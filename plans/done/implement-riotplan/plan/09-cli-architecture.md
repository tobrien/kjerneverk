# Step 09: CLI Architecture

## Objective

Restructure the CLI to use a subcommand architecture with proper help system, making the extensive command set discoverable and organized.

## Background

The analysis identified 60+ commands across 15+ categories. A flat CLI becomes unwieldy. The solution is subcommands:

```bash
riotplan plan init     # Instead of: riotplan init
riotplan status        # Short form for common operation  
riotplan status list   # Full subcommand form
riotplan feedback create
```

The existing CLI uses Commander.js with flat commands. This step restructures it.

## Tasks

### 1. Design Command Structure

```
riotplan
├── plan
│   ├── init <name>
│   ├── validate [path]
│   └── archive [path]
├── status [path]           # Default subcommand
│   ├── list
│   ├── dashboard
│   └── blockers
├── step
│   ├── add <title>
│   ├── remove <n>
│   ├── block <n>
│   ├── unblock <n>
│   └── complete <n>
├── feedback
│   ├── create <title>
│   ├── list
│   └── show <id>
├── exec (future)
├── revision (future)
├── template (future)
├── render (future)
└── config (future)
```

### 2. Create CLI Module Structure

```
riotplan-cli/src/
├── cli.ts                 # Main entry, program setup
├── commands/
│   ├── index.ts           # Export all command modules
│   ├── plan/
│   │   ├── index.ts       # plan subcommand group
│   │   ├── init.ts
│   │   ├── validate.ts
│   │   └── archive.ts
│   ├── status/
│   │   ├── index.ts       # status subcommand group
│   │   ├── show.ts
│   │   ├── list.ts
│   │   ├── dashboard.ts
│   │   └── blockers.ts
│   ├── step/
│   │   ├── index.ts
│   │   ├── add.ts
│   │   ├── remove.ts
│   │   └── status.ts      # block, unblock, complete
│   └── feedback/
│       ├── index.ts
│       ├── create.ts
│       ├── list.ts
│       └── show.ts
└── utils/
    ├── output.ts          # Output formatting
    ├── errors.ts          # Error handling
    └── config.ts          # Config loading
```

### 3. Implement Main CLI Entry

Update `src/cli.ts`:

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { registerPlanCommands } from './commands/plan/index.js';
import { registerStatusCommands } from './commands/status/index.js';
import { registerStepCommands } from './commands/step/index.js';
import { registerFeedbackCommands } from './commands/feedback/index.js';

const VERSION = '0.0.4';

export function createProgram(): Command {
  const program = new Command();
  
  program
    .name('riotplan')
    .description('Manage long-lived, stateful AI workflows')
    .version(VERSION)
    .configureHelp({
      sortSubcommands: true,
      subcommandTerm: (cmd) => cmd.name()
    });
  
  // Register command groups
  registerPlanCommands(program);
  registerStatusCommands(program);
  registerStepCommands(program);
  registerFeedbackCommands(program);
  
  // Global options
  program
    .option('-v, --verbose', 'Verbose output')
    .option('--json', 'Output as JSON')
    .option('--no-color', 'Disable colored output');
  
  // Handle unknown commands
  program.on('command:*', () => {
    console.error(chalk.red(`Unknown command: ${program.args.join(' ')}`));
    console.log(`Run ${chalk.cyan('riotplan --help')} for usage.`);
    process.exit(1);
  });
  
  return program;
}

// Main execution
const program = createProgram();
program.parse();
```

### 4. Implement Command Group Pattern

Create `src/commands/plan/index.ts`:

```typescript
import { Command } from 'commander';
import { initCommand } from './init.js';
import { validateCommand } from './validate.js';
import { archiveCommand } from './archive.js';

export function registerPlanCommands(program: Command): void {
  const planCmd = program
    .command('plan')
    .description('Plan management commands');
  
  // Add subcommands
  planCmd.addCommand(initCommand());
  planCmd.addCommand(validateCommand());
  planCmd.addCommand(archiveCommand());
}
```

Create `src/commands/plan/init.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { createPlan } from '@riotprompt/riotplan';
import { outputSuccess, outputError, outputPlan } from '../../utils/output.js';

export function initCommand(): Command {
  return new Command('init')
    .description('Create a new plan')
    .argument('<name>', 'Plan name/code (lowercase, hyphens)')
    .option('-d, --description <desc>', 'Plan description')
    .option('-t, --template <template>', 'Template to use', 'default')
    .option('-p, --path <path>', 'Base path for plan', '.')
    .option('--steps <count>', 'Number of initial steps', '3')
    .action(async (name, options) => {
      try {
        const result = await createPlan({
          code: name,
          name: formatName(name),
          basePath: options.path,
          description: options.description,
          steps: generateInitialSteps(parseInt(options.steps))
        });
        
        outputSuccess(`Created plan: ${result.plan.metadata.name}`);
        console.log(chalk.dim(`Location: ${result.path}`));
        console.log();
        console.log('Files created:');
        for (const file of result.filesCreated.slice(0, 5)) {
          console.log(chalk.dim(`  - ${file}`));
        }
        if (result.filesCreated.length > 5) {
          console.log(chalk.dim(`  ... and ${result.filesCreated.length - 5} more`));
        }
      } catch (error) {
        outputError(`Failed to create plan: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}

function formatName(code: string): string {
  return code
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateInitialSteps(count: number): Array<{ title: string; description?: string }> {
  const defaults = [
    { title: 'Setup', description: 'Initial setup and prerequisites' },
    { title: 'Implementation', description: 'Core implementation work' },
    { title: 'Testing', description: 'Verify everything works' },
    { title: 'Documentation', description: 'Update documentation' },
    { title: 'Release', description: 'Final release preparation' }
  ];
  return defaults.slice(0, count);
}
```

### 5. Implement Output Utilities

Create `src/utils/output.ts`:

```typescript
import chalk from 'chalk';
import type { Plan, PlanStep, TaskStatus } from '@riotprompt/riotplan';

export function outputSuccess(message: string): void {
  console.log(chalk.green('✓') + ' ' + message);
}

export function outputError(message: string): void {
  console.error(chalk.red('✗') + ' ' + message);
}

export function outputWarning(message: string): void {
  console.log(chalk.yellow('⚠') + ' ' + message);
}

export function outputInfo(message: string): void {
  console.log(chalk.blue('ℹ') + ' ' + message);
}

export function getStatusIcon(status: TaskStatus): string {
  const icons: Record<TaskStatus, string> = {
    pending: '⬜',
    in_progress: '🔄',
    completed: '✅',
    failed: '❌',
    blocked: '⏸️',
    skipped: '⏭️'
  };
  return icons[status] || '⬜';
}

export function formatStatus(status: TaskStatus): string {
  const colors: Record<TaskStatus, (s: string) => string> = {
    pending: chalk.dim,
    in_progress: chalk.yellow,
    completed: chalk.green,
    failed: chalk.red,
    blocked: chalk.magenta,
    skipped: chalk.gray
  };
  const color = colors[status] || chalk.white;
  return color(status.replace('_', ' '));
}

export function outputStepList(steps: PlanStep[]): void {
  for (const step of steps) {
    const num = String(step.number).padStart(2, '0');
    const icon = getStatusIcon(step.status);
    const status = formatStatus(step.status);
    console.log(`  ${icon} ${chalk.bold(num)} ${step.title} ${chalk.dim(`[${status}]`)}`);
  }
}

export function outputPlanSummary(plan: Plan): void {
  const { metadata, state, steps } = plan;
  const completedCount = steps.filter(s => s.status === 'completed').length;
  
  console.log();
  console.log(chalk.bold(metadata.name));
  console.log(chalk.dim(`Code: ${metadata.code}`));
  console.log();
  console.log(`Status: ${getStatusIcon(state.status)} ${formatStatus(state.status)}`);
  console.log(`Progress: ${state.progress}% (${completedCount}/${steps.length} steps)`);
  
  if (state.currentStep) {
    const currentStep = steps.find(s => s.number === state.currentStep);
    if (currentStep) {
      console.log(`Current: Step ${state.currentStep} - ${currentStep.title}`);
    }
  }
  
  if (state.blockers.length > 0) {
    console.log();
    console.log(chalk.yellow(`Blockers: ${state.blockers.length}`));
    for (const blocker of state.blockers) {
      console.log(chalk.dim(`  - ${blocker.description}`));
    }
  }
}

export function outputJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}
```

### 6. Implement Error Handling

Create `src/utils/errors.ts`:

```typescript
import chalk from 'chalk';

export class CliError extends Error {
  constructor(
    message: string,
    public code: string,
    public exitCode: number = 1
  ) {
    super(message);
    this.name = 'CliError';
  }
}

export function handleError(error: unknown): never {
  if (error instanceof CliError) {
    console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    process.exit(error.exitCode);
  }
  
  if (error instanceof Error) {
    console.error(chalk.red(`Error: ${error.message}`));
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
  
  console.error(chalk.red('An unknown error occurred'));
  process.exit(1);
}

export function notImplemented(feature: string): never {
  console.log(chalk.yellow(`⚠ ${feature} is not yet implemented.`));
  console.log(chalk.dim('Check back in a future version!'));
  process.exit(0);
}
```

### 7. Update package.json Scripts

In `riotplan-cli/package.json`:

```json
{
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "test": "vitest run --coverage",
    "cli": "node dist/cli.js"
  }
}
```

## Acceptance Criteria

- [ ] CLI uses subcommand structure
- [ ] `riotplan --help` shows command groups
- [ ] `riotplan plan --help` shows plan subcommands
- [ ] Global options work (--json, --verbose)
- [ ] Output utilities produce consistent formatting
- [ ] Error handling provides clear messages
- [ ] Unknown commands are handled gracefully
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/cli.test.ts
import { describe, it, expect } from 'vitest';
import { createProgram } from '../src/cli';

describe('CLI', () => {
  it('should create program with subcommands', () => {
    const program = createProgram();
    
    expect(program.name()).toBe('riotplan');
    
    const commands = program.commands.map(c => c.name());
    expect(commands).toContain('plan');
    expect(commands).toContain('status');
    expect(commands).toContain('step');
    expect(commands).toContain('feedback');
  });
  
  it('should have plan subcommands', () => {
    const program = createProgram();
    const planCmd = program.commands.find(c => c.name() === 'plan');
    
    const subcommands = planCmd!.commands.map(c => c.name());
    expect(subcommands).toContain('init');
    expect(subcommands).toContain('validate');
  });
});
```

## Files Changed

- `riotplan-cli/src/cli.ts` - Restructured entry point
- `riotplan-cli/src/commands/` - New command modules
- `riotplan-cli/src/utils/` - New utility modules
- `riotplan-cli/tests/cli.test.ts` - Tests

## Notes

- Commander.js supports subcommands natively
- Keep short aliases for common operations (e.g., `riotplan status`)
- Consider adding shell completion in future

## Dependencies

- None (CLI architecture is independent)

## References

- RIOTPLAN_ANALYSIS.md: CLI Requirements section
- Commander.js documentation

