# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Layered Integration

**Description**: Integrate riotplan-format into the existing riotplan package first, wiring the StorageProvider into existing tools and operations. Then add the HTTP server as a new transport alongside stdio — both transports share the same tool implementations. VSCode extension built last against the running server. Migration is a separate CLI command using riotplan-format's PlanMigrator. This preserves the existing tool logic and adds HTTP as another way to access it.

**Tradeoffs**:
- Pro: Existing ~40 tools work with both stdio and HTTP transports automatically
- Pro: Single codebase for plan operations — no duplication
- Pro: riotplan-format integration benefits the local MCP too
- Con: Slower to get HTTP server running — lots of integration work upfront
- Con: Carries legacy tool complexity into the HTTP API (contradicts 'simplify the API' goal)
- Con: StorageProvider integration touches many files in riotplan

**Assumptions**:
- Existing tool implementations can be adapted to work through StorageProvider without major rewrites
- The simplified HTTP API can be achieved by selectively exposing tools rather than rewriting them


### Approach: Standalone HTTP Server

**Description**: Build the HTTP server as a fresh entry point that uses riotplan-format's StorageProvider directly — not through the existing riotplan tool layer. Design a curated, simplified set of MCP tools from scratch that call the StorageProvider API. The server is a new src/mcp/server-hono.ts in the riotplan repo but with its own tool definitions. VSCode extension built against this clean API. Migration is a separate one-time script. The local stdio MCP continues using the old file-based approach unchanged.

**Tradeoffs**:
- Pro: Clean break — design the API you actually want without legacy baggage
- Pro: Directly aligns with 'simplify and reshape the API' goal
- Pro: Faster to prototype — StorageProvider API maps cleanly to tools
- Pro: HTTP server and local MCP evolve independently
- Con: Two codepaths for plan operations (local tools vs HTTP tools)
- Con: Bug fixes or features may need implementing in both places
- Con: Local MCP doesn't benefit from riotplan-format integration

**Assumptions**:
- The simplified HTTP tool set is meaningfully different enough from the local tools to justify separate implementations
- Divergence between local and HTTP codepaths is acceptable in the medium term


### Approach: Server-Driven Migration

**Description**: Build the HTTP server so it can read both directory-based plans AND .plan files. On startup, point it at the source directories (kjerneverk/plans, redaksjon/plans, etc.) and it automatically discovers and migrates plans to .plan format in the unified directory. The server IS the migration tool — no separate step. Uses riotplan-format's StorageProvider for .plan files and a lightweight directory reader for legacy plans. Once all plans are migrated, the directory reading code becomes dead. Fresh simplified MCP tools, like the Standalone approach.

**Tradeoffs**:
- Pro: No separate migration step — server handles it
- Pro: Immediate value — start the server and everything just works
- Pro: Graceful transition — plans migrate as they're accessed or on first startup
- Con: Server is more complex — understands two formats during transition
- Con: Directory reading code is throwaway after migration completes
- Con: Migration edge cases could cause data issues if not carefully handled
- Con: Harder to test — two code paths that produce the same output

**Assumptions**:
- Migration is a one-time event, not an ongoing need
- Directory-based plans can be reliably converted without data loss
- The complexity of dual-format support is justified by the convenience


## Feedback

_Feedback will be added here as you provide it_

### 2026-02-17T18:18:26.890Z

User leaning toward Standalone HTTP Server but wants clarity on two things before committing: (1) What does migration look like concretely? (2) How does this affect day-to-day usage — what changes for the user?

### 2026-02-17T18:20:46.787Z

User reconsidering earlier decision to keep local MCP. The standalone approach creates a natural tension: if the HTTP server is the primary interface and plans live centrally, what's the local MCP for? Maybe cleaner to go all-in on remote and drop local MCP entirely.

### 2026-02-17T18:26:25.556Z

Final decision: Go with Standalone HTTP Server. Preserve local MCP server to avoid disruption. Gradually migrate to the new model over time. This is a pragmatic choice — build the new thing, don't break the old thing, let adoption happen naturally.

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Standalone HTTP Server

**Reasoning**: Clean break from legacy tool complexity. Lets us design the simplified API from scratch against riotplan-format's StorageProvider. Local MCP preserved to avoid disruption — gradual migration over time. HTTP server becomes the primary interface for MCP clients and VSCode extension, while CLI can use StorageProvider directly if needed.

**Selected At**: 2026-02-17T18:26:28.038Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-17T18:14:56.013Z
**Next**: Select an approach and transition to 'built'
