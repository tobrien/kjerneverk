# Step 03: Create Validation Runner

## Objective

Create a function that runs validation rules against a plan. Validation rules are freeform markdown strings that describe checks to perform. This function will be called after plan creation and during feedback iterations.

## Background

Validation rules need to be executed, but since they're freeform markdown, we need a simple approach. Options:
1. Pass rules to AI model to check plan against rules
2. Simple text matching/search
3. User-defined validation function

For now, keep it simple - we'll create a function that can be extended later. The function should:
- Accept plan path and validation rules
- Return validation results (pass/fail, messages)
- Be callable from plan creation and feedback flows

## Tasks

### 1. Create Validation Rules Module

Create `src/plan/rules-validator.ts`:
- Function `runValidationRules(planPath: string, rules: string[]): ValidationResult`
- For now, return structure indicating rules were checked
- Can be a placeholder that returns success (to be implemented later)

### 2. Define Validation Result Type

Define interface for validation results:
```typescript
interface ValidationRuleResult {
  rule: string;
  passed: boolean;
  message?: string;
}

interface ValidationRulesResult {
  allPassed: boolean;
  results: ValidationRuleResult[];
}
```

### 3. Basic Implementation

For initial implementation:
- Return structure showing rules were checked
- Can be placeholder that always passes (actual validation logic added later)
- Or simple text search in plan files for rule keywords

## Acceptance Criteria

- [ ] Validation runner function exists
- [ ] Function accepts plan path and rules array
- [ ] Function returns validation results structure
- [ ] Function can be called from plan creation flow
- [ ] Function can be called from feedback flow

## Testing

- Call validation runner with rules
- Verify results structure is correct
- Test with empty rules array
- Test with plan path that doesn't exist (error handling)

## Files Changed

- `src/plan/rules-validator.ts` (new file)

## Notes

- Initial implementation can be simple/placeholder
- Actual validation logic can be enhanced later
- Focus on structure and integration points first
