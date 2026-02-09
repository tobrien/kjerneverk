# Step 5: Verify all 35 tools registered, fix missing 4, run tests

## Objective

Verify the refactor works correctly, all 35 tools are registered, and no regressions.

## Tasks

1. Run the existing test suite: `npm test`
2. Verify the tool count: all 35 tools should be registered (previously only 31 were)
3. Specifically verify the 4 previously missing tools are now registered:
   - `riotplan_transition`
   - `riotplan_catalyst_list`
   - `riotplan_catalyst_show`
   - `riotplan_catalyst_associate`
4. Run TypeScript compilation: `npx tsc --noEmit`
5. Run linting: `npm run lint`
6. If any tests reference the old `inputSchema` JSON Schema format, update them
7. Manual smoke test: start the MCP server and verify tools are listed

## Verification Checklist

- [ ] `npm test` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Tool count is 35 (not 31)
- [ ] No JSON Schema (`inputSchema`) remains anywhere in src/mcp/tools/
- [ ] No manual registerTool() calls remain in server.ts (except the helper function definition)
- [ ] No switch statement remains in tools/index.ts

## What "Done" Looks Like

Adding a new MCP tool requires exactly:
1. Create a tool file with `McpTool` descriptor (name, description, Zod schema, executor)
2. Add it to the `tools` array in `tools/index.ts`

That's it. No server.ts changes. No switch statement updates. One place, one registration.
