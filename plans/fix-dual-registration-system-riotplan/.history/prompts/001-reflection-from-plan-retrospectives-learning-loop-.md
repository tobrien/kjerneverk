# Narrative: Reflection from plan-retrospectives-learning-loop step 6 that identified the dual registration pain point

**Date**: 2026-02-09T05:03:05.134Z
**Source**: import
**Speaker**: user

---

From the plan-retrospectives-learning-loop Step 6 reflection: "This step took longer than expected because I initially forgot that RiotPlan uses a dual registration system for MCP tools. I implemented the tools in src/mcp/tools/ and registered them in the tools index, but completely missed that src/mcp/server.ts has its own manual tool registration with registerTool() calls. This caused the tools to be 'missing' from the MCP server even though they were properly implemented. The key learning: RiotPlan's MCP architecture has two registration points - one for internal use (src/mcp/tools/index.ts) and one for the MCP server itself (src/mcp/server.ts). Both must be updated when adding new tools."
