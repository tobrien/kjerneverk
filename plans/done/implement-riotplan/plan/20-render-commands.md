# Step 20: Render Commands

## Objective

Implement CLI commands for rendering plans: `render pdf`, `render html`, `render docx`, and `share`.

## Background

Rendering commands make plans shareable. Key use cases:

1. Export plan for review
2. Generate PDF for documentation
3. Share with stakeholders
4. Create shareable artifacts

## Tasks

### 1. Implement render Command Group

```typescript
// src/commands/render/index.ts
export function registerRenderCommands(program: Command): void {
  const renderCmd = program
    .command('render')
    .description('Render plan to various formats');
  
  renderCmd.addCommand(pdfCommand());
  renderCmd.addCommand(htmlCommand());
  renderCmd.addCommand(docxCommand());
  renderCmd.addCommand(markdownCommand());
}
```

### 2. Implement render pdf Command

```typescript
export function pdfCommand(): Command {
  return new Command('pdf')
    .description('Render plan to PDF')
    .argument('[path]', 'Path to plan', '.')
    .option('-o, --output <file>', 'Output file path')
    .option('--full', 'Include feedback, evidence, history')
    .option('--for-review', 'Optimized for external review')
    .option('--version <v>', 'Render at specific version')
    .action(async (path, options) => {
      const planPath = resolve(path);
      const plan = await loadPlan(planPath);
      
      const outputFile = options.output || 
        `${plan.metadata.code}.pdf`;
      
      console.log(chalk.dim(`Rendering ${plan.metadata.name} to PDF...`));
      
      const result = await render(plan, {
        format: 'pdf',
        mode: options.full ? 'full' : 'current',
        version: options.version,
        output: outputFile
      });
      
      outputSuccess(`Created: ${result.path}`);
    });
}
```

### 3. Implement Other Format Commands

Similar structure for `html`, `docx`, `markdown` commands.

### 4. Implement share Command

```typescript
export function shareCommand(): Command {
  return new Command('share')
    .description('Generate shareable artifact')
    .argument('[path]', 'Path to plan', '.')
    .option('--full', 'Include complete history')
    .option('--format <fmt>', 'Output format', 'pdf')
    .option('--open', 'Open after creating')
    .action(async (path, options) => {
      const planPath = resolve(path);
      const plan = await loadPlan(planPath);
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `${plan.metadata.code}-${date}.${options.format}`;
      
      console.log(chalk.dim('Creating shareable artifact...'));
      
      const result = await render(plan, {
        format: options.format,
        mode: options.full ? 'full' : 'current',
        output: filename
      });
      
      outputSuccess(`Created: ${result.path}`);
      
      if (options.open) {
        // Open with system default
        const { exec } = await import('child_process');
        exec(`open "${result.path}"`);
      }
    });
}
```

### 5. Add to Main CLI

```typescript
// In cli.ts
import { registerRenderCommands } from './commands/render/index.js';

// After other registrations
registerRenderCommands(program);

// Also add share as top-level
program.addCommand(shareCommand());
```

## Acceptance Criteria

- [ ] `riotplan render pdf` generates PDF
- [ ] `riotplan render html` generates HTML
- [ ] `riotplan render docx` generates Word doc
- [ ] `riotplan render markdown` generates single file
- [ ] `riotplan share` creates shareable artifact
- [ ] `--full` flag includes everything
- [ ] `--for-review` optimizes for external review
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan-cli/src/commands/render/` - New command group
- `riotplan-cli/src/commands/share.ts` - Share command
- `riotplan-cli/src/cli.ts` - Register commands

## Dependencies

- Step 19 (Renderer Package)
- Step 09 (CLI Architecture)

