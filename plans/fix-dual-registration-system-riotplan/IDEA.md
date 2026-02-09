# Idea: fix-dual-registration-system-riotplan

## Core Concept

Investigate whether RiotPlan's MCP architecture can be simplified to eliminate the dual registration system for tools, resources, and prompts. Currently, adding a new MCP tool requires registration in two separate places (src/mcp/tools/index.ts and src/mcp/server.ts via registerTool()), which is error-prone and has already caused bugs during development.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Pain point discovered during step 6 of plan-retrospectives-learning-loop: adding a new MCP tool requires updating two separate files (src/mcp/tools/index.ts and src/mcp/server.ts). Forgetting either one causes silent failures where tools appear implemented but are missing from the MCP server.
- Key finding: Resources and prompts do NOT have the dual registration problem. They use a single-loop registration pattern in server.ts. Only tools suffer from dual registration. The root cause is a schema format mismatch - tool files use JSON Schema, but server.ts registerTool() expects Zod schemas.
- There's a count discrepancy: 35 tools in tools/index.ts but only 30 registerTool() calls in server.ts. This means 5 tools are defined but not registered with the MCP server - exactly the kind of silent failure this dual registration causes.
- User decision: standardize everything on Zod. Eliminate JSON Schema from tool definitions. The initial JSON Schema usage was from early generated code that hasn't been fully reviewed. Goal is a single registration point using Zod throughout.

## Constraints

- _Add constraints..._
- Standardize on Zod schemas throughout. Eliminate JSON Schema from tool definitions entirely.

## Questions

- _Add questions..._
- Can we unify on Zod schemas everywhere (tool files export Zod, server.ts consumes Zod directly) to eliminate the need for manual re-registration?
- Could we adopt the same loop-based registration pattern that resources and prompts already use successfully?
- What are the 5 tools that exist in tools/index.ts but are missing from server.ts registerTool() calls? Are these actual bugs?

## Evidence

_Attach relevant documents, images, or files_
- [Codebase analysis of RiotPlan MCP dual registration architecture](evidence/codebase-analysis-of-riotplan-mcp-dual-registratio.md) (codebase analysis)
- [Exact list of 4 tools missing from MCP server registration](evidence/exact-list-of-4-tools-missing-from-mcp-server-regi.md) (codebase analysis - line-by-line comparison of tools/index.ts and server.ts)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-02-09T05:02:58.539Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
