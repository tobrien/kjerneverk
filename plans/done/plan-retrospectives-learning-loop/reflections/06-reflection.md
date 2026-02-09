This step took longer than expected because I initially forgot that RiotPlan uses a dual registration system for MCP tools. I implemented the tools in src/mcp/tools/ and registered them in the tools index, but completely missed that src/mcp/server.ts has its own manual tool registration with registerTool() calls. This caused the tools to be "missing" from the MCP server even though they were properly implemented.

The key learning: RiotPlan's MCP architecture has two registration points - one for internal use (src/mcp/tools/index.ts) and one for the MCP server itself (src/mcp/server.ts). Both must be updated when adding new tools.

What surprised me: The user caught the tool count discrepancy (28 vs 29 tools) which led to discovering the missing server registration. This was excellent debugging - the symptom (wrong tool count) pointed directly to the root cause.

What could be done differently: The step file could have been more explicit about the dual registration requirement. A checklist like "1. Implement tool in src/mcp/tools/, 2. Register in tools/index.ts, 3. Register in server.ts" would have prevented this oversight.

What the next step should know: The MCP server registration is in src/mcp/server.ts starting around line 349. Each tool needs a registerTool() call with name, description, and Zod schema. The tests in tests/step-operations.test.ts now include plan completion detection logic that can be referenced for similar testing patterns.