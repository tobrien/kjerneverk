# MCP Tool Registration Fix

## Problem

The MCP server was only showing 8 tools when loaded in Cursor, but we implemented 25 tools total.

### Root Cause

The `src/mcp/server.ts` file manually registers each tool with the MCP SDK using `registerTool()`. When we added the new idea, shaping, and history tools to `src/mcp/tools/index.ts`, we forgot to register them in the server.

### What Was Missing

**17 tools were not registered:**

**Idea Stage (6 tools)**
- `riotplan_idea_create`
- `riotplan_idea_add_note`
- `riotplan_idea_add_constraint`
- `riotplan_idea_add_question`
- `riotplan_idea_add_evidence`
- `riotplan_idea_kill`

**Shaping Stage (6 tools)**
- `riotplan_shaping_start`
- `riotplan_shaping_add_approach`
- `riotplan_shaping_add_feedback`
- `riotplan_shaping_add_evidence`
- `riotplan_shaping_compare`
- `riotplan_shaping_select`

**History/Checkpoint (5 tools)**
- `riotplan_checkpoint_create`
- `riotplan_checkpoint_list`
- `riotplan_checkpoint_show`
- `riotplan_checkpoint_restore`
- `riotplan_history_show`

## Solution

Added all 17 missing tool registrations to `src/mcp/server.ts` with:
- Proper tool names
- Descriptive help text
- Zod schema validation for parameters

### Changes Made

**File**: `src/mcp/server.ts`
- Added 164 lines of tool registrations
- Each tool includes:
  - Name (e.g., `riotplan_idea_create`)
  - Description (user-friendly help text)
  - Input schema (Zod validation)

## Verification

### Tool Count
```bash
# Expected: 25 tools
# Actual: 25 tools registered

$ grep "riotplan_" src/mcp/server.ts | grep registerTool | wc -l
25
```

### All Tools Now Available
```
riotplan_checkpoint_create
riotplan_checkpoint_list
riotplan_checkpoint_restore
riotplan_checkpoint_show
riotplan_create
riotplan_generate
riotplan_history_show
riotplan_idea_add_constraint
riotplan_idea_add_evidence
riotplan_idea_add_note
riotplan_idea_add_question
riotplan_idea_create
riotplan_idea_kill
riotplan_shaping_add_approach
riotplan_shaping_add_evidence
riotplan_shaping_add_feedback
riotplan_shaping_compare
riotplan_shaping_select
riotplan_shaping_start
riotplan_status
riotplan_step_add
riotplan_step_complete
riotplan_step_list
riotplan_step_start
riotplan_validate
```

## Testing

### Build Status
✅ Build: Successful  
✅ Lint: Passed  
✅ Tests: 623 tests passed  
✅ Coverage: 92.84% maintained

### Git Commit
```
commit ebee9e6
fix(mcp): register all 25 tools in MCP server

1 file changed, 164 insertions(+)
```

## Next Steps

1. **Restart Cursor** to reload the MCP server with new tool registrations
2. **Verify in UI** that all 25 tools now appear
3. **Test tools** using the prompts:
   - `/riotplan/explore_idea`
   - `/riotplan/shape_approach`

## Architecture Note

The RiotPlan MCP server has two layers:

1. **Tool Implementation** (`src/mcp/tools/*.ts`)
   - Defines tool schemas and execution logic
   - Exports tool definitions and executors

2. **Server Registration** (`src/mcp/server.ts`)
   - Registers tools with MCP SDK
   - Maps tool names to executors
   - Provides Zod schemas for validation

**Important**: When adding new tools, BOTH layers must be updated:
- Add tool to `src/mcp/tools/index.ts` (implementation)
- Register tool in `src/mcp/server.ts` (MCP exposure)

This fix ensures both layers are in sync.

---

**Status**: ✅ Fixed and Committed  
**Ready**: ✅ For Testing (restart Cursor)
