# Step 02: Rewrite generator system and user prompts for artifact-aware generation

## Objective

Replace the generic generator prompts with artifact-aware prompts that instruct the model to honor constraints, implement the selected approach, reference evidence, and ground steps in specific artifacts rather than general knowledge.

## Background

The current system prompt in `generator.ts` (lines 122-132) is completely generic: "You are an expert project planner and software architect" with boilerplate about breaking work into steps. It says nothing about constraints, evidence, or selected approaches. The user prompt (lines 134-196) asks for steps but doesn't instruct the model to honor specific artifacts. This is why plan generation works from conversation memory rather than from the artifacts themselves.

## Tasks

### 1. Rewrite the system prompt

Replace the generic system prompt with one that establishes artifact-aware generation as the core behavior:

- You are generating a plan that MUST be grounded in the provided artifacts
- Constraints are non-negotiable requirements that every plan must address
- Evidence files contain research, analysis, and findings that should inform step design
- The selected approach defines the implementation strategy - steps must implement it
- History context shows the evolution of thinking - respect the decisions made

### 2. Rewrite the user prompt builder (buildPlanPrompt)

Restructure `buildPlanPrompt()` to construct labeled sections from `GenerationContext`:

```
== PLAN NAME ==
{planName}

== CORE CONCEPT ==
{description extracted from IDEA.md}

== CONSTRAINTS (MUST HONOR ALL) ==
1. {constraint 1}
2. {constraint 2}
...

== SELECTED APPROACH ==
Name: {approach name}
Description: {approach description}
Reasoning: {why this was selected}

== EVIDENCE ==
### {evidence file 1 name}
{content or summary}

### {evidence file 2 name}
{content or summary}

== HISTORY CONTEXT ==
{key narrative chunks and decisions}

== GENERATION INSTRUCTIONS ==
- Every constraint MUST be addressed by at least one step
- Steps must implement the selected approach, not an alternative
- Reference specific evidence when it informs a step's design
- Be concrete about files, functions, and code changes
- Include provenance: which constraints and evidence each step addresses
```

### 3. Make sections conditional

If there are no evidence files, omit the EVIDENCE section. If there's no selected approach (building from idea stage without shaping), omit that section. If there's no history, omit that section. The prompt should be clean and not full of empty placeholders.

### 4. Maintain backward compatibility

If `GenerationContext` has no structured fields (constraints, evidence, etc.), fall back to the current behavior of just using the description string. This ensures existing callers of `generatePlan()` don't break.

## Acceptance Criteria

- [ ] System prompt instructs artifact-aware generation (not generic planning)
- [ ] User prompt has labeled sections for constraints, selected approach, evidence, and history
- [ ] Empty sections are omitted (no placeholders for missing artifacts)
- [ ] Backward compatible - works with just a description string (no structured fields)
- [ ] Prompt explicitly instructs the model to address every constraint

## Files Changed

- `src/ai/generator.ts` - Rewrite `SYSTEM_PROMPT` and `buildPlanPrompt()` function

## Testing

- Generate a plan with full artifacts and verify the prompt includes all sections
- Generate a plan with only IDEA.md (no evidence, no shaping) and verify clean prompt
- Verify the system prompt establishes artifact-aware behavior
- Check that constraint numbering in the prompt matches what's in IDEA.md

## Notes

- Don't change the response schema yet (that's step 3)
- The prompt should be substantial but not wasteful - include evidence content that's useful, not padding
- Consider using markdown formatting in the prompt sections for readability
