# Step 1: Add Behavioral Preamble to All MCP Tool Descriptions

**Recommended Model**: Haiku 4.5
**Rationale**: Mechanical text editing - applying a template string to ~25 registerTool calls in a single file. No creative judgment needed, just consistent application of the text designed in Step 2.

**Depends on**: Step 2 (need the behavioral text first)

## Objective

Update every `registerTool()` call in `src/mcp/server.ts` to prepend behavioral instructions to each tool's description string.

## Background

MCP tool descriptions are read by the model but not displayed to users. This makes them an ideal vector for behavioral instructions. Currently, descriptions are purely functional (e.g., "Add a note to an idea. Capture thoughts and observations during exploration."). We need to prepend a behavioral preamble to each description.

## Tasks

- [ ] Take the behavioral preamble text from Step 2
- [ ] Prepend it to every `registerTool` description in `src/mcp/server.ts` (lines 275-533)
- [ ] Ensure the preamble is separated from the functional description by a clear delimiter
- [ ] Verify all ~25 tool registrations are updated
- [ ] Run TypeScript compilation to verify no syntax errors

## Pattern

Current:
```typescript
registerTool(
    'riotplan_idea_add_note',
    'Add a note to an idea. Capture thoughts and observations during exploration.',
    { ... }
);
```

After:
```typescript
registerTool(
    'riotplan_idea_add_note',
    '[BEHAVIORAL PREAMBLE FROM STEP 2]. Add a note to an idea. Capture thoughts and observations during exploration.',
    { ... }
);
```

## Files Changed

- `src/mcp/server.ts` - All registerTool calls (~25 instances)

## Acceptance Criteria

- Every registerTool call includes the behavioral preamble
- TypeScript compiles without errors
- Tool descriptions read naturally with preamble + functional description
