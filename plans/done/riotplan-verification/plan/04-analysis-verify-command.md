# Step 04: Analysis Verify Command

## Objective

Implement the `riotplan verify --analysis` CLI command.

## Background

This command displays the coverage report showing how well the plan addresses the analysis requirements.

## Tasks

### 4.1 Create Verify Command

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/verify.ts`:

```typescript
import { Command } from "commander";
import chalk from "chalk";
import { resolve } from "node:path";
import { checkCoverage } from "../../verification/index.js";
import type { CoverageReport, CriterionResult } from "../../verification/types.js";

export interface VerifyOptions {
    analysis?: boolean;
    execution?: boolean;
    criteria?: boolean;
    json?: boolean;
}

/**
 * Format coverage report for terminal output
 */
function formatCoverageReport(report: CoverageReport): void {
    console.log(chalk.bold.cyan("\nVerification: Analysis → Plan Alignment"));
    console.log(chalk.cyan("═".repeat(50)));
    
    if (report.totalCriteria === 0) {
        console.log(chalk.yellow("\nNo verification criteria found."));
        if (report.questions.length > 0) {
            console.log(chalk.gray("\nNotes:"));
            for (const note of report.questions) {
                console.log(chalk.gray(`  - ${note}`));
            }
        }
        return;
    }
    
    console.log(chalk.gray("\nChecking requirements coverage...\n"));
    
    // Covered
    if (report.covered.length > 0) {
        console.log(chalk.green(`✅ COVERED (${report.covered.length}):`));
        for (const result of report.covered) {
            const steps = result.matchedSteps.length > 0 
                ? ` → Steps ${result.matchedSteps.join(", ")}` 
                : "";
            console.log(chalk.green(`   • ${result.criterion.text}${steps}`));
        }
        console.log();
    }
    
    // Partial
    if (report.partial.length > 0) {
        console.log(chalk.yellow(`⚠️  PARTIAL (${report.partial.length}):`));
        for (const result of report.partial) {
            const steps = result.matchedSteps.length > 0 
                ? ` → Steps ${result.matchedSteps.join(", ")}` 
                : "";
            console.log(chalk.yellow(`   • ${result.criterion.text}${steps}`));
            if (result.notes) {
                console.log(chalk.gray(`     ${result.notes}`));
            }
        }
        console.log();
    }
    
    // Missing
    if (report.missing.length > 0) {
        console.log(chalk.red(`❌ MISSING (${report.missing.length}):`));
        for (const result of report.missing) {
            const priority = result.criterion.priority === "must" 
                ? chalk.red("[MUST]") 
                : result.criterion.priority === "should" 
                    ? chalk.yellow("[SHOULD]") 
                    : chalk.gray("[COULD]");
            console.log(chalk.red(`   • ${priority} ${result.criterion.text}`));
        }
        console.log();
    }
    
    // Priority breakdown
    console.log(chalk.cyan("Coverage by Priority:"));
    console.log(chalk.gray(`   Must:   ${formatPriorityCoverage(report.byPriority.must)}`));
    console.log(chalk.gray(`   Should: ${formatPriorityCoverage(report.byPriority.should)}`));
    console.log(chalk.gray(`   Could:  ${formatPriorityCoverage(report.byPriority.could)}`));
    console.log();
    
    // Verification questions
    if (report.questions.length > 0) {
        console.log(chalk.cyan("Verification Questions:"));
        for (let i = 0; i < report.questions.length; i++) {
            console.log(chalk.gray(`  ${i + 1}. ${report.questions[i]}`));
        }
        console.log();
    }
    
    // Score
    const scoreColor = report.coverageScore >= 80 
        ? chalk.green 
        : report.coverageScore >= 60 
            ? chalk.yellow 
            : chalk.red;
    console.log(chalk.bold(`Alignment Score: ${scoreColor(report.coverageScore + "%")}`));
}

function formatPriorityCoverage(stats: { total: number; covered: number; partial: number; missing: number }): string {
    if (stats.total === 0) return "N/A";
    const covered = stats.covered + stats.partial;
    const pct = Math.round((covered / stats.total) * 100);
    return `${covered}/${stats.total} (${pct}%)`;
}

/**
 * Register the verify command
 */
export function registerVerifyCommand(program: Command): void {
    program
        .command("verify [path]")
        .description("Verify plan alignment and completion")
        .option("-a, --analysis", "Verify plan covers analysis requirements")
        .option("-e, --execution", "Verify execution is complete")
        .option("-c, --criteria", "Show all verification criteria")
        .option("--json", "Output as JSON")
        .action(async (pathArg: string | undefined, options: VerifyOptions) => {
            try {
                const planPath = resolve(pathArg || process.cwd());
                
                // Default to all checks if none specified
                const runAnalysis = options.analysis || (!options.analysis && !options.execution && !options.criteria);
                const runExecution = options.execution || (!options.analysis && !options.execution && !options.criteria);
                const showCriteria = options.criteria;
                
                if (showCriteria) {
                    // Just show criteria (implemented in later step)
                    console.log(chalk.yellow("--criteria not yet implemented"));
                    return;
                }
                
                if (runAnalysis) {
                    const report = await checkCoverage(planPath);
                    
                    if (options.json) {
                        console.log(JSON.stringify(report, null, 2));
                    } else {
                        formatCoverageReport(report);
                    }
                }
                
                if (runExecution) {
                    // Implemented in Step 06
                    console.log(chalk.yellow("\n--execution not yet implemented"));
                }
                
            } catch (error) {
                console.error(chalk.red("Verification failed:"), error);
                process.exit(1);
            }
        });
}
```

### 4.2 Register Command

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/cli.ts`:

```typescript
import { registerVerifyCommand } from "./commands/verify.js";

// In createProgram():
registerVerifyCommand(program);
```

## Acceptance Criteria

- [ ] `riotplan verify --analysis` runs coverage check
- [ ] Covered/partial/missing criteria displayed with colors
- [ ] Priority breakdown shown
- [ ] Verification questions generated
- [ ] Alignment score displayed
- [ ] `--json` outputs JSON format
- [ ] TypeScript compiles without errors

## Testing

```bash
# Manual testing
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build

# Create a test plan with analysis
./dist/cli/bin.js create test-verify --analyze
# Add verification criteria to analysis/REQUIREMENTS.md
./dist/cli/bin.js generate ./test-verify

# Run verification
./dist/cli/bin.js verify ./test-verify --analysis
./dist/cli/bin.js verify ./test-verify --analysis --json
```

## Files Changed

- `riotplan/src/cli/commands/verify.ts` (new)
- `riotplan/src/cli/cli.ts` (register command)

## Notes

The output formatting is designed to be scannable. Green = good, yellow = needs attention, red = problem.
