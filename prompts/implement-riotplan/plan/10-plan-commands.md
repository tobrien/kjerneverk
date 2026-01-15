# Step 10: Plan Commands

## Objective

Implement the `plan` command group: `plan init`, `plan validate`, and `plan archive`—connecting the CLI to the core library functions.

## Background

The plan commands are the foundation of CLI interaction:

- `plan init` - Create new plans (calls `createPlan()`)
- `plan validate` - Validate plan structure (calls `validatePlan()`)
- `plan archive` - Archive completed plans (new functionality)

## Tasks

### 1. Implement plan init Command

Update `src/commands/plan/init.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { createPlan, type CreatePlanConfig } from '@riotprompt/riotplan';
import { outputSuccess, outputError } from '../../utils/output.js';

export function initCommand(): Command {
  return new Command('init')
    .description('Create a new plan')
    .argument('<name>', 'Plan code (lowercase letters, numbers, hyphens)')
    .option('-d, --description <desc>', 'Plan description')
    .option('-t, --template <template>', 'Template to use', 'default')
    .option('-p, --path <path>', 'Base path for plan', './prompts')
    .option('--steps <steps...>', 'Initial step titles')
    .option('--no-feedback', 'Skip creating feedback/ directory')
    .option('--no-evidence', 'Skip creating evidence/ directory')
    .action(async (name, options) => {
      try {
        // Validate name
        if (!/^[a-z0-9-]+$/.test(name)) {
          outputError('Plan code must be lowercase letters, numbers, and hyphens only');
          process.exit(1);
        }
        
        // Build config
        const config: CreatePlanConfig = {
          code: name,
          name: formatName(name),
          basePath: resolve(options.path),
          description: options.description,
          createFeedbackDir: options.feedback,
          createEvidenceDir: options.evidence
        };
        
        // Custom steps
        if (options.steps && options.steps.length > 0) {
          config.steps = options.steps.map((title: string) => ({ title }));
        }
        
        // Create plan
        const result = await createPlan(config);
        
        // Output
        outputSuccess(`Created plan: ${chalk.bold(result.plan.metadata.name)}`);
        console.log();
        console.log(`  ${chalk.dim('Location:')} ${result.path}`);
        console.log(`  ${chalk.dim('Steps:')} ${result.plan.steps.length}`);
        console.log();
        console.log('Next steps:');
        console.log(`  1. Edit ${chalk.cyan('SUMMARY.md')} with your plan overview`);
        console.log(`  2. Edit step files in ${chalk.cyan('plan/')}`);
        console.log(`  3. Run ${chalk.cyan(`riotplan plan validate ${name}`)} to check structure`);
        
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
```

### 2. Implement plan validate Command

Create `src/commands/plan/validate.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { validatePlan, type ValidationResult } from '@riotprompt/riotplan';
import { outputSuccess, outputError, outputWarning, outputInfo, outputJson } from '../../utils/output.js';

export function validateCommand(): Command {
  return new Command('validate')
    .description('Validate plan structure')
    .argument('[path]', 'Path to plan directory', '.')
    .option('--strict', 'Treat warnings as errors')
    .option('--fix', 'Attempt to auto-fix issues')
    .option('--no-content', 'Skip content validation')
    .option('--no-deps', 'Skip dependency validation')
    .option('--json', 'Output as JSON')
    .action(async (path, options) => {
      try {
        const planPath = resolve(path);
        
        const result = await validatePlan(planPath, {
          strict: options.strict,
          validateContent: options.content,
          validateDependencies: options.deps
        });
        
        // JSON output
        if (options.json) {
          outputJson(result);
          process.exit(result.valid ? 0 : 1);
        }
        
        // Human-readable output
        outputValidationResult(result, planPath);
        
        // Auto-fix
        if (options.fix && result.fixable.length > 0) {
          console.log();
          console.log(chalk.bold('Auto-fixing issues...'));
          for (const issue of result.fixable) {
            try {
              await issue.fix();
              outputSuccess(`Fixed: ${issue.description}`);
            } catch (e) {
              outputError(`Failed to fix: ${issue.description}`);
            }
          }
        }
        
        process.exit(result.valid ? 0 : 1);
        
      } catch (error) {
        outputError(`Validation failed: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}

function outputValidationResult(result: ValidationResult, path: string): void {
  console.log();
  console.log(chalk.bold(`Validating: ${path}`));
  console.log();
  
  // Errors
  if (result.errors.length > 0) {
    console.log(chalk.red.bold(`Errors (${result.errors.length}):`));
    for (const error of result.errors) {
      console.log(chalk.red(`  ✗ [${error.code}] ${error.message}`));
      if (error.path) {
        console.log(chalk.dim(`    at ${error.path}`));
      }
    }
    console.log();
  }
  
  // Warnings
  if (result.warnings.length > 0) {
    console.log(chalk.yellow.bold(`Warnings (${result.warnings.length}):`));
    for (const warning of result.warnings) {
      console.log(chalk.yellow(`  ⚠ [${warning.code}] ${warning.message}`));
    }
    console.log();
  }
  
  // Fixable
  if (result.fixable.length > 0) {
    console.log(chalk.blue.bold(`Auto-fixable (${result.fixable.length}):`));
    for (const issue of result.fixable) {
      console.log(chalk.blue(`  🔧 ${issue.description}`));
    }
    console.log(chalk.dim('  Run with --fix to auto-fix these issues'));
    console.log();
  }
  
  // Info
  for (const info of result.info) {
    outputInfo(info.message);
  }
  
  // Summary
  console.log();
  if (result.valid) {
    outputSuccess('Plan is valid');
  } else {
    outputError('Plan has errors that must be fixed');
  }
}
```

### 3. Implement plan archive Command

Create `src/commands/plan/archive.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve, join, basename } from 'node:path';
import { rename, mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadPlan, generateStatus, type Plan } from '@riotprompt/riotplan';
import { outputSuccess, outputError, outputWarning } from '../../utils/output.js';

export function archiveCommand(): Command {
  return new Command('archive')
    .description('Archive a completed plan')
    .argument('[path]', 'Path to plan directory', '.')
    .option('-t, --target <dir>', 'Archive target directory', './archive')
    .option('--force', 'Archive even if not completed')
    .option('--mark-complete', 'Mark plan as completed before archiving')
    .action(async (path, options) => {
      try {
        const planPath = resolve(path);
        const plan = await loadPlan(planPath);
        
        // Check if completed
        if (plan.state.status !== 'completed' && !options.force) {
          if (options.markComplete) {
            // Mark as completed
            const updatedPlan: Plan = {
              ...plan,
              state: {
                ...plan.state,
                status: 'completed',
                completedAt: new Date(),
                lastUpdatedAt: new Date()
              }
            };
            
            // Update STATUS.md
            const statusPath = join(planPath, 'STATUS.md');
            const existingContent = await readFile(statusPath, 'utf-8').catch(() => '');
            const newStatus = generateStatus(updatedPlan, { existingContent });
            await writeFile(statusPath, newStatus);
            
            outputSuccess('Marked plan as completed');
          } else {
            outputWarning('Plan is not completed. Use --force to archive anyway, or --mark-complete');
            process.exit(1);
          }
        }
        
        // Create archive directory
        const archiveDir = resolve(options.target);
        await mkdir(archiveDir, { recursive: true });
        
        // Move plan to archive
        const archivePath = join(archiveDir, basename(planPath));
        await rename(planPath, archivePath);
        
        outputSuccess(`Archived: ${plan.metadata.name}`);
        console.log(chalk.dim(`  From: ${planPath}`));
        console.log(chalk.dim(`  To: ${archivePath}`));
        
      } catch (error) {
        outputError(`Archive failed: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
```

### 4. Register Commands in Index

Update `src/commands/plan/index.ts`:

```typescript
import { Command } from 'commander';
import { initCommand } from './init.js';
import { validateCommand } from './validate.js';
import { archiveCommand } from './archive.js';

export function registerPlanCommands(program: Command): void {
  const planCmd = program
    .command('plan')
    .description('Plan management commands')
    .addHelpText('after', `
Examples:
  riotplan plan init my-feature           Create a new plan
  riotplan plan validate ./prompts/my-plan   Validate plan structure
  riotplan plan archive ./prompts/done-plan  Archive completed plan
`);
  
  planCmd.addCommand(initCommand());
  planCmd.addCommand(validateCommand());
  planCmd.addCommand(archiveCommand());
}
```

### 5. Add Shortcut Command

For convenience, add `riotplan init` as alias to `riotplan plan init`:

In `src/cli.ts`:

```typescript
// After registering command groups

// Convenience alias: riotplan init → riotplan plan init
program
  .command('init <name>')
  .description('Create a new plan (alias for "plan init")')
  .option('-d, --description <desc>', 'Plan description')
  .option('-p, --path <path>', 'Base path for plan', './prompts')
  .action(async (name, options) => {
    // Delegate to plan init
    const args = ['plan', 'init', name];
    if (options.description) args.push('-d', options.description);
    if (options.path) args.push('-p', options.path);
    
    program.parse(['node', 'riotplan', ...args]);
  });
```

## Acceptance Criteria

- [ ] `riotplan plan init` creates valid plans
- [ ] `riotplan plan validate` reports errors/warnings
- [ ] `riotplan plan validate --fix` auto-fixes issues
- [ ] `riotplan plan archive` moves completed plans
- [ ] JSON output works for all commands
- [ ] Error messages are clear and actionable
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/commands/plan.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createProgram } from '../../src/cli';
import { rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('plan commands', () => {
  let testDir: string;
  
  beforeEach(() => {
    testDir = join(tmpdir(), `riotplan-cli-test-${Date.now()}`);
  });
  
  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true });
    } catch {}
  });
  
  describe('plan init', () => {
    it('should create a plan', async () => {
      const program = createProgram();
      
      await program.parseAsync([
        'node', 'riotplan',
        'plan', 'init', 'test-plan',
        '-p', testDir
      ]);
      
      // Verify plan was created
      await expect(access(join(testDir, 'test-plan'))).resolves.not.toThrow();
    });
  });
  
  describe('plan validate', () => {
    it('should validate a valid plan', async () => {
      // Create a plan first
      const program = createProgram();
      await program.parseAsync(['node', 'riotplan', 'plan', 'init', 'test-plan', '-p', testDir]);
      
      // Reset and validate
      const program2 = createProgram();
      // Note: Would need to capture exit code in real test
    });
  });
});
```

## Files Changed

- `riotplan-cli/src/commands/plan/init.ts` - Full implementation
- `riotplan-cli/src/commands/plan/validate.ts` - New file
- `riotplan-cli/src/commands/plan/archive.ts` - New file
- `riotplan-cli/src/commands/plan/index.ts` - Register commands
- `riotplan-cli/src/cli.ts` - Alias commands
- `riotplan-cli/tests/commands/plan.test.ts` - Tests

## Notes

- Commands should work from any directory
- Default path is `./prompts` to match kjerneverk convention
- Consider adding `plan info` command to show plan details

## Dependencies

- Step 03 (Plan Creation) - `createPlan()`
- Step 08 (Plan Validation) - `validatePlan()`
- Step 09 (CLI Architecture)

## References

- RIOTPLAN_ANALYSIS.md: CLI Requirements

