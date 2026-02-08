# Step 7: Add build-time validation for evidence usage in generated steps

**Model: Sonnet 4.5** — Validation logic that scans step files for evidence references. Moderate complexity — needs to read the evidence directory, scan step file content, and produce a warning. Not blocking, just advisory.

## Objective

Add a validation check that runs during plan building/validation that warns if evidence files exist in `evidence/` but none of the generated step files reference them. This is a non-blocking warning, not an error — it nudges the model (or user) to incorporate evidence into the plan.

## Context

The "model not reading evidence" bug (`.evidence/bug-model-not-reading-evidence.md`) documents how models create steps from memory without referencing evidence. Even with prompt improvements (Steps 4-5) and the context tool (Step 6), validation provides a safety net. This is the final layer of defense in the belt-and-suspenders approach.

## Files to Modify

1. **`src/mcp/tools/build.ts`** or validation logic location — Add evidence usage check
2. **`src/steps/operations.ts`** (if validation lives here) — Alternative location

## Tasks

- [ ] Find where plan validation currently lives (likely `riotplan_validate` tool)
- [ ] Add a new validation check: "evidence_usage"
  - List all files in `evidence/` directory
  - If count > 0, scan all step files in `plan/` directory
  - Check if any step file content mentions `evidence/` or any evidence filename
  - If evidence exists but no step references it, return a WARNING (not error)
- [ ] Warning message should be actionable: "Found N evidence files but no step references them. Consider reviewing evidence/ and incorporating findings into relevant steps."
- [ ] Add the check to the existing validation pipeline
- [ ] Ensure it doesn't block plan creation — warnings only

## Acceptance Criteria

- [ ] Validation warns when evidence/ has files but step files don't reference them
- [ ] Warning is non-blocking (plan still validates successfully)
- [ ] Warning message is clear and actionable
- [ ] No false positives when evidence files are properly referenced in steps
- [ ] Works for both `riotplan_validate` calls and any build-time validation
- [ ] Handles edge case: no evidence directory (no warning needed)

## Evidence

- Bug report: `.evidence/bug-model-not-reading-evidence.md` — documents the failure mode this catches
- Shaping approach: "Validation catches the 'model ignored evidence' failure mode"

## Dependencies

- Steps 1-3 (schema/code changes complete)
- Steps 4-5 helpful but not required (validation works regardless of prompt changes)
