# Step 05: Integrate into Feedback Flow

## Objective

Run validation rules during feedback iterations. This ensures plans continue to meet validation criteria as they evolve through feedback.

## Background

Feedback is handled in:
- `src/feedback/index.ts` - Feedback creation and management
- Feedback iterations may modify plans
- After feedback is processed, we should re-run validation rules

## Tasks

### 1. Identify Feedback Integration Points

Find where feedback is processed:
- When feedback is created (`createFeedback`)
- When feedback results in plan changes
- May need to add hook/extension point

### 2. Add Validation to Feedback Flow

After feedback is processed:
- Load config to get validation rules
- Call validation runner with plan path and rules
- Include validation results in feedback record or log them

### 3. Update Feedback Types (if needed)

If feedback records need to store validation results:
- Add optional `validationResults` field to `FeedbackRecord`
- Or create separate validation records

## Acceptance Criteria

- [ ] Validation rules run during feedback iterations
- [ ] Validation results are captured/logged
- [ ] Works correctly when no validation rules defined
- [ ] Doesn't interfere with existing feedback flow

## Testing

- Create feedback with validation rules in config
- Verify validation runs
- Verify results are captured
- Test without validation rules - should work normally

## Files Changed

- `src/feedback/index.ts` (or feedback processing code)
- `src/types.ts` (if adding validation results to feedback types)

## Notes

- May need to identify exact integration point
- Validation should be non-blocking
- Results should be visible/accessible
