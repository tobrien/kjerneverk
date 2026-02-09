# Evidence: Exact list of 4 tools missing from MCP server registration

**Source**: codebase analysis - line-by-line comparison of tools/index.ts and server.ts
**Original Query**: What are the 5 missing tools in the dual registration system?
**Added**: 2026-02-09T05:07:17.335Z
**Gathering Method**: model-assisted

---

## Missing Tool Registration Analysis

Compared tools/index.ts (35 tools) against server.ts registerTool() calls (31 calls).

### 4 Tools Missing from server.ts:

1. **riotplan_transition** (from transition.ts)
   - Moves plans between lifecycle stages
   - Core lifecycle tool - significant gap

2. **riotplan_catalyst_list** (from catalyst.ts)
   - Lists available catalysts
   - Entire catalyst subsystem missing from MCP

3. **riotplan_catalyst_show** (from catalyst.ts)
   - Shows catalyst details
   - Entire catalyst subsystem missing from MCP

4. **riotplan_catalyst_associate** (from catalyst.ts)
   - Associates catalysts with a plan
   - Entire catalyst subsystem missing from MCP

### Impact:
- The transition tool gap means MCP clients cannot manually transition plan stages
- The catalyst tools gap means the entire catalyst feature is invisible to MCP clients
- All 4 tools ARE properly implemented, have executors in the switch statement, and are in the tools array
- The ONLY thing missing is the registerTool() call in server.ts