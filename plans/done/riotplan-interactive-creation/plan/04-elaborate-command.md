# Step 04: Elaborate Command

## Objective

Implement the `riotplan elaborate` command for adding feedback to the analysis phase.

## Background

"Elaborate" is for providing conceptual, philosophical feedback on the analysis:
- Refine requirements
- Clarify intent
- Add context about approach
- Provide documentation preferences

This is distinct from "amend" which is technical feedback on the plan itself.

## Tasks

### 4.1 Create Elaborate Command

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/elaborate.ts`:

```typescript
import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { resolve } from "node:path";
import { loadAnalysis, hasAnalysis } from "../../analysis/index.js";
import { saveElaborationPrompt } from "../../plan/prompts.js";

export interface ElaborateOptions {
    path?: string;
    message?: string;
}

/**
 * Prompt for elaboration feedback
 */
async function promptForFeedback(): Promise<string> {
    const { feedback } = await inquirer.prompt([
        {
            type: "editor",
            name: "feedback",
            message: "Provide your elaboration feedback (opens editor):",
        },
    ]);
    return feedback;
}

/**
 * Display current analysis state
 */
function displayAnalysisState(analysis: Awaited<ReturnType<typeof loadAnalysis>>): void {
    if (!analysis) return;
    
    console.log(chalk.cyan("\n📋 Current Analysis State:"));
    console.log(chalk.gray(`   Status: ${analysis.metadata.status}`));
    console.log(chalk.gray(`   Elaborations: ${analysis.metadata.elaborationCount}`));
    
    if (analysis.elaborations.length > 0) {
        console.log(chalk.gray("\n   Previous elaborations:"));
        for (const elab of analysis.elaborations.slice(-3)) {
            const preview = elab.content.slice(0, 50).replace(/\n/g, " ");
            console.log(chalk.gray(`   - #${elab.id}: ${preview}...`));
        }
    }
}

/**
 * Register the elaborate command
 */
export function registerElaborateCommand(program: Command): void {
    program
        .command("elaborate [path]")
        .description("Add elaboration feedback to analysis")
        .option("-m, --message <message>", "Feedback message (skip editor)")
        .action(async (pathArg: string | undefined, options: ElaborateOptions) => {
            try {
                const planPath = resolve(pathArg || options.path || process.cwd());
                
                // Check if analysis exists
                if (!(await hasAnalysis(planPath))) {
                    console.error(chalk.red("No analysis found at this path."));
                    console.log(chalk.gray("Run 'riotplan create --analyze' first."));
                    process.exit(1);
                }
                
                // Load current analysis
                const analysis = await loadAnalysis(planPath);
                displayAnalysisState(analysis);
                
                // Get feedback
                const feedback = options.message || (await promptForFeedback());
                
                if (!feedback.trim()) {
                    console.log(chalk.yellow("No feedback provided. Aborting."));
                    return;
                }
                
                // Save elaboration
                const savedPath = await saveElaborationPrompt(planPath, feedback, {
                    previousCount: analysis?.metadata.elaborationCount || 0,
                });
                
                console.log(chalk.green(`\n✅ Elaboration saved: ${savedPath}`));
                console.log(chalk.cyan("\nNext steps:"));
                console.log(chalk.gray("  - Continue elaborating: riotplan elaborate"));
                console.log(chalk.gray("  - Generate plan: riotplan generate"));
                console.log(chalk.gray("  - View analysis: riotplan analysis show"));
                
            } catch (error) {
                console.error(chalk.red("Failed to save elaboration:"), error);
                process.exit(1);
            }
        });
}
```

### 4.2 Create Analysis Show Command

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/analysis.ts`:

```typescript
import { Command } from "commander";
import chalk from "chalk";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadAnalysis, hasAnalysis } from "../../analysis/index.js";

/**
 * Register analysis subcommands
 */
export function registerAnalysisCommands(program: Command): void {
    const analysis = program
        .command("analysis")
        .description("Analysis management commands");
    
    analysis
        .command("show [path]")
        .description("Display current analysis")
        .action(async (pathArg: string | undefined) => {
            try {
                const planPath = resolve(pathArg || process.cwd());
                
                if (!(await hasAnalysis(planPath))) {
                    console.error(chalk.red("No analysis found."));
                    process.exit(1);
                }
                
                // Read and display REQUIREMENTS.md
                const reqPath = join(planPath, "analysis", "REQUIREMENTS.md");
                const content = await readFile(reqPath, "utf-8");
                
                console.log(chalk.cyan("\n📋 REQUIREMENTS.md:\n"));
                console.log(content);
                
            } catch (error) {
                console.error(chalk.red("Failed to show analysis:"), error);
                process.exit(1);
            }
        });
    
    analysis
        .command("ready [path]")
        .description("Mark analysis as ready for plan generation")
        .action(async (pathArg: string | undefined) => {
            try {
                const planPath = resolve(pathArg || process.cwd());
                
                if (!(await hasAnalysis(planPath))) {
                    console.error(chalk.red("No analysis found."));
                    process.exit(1);
                }
                
                // Update status in REQUIREMENTS.md
                const reqPath = join(planPath, "analysis", "REQUIREMENTS.md");
                let content = await readFile(reqPath, "utf-8");
                content = content.replace(
                    /\*\*Status\*\*\s*\|\s*`\w+`/,
                    "**Status** | `ready`"
                );
                
                const { writeFile } = await import("node:fs/promises");
                await writeFile(reqPath, content, "utf-8");
                
                console.log(chalk.green("✅ Analysis marked as ready."));
                console.log(chalk.cyan("Run 'riotplan generate' to create the plan."));
                
            } catch (error) {
                console.error(chalk.red("Failed to update analysis:"), error);
                process.exit(1);
            }
        });
}
```

### 4.3 Register Commands in CLI

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/cli.ts`:

```typescript
import { registerElaborateCommand } from "./commands/elaborate.js";
import { registerAnalysisCommands } from "./commands/analysis.js";

// In createProgram():
registerElaborateCommand(program);
registerAnalysisCommands(program);
```

## Acceptance Criteria

- [ ] `riotplan elaborate` prompts for feedback
- [ ] `riotplan elaborate -m "message"` accepts inline message
- [ ] Feedback saved to `analysis/prompts/XXX-feedback.md`
- [ ] Current analysis state displayed before prompting
- [ ] `riotplan analysis show` displays REQUIREMENTS.md
- [ ] `riotplan analysis ready` updates status
- [ ] Error handling for missing analysis
- [ ] TypeScript compiles without errors

## Testing

```bash
# Manual testing
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build

# Create a test plan with analysis
./dist/cli/bin.js create test-elaborate --analyze

# Add elaboration
./dist/cli/bin.js elaborate ./test-elaborate
./dist/cli/bin.js elaborate ./test-elaborate -m "Quick feedback"

# View analysis
./dist/cli/bin.js analysis show ./test-elaborate
./dist/cli/bin.js analysis ready ./test-elaborate
```

## Files Changed

- `riotplan/src/cli/commands/elaborate.ts` (new)
- `riotplan/src/cli/commands/analysis.ts` (new)
- `riotplan/src/cli/cli.ts` (register commands)

## Notes

The elaborate command is the main way users interact with the analysis phase. It's intentionally simple - open editor, save feedback. The actual AI-assisted elaboration would be a future enhancement.
