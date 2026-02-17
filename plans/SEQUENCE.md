# Plan Execution Sequence

**Created**: 2026-01-31  
**Last updated**: 2026-02-17  
**Purpose**: Track active plans and execution order

---

## Completed Plans

All of the following have been executed and moved to `done/` (or completed in place).

### 1. fix-lifecycle-transitions
**Completed**: 2026-01-31 | **Steps**: 5/5  
**Location**: `done/fix-lifecycle-transitions/`

Fixed the workflow bug where creating a plan from a shaping directory creates a duplicate directory. Added `riotplan_transition`, made `riotplan_create` detect existing directories, added `riotplan_build`.

### 2. riotplan-sampling
**Completed**: ~2026-02-04 | **Stage**: IDEA (explored, concluded)  
**Location**: `done/riotplan-sampling/`

Explored MCP sampling so RiotPlan wouldn't need its own API key when called via MCP. **Critical finding**: Cursor does NOT support MCP sampling — only GitHub Copilot does. Pivoted to building `execution-sampling` as a reusable abstraction anyway, ready for when IDE support arrives. Architecture designed with session-based provider mode detection.

### 3. riotplan-connect-to-idea
**Completed**: ~2026-02-06 | **Steps**: 7/7  
**Location**: `done/riotplan-connect-to-idea/`

Made plan generation rooted in agentic exploration of all idea content (IDEA.md, history, prompts, timeline, evidence) — not just model memory. Plans are now reproducible from artifacts alone. Added `riotplan_read_context` tool for loading all artifacts at stage transitions.

### 4. riotplan-gathering-evidence
**Completed**: ~2026-02-06 | **Steps**: 7/7  
**Location**: `done/riotplan-gathering-evidence/`

Made RiotPlan proactive about gathering and recording evidence. Evidence is now automatically captured during research with metadata (date, URL, query, source). Renamed `.evidence/` → `evidence/` and `.history/` → visible directories.

### 5. riotplan-losing-focus
**Completed**: ~2026-02-08 | **Steps**: 7/7  
**Location**: `done/riotplan-losing-focus/`

Solved the problem of conversations losing focus — models now consistently update plans with insights during Q&A. Implemented as Phase 1: Embedded Behavioral Layer (behavioral preambles in tool descriptions + heartbeat footers).

### 6. global-riotplan-rules → RiotPlan Catalysts
**Completed**: ~2026-02-08 | **Steps**: 10/10  
**Location**: `done/global-riotplan-rules/`

Evolved from simple plan rules into the full **Catalyst** system — composable, layerable guidance packages that shape the entire planning process. Created `@kjerneverk/riotplan-catalyst` package with six facets: questions, constraints, output templates, domain knowledge, process guidance, validation rules. Catalysts are associated via `plan.yaml` manifests.

### 7. riotplan-command-line
**Completed**: ~2026-02-10 | **Steps**: 7/7  
**Location**: `done/riotplan-command-line/`

Built a full LLM-powered interactive CLI for RiotPlan. Commands: `explore`, `build`, `execute`, `chat` (agent sessions) plus utility commands (`status`, `step`, `plan`, `render`). Built in-house agent loop in `@kjerneverk/agentic`. Extended `execution-anthropic` and `execution-openai` with streaming and tool support.

### 8. riotplan-upgrade-chat
**Completed**: ~2026-02-12 | **Steps**: 6/6  
**Location**: `done/riotplan-upgrade-chat/`

Upgraded `rp build` from one-shot LLM call to agent-powered generation with codebase exploration. Agent gets read-only tools (read_file, list_files, grep, query_index) and a `write_plan` tool. Plans now reference actual files, interfaces, and code patterns. Added configurable model selection for build vs explore phases.

### 9. riotplan-format
**Completed**: 2026-02-12 | **Steps**: 6/6  
**Location**: `plans/riotplan-format/`

Created `@kjerneverk/riotplan-format` package implementing dual-format storage architecture — both directory-based and SQLite `.plan` formats through a unified storage abstraction layer. Includes migration utilities between formats, configuration support for format selection, and full backward compatibility.

---

## Active Plans

### 10. riotplan-http-mcp
**Status**: ⬜ IDEA  
**Created**: 2026-02-13  
**Location**: `plans/riotplan-http-mcp/`

**What it does**: Make RiotPlan a remote HTTP MCP server (like Protokoll) instead of running as a local MCP. Plans stored centrally as a service, not scattered across project directories.

**Core problem**: Currently have to specify plan directories everywhere. Agents executing plan steps have filesystem access to plan files. Want plans to "just work" across all workspaces with a single service.

**Key ideas**:
- Follow Protokoll's architecture pattern — remote HTTP server that MCP clients connect to
- Uses the same SQLite-based format (`riotplan-format`) for storage
- Workspaces unaware of plan storage location — only know there's a remote service
- Agent isolation — agents connect to service, don't get filesystem access to plan files
- Identity/multi-tenancy/security out of scope for initial implementation (localhost on a port)

**Depends on**: riotplan-format (✅ done)

**Next**: Continue idea exploration, then shape

---

### 11. riotplan-format-converter
**Status**: ⬜ IDEA  
**Created**: 2026-02-12  
**Location**: `plans/riotplan-format-converter/`

**What it does**: Standalone CLI tools to convert between directory-based RiotPlan formats and SQLite `.rp` files. Bidirectional conversion utilities.

**Key ideas**:
- Two commands: `rp-convert dir-to-file` and `rp-convert file-to-dir`
- Using `.rp` extension for SQLite files
- Perfect round-trip conversion as top priority
- Independent of full RiotPlan installation

**Depends on**: riotplan-format (✅ done)

**Next**: Decide if this is still needed as a separate tool, or if `riotplan-format` already covers conversion

---

### 12. project-voice-tone
**Status**: ⬜ IDEA (exploration complete, set aside)  
**Created**: 2026-01-31  
**Location**: `plans/project-voice-tone/`

**What it does**: Project-level voice, tone, and style configuration. Hierarchical config (home → project), multiple voices/tones per user, auto-generation from existing work, industry-standard dimensions.

**Research completed**:
- Voice vs Tone vs Style definitions (with citations from Nielsen Norman Group, Grammarly, CUNY)
- Four core dimensions: Formal/Casual, Serious/Funny, Respectful/Irreverent, Enthusiastic/Matter-of-Fact
- Reading level measurement (Flesch-Kincaid)
- Hierarchical config pattern (CardiganTime + walk-up)

**Next**: Shape when ready — substantial feature, exploration is thorough

---

## On Hold

### riotplan-session-based-state-machine
**Location**: `plans/hold/riotplan-session-based-state-machine/`

Phase 2 of the losing-focus fix. Adds explicit session-based state machine to enforce mode discipline at the MCP server level. Only needed if Phase 1 (Embedded Behavioral Layer, completed in plan #5) proves insufficient. Trigger: models still drifting despite behavioral preambles and heartbeat footers.

### align-riotdoc-infrastructure
**Location**: `plans/hold/align-riotdoc-infrastructure/`

Align RiotDoc with CardiganTime configuration patterns. **Killed/iced** — no immediate functional need. RiotDoc works fine without it. Will revisit if a concrete configuration gap emerges.

---

## Recommended Execution Order

### What's Next

1. **riotplan-http-mcp** (IDEA → needs shaping)
   - This is the next strategic move — shifting RiotPlan's primary interface from local MCP to remote HTTP server
   - Builds directly on `riotplan-format` (SQLite storage) which is complete
   - Enables plan sharing, agent isolation, cross-workspace plans
   - Follows the proven Protokoll architecture pattern

2. **riotplan-format-converter** (IDEA → needs decision)
   - May be unnecessary if `riotplan-format` already handles migration
   - Quick decision: is a standalone conversion CLI still valuable, or is it subsumed?
   - Low effort if needed — schema and conversion logic already exist in `riotplan-format`

3. **project-voice-tone** (IDEA → needs shaping)
   - Substantial feature with thorough research already done
   - Not blocking anything — can be picked up when there's appetite for it
   - Would benefit RiotDoc document generation

### On Deck (if needed)

- **riotplan-session-based-state-machine** — only if Phase 1 losing-focus fix proves insufficient in practice

---

## Key Insights

**The Format Chain**: Plans #9 → #10 → #11 form a chain. `riotplan-format` (done) provides SQLite storage. `riotplan-http-mcp` uses that storage for a remote service. `riotplan-format-converter` provides CLI tools for migration. The foundation is built.

**Massive Progress**: Since 2026-01-31, nine plans have been completed — the entire original critical path (#2-#5), plus catalysts (#6), CLI (#7), agent-powered build (#8), and SQLite format (#9). RiotPlan now has: artifact-grounded plan generation, proactive evidence capture, focus maintenance, composable catalysts, full CLI experience, agent-powered builds, and dual-format storage.

**What Changed**: The original sequence was: sampling → connect-to-idea → gathering-evidence → losing-focus → catalysts → voice-tone. What actually happened was all of those got done, plus three more plans (command-line, upgrade-chat, riotplan-format) that emerged from usage. The project is now focused on infrastructure evolution (HTTP MCP, format tooling) rather than core functionality gaps.

---

*Last updated: 2026-02-17*
