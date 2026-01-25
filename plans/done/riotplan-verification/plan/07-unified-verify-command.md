# Step 07: Unified Verify Command

## Objective

Polish the verify command to run all checks by default and add the --criteria flag.

## Background

`riotplan verify` should:
- Run both analysis and execution checks by default
- Provide a unified health score
- Support `--criteria` to just show criteria

## Tasks

### 7.1 Add Full Verification Report

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/verify.ts`:

```typescript
import type { VerificationReport } from "../../verification/types.js";
import { parseCriteria, getCriteriaSummary } from "../../verification/index.js";

/**
 * Run full verification and generate combined report
 */
async function runFullVerification(planPath: string): Promise<VerificationReport> {
    const coverage = await checkCoverage(planPath);
    const completion = await checkCompletion(planPath);
    
    // Calculate overall health
    const healthScore = calculateHealthScore(coverage, completion);
    
    // Generate summary and recommendations
    const summary = generateSummary(coverage, completion);
    const recommendations = generateRecommendations(coverage, completion);
    
    return {
        planPath,
        timestamp: new Date(),
        coverage: coverage.totalCriteria > 0 ? coverage : undefined,
        completion: completion.totalSteps > 0 ? completion : undefined,
        healthScore,
        summary,
        recommendations,
    };
}

function calculateHealthScore(
    coverage: CoverageReport,
    completion: CompletionReport
): number {
    const scores: number[] = [];
    
    if (coverage.totalCriteria > 0) {
        scores.push(coverage.coverageScore);
    }
    
    if (completion.totalSteps > 0) {
        scores.push(completion.completionScore);
    }
    
    if (scores.length === 0) return 100;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function generateSummary(
    coverage: CoverageReport,
    completion: CompletionReport
): string[] {
    const summary: string[] = [];
    
    if (coverage.totalCriteria > 0) {
        summary.push(`Analysis coverage: ${coverage.coverageScore}% (${coverage.covered.length}/${coverage.totalCriteria} criteria)`);
    }
    
    if (completion.totalSteps > 0) {
        summary.push(`Execution progress: ${completion.completionScore}% (${completion.complete.length}/${completion.totalSteps} steps)`);
    }
    
    return summary;
}

function generateRecommendations(
    coverage: CoverageReport,
    completion: CompletionReport
): string[] {
    const recommendations: string[] = [];
    
    // Coverage recommendations
    if (coverage.missing.length > 0) {
        const mustMissing = coverage.missing.filter(r => r.criterion.priority === "must");
        if (mustMissing.length > 0) {
            recommendations.push(`Add plan steps for ${mustMissing.length} missing MUST HAVE criteria`);
        }
    }
    
    // Completion recommendations
    if (completion.incomplete.length > 0) {
        recommendations.push(`Review ${completion.incomplete.length} step(s) marked complete but with unchecked criteria`);
    }
    
    if (completion.outstandingItems.length > 0) {
        recommendations.push(`Address ${completion.outstandingItems.length} outstanding acceptance criteria`);
    }
    
    return recommendations;
}

/**
 * Format the full verification report
 */
function formatFullReport(report: VerificationReport): void {
    console.log(chalk.bold.cyan("\n╔════════════════════════════════════════════════╗"));
    console.log(chalk.bold.cyan("║           PLAN VERIFICATION REPORT             ║"));
    console.log(chalk.bold.cyan("╚════════════════════════════════════════════════╝"));
    console.log(chalk.gray(`\nPath: ${report.planPath}`));
    console.log(chalk.gray(`Time: ${report.timestamp.toISOString()}`));
    
    // Coverage section
    if (report.coverage) {
        formatCoverageReport(report.coverage);
    } else {
        console.log(chalk.gray("\n(No analysis found - skipping coverage check)"));
    }
    
    // Completion section
    if (report.completion) {
        formatCompletionReport(report.completion);
    } else {
        console.log(chalk.gray("\n(No plan steps found - skipping completion check)"));
    }
    
    // Summary
    console.log(chalk.bold.cyan("\n═══════════════════════════════════════════════"));
    console.log(chalk.bold("Summary:"));
    for (const line of report.summary) {
        console.log(chalk.gray(`  • ${line}`));
    }
    
    // Recommendations
    if (report.recommendations.length > 0) {
        console.log(chalk.bold("\nRecommendations:"));
        for (const rec of report.recommendations) {
            console.log(chalk.yellow(`  → ${rec}`));
        }
    }
    
    // Health score
    const healthColor = report.healthScore >= 80 
        ? chalk.green 
        : report.healthScore >= 60 
            ? chalk.yellow 
            : chalk.red;
    console.log(chalk.bold(`\nOverall Health: ${healthColor(report.healthScore + "%")}`));
}

/**
 * Display criteria list
 */
async function displayCriteria(planPath: string): Promise<void> {
    const { criteria, parseErrors } = await parseCriteria(planPath);
    const summary = getCriteriaSummary(criteria);
    
    console.log(chalk.bold.cyan("\nVerification Criteria"));
    console.log(chalk.cyan("═".repeat(50)));
    
    if (criteria.length === 0) {
        console.log(chalk.yellow("\nNo criteria found."));
        for (const error of parseErrors) {
            console.log(chalk.gray(`  ${error}`));
        }
        return;
    }
    
    console.log(chalk.gray(`\nTotal: ${summary.total} criteria\n`));
    
    // Group by priority
    const grouped = {
        must: criteria.filter(c => c.priority === "must"),
        should: criteria.filter(c => c.priority === "should"),
        could: criteria.filter(c => c.priority === "could"),
    };
    
    if (grouped.must.length > 0) {
        console.log(chalk.red.bold(`Must Have (${grouped.must.length}):`));
        for (const c of grouped.must) {
            console.log(chalk.gray(`  - ${c.text}`));
        }
        console.log();
    }
    
    if (grouped.should.length > 0) {
        console.log(chalk.yellow.bold(`Should Have (${grouped.should.length}):`));
        for (const c of grouped.should) {
            console.log(chalk.gray(`  - ${c.text}`));
        }
        console.log();
    }
    
    if (grouped.could.length > 0) {
        console.log(chalk.gray.bold(`Could Have (${grouped.could.length}):`));
        for (const c of grouped.could) {
            console.log(chalk.gray(`  - ${c.text}`));
        }
    }
}
```

### 7.2 Update Command Action

Update the action handler:

```typescript
.action(async (pathArg: string | undefined, options: VerifyOptions) => {
    try {
        const planPath = resolve(pathArg || process.cwd());
        
        // Handle --criteria flag
        if (options.criteria) {
            await displayCriteria(planPath);
            return;
        }
        
        // Determine what to run
        const runAnalysis = options.analysis;
        const runExecution = options.execution;
        const runAll = !runAnalysis && !runExecution;
        
        if (runAll) {
            // Run full verification
            const report = await runFullVerification(planPath);
            
            if (options.json) {
                console.log(JSON.stringify(report, null, 2));
            } else {
                formatFullReport(report);
            }
        } else {
            // Run specific checks
            if (runAnalysis) {
                const report = await checkCoverage(planPath);
                if (options.json) {
                    console.log(JSON.stringify(report, null, 2));
                } else {
                    formatCoverageReport(report);
                }
            }
            
            if (runExecution) {
                const report = await checkCompletion(planPath);
                if (options.json) {
                    console.log(JSON.stringify(report, null, 2));
                } else {
                    formatCompletionReport(report);
                }
            }
        }
        
    } catch (error) {
        console.error(chalk.red("Verification failed:"), error);
        process.exit(1);
    }
});
```

## Acceptance Criteria

- [ ] `riotplan verify` runs both analysis and execution checks
- [ ] Combined health score calculated
- [ ] Summary and recommendations generated
- [ ] Full report formatted nicely
- [ ] `--criteria` shows all criteria from analysis
- [ ] Individual flags still work (`--analysis`, `--execution`)
- [ ] `--json` works for all modes
- [ ] TypeScript compiles without errors

## Testing

```bash
# Full verification
./dist/cli/bin.js verify ./test-plan

# Just criteria
./dist/cli/bin.js verify ./test-plan --criteria

# Individual checks
./dist/cli/bin.js verify ./test-plan --analysis
./dist/cli/bin.js verify ./test-plan --execution

# JSON output
./dist/cli/bin.js verify ./test-plan --json
```

## Files Changed

- `riotplan/src/cli/commands/verify.ts` (update)

## Notes

The full report provides an at-a-glance view of plan health - how well it addresses requirements and how complete execution is.
