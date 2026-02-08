# Step 6: Create read_plan_context tool for consolidated artifact loading

**Model: Opus 4.5** — This is the most complex step. New tool creation that needs to understand the MCP server architecture, tool registration patterns, file reading, and how to aggregate multiple artifacts into a useful payload. Worth the investment for a correct implementation.

## Objective

Create a new MCP tool `riotplan_read_context` (or enhance `riotplan_status`) that returns a consolidated view of all plan artifacts in a single call: IDEA.md content, SHAPING.md content, evidence file list with summaries, and recent history. This makes it trivially easy for the model to load all context at stage transitions instead of making 5+ separate read calls.

## Context

The core problem: at stage transitions, the model needs to re-read IDEA.md, SHAPING.md, evidence files, and history. But making 5+ tool calls is friction — the model might skip some. A single "give me everything" tool removes that friction. The `develop_plan.md` prompt shows the ideal workflow (lines 96-117) but requires multiple manual file reads.

## Files to Modify/Create

1. **`src/mcp/tools/context.ts`** (NEW) — Implementation of the read_plan_context tool
2. **`src/mcp/server.ts`** — Register the new tool
3. **`src/mcp/tools/index.ts`** (if exists) — Export the new module

## Tasks

- [ ] Create `src/mcp/tools/context.ts` with a `readPlanContext` function that:
  - Takes `path` (plan directory) and optional `includeContent` flag
  - Reads IDEA.md and returns its content
  - Reads SHAPING.md if it exists and returns its content
  - Lists evidence/ directory and returns file names + first few lines of each (or summaries if available)
  - Reads recent history (last 10-20 events from timeline.jsonl)
  - Returns LIFECYCLE.md if it exists
  - Returns a structured JSON response with all artifacts
- [ ] Define the Zod schema for the tool input
- [ ] Register the tool in `server.ts` following the existing registration pattern
- [ ] The tool description should explain this is for loading full plan context at stage transitions
- [ ] Consider adding a `depth` parameter: "summary" (file list + metadata only) vs "full" (includes file contents)
- [ ] Handle missing files gracefully (SHAPING.md won't exist for idea-stage plans)

## Return Shape

```typescript
{
  planPath: string,
  stage: string,
  idea: { content: string } | null,
  shaping: { content: string, selectedApproach: string } | null,
  evidence: {
    files: Array<{ name: string, preview: string, size: number }>,
    count: number
  },
  history: {
    recentEvents: Array<{ type: string, timestamp: string, summary: string }>,
    totalEvents: number
  },
  lifecycle: { content: string } | null,
  constraints: string[],  // extracted from IDEA.md for easy reference
  questions: string[]      // extracted from IDEA.md for easy reference
}
```

## Acceptance Criteria

- [ ] `riotplan_read_context` tool exists and is registered in MCP server
- [ ] Returns IDEA.md content, SHAPING.md content (if exists), evidence list with previews, recent history
- [ ] Handles all plan stages (idea-only, shaped, built, executing)
- [ ] Missing files are handled gracefully (null, not error)
- [ ] Response is structured and useful without requiring additional tool calls
- [ ] TypeScript compiles without errors
- [ ] Tool description clearly explains its purpose

## Evidence

- IDEA.md constraint: "The model must never rely on conversation memory alone - the plan files are the source of truth"
- `develop_plan.md` (lines 96-117) — shows the multi-file-read workflow this tool would replace
- Shaping approach: "read_plan_context makes re-reading artifacts trivially easy - one tool call instead of many"

## Dependencies

- Steps 1-3 should be complete (schema changes done, so context tool returns accurate metadata)
- Step 4-5 should be complete or in progress (prompts will reference this tool)
