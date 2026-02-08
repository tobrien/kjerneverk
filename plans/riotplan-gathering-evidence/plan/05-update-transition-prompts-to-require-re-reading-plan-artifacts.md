# Step 5: Update transition prompts to require re-reading plan artifacts

**Model: Sonnet 4.5** — Editing multiple prompt files with consistent instructions. Needs to understand each prompt's existing structure and insert the right instructions without redundancy. Note: `develop_plan.md` already does this well — use it as the model for the others.

## Objective

Ensure that every stage transition prompt explicitly requires the model to re-read all plan artifacts (IDEA.md, SHAPING.md, evidence/ files, recent history) before proceeding. The model must work from the plan files, not conversation memory.

## Context

The `develop_plan.md` prompt already does this excellently — it has a "Critical Context Sources" section and says "DO NOT SKIP THIS STEP." But `shape_approach.md`, `execute_plan.md`, and `execute_step.md` may not have equivalent instructions. The constraint from IDEA.md states: "At every stage transition, prompts MUST instruct the model to re-read all plan artifacts."

## Files to Modify

1. **`src/mcp/prompts/shape_approach.md`** — Add artifact re-reading requirement at the start
2. **`src/mcp/prompts/execute_plan.md`** — Add artifact re-reading requirement at the start
3. **`src/mcp/prompts/execute_step.md`** — Add evidence reading requirement before executing each step

## Tasks

- [ ] Read `develop_plan.md` as the reference — it has the best pattern for requiring artifact reading (lines 32-93)
- [ ] Read each of the three prompts to understand their current state
- [ ] For `shape_approach.md`: Add a section requiring the model to read IDEA.md and evidence/ before proposing approaches. Approaches should be informed by evidence, not just conversation.
- [ ] For `execute_plan.md`: Add a section requiring the model to read IDEA.md, SHAPING.md, evidence/, and the step files before beginning execution. Reference `develop_plan.md`'s pattern.
- [ ] For `execute_step.md`: Add a requirement to read the specific step file AND any evidence files referenced in it before implementing. The model should check if evidence/ has relevant files for this step.
- [ ] Use consistent language across all prompts: "Before proceeding, you MUST read..." with a concrete list of what to read
- [ ] Add anti-pattern to each: "Do NOT rely on conversation memory — the plan files are the source of truth"

## Acceptance Criteria

- [ ] `shape_approach.md` requires reading IDEA.md and evidence/ before proposing approaches
- [ ] `execute_plan.md` requires reading all plan artifacts before beginning execution
- [ ] `execute_step.md` requires reading step file and relevant evidence before implementing
- [ ] All three prompts use "MUST" language consistent with `develop_plan.md`
- [ ] Anti-patterns about conversation memory are present in each

## Evidence

- IDEA.md constraint: "At every stage transition, prompts MUST instruct the model to re-read all plan artifacts"
- `develop_plan.md` (lines 32-119) — existing best practice to follow
- Bug report: `.evidence/bug-model-not-reading-evidence.md` — model works from memory, not files

## Dependencies

- None (prompt changes are independent of code changes, but logically follows Step 4)
