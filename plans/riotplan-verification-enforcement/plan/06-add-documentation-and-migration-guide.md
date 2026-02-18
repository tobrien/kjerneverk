# Step 06: Add Documentation and Migration Guide

## Objective

Create comprehensive documentation for the verification system and migration guide for existing users

## Background

The verification system introduces new configuration options and changes behavior. Users need clear documentation and migration guidance to adopt the system effectively.

## Tasks

### 1. 06.1

Create comprehensive documentation in docs/verification.md:

```markdown
# Plan Verification System

## Overview

The verification system prevents incomplete steps from being marked as done through automated checks and configurable enforcement.

## Configuration

```yaml
# riotplan.yml
verification:
  enforcement: interactive  # advisory | interactive | strict
  checkAcceptanceCriteria: true
  checkArtifacts: false
  autoRetrospective: true
  requireEvidence: false
```

## Enforcement Levels

- **Advisory**: Show warnings but allow completion
- **Interactive**: Prompt user for confirmation (default)
- **Strict**: Block completion unless --force flag

## Usage Examples

```bash
# Complete with verification (default)
riotplan step complete 3

# Force completion bypassing verification
riotplan step complete 3 --force

# Skip verification entirely
riotplan step complete 3 --no-verify
```
```

This provides complete user-facing documentation with examples and configuration options.

### 2. 06.2

Create migration guide in docs/verification-migration.md:

```markdown
# Migrating to Verification System

## For Existing Users

The verification system is **opt-in by default** through the 'interactive' enforcement mode:

- Existing workflows continue to work unchanged
- You'll be prompted if verification finds issues
- Use --force to bypass any prompts

## Gradual Adoption

1. **Start with Advisory**: Set `enforcement: advisory` to see warnings without blocking
2. **Enable Interactive**: Default mode provides safety with flexibility  
3. **Strict Mode**: Use in CI/automated environments with --force escape hatch

## Configuration Migration

No breaking changes to existing configuration files. Add verification section when ready:

```yaml
# Add this to existing riotplan.yml
verification:
  enforcement: advisory  # Start here
```

## Environment Variables

```bash
# Override per-user or per-environment
export RIOTPLAN_VERIFICATION_ENFORCEMENT=strict
export RIOTPLAN_VERIFICATION_CHECK_CRITERIA=true
```
```

This ensures smooth migration path for existing users.

### 3. 06.3

Add verification examples to the existing CLI help and create integration tests that demonstrate the full workflow. Update src/cli/commands/step.ts to include verification help:

```typescript
step.command("complete")
    .description("Mark a step as complete with optional verification")
    .argument("<n>", "Step number to complete", parseInt)
    .option("-n, --notes <text>", "Completion notes")
    .option("-f, --force", "Skip verification checks")
    .option("--no-verify", "Skip verification entirely")
    .addHelpText('after', `
Verification Modes:
  advisory     Show warnings only (RIOTPLAN_VERIFICATION_ENFORCEMENT=advisory)
  interactive  Prompt for confirmation (default)
  strict       Block unless --force (RIOTPLAN_VERIFICATION_ENFORCEMENT=strict)

Examples:
  $ riotplan step complete 3              # Complete with verification
  $ riotplan step complete 3 --force      # Force completion
  $ riotplan step complete 3 --no-verify  # Skip verification
`)
```

This provides inline help that explains the verification system to users.

### 4. 06.4

Create integration tests in tests/verification-integration.test.ts that demonstrate the complete workflow:

```typescript
describe('Verification Integration', () => {
    test('interactive mode prompts user on verification failure', async () => {
        const plan = await createTestPlan();
        const step = plan.steps[0];
        
        // Add unchecked acceptance criteria to step file
        await writeStepFile(step.filePath, `
## Acceptance Criteria
- [ ] Unchecked criterion
        `);
        
        // Mock inquirer prompt
        const promptSpy = jest.spyOn(inquirer, 'prompt')
            .mockResolvedValue({ proceed: false });
        
        await expect(completeStepViaCLI(plan.path, step.number))
            .rejects.toThrow('Step completion cancelled');
            
        expect(promptSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Mark step as complete despite these issues?'
            })
        );
    });
    
    test('force flag bypasses all verification', async () => {
        // Test that --force works in all enforcement modes
    });
    
    test('advisory mode shows warnings but completes', async () => {
        // Test warning behavior
    });
});
```

This provides comprehensive testing of the complete user workflow.

## Acceptance Criteria

- [x] Complete documentation explains all verification features and configuration options
- [x] Migration guide provides clear path for existing users
- [x] CLI help includes verification examples and usage patterns (added in Step 7)
- [x] Integration tests cover all enforcement modes and edge cases (added in Step 7)

## Testing

Documentation review, migration testing with existing plans, and comprehensive integration test suite

## Files Changed

- `docs/verification.md`
- `docs/verification-migration.md`
- `src/cli/commands/step.ts`
- `tests/verification-integration.test.ts`

## Notes

This step ensures users can successfully adopt and use the verification system
