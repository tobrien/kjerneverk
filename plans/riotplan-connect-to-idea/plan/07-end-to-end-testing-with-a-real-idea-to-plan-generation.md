# Step 07: End-to-end testing with a real idea-to-plan generation

## Objective

Test the complete artifact-aware generation pipeline using a real idea directory with evidence, history, constraints, and a selected approach. Verify that the generated plan is genuinely grounded in the artifacts, not just generally competent.

## Background

The whole point of this work is that plans should be reproducible from artifacts alone - "someone else should be able to generate a similar plan from the same artifacts." This step tests that claim. We need to verify that the generated plan reflects the specific constraints, incorporates the specific evidence, and implements the specific selected approach - not just produce a generally reasonable plan that a model could generate from the description alone.

## Tasks

### 1. Select or create a test idea directory

Use an existing completed plan (e.g., `plans/done/riotplan-gathering-evidence/`) as a test case, or create a purpose-built test idea with:
- IDEA.md with specific constraints (at least 4)
- SHAPING.md with a selected approach
- Evidence files (at least 2) with specific findings
- History timeline with notes and narrative chunks

### 2. Generate a plan using the new pipeline

Run `riotplan_build` against the test idea directory and capture:
- The full prompt sent to the model (log it for inspection)
- The model's response including analysis section
- The generated PROVENANCE.md
- Any validation warnings

### 3. Verify artifact grounding

Check the generated plan against the artifacts:
- Does each constraint from IDEA.md have at least one step addressing it?
- Does the plan implement the selected approach (not an alternative)?
- Are evidence findings reflected in step design (specific details, not general)?
- Does PROVENANCE.md accurately map constraints → steps?
- Could this plan have been generated from the description alone, or does it clearly show artifact influence?

### 4. Test the degraded mode

Test with a minimal idea (only IDEA.md, no evidence, no shaping):
- Verify generation still works (fallback behavior)
- Verify no errors from missing artifacts
- Verify PROVENANCE.md still generated (with fewer sections)

### 5. Test token tiering

If the test idea has large artifacts, verify that:
- Smart tiering kicks in at the right thresholds
- Summarized evidence is still useful in the prompt
- Token budget summary appears in output

### 6. Compare with old behavior

If possible, generate a plan from the same idea using the OLD pipeline (description-only) and compare with the new artifact-aware plan. Document the differences - this is the proof that the change matters.

## Acceptance Criteria

- [ ] Plan generated from full idea directory reflects all constraints
- [ ] Plan implements the selected approach, not a generic alternative
- [ ] Evidence findings appear in specific step designs
- [ ] PROVENANCE.md correctly maps artifacts to steps
- [ ] Validation reports no uncovered constraints
- [ ] Degraded mode works (minimal idea, no evidence)
- [ ] Token tiering works for large artifact sets
- [ ] Generated plan is clearly different from what description-only generation would produce

## Files Changed

- No code changes - this is a testing and verification step
- May produce test artifacts in a test directory

## Testing

This entire step IS testing. The acceptance criteria above define what success looks like.

## Notes

- This is the most important step - it validates that all the previous work actually achieves the goal
- The comparison with old behavior (task 6) is particularly valuable for demonstrating impact
- If the plan ISN'T meaningfully different from description-only generation, we need to revisit the prompts
- Consider: should we keep the test artifacts as evidence for this plan's own documentation?
- The "reproducibility" constraint can be tested by running generation twice and comparing outputs (they should be structurally similar, even if not identical)
