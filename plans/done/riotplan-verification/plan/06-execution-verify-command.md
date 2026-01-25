# Step 06: Execution Verify Command

## Objective

Implement the `riotplan verify --execution` display.

## Background

This adds execution verification display to the verify command created in Step 04.

## Tasks

### 6.1 Add Execution Report Formatting

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/verify.ts`:

```typescript
import { checkCompletion } from "../../verification/index.js";
import type { CompletionReport, StepCompletionResult } from "../../verification/types.js";

/**
 * Format completion report for terminal output
 */
function formatCompletionReport(report: CompletionReport): void {
    console.log(chalk.bold.cyan("\nVerification: Plan → Execution Alignment"));
    console.log(chalk.cyan("═".repeat(50)));
    
    if (report.totalSteps === 0) {
        console.log(chalk.yellow("\nNo steps found in plan."));
        return;
    }
    
    console.log(chalk.gray("\nChecking step completion...\n"));
    
    // Show each step
    const allSteps = [
        ...report.complete,
        ...report.partial,
        ...report.incomplete,
        ...report.pending,
    ].sort((a, b) => a.stepNumber - b.stepNumber);
    
    for (const step of allSteps) {
        formatStepResult(step);
    }
    
    // Summary
    console.log(chalk.cyan("\nSummary:"));
    console.log(chalk.green(`   ✅ Complete: ${report.complete.length}`));
    console.log(chalk.yellow(`   ⚠️  Partial: ${report.partial.length}`));
    console.log(chalk.red(`   ❌ Incomplete: ${report.incomplete.length}`));
    console.log(chalk.gray(`   ⬜ Pending: ${report.pending.length}`));
    console.log();
    
    // Outstanding items
    if (report.outstandingItems.length > 0) {
        console.log(chalk.cyan("Outstanding Items:"));
        for (const item of report.outstandingItems.slice(0, 10)) {
            console.log(chalk.gray(`   • ${item}`));
        }
        if (report.outstandingItems.length > 10) {
            console.log(chalk.gray(`   ... and ${report.outstandingItems.length - 10} more`));
        }
        console.log();
    }
    
    // Score
    const scoreColor = report.completionScore >= 90 
        ? chalk.green 
        : report.completionScore >= 70 
            ? chalk.yellow 
            : chalk.red;
    console.log(chalk.bold(`Execution Completeness: ${scoreColor(report.completionScore + "%")}`));
}

/**
 * Format a single step result
 */
function formatStepResult(step: StepCompletionResult): void {
    const statusIcon = {
        complete: chalk.green("✅"),
        partial: chalk.yellow("⚠️"),
        incomplete: chalk.red("❌"),
        pending: chalk.gray("⬜"),
        skipped: chalk.gray("⏭️"),
    }[step.status];
    
    const stepNum = String(step.stepNumber).padStart(2, "0");
    console.log(`${statusIcon} Step ${stepNum} - ${step.stepTitle}`);
    
    // Show criteria details for non-complete steps
    if (step.status !== "complete" && step.status !== "pending" && step.status !== "skipped") {
        for (const criterion of step.acceptanceCriteria) {
            const icon = criterion.checked ? chalk.green("✅") : chalk.red("❌");
            console.log(chalk.gray(`   ${icon} ${criterion.text}`));
        }
    }
    
    // Special message for incomplete (marked done but not done)
    if (step.status === "incomplete") {
        console.log(chalk.red(`   ⚠️  Marked as ${step.markedStatus} but criteria not met`));
    }
}
```

### 6.2 Update Verify Command Action

Update the action handler in verify.ts:

```typescript
if (runExecution) {
    const report = await checkCompletion(planPath);
    
    if (options.json) {
        console.log(JSON.stringify(report, null, 2));
    } else {
        formatCompletionReport(report);
    }
}
```

## Acceptance Criteria

- [ ] `riotplan verify --execution` runs completion check
- [ ] Each step shown with status icon
- [ ] Incomplete steps show unchecked criteria
- [ ] "Marked done but not done" specially highlighted
- [ ] Summary counts displayed
- [ ] Outstanding items listed
- [ ] Completion score displayed
- [ ] `--json` outputs JSON format
- [ ] TypeScript compiles without errors

## Testing

```bash
# Manual testing
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build

# Create and partially complete a plan
./dist/cli/bin.js create test-exec --direct
./dist/cli/bin.js generate ./test-exec
# Manually mark some steps complete in STATUS.md
# Check some criteria in step files

# Run verification
./dist/cli/bin.js verify ./test-exec --execution
./dist/cli/bin.js verify ./test-exec --execution --json
```

## Files Changed

- `riotplan/src/cli/commands/verify.ts` (update)

## Notes

The key output is catching when STATUS.md says "Complete" but the acceptance criteria checkboxes in the step file aren't all checked.
