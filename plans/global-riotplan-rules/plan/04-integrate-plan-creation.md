# Step 04: Integrate into Plan Creation

## Objective

Run validation rules after a plan is created. This ensures plans meet project-specific validation criteria immediately after generation.

## Background

Plan creation happens in multiple places:
- `src/cli/commands/create.ts` - CLI create command
- `src/mcp/tools/create.ts` - MCP create tool
- After plan generation completes, we should run validation rules

## Tasks

### 1. Update Plan Creation Flow

In `src/cli/commands/create.ts`:
- After plan generation completes (in `generatePlanWithAI`)
- Load config to get validation rules
- Call validation runner with plan path and rules
- Log validation results (warnings/errors)

### 2. Update MCP Create Tool

In `src/mcp/tools/create.ts`:
- After plan creation completes
- Load config to get validation rules
- Call validation runner
- Include validation results in tool response

### 3. Handle Validation Failures

Decide on behavior when validation fails:
- Log warnings but don't fail plan creation?
- Return validation results in response?
- For now, log results but don't block creation

## Acceptance Criteria

- [ ] Validation rules run after plan creation in CLI
- [ ] Validation rules run after plan creation in MCP tool
- [ ] Validation results are logged/returned
- [ ] Plan creation succeeds even if validation fails (for now)
- [ ] Works correctly when no validation rules defined

## Testing

- Create plan with validation rules in config
- Verify validation runs after creation
- Verify results are logged/returned
- Create plan without validation rules - should work normally

## Files Changed

- `src/cli/commands/create.ts`
- `src/mcp/tools/create.ts`

## Notes

- Validation doesn't block creation (for now)
- Results should be visible to user
- Can enhance failure handling later
