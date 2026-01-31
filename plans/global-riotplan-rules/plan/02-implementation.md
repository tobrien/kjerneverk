# Step 02: Update Plan Generator

## Objective

Modify the plan generator to accept creation rules and inject them into the prompt sent to the AI model. Rules should be appended as guidance in the prompt.

## Background

The plan generator (`src/ai/generator.ts`) currently builds a prompt from the generation context. We need to:
1. Accept rules as a parameter (from config)
2. Append rules to the prompt when present
3. Ensure rules are formatted clearly in the prompt

## Tasks

### 1. Update GenerationContext Interface

Modify `GenerationContext` in `src/ai/generator.ts`:
- Add optional `planRules?: string[]` property

### 2. Update buildPlanPrompt Function

Modify `buildPlanPrompt()` function:
- Accept rules parameter (or get from context)
- If rules exist, append a "Plan Rules" section to the prompt
- Format rules clearly (numbered list or bullet points)

Example prompt addition:
```
**Plan Rules**:
The following rules must be followed when creating this plan:
1. [rule 1]
2. [rule 2]
...
```

### 3. Update generatePlan Function

Modify `generatePlan()` function:
- Accept rules parameter (or get from context)
- Pass rules to `buildPlanPrompt()`

### 4. Update Call Sites

Find all places that call `generatePlan()`:
- `src/cli/commands/create.ts`
- `src/cli/commands/generate.ts`
- `src/mcp/tools/generate.ts`
- Load config and pass `planRules` to generator

## Acceptance Criteria

- [ ] Generator accepts rules parameter
- [ ] Rules are injected into prompt when present
- [ ] Rules are formatted clearly in prompt
- [ ] Generator works normally when no rules provided
- [ ] All call sites updated to pass rules from config

## Testing

- Generate plan with rules in config - verify rules appear in prompt
- Generate plan without rules - verify normal behavior
- Test with empty rules array - should work normally

## Files Changed

- `src/ai/generator.ts`
- `src/cli/commands/create.ts`
- `src/cli/commands/generate.ts`
- `src/mcp/tools/generate.ts`

## Notes

- Rules are guidance - AI model interprets them
- Rules are appended to prompt, not replacing anything
- If rules are empty/undefined, prompt unchanged
