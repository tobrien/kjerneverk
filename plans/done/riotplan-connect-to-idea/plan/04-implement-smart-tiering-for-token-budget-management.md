# Step 04: Implement smart tiering for token budget management

## Objective

Add token budget awareness to the generation pipeline so large artifacts don't overflow context windows. Implement a tiering strategy that prioritizes constraints and selected approach (always full), then evidence (summarized if large), then history (abbreviated if needed).

## Background

The user raised a valid concern: "Don't send all the evidence files over if they're like 100 kilobyte text files." The prompt needs to be substantial and meaningful, but not wasteful. With many evidence files or long history, the prompt could exceed model context limits. Smart tiering ensures the most important content is always included while gracefully degrading less critical content.

## Tasks

### 1. Add token estimation utility

Create a simple token estimator (character count / 4 is a reasonable approximation, or use a lightweight tokenizer). This doesn't need to be exact - it's for budget decisions, not billing.

```typescript
function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}
```

### 2. Define tiering thresholds

Configurable thresholds for prompt budget:

- **Always include (full)**: Constraints, selected approach description, core concept
- **Tier 1** (include full if budget allows): Evidence files under 2KB, recent narrative chunks
- **Tier 2** (summarize if over budget): Evidence files 2KB-20KB → first 50 lines + "... truncated"
- **Tier 3** (list only if over budget): Evidence files over 20KB → filename + first 5 lines only
- **Abbreviate**: History events → last 10 instead of 15, then last 5

### 3. Implement tiering logic in prompt builder

Before building the prompt, calculate the budget:
1. Measure total artifact size
2. If under threshold (e.g., 40K tokens), include everything at full detail
3. If over threshold, apply tiering rules in order:
   - Summarize large evidence files
   - Abbreviate history
   - If still over, reduce evidence to filenames + key lines
4. Log/warn about what was tiered and why

### 4. Add token budget to generation metadata

Include a summary of the token budget in the build output:
- Total artifact size (tokens)
- What was included at full, summarized, or list-only level
- Any warnings about large artifacts

### 5. Make thresholds configurable

Add optional `tokenBudget` field to `GenerationContext` or build options so callers can adjust the budget based on the model being used (e.g., larger budget for models with 200K context).

## Acceptance Criteria

- [ ] Token estimation function exists and is reasonably accurate
- [ ] Evidence files over size thresholds are summarized or listed rather than included in full
- [ ] Constraints and selected approach are ALWAYS included at full detail regardless of budget
- [ ] History is abbreviated when budget is tight
- [ ] Build output includes token budget summary
- [ ] Thresholds are configurable
- [ ] A plan with small artifacts includes everything in full (no unnecessary summarization)

## Files Changed

- `src/ai/generator.ts` - Add tiering logic to `buildPlanPrompt()`
- Possibly new: `src/ai/tokens.ts` - Token estimation and tiering utilities
- `src/mcp/tools/build.ts` - Pass token budget config to generator

## Testing

- Test with small artifacts (all under threshold) → everything included in full
- Test with one large evidence file (50KB) → verify it's summarized
- Test with many evidence files totaling over budget → verify tiering applied
- Test with no evidence → no tiering needed, clean prompt
- Verify constraints are never summarized or omitted

## Notes

- Don't over-engineer tokenization - character/4 is fine for budget decisions
- The tiering should be transparent - if evidence was summarized, that should be visible in the output
- Consider: should the model be told "this evidence was summarized, full content available at {path}"?
- This step can be refined later based on real-world usage patterns
