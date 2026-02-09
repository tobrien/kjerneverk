# Evidence: Codebase analysis of RiotPlan MCP dual registration architecture

**Source**: codebase analysis
**Original Query**: Investigate whether RiotPlan's MCP architecture can be simplified to eliminate the dual registration system
**Added**: 2026-02-09T05:03:45.585Z
**Gathering Method**: model-assisted

---

## RiotPlan MCP Registration Architecture Analysis

### The Problem: Dual Registration for Tools Only

**Tools are dual-registered** in two places with different schema formats:
1. `src/mcp/tools/index.ts` - exports `tools: McpTool[]` array (35 tools) using JSON Schema format
2. `src/mcp/server.ts` - 30 manual `registerTool()` calls using Zod schema format

**Resources and Prompts are NOT dual-registered** - they use a single registration loop pattern:
- Resources: `src/mcp/resources/index.ts` exports `getResources()`, server.ts loops through them
- Prompts: `src/mcp/prompts/index.ts` exports `getPrompts()`, server.ts loops through them

### Schema Format Mismatch (Root Cause)

Tool files export JSON Schema:
```typescript
export const createTool: McpTool = {
    name: 'riotplan_create',
    inputSchema: { type: 'object', properties: { code: { type: 'string' } } }
};
```

Server.ts registerTool() expects Zod:
```typescript
registerTool('riotplan_create', '...', { code: z.string(), description: z.string() });
```

This forces manual Zod schema recreation in server.ts for every tool.

### Count Discrepancy
- 35 tools in tools/index.ts
- 30 registerTool() calls in server.ts (5 missing or consolidated)

### Unification Already Works for Resources/Prompts
Resources and prompts prove the pattern works:
```typescript
for (const resource of resources) { server.resource(...) }
for (const prompt of prompts) { server.prompt(...) }
```

### Tool File Exports
Each tool file exports:
1. `*Tool: McpTool` - name, description, inputSchema (JSON Schema)
2. `execute*()` - execution function

Some tool files already use Zod internally (idea.ts, shaping.ts) but convert to JSON Schema via `.shape`.