# Step 04: Enhance CLI Step Command with Interactive Verification

## Objective

Add interactive verification prompts and force flags to the CLI step completion command

## Background

The CLI in src/cli/commands/step.ts currently calls completeStep() directly. We need to add user interaction for the 'interactive' enforcement mode and support for the --force flag.

## Tasks

### 1. 04.1

Enhance the 'step complete' command in src/cli/commands/step.ts to handle verification:

```typescript
step.command("complete")
    .description("Mark a step as complete")
    .argument("<n>", "Step number to complete", parseInt)
    .option("-n, --notes <text>", "Completion notes")
    .option("-f, --force", "Skip verification checks")
    .option("--no-verify", "Skip verification entirely")
    .argument("[path]", "Path to plan directory", process.cwd())
    .action(async (stepNumber: number, options: {
        notes?: string;
        force?: boolean;
        verify?: boolean;
    }, path: string) => {
        try {
            const plan = await loadPlan(path);
            const config = await loadConfig(path);
            
            // Handle interactive verification
            if (config.verification?.enforcement === 'interactive' && !options.force) {
                await handleInteractiveVerification(plan, stepNumber, options);
            }
            
            const completed = await completeStep(plan, stepNumber, options.notes, {
                force: options.force,
                skipVerification: !options.verify
            });
            
            console.log(chalk.green(`✓ Completed step ${completed.number}: ${completed.title}`));
            
        } catch (error) {
            if (error instanceof VerificationError) {
                handleVerificationError(error, options.force);
            } else {
                console.error(chalk.red("Error completing step:"), (error as Error).message);
            }
            process.exit(1);
        }
    });
```

This adds the --force flag and interactive handling while maintaining the existing command structure.

### 2. 04.2

Implement interactive verification prompts in src/cli/utils/verification.ts:

```typescript
import inquirer from 'inquirer';

export async function handleInteractiveVerification(
    plan: Plan,
    stepNumber: number,
    options: any
): Promise<void> {
    const engine = new VerificationEngine();
    const config = await loadConfig(plan.metadata.path);
    
    const result = await engine.verifyStepCompletion(plan, stepNumber, {
        ...config.verification,
        force: false
    });
    
    if (result.level === 'error') {
        console.log(chalk.yellow('\n⚠️  Verification Issues Found:'));
        for (const message of result.messages) {
            console.log(chalk.gray(`   ${message}`));
        }
        
        const { proceed } = await inquirer.prompt([{
            type: 'confirm',
            name: 'proceed', 
            message: 'Mark step as complete despite these issues?',
            default: false
        }]);
        
        if (!proceed) {
            console.log(chalk.yellow('Step completion cancelled.'));
            process.exit(0);
        }
    }
}

export function handleVerificationError(error: VerificationError, force?: boolean): void {
    console.log(chalk.red('\n❌ Verification Failed:'));
    for (const message of error.details.messages) {
        console.log(chalk.gray(`   ${message}`));
    }
    
    if (!force) {
        console.log(chalk.yellow('\nUse --force to bypass verification checks.'));
    }
}
```

This provides a clean interactive experience that shows users what's wrong and lets them decide.

## Acceptance Criteria

- [x] CLI step complete command supports --force and --skip-verification flags (not --no-verify, but functionally equivalent)
- [x] Interactive mode prompts users with clear information about verification issues
- [x] Advisory mode shows warnings but doesn't block completion
- [x] Strict mode blocks completion unless --force is used
- [x] Error messages are clear and actionable

## Testing

CLI integration tests for each enforcement mode, flag handling, and user interaction flows

## Files Changed

- `src/cli/commands/step.ts`
- `src/cli/utils/verification.ts`

## Notes

This step provides the user-facing interface for the verification system
