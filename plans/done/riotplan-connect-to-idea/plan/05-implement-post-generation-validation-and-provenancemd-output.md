# Step 05: Implement post-generation validation and PROVENANCE.md output

## Objective

After a plan is generated, validate that constraints are addressed, evidence is referenced, and the selected approach is reflected. Produce a PROVENANCE.md file that documents how the plan connects to the idea artifacts.

## Background

This is the accountability layer. Without validation, provenance citations could be shallow or missing. The validation step catches when the model says "I addressed this constraint" but actually didn't, or when evidence files were provided but no step references them. PROVENANCE.md makes the connection between artifacts and plan visible and auditable - you can look at it and see exactly how the idea shaped the plan. The user also noted this should have a hook for future customizable validation.

## Tasks

### 1. Implement constraint coverage validation

After generation, check the analysis and step provenance:

- For each constraint from IDEA.md, verify at least one step cites it in `constraintsAddressed`
- Produce a coverage report: which constraints are covered, which are uncovered
- Uncovered constraints produce warnings (not errors - generation still succeeds)

### 2. Implement evidence reference validation

If evidence files were provided in the prompt:

- Check if the analysis section has an entry for each evidence file
- Check if any steps reference evidence in their `evidenceUsed` field
- Evidence that was provided but never referenced produces a warning
- This is informational, not blocking - some evidence may legitimately not apply to any step

### 3. Implement selected approach validation

If a selected approach was provided:

- Check that the analysis section's `approachAnalysis` is populated
- Check that the plan summary or approach text references the selected approach name
- Warning if the analysis doesn't mention the approach

### 4. Generate PROVENANCE.md

Create a `PROVENANCE.md` file in the plan directory that documents:

```markdown
# Plan Provenance

## How This Plan Was Generated

Generated from idea artifacts on {date}.

## Artifact Analysis

### Constraints
| # | Constraint | Addressed By | Analysis |
|---|-----------|-------------|----------|
| 1 | {constraint text} | Step 2, Step 5 | {model's understanding} |
| 2 | {constraint text} | Step 3 | {model's understanding} |

### Evidence Used
| File | Key Findings | Referenced In |
|------|-------------|--------------|
| {filename} | {key findings} | Step 1, Step 4 |

### Selected Approach
- **Approach**: {name}
- **Commitments**: {what it committed to}
- **Implementation Strategy**: {how the plan implements it}

## Coverage Warnings
- {any uncovered constraints or unreferenced evidence}

## Token Budget
- Total artifact size: {N} tokens
- Evidence tiering applied: {yes/no, details}
```

### 5. Add validation hook point

Structure the validation as a pipeline of checks that can be extended:

```typescript
interface ValidationCheck {
    name: string;
    validate(plan: GeneratedPlan, context: GenerationContext): ValidationResult;
}

interface ValidationResult {
    passed: boolean;
    warnings: string[];
    details: Record<string, any>;
}
```

This provides the extensibility hook the user mentioned for future customizable validation.

### 6. Integrate validation into build.ts

After `generatePlan()` returns, run the validation pipeline, generate PROVENANCE.md, and include validation results in the build output message.

## Acceptance Criteria

- [ ] Constraint coverage is checked - uncovered constraints produce warnings
- [ ] Evidence reference is checked - unreferenced evidence produces warnings  
- [ ] Selected approach validation checks analysis section
- [ ] PROVENANCE.md is generated with constraint mapping, evidence usage, and approach analysis
- [ ] Validation warnings appear in the build output message
- [ ] Validation is structured as extensible pipeline (hook for future customization)
- [ ] PROVENANCE.md includes token budget information

## Files Changed

- New: `src/ai/validation.ts` - Validation checks and pipeline
- New: `src/ai/provenance.ts` - PROVENANCE.md generation
- `src/mcp/tools/build.ts` - Integrate validation and provenance generation after plan generation

## Testing

- Generate a plan where all constraints are addressed → no warnings
- Generate a plan where a constraint is missed → warning appears
- Generate a plan with evidence that's not referenced → warning appears
- Verify PROVENANCE.md content matches the analysis and provenance data
- Verify validation pipeline is extensible (can add a custom check)

## Notes

- Validation is warnings-only, not blocking. The plan is still generated even if validation finds gaps.
- PROVENANCE.md is a plan artifact alongside SUMMARY.md and EXECUTION_PLAN.md
- The extensible validation pipeline is the hook for the future customizable validation the user mentioned
- Consider: should validation results be saved to timeline as an event?
