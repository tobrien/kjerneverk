# Step 05: Plan Generation

## Objective

Implement plan generation that can work from either an analysis or directly from the initial prompt.

## Background

Plan generation should:
- Use analysis requirements when available
- Fall back to initial prompt for direct mode
- Generate SUMMARY.md, EXECUTION_PLAN.md, and step files
- Build on existing `riotplan init` infrastructure

## Tasks

### 5.1 Create Generate Command

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/generate.ts`:

```typescript
import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { resolve, join } from "node:path";
import { readFile, stat } from "node:fs/promises";
import { loadAnalysis, hasAnalysis } from "../../analysis/index.js";

export interface GenerateOptions {
    path?: string;
    steps?: number;
    force?: boolean;
}

/**
 * Check if plan files already exist
 */
async function planExists(planPath: string): Promise<boolean> {
    try {
        await stat(join(planPath, "EXECUTION_PLAN.md"));
        return true;
    } catch {
        return false;
    }
}

/**
 * Load initial prompt from plan directory
 */
async function loadInitialPrompt(planPath: string, planName: string): Promise<string | null> {
    try {
        const promptPath = join(planPath, `${planName}-prompt.md`);
        const content = await readFile(promptPath, "utf-8");
        // Extract just the prompt content (after the --- separator)
        const match = content.match(/---\n\n([\s\S]+)$/);
        return match ? match[1].trim() : content;
    } catch {
        return null;
    }
}

/**
 * Build generation context from analysis or prompt
 */
async function buildGenerationContext(planPath: string, planName: string): Promise<{
    source: "analysis" | "prompt";
    content: string;
    elaborations?: string[];
}> {
    // Try to load analysis first
    if (await hasAnalysis(planPath)) {
        const analysis = await loadAnalysis(planPath);
        if (analysis && analysis.metadata.status === "ready") {
            return {
                source: "analysis",
                content: analysis.requirements,
                elaborations: analysis.elaborations.map(e => e.content),
            };
        } else if (analysis) {
            console.log(chalk.yellow("⚠️  Analysis exists but not marked ready."));
            const { proceed } = await inquirer.prompt([{
                type: "confirm",
                name: "proceed",
                message: "Generate plan from draft analysis?",
                default: false,
            }]);
            if (proceed) {
                return {
                    source: "analysis",
                    content: analysis.requirements,
                    elaborations: analysis.elaborations.map(e => e.content),
                };
            }
        }
    }
    
    // Fall back to initial prompt
    const prompt = await loadInitialPrompt(planPath, planName);
    if (!prompt) {
        throw new Error("No analysis or initial prompt found");
    }
    
    return {
        source: "prompt",
        content: prompt,
    };
}

/**
 * Register the generate command
 */
export function registerGenerateCommand(program: Command): void {
    program
        .command("generate [path]")
        .description("Generate plan files from analysis or prompt")
        .option("-s, --steps <number>", "Number of steps to generate", "5")
        .option("-f, --force", "Overwrite existing plan files")
        .action(async (pathArg: string | undefined, options: GenerateOptions) => {
            try {
                const planPath = resolve(pathArg || options.path || process.cwd());
                const planName = planPath.split("/").pop() || "plan";
                
                // Check for existing plan
                if (await planExists(planPath) && !options.force) {
                    console.error(chalk.red("Plan already exists. Use --force to overwrite."));
                    process.exit(1);
                }
                
                // Build context
                console.log(chalk.cyan("Loading generation context..."));
                const context = await buildGenerationContext(planPath, planName);
                console.log(chalk.gray(`Source: ${context.source}`));
                
                // For now, generate placeholder files
                // In a real implementation, this would use AI to generate content
                console.log(chalk.cyan("\nGenerating plan files..."));
                
                await generatePlanFiles(planPath, planName, context, {
                    stepCount: parseInt(String(options.steps), 10) || 5,
                });
                
                console.log(chalk.green("\n✅ Plan generated successfully!"));
                console.log(chalk.cyan("\nNext steps:"));
                console.log(chalk.gray("  - Review: riotplan status"));
                console.log(chalk.gray("  - Amend: riotplan amend"));
                console.log(chalk.gray("  - Start: riotplan step start 01"));
                
            } catch (error) {
                console.error(chalk.red("Failed to generate plan:"), error);
                process.exit(1);
            }
        });
}

/**
 * Generate the plan files
 */
async function generatePlanFiles(
    planPath: string,
    planName: string,
    context: { source: string; content: string; elaborations?: string[] },
    options: { stepCount: number }
): Promise<void> {
    const { mkdir, writeFile } = await import("node:fs/promises");
    
    // Create plan directory
    await mkdir(join(planPath, "plan"), { recursive: true });
    
    // Generate SUMMARY.md
    const summaryContent = generateSummary(planName, context);
    await writeFile(join(planPath, "SUMMARY.md"), summaryContent, "utf-8");
    console.log(chalk.gray("  Created: SUMMARY.md"));
    
    // Generate EXECUTION_PLAN.md
    const execContent = generateExecutionPlan(planPath, planName, options.stepCount);
    await writeFile(join(planPath, "EXECUTION_PLAN.md"), execContent, "utf-8");
    console.log(chalk.gray("  Created: EXECUTION_PLAN.md"));
    
    // Generate STATUS.md
    const statusContent = generateStatus(planName, options.stepCount);
    await writeFile(join(planPath, "STATUS.md"), statusContent, "utf-8");
    console.log(chalk.gray("  Created: STATUS.md"));
    
    // Generate step files
    for (let i = 1; i <= options.stepCount; i++) {
        const stepNum = String(i).padStart(2, "0");
        const stepContent = generateStepFile(i, planName);
        await writeFile(
            join(planPath, "plan", `${stepNum}-step.md`),
            stepContent,
            "utf-8"
        );
        console.log(chalk.gray(`  Created: plan/${stepNum}-step.md`));
    }
}

function generateSummary(planName: string, context: { source: string; content: string }): string {
    const title = planName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return `# ${title} - Summary

## Executive Summary

> Generated from ${context.source}. Review and edit as needed.

_Summary to be elaborated..._

## Approach

_Approach to be defined..._

## Success Criteria

_Success criteria to be defined..._
`;
}

function generateExecutionPlan(planPath: string, planName: string, stepCount: number): string {
    const title = planName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const steps = Array.from({ length: stepCount }, (_, i) => {
        const num = String(i + 1).padStart(2, "0");
        return `| ${i + 1} | Step ${num} | \`plan/${num}-step.md\` | - |`;
    }).join("\n");
    
    return `# ${title} - Execution Plan

> Execute: "${planPath}/EXECUTION_PLAN.md"

## Execution Sequence

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
${steps}

## How to Execute

1. Read STATUS.md for current state
2. Find next pending step
3. Execute step file
4. Update STATUS.md
5. Continue until complete
`;
}

function generateStatus(planName: string, stepCount: number): string {
    const title = planName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const today = new Date().toISOString().split("T")[0];
    const steps = Array.from({ length: stepCount }, (_, i) => {
        const num = String(i + 1).padStart(2, "0");
        return `| ${num} | Step ${num} | ⬜ Pending | - | - | - |`;
    }).join("\n");
    
    return `# ${title} - Execution Status

## Current State

| Field | Value |
|-------|-------|
| **Status** | \`pending\` |
| **Current Step** | - |
| **Last Completed** | - |
| **Started At** | - |
| **Last Updated** | ${today} |

## Step Progress

| Step | Name | Status | Started | Completed | Notes |
|------|------|--------|---------|-----------|-------|
${steps}

## Blockers

_No blockers currently._

## Issues

_No issues currently._

## Notes

_Plan generated. Ready for review and execution._
`;
}

function generateStepFile(stepNum: number, planName: string): string {
    const num = String(stepNum).padStart(2, "0");
    return `# Step ${num}: [Title]

## Objective

_Define the objective of this step..._

## Background

_Provide context..._

## Tasks

### ${num}.1 Task One

_Describe the task..._

## Acceptance Criteria

- [ ] Criterion one
- [ ] Criterion two

## Testing

_How to verify this step is complete..._

## Files Changed

- _List files that will be modified..._

## Notes

_Additional notes..._
`;
}
```

### 5.2 Register Generate Command

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/cli.ts`:

```typescript
import { registerGenerateCommand } from "./commands/generate.js";

// In createProgram():
registerGenerateCommand(program);
```

## Acceptance Criteria

- [ ] `riotplan generate` creates SUMMARY.md, EXECUTION_PLAN.md, STATUS.md
- [ ] Step files created in `plan/` directory
- [ ] Uses analysis requirements when available and ready
- [ ] Falls back to initial prompt for direct mode
- [ ] `--force` overwrites existing files
- [ ] `--steps` controls number of steps
- [ ] Generated files follow RiotPlan format
- [ ] TypeScript compiles without errors

## Testing

```bash
# Manual testing
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build

# Generate from analysis
./dist/cli/bin.js create test-gen --analyze
./dist/cli/bin.js elaborate ./test-gen -m "Add requirements"
./dist/cli/bin.js analysis ready ./test-gen
./dist/cli/bin.js generate ./test-gen

# Generate directly
./dist/cli/bin.js create test-direct --direct
./dist/cli/bin.js generate ./test-direct --steps 3
```

## Files Changed

- `riotplan/src/cli/commands/generate.ts` (new)
- `riotplan/src/cli/cli.ts` (register command)

## Notes

This generates placeholder content. A future enhancement would integrate with AI to generate meaningful content based on the analysis/prompt. The structure is what matters for now.
