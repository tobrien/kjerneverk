# Step 12: Feedback Commands

## Objective

Implement the `feedback` command group: `feedback create`, `feedback list`, and `feedback show`—enabling deliberation capture from the CLI.

## Background

Feedback capture is the **philosophical foundation** of RiotPlan. These commands make it easy to preserve conversations and decisions without leaving the terminal.

## Tasks

### 1. Implement feedback create Command

Create `src/commands/feedback/create.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { 
  createFeedback, 
  type CreateFeedbackOptions,
  type FeedbackPlatform 
} from '@riotprompt/riotplan';
import { outputSuccess, outputError } from '../../utils/output.js';

export function createCommand(): Command {
  return new Command('create')
    .description('Create a feedback record')
    .argument('<title>', 'Feedback title')
    .argument('[path]', 'Path to plan directory', '.')
    .option('-f, --feedback <text>', 'Feedback content (or read from stdin)')
    .option('-p, --platform <platform>', 'Platform (cursor, chatgpt, slack, etc.)', 'cursor')
    .option('--proposed <text>', 'What was proposed before feedback')
    .option('--resolution <text>', 'Resolution/outcome')
    .option('--participant <names...>', 'Participant names')
    .option('-i, --interactive', 'Interactive mode (prompt for content)')
    .action(async (title, path, options) => {
      try {
        const planPath = resolve(path);
        
        // Get feedback content
        let feedbackContent: string;
        
        if (options.feedback) {
          feedbackContent = options.feedback;
        } else if (options.interactive) {
          feedbackContent = await promptForFeedback();
        } else if (!process.stdin.isTTY) {
          // Read from pipe
          feedbackContent = await readStdin();
        } else {
          // Default interactive mode
          feedbackContent = await promptForFeedback();
        }
        
        // Build options
        const feedbackOptions: CreateFeedbackOptions = {
          title,
          feedback: feedbackContent,
          platform: options.platform as FeedbackPlatform,
          proposed: options.proposed,
          resolution: options.resolution
        };
        
        // Add participants
        if (options.participant && options.participant.length > 0) {
          feedbackOptions.participants = options.participant.map((name: string) => ({
            name,
            type: name.toLowerCase().includes('claude') || 
                  name.toLowerCase().includes('gpt') ||
                  name.toLowerCase().includes('ai') ? 'ai' as const : 'human' as const
          }));
        } else {
          // Default participants
          feedbackOptions.participants = [
            { name: process.env.USER || 'User', type: 'human' }
          ];
        }
        
        // Create feedback
        const result = await createFeedback(planPath, feedbackOptions);
        
        outputSuccess(`Created feedback: ${result.record.id} - ${title}`);
        console.log(chalk.dim(`  File: ${result.path}`));
        
      } catch (error) {
        outputError(`Failed to create feedback: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}

async function promptForFeedback(): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log(chalk.dim('Enter feedback (Ctrl+D or empty line to finish):'));
  
  return new Promise((resolve) => {
    const lines: string[] = [];
    
    rl.on('line', (line) => {
      if (line === '' && lines.length > 0) {
        rl.close();
      } else {
        lines.push(line);
      }
    });
    
    rl.on('close', () => {
      resolve(lines.join('\n'));
    });
  });
}

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data.trim());
    });
    process.stdin.on('error', reject);
  });
}
```

### 2. Implement feedback list Command

Create `src/commands/feedback/list.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { listFeedback } from '@riotprompt/riotplan';
import { outputError, outputJson } from '../../utils/output.js';

export function listCommand(): Command {
  return new Command('list')
    .description('List feedback records')
    .argument('[path]', 'Path to plan directory', '.')
    .option('--json', 'Output as JSON')
    .option('-n, --limit <n>', 'Limit number of records')
    .action(async (path, options) => {
      try {
        const planPath = resolve(path);
        let records = await listFeedback(planPath);
        
        // Limit
        if (options.limit) {
          records = records.slice(0, parseInt(options.limit));
        }
        
        if (options.json) {
          outputJson(records);
          return;
        }
        
        console.log();
        console.log(chalk.bold('Feedback Records'));
        console.log();
        
        if (records.length === 0) {
          console.log(chalk.dim('  No feedback records found'));
          console.log();
          console.log(`  Create one with: ${chalk.cyan('riotplan feedback create "Title"')}`);
        } else {
          for (const record of records) {
            const date = record.createdAt.toISOString().split('T')[0];
            const participants = record.participants
              .map(p => p.name)
              .join(', ') || 'Unknown';
            
            console.log(`  ${chalk.bold(record.id)} - ${record.title}`);
            console.log(chalk.dim(`       ${date} | ${record.platform} | ${participants}`));
            
            // Show preview of feedback
            const preview = record.feedback
              .split('\n')[0]
              .substring(0, 60);
            console.log(chalk.dim(`       ${preview}${record.feedback.length > 60 ? '...' : ''}`));
            console.log();
          }
        }
        
      } catch (error) {
        outputError(`Failed to list feedback: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
```

### 3. Implement feedback show Command

Create `src/commands/feedback/show.ts`:

```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve, join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { getFeedback, PLAN_CONVENTIONS } from '@riotprompt/riotplan';
import { outputError, outputJson } from '../../utils/output.js';

export function showCommand(): Command {
  return new Command('show')
    .description('Show feedback record details')
    .argument('<id>', 'Feedback ID (e.g., 001)')
    .argument('[path]', 'Path to plan directory', '.')
    .option('--json', 'Output as JSON')
    .option('--raw', 'Show raw markdown content')
    .action(async (id, path, options) => {
      try {
        const planPath = resolve(path);
        
        // Normalize ID
        const normalizedId = id.padStart(3, '0');
        
        const record = await getFeedback(planPath, normalizedId);
        
        if (!record) {
          outputError(`Feedback ${normalizedId} not found`);
          process.exit(1);
        }
        
        if (options.json) {
          outputJson(record);
          return;
        }
        
        if (options.raw) {
          // Read and output raw file
          const feedbackPath = join(
            planPath, 
            'feedback',
            record.filename
          );
          const content = await readFile(feedbackPath, 'utf-8');
          console.log(content);
          return;
        }
        
        // Formatted output
        console.log();
        console.log(chalk.bold(`Feedback ${record.id}: ${record.title}`));
        console.log(chalk.dim('─'.repeat(50)));
        console.log();
        
        // Context
        console.log(chalk.bold('Context'));
        console.log(`  Date: ${record.createdAt.toISOString().split('T')[0]}`);
        console.log(`  Platform: ${record.platform}`);
        if (record.participants.length > 0) {
          console.log(`  Participants: ${record.participants.map(p => 
            `${p.name} (${p.type}${p.model ? `, ${p.model}` : ''})`
          ).join(', ')}`);
        }
        if (record.planVersion) {
          console.log(`  Plan Version: ${record.planVersion}`);
        }
        console.log();
        
        // What was proposed
        if (record.proposed) {
          console.log(chalk.bold('What Was Proposed'));
          console.log(indent(record.proposed));
          console.log();
        }
        
        // Feedback
        console.log(chalk.bold('Feedback'));
        console.log(indent(record.feedback));
        console.log();
        
        // Discussion
        if (record.discussion) {
          console.log(chalk.bold('Discussion'));
          console.log(indent(record.discussion));
          console.log();
        }
        
        // Resolution
        if (record.resolution) {
          console.log(chalk.bold('Resolution'));
          console.log(indent(record.resolution));
          console.log();
        }
        
        // Changes
        if (record.changes && record.changes.length > 0) {
          console.log(chalk.bold('Changes Made'));
          for (const change of record.changes) {
            console.log(`  - ${change}`);
          }
          console.log();
        }
        
        // File location
        console.log(chalk.dim(`File: feedback/${record.filename}`));
        
      } catch (error) {
        outputError(`Failed to show feedback: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}

function indent(text: string, spaces: number = 2): string {
  const prefix = ' '.repeat(spaces);
  return text.split('\n').map(line => prefix + line).join('\n');
}
```

### 4. Register Feedback Commands

Update `src/commands/feedback/index.ts`:

```typescript
import { Command } from 'commander';
import { createCommand } from './create.js';
import { listCommand } from './list.js';
import { showCommand } from './show.js';

export function registerFeedbackCommands(program: Command): void {
  const feedbackCmd = program
    .command('feedback')
    .description('Feedback and deliberation capture')
    .addHelpText('after', `
Examples:
  riotplan feedback create "Scope discussion"           Interactive feedback
  riotplan feedback create "API review" -f "Good API"   With content
  echo "feedback" | riotplan feedback create "Title"    From pipe
  riotplan feedback list                                List all feedback
  riotplan feedback show 001                            Show specific record
  
Capture deliberation to preserve the reasoning behind decisions.
`);
  
  feedbackCmd.addCommand(createCommand());
  feedbackCmd.addCommand(listCommand());
  feedbackCmd.addCommand(showCommand());
}
```

### 5. Add Quick Feedback Alias

In `src/cli.ts`, add alias for quick feedback:

```typescript
// Quick feedback alias
program
  .command('fb <title>')
  .description('Quick feedback (alias for "feedback create")')
  .option('-f, --feedback <text>', 'Feedback content')
  .action(async (title, options) => {
    program.parse(['node', 'riotplan', 'feedback', 'create', title, 
      ...(options.feedback ? ['-f', options.feedback] : [])
    ]);
  });
```

## Acceptance Criteria

- [ ] `riotplan feedback create` creates feedback records
- [ ] Interactive mode prompts for content
- [ ] Piped content works (`echo "..." | riotplan feedback create`)
- [ ] `riotplan feedback list` shows all records
- [ ] `riotplan feedback show` displays full record
- [ ] Participants are correctly identified as human/AI
- [ ] JSON output works for all commands
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/commands/feedback.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createProgram } from '../../src/cli';
import { createPlan, listFeedback } from '@riotprompt/riotplan';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('feedback commands', () => {
  let testDir: string;
  let planPath: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `riotplan-feedback-test-${Date.now()}`);
    const result = await createPlan({
      code: 'test-plan',
      name: 'Test Plan',
      basePath: testDir
    });
    planPath = result.path;
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true });
  });
  
  describe('feedback create', () => {
    it('should create feedback with -f option', async () => {
      const program = createProgram();
      
      await program.parseAsync([
        'node', 'riotplan',
        'feedback', 'create', 'Test Feedback',
        planPath,
        '-f', 'This is the feedback content'
      ]);
      
      const records = await listFeedback(planPath);
      expect(records.length).toBe(1);
      expect(records[0].title).toBe('Test Feedback');
    });
  });
});
```

## Files Changed

- `riotplan-cli/src/commands/feedback/create.ts` - New file
- `riotplan-cli/src/commands/feedback/list.ts` - New file
- `riotplan-cli/src/commands/feedback/show.ts` - New file
- `riotplan-cli/src/commands/feedback/index.ts` - Register commands
- `riotplan-cli/src/cli.ts` - Add alias
- `riotplan-cli/tests/commands/feedback.test.ts` - Tests

## Notes

- Feedback capture should be frictionless
- Consider adding `feedback edit` command
- Interactive mode is important for capturing longer discussions

## Dependencies

- Step 04 (Feedback Capture) - Core feedback functions
- Step 09 (CLI Architecture)

## References

- RIOTPLAN_ANALYSIS.md: R9 (Feedback & Deliberation Capture)

