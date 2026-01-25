# Step 01: CLI Infrastructure

## Objective

Add the `riotplan create` command skeleton and set up inquirer for interactive prompts.

## Background

The existing CLI uses Commander.js but lacks interactive prompt support. We need to:
- Add inquirer for user prompts
- Create the `create` command structure
- Establish the pattern for interactive flows

## Tasks

### 1.1 Install inquirer

```bash
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm install inquirer @types/inquirer
```

### 1.2 Create Create Command File

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/create.ts`:

```typescript
import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { join } from "node:path";

export interface CreateOptions {
    direct?: boolean;
    analyze?: boolean;
    path?: string;
}

/**
 * Prompt user for plan name if not provided
 */
async function promptForName(): Promise<string> {
    const { name } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Plan name (kebab-case):",
            validate: (input: string) => {
                if (!input.trim()) return "Name is required";
                if (!/^[a-z0-9-]+$/.test(input)) {
                    return "Use lowercase letters, numbers, and hyphens only";
                }
                return true;
            },
        },
    ]);
    return name;
}

/**
 * Prompt user for initial plan description
 */
async function promptForDescription(): Promise<string> {
    const { description } = await inquirer.prompt([
        {
            type: "editor",
            name: "description",
            message: "Describe what you want to accomplish (opens editor):",
        },
    ]);
    return description;
}

/**
 * Ask user whether to analyze first or generate directly
 */
async function promptForMode(): Promise<"analyze" | "direct"> {
    const { mode } = await inquirer.prompt([
        {
            type: "list",
            name: "mode",
            message: "How would you like to proceed?",
            choices: [
                {
                    name: "Create an analysis first (recommended for complex plans)",
                    value: "analyze",
                },
                {
                    name: "Generate the plan directly",
                    value: "direct",
                },
            ],
        },
    ]);
    return mode;
}

/**
 * Register the create command
 */
export function registerCreateCommand(program: Command): void {
    program
        .command("create [name]")
        .description("Interactively create a new plan")
        .option("-d, --direct", "Skip analysis, generate plan directly")
        .option("-a, --analyze", "Force analysis phase")
        .option("-p, --path <path>", "Output directory (default: current)")
        .action(async (name: string | undefined, options: CreateOptions) => {
            try {
                // Get name if not provided
                const planName = name || (await promptForName());
                
                // Get description
                console.log(chalk.cyan("\nDescribe your plan:"));
                const description = await promptForDescription();
                
                // Determine mode
                let mode: "analyze" | "direct";
                if (options.direct) {
                    mode = "direct";
                } else if (options.analyze) {
                    mode = "analyze";
                } else {
                    mode = await promptForMode();
                }
                
                // Output path
                const basePath = options.path || process.cwd();
                const planPath = join(basePath, planName);
                
                console.log(chalk.green(`\nCreating plan: ${planName}`));
                console.log(chalk.gray(`Path: ${planPath}`));
                console.log(chalk.gray(`Mode: ${mode}`));
                
                // TODO: Implement actual creation in subsequent steps
                console.log(chalk.yellow("\n⚠️  Create implementation pending (Step 02+)"));
                
            } catch (error) {
                console.error(chalk.red("Failed to create plan:"), error);
                process.exit(1);
            }
        });
}
```

### 1.3 Register Command in CLI

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/cli.ts`:

Add import:
```typescript
import { registerCreateCommand } from "./commands/create.js";
```

Add registration in `createProgram()`:
```typescript
registerCreateCommand(program);
```

### 1.4 Add Export

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/cli/commands/index.ts` (create if needed):

```typescript
export { registerCreateCommand } from "./create.js";
```

## Acceptance Criteria

- [ ] `inquirer` installed and types available
- [ ] `riotplan create` command registered
- [ ] Name prompt works (validates kebab-case)
- [ ] Description prompt opens editor
- [ ] Mode selection works
- [ ] `--direct` and `--analyze` flags work
- [ ] TypeScript compiles without errors

## Testing

```bash
# Manual testing
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build
./dist/cli/bin.js create
./dist/cli/bin.js create my-test --direct
./dist/cli/bin.js create --help
```

## Dependencies

- inquirer: ^9.x (for prompts)
- @types/inquirer (for TypeScript)

## Files Changed

- `riotplan/package.json` (add inquirer)
- `riotplan/src/cli/commands/create.ts` (new)
- `riotplan/src/cli/cli.ts` (register command)

## Notes

This step establishes the interactive foundation. The actual plan creation logic comes in subsequent steps.
