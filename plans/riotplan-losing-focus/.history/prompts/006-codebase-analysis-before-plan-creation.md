# Narrative: Codebase analysis before plan creation

**Date**: 2026-02-07T21:33:30.532Z
**Source**: typing
**Speaker**: assistant

---

Moving to plan creation. Analyzed the RiotPlan MCP server codebase to understand what needs to change:

KEY FILES:
- src/mcp/server.ts: All tool registrations with descriptions (lines 275-533), tool response handler (lines 146-270)
- src/mcp/tools/shared.ts: createSuccess() and formatError() helpers that construct tool responses
- src/mcp/prompts/explore_idea.md: The explore_idea command prompt
- src/plan/creator.ts: Plan creation with STATUS.md and step files

IMPLEMENTATION SURFACE:
1. Tool descriptions: 25+ registerTool calls in server.ts, each with a description string - these can include behavioral instructions
2. Tool responses: Single handler in registerTool wraps all tool results - perfect place to inject heartbeat footer
3. explore_idea prompt: Currently only handles new ideas - needs path detection for existing plans
4. New tool needed: riotplan_generate_rule to create .cursor/rules/riotplan.md
