# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Zod Schema Export + Auto-Registration Loop

**Description**: Each tool file exports a Zod schema alongside the existing McpTool definition. The McpTool type gets a new optional field (e.g., `zodSchema: z.ZodRawShape`). server.ts replaces all 31 manual registerTool() calls with a single loop: `for (const tool of tools) { registerTool(tool.name, tool.description, tool.zodSchema); }`. The registerTool() helper function stays as-is (it handles context setup, error handling, heartbeats). JSON Schema inputSchema fields are removed or derived from Zod. Minimal refactor - mostly additive changes to tool files, then delete the manual calls from server.ts.

**Tradeoffs**:
- Pro: Smallest diff - add zodSchema to each tool, delete manual calls from server.ts
- Pro: registerTool() helper with its context/error/heartbeat logic stays untouched
- Pro: Follows the exact pattern resources and prompts already use successfully
- Con: Two schema fields on McpTool temporarily (zodSchema + inputSchema) unless we drop inputSchema
- Con: Requires touching every tool file to add the Zod export

**Assumptions**:
- The MCP SDK's server.tool() will continue to accept z.ZodRawShape
- All current JSON Schema definitions can be cleanly expressed as Zod schemas
- Some tool files already use Zod internally (idea.ts, shaping.ts) so those are trivial


### Approach: Full Tool Descriptor with Zod as Source of Truth

**Description**: Redefine the McpTool type so Zod IS the schema format. Each tool file exports a single descriptor: `{ name, description, schema: z.ZodRawShape, execute }`. Drop the JSON Schema inputSchema entirely. server.ts loops over tools and calls registerTool() with the descriptor fields. The tools/index.ts switch statement is also eliminated - each tool carries its own executor. The executeTool() function becomes a simple lookup by name from a Map built from the tools array. This is a deeper cleanup that removes both the dual registration AND the giant switch statement.

**Tradeoffs**:
- Pro: Cleanest end state - one object per tool has everything needed
- Pro: Eliminates the 35-case switch statement in tools/index.ts too
- Pro: Adding a new tool = export one object from one file, add to array, done
- Pro: No possibility of name/schema/executor getting out of sync
- Con: Larger refactor - changes the McpTool type, every tool file, index.ts, and server.ts
- Con: Needs to verify nothing external depends on the JSON Schema inputSchema format
- Con: More risk of introducing bugs during the migration

**Assumptions**:
- Nothing outside the MCP server consumes the JSON Schema inputSchema from McpTool
- The execute function signatures are consistent enough to standardize
- Tests can be updated to reflect the new structure


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Full Tool Descriptor with Zod as Source of Truth

**Reasoning**: This is generated code that hasn't been fully reviewed yet. Going thorough now eliminates both the dual registration and the giant switch statement. Adding a new tool becomes: export one object, add to array, done. The switch statement is just another form of dual registration (name matched in two places). Clean it up properly once.

**Selected At**: 2026-02-09T05:10:10.012Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-09T05:08:25.316Z
**Next**: Select an approach and transition to 'built'
