# Step 2: Migrate all tool files to full descriptor format with Zod schemas

## Objective

Update every tool file in `src/mcp/tools/` to export a full descriptor with Zod schema and executor function.

## Files to Migrate

- `create.ts` — `createTool` + `executeCreate`
- `status.ts` — `statusTool` + `executeStatus`
- `step.ts` — `stepListTool`, `stepStartTool`, `stepCompleteTool`, `stepAddTool` + executors
- `validate.ts` — `validateTool` + `executeValidate`
- `generate.ts` — `generateTool` + `executeGenerate`
- `idea.ts` — 7 tools (ideaCreate, addNote, addConstraint, addQuestion, addEvidence, addNarrative, kill)
- `shaping.ts` — 6 tools (start, addApproach, addFeedback, addEvidence, compare, select)
- `history.ts` — 5 tools (checkpointCreate, checkpointList, checkpointShow, checkpointRestore, historyShow)
- `transition.ts` — `transitionTool` + `executeTransition`
- `build.ts` — `buildTool` + `executeBuild`
- `generate-rule.ts` — `generateRuleTool` + `executeGenerateRule`
- `context.ts` — `readContextTool` + `executeReadContext`
- `catalyst.ts` — 3 tools (catalystList, catalystShow, catalystAssociate)
- `reflect.ts` — `stepReflectTool` + `executeStepReflect`
- `retrospective.ts` — `generateRetrospectiveTool` + `executeGenerateRetrospective`

## Migration Pattern

**Before (JSON Schema + separate executor):**
```typescript
export const createTool: McpTool = {
    name: 'riotplan_create',
    description: '...',
    inputSchema: { type: 'object', properties: { code: { type: 'string' } } },
};

export async function executeCreate(args, context) { ... }
```

**After (Zod schema + executor bundled):**
```typescript
export const createTool: McpTool = {
    name: 'riotplan_create',
    description: '...',
    schema: { code: z.string(), description: z.string(), directory: z.string().optional() },
    execute: executeCreate,
};

async function executeCreate(args, context) { ... }
```

## Notes

- Some files (idea.ts, shaping.ts) already use Zod internally — these are the easiest to migrate
- For files using JSON Schema, convert each property to the Zod equivalent
- The execute function no longer needs to be exported separately (it's on the tool object)
- Keep the execute function as a named function for readability, just assign it to the tool

## Acceptance Criteria

- [ ] All 35 tool definitions use `schema: z.ZodRawShape` instead of `inputSchema`
- [ ] All 35 tool definitions include `execute` function
- [ ] No JSON Schema remains in any tool file
- [ ] TypeScript compiles with the new type
