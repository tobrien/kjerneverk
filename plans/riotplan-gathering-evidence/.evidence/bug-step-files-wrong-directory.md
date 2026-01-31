# Bug: riotplan_step_add Creates Files in Wrong Directory

## Summary
`riotplan_step_add` creates step files directly in the plan root directory instead of in a `plan/` subdirectory.

## Expected Behavior
Step files should be created in:
```
/path/to/plan/plan/01-step-name.md
/path/to/plan/plan/02-step-name.md
```

## Actual Behavior
Step files are created in:
```
/path/to/plan/01-step-name.md
/path/to/plan/02-step-name.md
```

## Evidence
All existing plans in the repository use `plan/` subdirectory:
- `mcp-integration/env-var-config-implementation/plan/`
- `done/config-discovery-locations/plan/`
- `done/config-format-support/plan/`
- `future/server-runtime-support/plan/`

## Impact
- **Inconsistent structure** - New plans don't match existing pattern
- **Pollutes plan root** - Step files mixed with IDEA.md, SHAPING.md, LIFECYCLE.md
- **Breaks tooling** - Any scripts/tools expecting `plan/` subdirectory will fail
- **User confusion** - Users expect consistent structure

## Reproduction
```typescript
// Call riotplan_step_add
riotplan_step_add({
  title: "Test Step",
  description: "Test description",
  path: "/path/to/plan"
})

// Returns:
{
  "planPath": "/path/to/plan",
  "step": 1,
  "file": "/path/to/plan/01-test-step.md",  // WRONG - should be /path/to/plan/plan/01-test-step.md
  "renamedFiles": []
}
```

## Root Cause
The `riotplan_step_add` tool implementation creates files directly at `planPath` instead of `planPath/plan/`.

## Proposed Fix
```typescript
// In riotplan_step_add implementation:
const planDir = path.join(planPath, 'plan');

// Ensure plan directory exists
await fs.mkdir(planDir, { recursive: true });

// Create step file in plan subdirectory
const stepFile = path.join(planDir, `${stepNumber}-${slug}.md`);
await fs.writeFile(stepFile, content);

return {
  planPath,
  step: stepNumber,
  file: stepFile,  // Now returns correct path
  renamedFiles: []
};
```

## Testing
1. Create a new plan
2. Add steps using `riotplan_step_add`
3. Verify files are created in `plan/` subdirectory
4. Verify structure matches existing plans

## Related Issues
- This affects all new plans created with `riotplan_step_add`
- Existing plans are unaffected (they were created correctly)
- Workaround: Manually move files to `plan/` subdirectory

## Priority
**High** - Affects all new plan creation, creates inconsistent structure
