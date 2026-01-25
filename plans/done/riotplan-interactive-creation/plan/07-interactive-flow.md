# Step 07: Interactive Flow

## Objective

Wire up the complete interactive creation flow, connecting create → elaborate/generate → amend into a cohesive experience.

## Background

The pieces are in place:
- `create` gathers initial input
- `elaborate` refines analysis
- `generate` creates plan
- `amend` refines plan

Now we need to wire them together so the flow is seamless.

## Tasks

### 7.1 Update Create Command Flow

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/create.ts`:

```typescript
// Add after mode selection in action handler:

if (mode === "analyze") {
    // Create analysis directory
    const analysisPath = await createAnalysisDirectory({
        planPath,
        planName,
        initialPrompt: description,
    });
    console.log(chalk.green(`\n✅ Analysis created: ${analysisPath}`));
    
    // Ask if they want to elaborate now
    const { elaborateNow } = await inquirer.prompt([{
        type: "confirm",
        name: "elaborateNow",
        message: "Would you like to add elaboration feedback now?",
        default: true,
    }]);
    
    if (elaborateNow) {
        // Loop for elaborations
        let continueElaborating = true;
        while (continueElaborating) {
            const feedback = await promptForFeedback();
            if (feedback.trim()) {
                await saveElaborationPrompt(planPath, feedback);
                console.log(chalk.green("Elaboration saved."));
            }
            
            const { more } = await inquirer.prompt([{
                type: "confirm",
                name: "more",
                message: "Add more elaboration?",
                default: false,
            }]);
            continueElaborating = more;
        }
    }
    
    // Ask if ready to generate
    const { generateNow } = await inquirer.prompt([{
        type: "confirm",
        name: "generateNow",
        message: "Ready to generate plan from analysis?",
        default: false,
    }]);
    
    if (generateNow) {
        // Mark analysis ready and generate
        await markAnalysisReady(planPath);
        await generatePlanFromContext(planPath, planName);
    } else {
        console.log(chalk.cyan("\nWhen ready:"));
        console.log(chalk.gray("  - Add more: riotplan elaborate"));
        console.log(chalk.gray("  - Generate: riotplan analysis ready && riotplan generate"));
    }
    
} else {
    // Direct mode - generate immediately
    console.log(chalk.cyan("\nGenerating plan directly..."));
    await generatePlanFromContext(planPath, planName);
}

// After generation, offer amendment
if (await planExists(planPath)) {
    const { amendNow } = await inquirer.prompt([{
        type: "confirm",
        name: "amendNow",
        message: "Would you like to review and amend the plan?",
        default: false,
    }]);
    
    if (amendNow) {
        // Show plan summary
        await displayPlanSummary(planPath);
        
        const feedback = await promptForAmendment();
        if (feedback.trim()) {
            await saveAmendmentPrompt(planPath, feedback);
            console.log(chalk.green("Amendment saved."));
        }
    }
}

console.log(chalk.green("\n🎉 Plan creation complete!"));
console.log(chalk.cyan("\nNext steps:"));
console.log(chalk.gray(`  cd ${planPath}`));
console.log(chalk.gray("  riotplan status"));
console.log(chalk.gray("  riotplan step start 01"));
```

### 7.2 Add Helper Functions

Add to create.ts or a shared utils file:

```typescript
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function promptForFeedback(): Promise<string> {
    const { feedback } = await inquirer.prompt([{
        type: "editor",
        name: "feedback",
        message: "Enter your feedback (opens editor):",
    }]);
    return feedback;
}

async function promptForAmendment(): Promise<string> {
    const { feedback } = await inquirer.prompt([{
        type: "editor",
        name: "feedback",
        message: "Enter your amendment (opens editor):",
    }]);
    return feedback;
}

async function markAnalysisReady(planPath: string): Promise<void> {
    const reqPath = join(planPath, "analysis", "REQUIREMENTS.md");
    let content = await readFile(reqPath, "utf-8");
    content = content.replace(
        /\*\*Status\*\*\s*\|\s*`\w+`/,
        "**Status** | `ready`"
    );
    await writeFile(reqPath, content, "utf-8");
}

async function generatePlanFromContext(planPath: string, planName: string): Promise<void> {
    const context = await buildGenerationContext(planPath, planName);
    await generatePlanFiles(planPath, planName, context, { stepCount: 5 });
}

async function displayPlanSummary(planPath: string): Promise<void> {
    try {
        const summaryPath = join(planPath, "SUMMARY.md");
        const content = await readFile(summaryPath, "utf-8");
        console.log(chalk.cyan("\n📋 Plan Summary:\n"));
        // Show first 20 lines
        const lines = content.split("\n").slice(0, 20);
        console.log(chalk.gray(lines.join("\n")));
        console.log(chalk.gray("..."));
    } catch {
        // No summary yet
    }
}

async function planExists(planPath: string): Promise<boolean> {
    try {
        await stat(join(planPath, "EXECUTION_PLAN.md"));
        return true;
    } catch {
        return false;
    }
}
```

### 7.3 Add Progress Indicators

Add visual feedback during the flow:

```typescript
import ora from "ora";  // npm install ora

// Usage:
const spinner = ora("Creating analysis directory...").start();
await createAnalysisDirectory(options);
spinner.succeed("Analysis directory created");
```

### 7.4 Update Package.json

Add ora if using spinners:

```bash
npm install ora
```

## Acceptance Criteria

- [ ] `riotplan create` runs complete interactive flow
- [ ] Analysis mode: create → elaborate loop → generate option
- [ ] Direct mode: create → generate immediately
- [ ] Amendment offered after generation
- [ ] Clear next steps displayed at each stage
- [ ] User can exit flow at any point
- [ ] `--direct` and `--analyze` flags bypass prompts
- [ ] TypeScript compiles without errors

## Testing

```bash
# Full interactive test
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build
./dist/cli/bin.js create full-test

# With flags
./dist/cli/bin.js create quick-test --direct
./dist/cli/bin.js create analyzed-test --analyze
```

## Files Changed

- `riotplan/src/cli/commands/create.ts` (major update)
- `riotplan/package.json` (ora dependency)

## Notes

The flow should feel natural and allow users to exit at any point without losing their work (all prompts are saved). The goal is guidance, not enforcement.
