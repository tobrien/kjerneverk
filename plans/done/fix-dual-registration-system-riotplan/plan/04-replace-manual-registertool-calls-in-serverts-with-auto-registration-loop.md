# Step 4: Replace manual registerTool calls in server.ts with auto-registration loop

## Objective

Delete all 31 manual `registerTool()` calls in server.ts and replace with a single loop over the tools array.

## Tasks

1. Import the `tools` array from `./tools/index.js`
2. Replace lines ~349-688 (all manual registerTool calls) with:

```typescript
// Register all tools
import { tools } from './tools/index.js';

for (const tool of tools) {
    registerTool(tool.name, tool.description, tool.schema);
}
```

3. The `registerTool()` helper function (lines 197-346) stays unchanged — it handles context setup, error handling, heartbeat, and progress notifications
4. Remove the `z` import from server.ts if it's no longer needed (Zod schemas now come from tool files)

## What This Eliminates

- 31 manual registerTool() calls (~340 lines of code)
- Manual Zod schema duplication in server.ts
- The possibility of tools being defined but not registered (the 4 missing tools bug)

## What Stays

- `registerTool()` helper — it wraps `server.tool()` with context, error handling, and heartbeats
- `executeTool()` — still called by registerTool, now uses Map lookup from step 3

## Acceptance Criteria

- [ ] All manual registerTool() calls are removed from server.ts
- [ ] Single loop registers all tools from the tools array
- [ ] registerTool() helper function is unchanged
- [ ] All 35 tools are automatically registered (including the 4 that were missing)
