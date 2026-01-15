# Step 09: RiotPlan CLI Stub

## Objective

Create `riotplan-cli` as a properly structured CLI project for managing and executing plans from the command line.

## Project Location

```
/Users/tobrien/gitw/kjerneverk/riotplan-cli/
```

## What is RiotPlan CLI?

The CLI provides command-line access to riotplan functionality:

- Create new plans from templates
- View plan status and progress
- List steps in a plan
- Execute individual steps
- Resume interrupted plans
- Validate plan structure
- Update STATUS.md

## Tasks

### 9.1 Create Project Structure

Directory already exists at `/Users/tobrien/gitw/kjerneverk/riotplan-cli/`

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/riotplan-cli/src
mkdir -p /Users/tobrien/gitw/kjerneverk/riotplan-cli/tests
```

### 9.2 Create package.json

```json
{
  "name": "riotplan-cli",
  "version": "0.0.1",
  "description": "CLI for RiotPlan - manage and execute plans",
  "type": "module",
  "bin": {
    "riotplan": "./dist/cli.js"
  },
  "main": "./dist/cli.js",
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "keywords": ["cli", "plan", "workflow", "ai", "prompts"],
  "license": "Apache-2.0",
  "dependencies": {
    "commander": "^14.0.2",
    "chalk": "^5.4.1"
  },
  "peerDependencies": {
    "riotplan": "^0.0.1"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^7.0.4",
    "vite-plugin-dts": "^4.5.4",
    "vitest": "^3.2.4"
  }
}
```

### 9.3 Create Stub CLI

Create `riotplan-cli/src/cli.ts`:

```typescript
#!/usr/bin/env node
/**
 * RiotPlan CLI
 *
 * Commands:
 * - riotplan init <name>       Create a new plan
 * - riotplan status [path]     Show current status
 * - riotplan list [path]       List steps in plan
 * - riotplan execute [step]    Execute a step
 * - riotplan resume            Resume interrupted plan
 * - riotplan validate [path]   Validate plan structure
 * - riotplan update-status     Regenerate STATUS.md
 * - riotplan add-step <title>  Add a new step
 */

import { Command } from "commander";

const program = new Command();

program
  .name("riotplan")
  .description("CLI for managing and executing long-lived AI workflows")
  .version("0.0.1");

// init - Create new plan
program
  .command("init <name>")
  .description("Create a new plan")
  .option("-d, --description <desc>", "Plan description")
  .option("-t, --template <template>", "Template to use", "default")
  .option("--steps <count>", "Number of initial steps", "3")
  .action((name, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
    console.log(`Would create plan: ${name}`);
    // ... show what would be created
  });

// status - Show plan status
program
  .command("status [path]")
  .description("Show plan status")
  .option("-v, --verbose", "Show detailed status")
  .option("--json", "Output as JSON")
  .action((path, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
    // ... show example status
  });

// list - List steps
program
  .command("list [path]")
  .description("List steps in a plan")
  .option("--all", "Show all steps including completed")
  .option("--pending", "Show only pending steps")
  .action((path, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
    // ... show example list
  });

// execute - Execute step
program
  .command("execute [step]")
  .description("Execute plan step")
  .option("--dry-run", "Show what would be executed")
  .option("--force", "Execute even if dependencies not met")
  .option("--provider <provider>", "LLM provider to use")
  .action((step, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
    // ... show what would be executed
  });

// resume - Resume plan
program
  .command("resume")
  .description("Resume interrupted plan")
  .option("--skip-failed", "Skip failed steps")
  .option("--from <step>", "Resume from specific step")
  .action((options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
  });

// validate - Validate structure
program
  .command("validate [path]")
  .description("Validate plan structure")
  .option("--fix", "Attempt to fix issues")
  .action((path, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
  });

// update-status - Regenerate STATUS.md
program
  .command("update-status [path]")
  .description("Regenerate STATUS.md from current state")
  .option("--dry-run", "Show what would be written")
  .action((path, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
  });

// add-step - Add new step
program
  .command("add-step <title>")
  .description("Add a new step to the plan")
  .option("-n, --number <number>", "Step number")
  .option("-a, --after <step>", "Insert after this step")
  .action((title, options) => {
    console.log(`\n⚠️  riotplan is not yet implemented.\n`);
  });

program.parse();
```

### 9.4 Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 9.5 Create vite.config.ts

```typescript
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/cli.ts"),
      name: "riotplan-cli",
      fileName: () => "cli.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "commander", "chalk", "riotplan",
        "node:fs", "node:path", "node:fs/promises", "node:process",
      ],
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
    sourcemap: true,
    minify: false,
  },
});
```

### 9.6 Create README.md

Document all planned commands:

| Command | Description |
|---------|-------------|
| `init <name>` | Create a new plan |
| `status [path]` | Show current status |
| `list [path]` | List steps in plan |
| `execute [step]` | Execute a step |
| `resume` | Resume interrupted plan |
| `validate [path]` | Validate structure |
| `update-status` | Regenerate STATUS.md |
| `add-step <title>` | Add new step |

### 9.7 Initialize Git

```bash
cd /Users/tobrien/gitw/kjerneverk/riotplan-cli
git init
git add .
git commit -m "Initial: riotplan-cli stub"
```

## Planned Commands Detail

### init

```bash
riotplan init my-feature
riotplan init my-feature --description "Implement feature X"
riotplan init my-feature --template detailed --steps 5
```

### status

```bash
riotplan status
riotplan status ./my-plan
riotplan status -v
riotplan status --json
```

### list

```bash
riotplan list
riotplan list --pending
riotplan list --all
```

Output:
```
✅ 01 analysis
✅ 02 design
🔄 03 implementation
⬜ 04 testing
⬜ 05 documentation
```

### execute

```bash
riotplan execute           # Next step
riotplan execute 03        # Specific step
riotplan execute --dry-run
riotplan execute --force
```

### resume

```bash
riotplan resume
riotplan resume --skip-failed
riotplan resume --from 03
```

### validate

```bash
riotplan validate
riotplan validate --fix
```

Checks:
- Required files exist
- STATUS.md parseable
- Valid step numbering
- No circular dependencies

## Validation

- [ ] CLI stub responds to all commands
- [ ] Help text documents all options
- [ ] Build configuration works
- [ ] README documents all commands

## Files Created

```
riotplan-cli/
├── src/
│   └── cli.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Next Step

Proceed to `10-documentation.md`
