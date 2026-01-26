# Step 11: Status Commands

## Objective

Implement the `status` command group: `status` (show), `status list`, `status dashboard`, and `status blockers`—providing visibility into plan state.

## Background

Status commands are the most frequently used. They answer:

- "What's the state of this plan?"
- "What steps are pending/completed?"
- "What's blocking progress?"
- "What's happening across all my plans?"

## Tasks

### 1. Implement status (show) Command

Create `src/commands/status/show.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { loadPlan } from '@riotprompt/riotplan';
import { 
  outputPlanSummary, 
  outputError, 
  outputJson,
  getStatusIcon,
  formatStatus 
} from '../../utils/output.js';

export function showCommand(): Command {
  return new Command('show')
    .description('Show plan status (default)')
    .argument('[path]', 'Path to plan directory', '.')
    .option('-v, --verbose', 'Show detailed status')
    .option('--json', 'Output as JSON')
    .action(async (path, options) => {
      try {
        const planPath = resolve(path);
        const plan = await loadPlan(planPath);
        
        if (options.json) {
          outputJson({
            plan: plan.metadata,
            state: plan.state,
            steps: plan.steps.map(s => ({
              number: s.number,
              title: s.title,
              status: s.status
            }))
          });
          return;
        }
        
        outputPlanSummary(plan);
        
        if (options.verbose) {
          console.log();
          console.log(chalk.bold('Steps:'));
          for (const step of plan.steps) {
            const num = String(step.number).padStart(2, '0');
            const icon = getStatusIcon(step.status);
            console.log(`  ${icon} ${num} ${step.title}`);
            if (step.notes) {
              console.log(chalk.dim(`       ${step.notes}`));
            }
          }
        }
        
      } catch (error) {
        outputError(`Failed to load plan: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
```

### 2. Implement status list Command

Create `src/commands/status/list.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { loadPlan, type PlanStep } from '@riotprompt/riotplan';
import { 
  outputError, 
  outputJson,
  getStatusIcon,
  formatStatus 
} from '../../utils/output.js';

export function listCommand(): Command {
  return new Command('list')
    .description('List all steps with status')
    .argument('[path]', 'Path to plan directory', '.')
    .option('--pending', 'Show only pending steps')
    .option('--completed', 'Show only completed steps')
    .option('--blocked', 'Show only blocked steps')
    .option('--in-progress', 'Show only in-progress steps')
    .option('--json', 'Output as JSON')
    .action(async (path, options) => {
      try {
        const planPath = resolve(path);
        const plan = await loadPlan(planPath);
        
        // Filter steps
        let steps = plan.steps;
        if (options.pending) {
          steps = steps.filter(s => s.status === 'pending');
        } else if (options.completed) {
          steps = steps.filter(s => s.status === 'completed');
        } else if (options.blocked) {
          steps = steps.filter(s => s.status === 'blocked');
        } else if (options.inProgress) {
          steps = steps.filter(s => s.status === 'in_progress');
        }
        
        if (options.json) {
          outputJson(steps.map(s => ({
            number: s.number,
            code: s.code,
            title: s.title,
            status: s.status,
            filename: s.filename
          })));
          return;
        }
        
        // Human output
        console.log();
        console.log(chalk.bold(plan.metadata.name));
        console.log(chalk.dim(`${steps.length} steps${options.pending || options.completed || options.blocked ? ' (filtered)' : ''}`));
        console.log();
        
        if (steps.length === 0) {
          console.log(chalk.dim('  No steps match the filter'));
        } else {
          outputStepTable(steps);
        }
        
      } catch (error) {
        outputError(`Failed to load plan: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}

function outputStepTable(steps: PlanStep[]): void {
  // Header
  console.log(chalk.dim('  Step  Status       Title'));
  console.log(chalk.dim('  ────  ──────       ─────'));
  
  for (const step of steps) {
    const num = String(step.number).padStart(2, '0');
    const icon = getStatusIcon(step.status);
    const status = step.status.padEnd(11);
    console.log(`  ${num}    ${icon} ${status}  ${step.title}`);
  }
}
```

### 3. Implement status dashboard Command

Create `src/commands/status/dashboard.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve, join, basename } from 'node:path';
import { readdir, stat } from 'node:fs/promises';
import { loadPlan, type Plan } from '@riotprompt/riotplan';
import { 
  outputError, 
  outputJson,
  getStatusIcon 
} from '../../utils/output.js';

export function dashboardCommand(): Command {
  return new Command('dashboard')
    .description('Show multi-plan dashboard')
    .option('-p, --path <path>', 'Base path to scan for plans', './prompts')
    .option('-c, --context <context>', 'Filter by context')
    .option('-a, --all', 'Show all contexts')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      try {
        const basePath = resolve(options.path);
        const plans = await discoverPlans(basePath);
        
        if (options.json) {
          outputJson(plans.map(p => ({
            code: p.metadata.code,
            name: p.metadata.name,
            path: p.metadata.path,
            status: p.state.status,
            progress: p.state.progress,
            steps: {
              total: p.steps.length,
              completed: p.steps.filter(s => s.status === 'completed').length,
              inProgress: p.steps.filter(s => s.status === 'in_progress').length,
              blocked: p.steps.filter(s => s.status === 'blocked').length
            }
          })));
          return;
        }
        
        // Human output
        outputDashboard(plans, basePath);
        
      } catch (error) {
        outputError(`Dashboard failed: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}

async function discoverPlans(basePath: string): Promise<Plan[]> {
  const plans: Plan[] = [];
  
  try {
    const entries = await readdir(basePath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const planPath = join(basePath, entry.name);
      
      // Check if it looks like a plan
      try {
        const plan = await loadPlan(planPath, { 
          includeFeedback: false,
          includeEvidence: false 
        });
        plans.push(plan);
      } catch {
        // Not a valid plan, skip
      }
    }
  } catch {
    // Can't read directory
  }
  
  return plans;
}

function outputDashboard(plans: Plan[], basePath: string): void {
  console.log();
  console.log(chalk.bold('📋 Plan Dashboard'));
  console.log(chalk.dim(`   Scanning: ${basePath}`));
  console.log();
  
  if (plans.length === 0) {
    console.log(chalk.dim('   No plans found'));
    return;
  }
  
  // Group by status
  const inProgress = plans.filter(p => p.state.status === 'in_progress');
  const pending = plans.filter(p => p.state.status === 'pending');
  const blocked = plans.filter(p => 
    p.state.status === 'blocked' || p.state.blockers.length > 0
  );
  const completed = plans.filter(p => p.state.status === 'completed');
  
  // In Progress
  if (inProgress.length > 0) {
    console.log(chalk.yellow.bold('🔄 In Progress'));
    for (const plan of inProgress) {
      outputPlanLine(plan);
    }
    console.log();
  }
  
  // Blocked
  if (blocked.length > 0) {
    console.log(chalk.magenta.bold('⏸️ Blocked'));
    for (const plan of blocked) {
      outputPlanLine(plan);
      for (const blocker of plan.state.blockers) {
        console.log(chalk.dim(`      └── ${blocker.description}`));
      }
    }
    console.log();
  }
  
  // Pending
  if (pending.length > 0) {
    console.log(chalk.dim.bold('⬜ Ready to Start'));
    for (const plan of pending) {
      outputPlanLine(plan);
    }
    console.log();
  }
  
  // Completed (summary only)
  if (completed.length > 0) {
    console.log(chalk.green.bold(`✅ Completed (${completed.length})`));
    console.log(chalk.dim(`   ${completed.map(p => p.metadata.code).join(', ')}`));
    console.log();
  }
  
  // Summary
  console.log(chalk.dim('─'.repeat(50)));
  console.log(`Total: ${plans.length} plans`);
  console.log(`  ${inProgress.length} in progress, ${blocked.length} blocked, ${pending.length} pending, ${completed.length} completed`);
}

function outputPlanLine(plan: Plan): void {
  const completedCount = plan.steps.filter(s => s.status === 'completed').length;
  const progress = `[${completedCount}/${plan.steps.length}]`;
  const progressBar = generateProgressBar(plan.state.progress, 10);
  
  console.log(`   ${plan.metadata.code.padEnd(30)} ${progress.padEnd(8)} ${progressBar}`);
  
  // Show current step if in progress
  if (plan.state.currentStep) {
    const current = plan.steps.find(s => s.number === plan.state.currentStep);
    if (current) {
      console.log(chalk.dim(`      └── Step ${plan.state.currentStep}: ${current.title}`));
    }
  }
}

function generateProgressBar(percent: number, width: number): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return chalk.green('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
}
```

### 4. Implement status blockers Command

Create `src/commands/status/blockers.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { loadPlan } from '@riotprompt/riotplan';
import { outputError, outputJson } from '../../utils/output.js';

export function blockersCommand(): Command {
  return new Command('blockers')
    .description('Show blockers and blocked steps')
    .argument('[path]', 'Path to plan directory', '.')
    .option('--json', 'Output as JSON')
    .action(async (path, options) => {
      try {
        const planPath = resolve(path);
        const plan = await loadPlan(planPath);
        
        const blockedSteps = plan.steps.filter(s => s.status === 'blocked');
        const blockers = plan.state.blockers;
        
        if (options.json) {
          outputJson({ blockers, blockedSteps });
          return;
        }
        
        console.log();
        console.log(chalk.bold(plan.metadata.name));
        console.log();
        
        // Blockers
        if (blockers.length === 0 && blockedSteps.length === 0) {
          console.log(chalk.green('  ✓ No blockers'));
        } else {
          if (blockers.length > 0) {
            console.log(chalk.red.bold('Blockers:'));
            for (const blocker of blockers) {
              console.log(chalk.red(`  ⏸️ ${blocker.description}`));
              if (blocker.affectedSteps.length > 0) {
                console.log(chalk.dim(`     Affects steps: ${blocker.affectedSteps.join(', ')}`));
              }
            }
            console.log();
          }
          
          if (blockedSteps.length > 0) {
            console.log(chalk.yellow.bold('Blocked Steps:'));
            for (const step of blockedSteps) {
              const num = String(step.number).padStart(2, '0');
              console.log(chalk.yellow(`  ⏸️ ${num} ${step.title}`));
              if (step.notes) {
                console.log(chalk.dim(`     Reason: ${step.notes}`));
              }
            }
          }
        }
        
      } catch (error) {
        outputError(`Failed to load plan: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
```

### 5. Register Status Commands

Update `src/commands/status/index.ts`:

```typescript
import { Command } from 'commander';
import { showCommand } from './show.js';
import { listCommand } from './list.js';
import { dashboardCommand } from './dashboard.js';
import { blockersCommand } from './blockers.js';

export function registerStatusCommands(program: Command): void {
  // Default status command (shows current plan)
  const statusShow = showCommand();
  statusShow.name('status');
  program.addCommand(statusShow);
  
  // Status subcommand group
  const statusCmd = program
    .command('status')
    .description('Status commands')
    .addHelpText('after', `
Examples:
  riotplan status                    Show current plan status
  riotplan status list               List all steps
  riotplan status list --pending     List only pending steps
  riotplan status dashboard          Show all plans in ./prompts
  riotplan status blockers           Show blockers
`);
  
  statusCmd.addCommand(listCommand());
  statusCmd.addCommand(dashboardCommand());
  statusCmd.addCommand(blockersCommand());
}
```

## Acceptance Criteria

- [ ] `riotplan status` shows plan summary
- [ ] `riotplan status list` shows all steps
- [ ] `riotplan status list --pending` filters correctly
- [ ] `riotplan status dashboard` scans and displays multiple plans
- [ ] `riotplan status blockers` shows blocking issues
- [ ] JSON output works for all commands
- [ ] Progress visualization is clear
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/commands/status.test.ts
import { describe, it, expect } from 'vitest';
import { createProgram } from '../../src/cli';

describe('status commands', () => {
  // Integration tests would require setting up test plans
  // and capturing CLI output
});
```

## Files Changed

- `riotplan-cli/src/commands/status/show.ts` - New file
- `riotplan-cli/src/commands/status/list.ts` - New file
- `riotplan-cli/src/commands/status/dashboard.ts` - New file
- `riotplan-cli/src/commands/status/blockers.ts` - New file
- `riotplan-cli/src/commands/status/index.ts` - Register commands
- `riotplan-cli/tests/commands/status.test.ts` - Tests

## Notes

- Dashboard is key for multi-plan management
- Consider adding watch mode for continuous updates
- Context filtering will be implemented when contexts are added

## Dependencies

- Step 02 (Plan Loading) - `loadPlan()`
- Step 05 (Status Parsing) - Status data
- Step 09 (CLI Architecture)

## References

- RIOTPLAN_ANALYSIS.md: R6 (Multi-Plan Dashboard)

