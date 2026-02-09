# Lifecycle

## Current Stage

**Stage**: `shaping`
**Since**: 2026-02-09T05:08:25.317Z

## State History

| From | To | When | Reason |
|------|-----|------|--------|
| idea | shaping | 2026-02-09T05:08:25.317Z | Ready to explore approaches |
| - | idea | 2026-02-09T05:02:58.539Z | Initial creation |

## Stage-Specific Data

### Idea
- Core concept: Investigate whether RiotPlan's MCP architecture can be simplified to eliminate the dual registration system for tools, resources, and prompts. Currently, adding a new MCP tool requires registration in two separate places (src/mcp/tools/index.ts and src/mcp/server.ts via registerTool()), which is error-prone and has already caused bugs during development.
- Notes: []
- Constraints: []
- Questions: []
- Evidence: []
