# Step 18: Template Commands

## Objective

Implement CLI commands for template management: list, show, and interactive wizard mode.

## Background

Users need to:
- Discover available templates
- Preview template structure before using
- Get guided through plan creation

## Tasks

### 1. Implement template list Command

```bash
$ riotplan template list

Available Templates:

Development:
  feature     New feature development
  bugfix      Bug fix workflow
  refactor    Code refactoring
  security    Security audit/remediation

Content:
  content     Blog post or documentation
  research    Research project

General:
  migration   Migration project
  blank       Empty template (default)
```

### 2. Implement template show Command

```bash
$ riotplan template show feature

Template: feature
Category: Development
Description: Plan for developing a new feature

Phases:
  1. Research (2 steps)
     - Requirements Gathering
     - Technical Research
  2. Design (2 steps)
     - Architecture Design
     - API Design
  3. Implementation (2 steps)
     - Core Implementation
     - Integration
  4. Verification (3 steps)
     - Testing
     - Documentation
     - Release

Total: 9 steps across 4 phases

Use with: riotplan plan init my-feature -t feature
```

### 3. Implement Wizard Mode

```bash
$ riotplan plan init my-feature --wizard

🧙 Plan Creation Wizard

What type of work is this?
  [1] Feature development
  [2] Bug fix
  [3] Refactoring
  [4] Security work
  [5] Content creation
  [6] Research
  [7] Other (blank template)
> 1

How complex is this work?
  [1] Small (3-5 steps)
  [2] Medium (6-10 steps)
  [3] Large (10+ steps)
> 2

Brief description (optional):
> Implement OAuth 2.0 authentication

Creating plan with 'feature' template...
✓ Created: my-feature

Structure:
  my-feature/
  ├── SUMMARY.md
  ├── EXECUTION_PLAN.md
  ├── STATUS.md
  └── plan/
      ├── 01-requirements-gathering.md
      ├── 02-technical-research.md
      └── ... (7 more steps)

Next: Edit SUMMARY.md with your plan overview
```

### 4. Implementation

Create `src/commands/template/`:

```typescript
// src/commands/template/list.ts
export function listCommand(): Command {
  return new Command('list')
    .description('List available templates')
    .option('--category <cat>', 'Filter by category')
    .action(async (options) => {
      const templates = await getAllTemplates();
      // Group by category and display
    });
}

// src/commands/template/show.ts
export function showCommand(): Command {
  return new Command('show')
    .argument('<template>', 'Template ID')
    .action(async (templateId) => {
      const template = await getTemplate(templateId);
      // Display template details
    });
}

// src/commands/plan/wizard.ts
export async function runWizard(name: string): Promise<CreatePlanConfig> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  
  // Interactive prompts
  const workType = await prompt(rl, 'What type of work?', workTypeOptions);
  const complexity = await prompt(rl, 'Complexity?', complexityOptions);
  const description = await prompt(rl, 'Description (optional):');
  
  rl.close();
  
  return {
    code: name,
    name: formatName(name),
    template: mapWorkTypeToTemplate(workType),
    description,
    steps: adjustStepsForComplexity(complexity)
  };
}
```

### 5. Register Commands

```typescript
export function registerTemplateCommands(program: Command): void {
  const templateCmd = program
    .command('template')
    .description('Template management');
  
  templateCmd.addCommand(listCommand());
  templateCmd.addCommand(showCommand());
}
```

## Acceptance Criteria

- [ ] `riotplan template list` shows all templates
- [ ] `riotplan template show <id>` shows template details
- [ ] `riotplan plan init --wizard` runs interactive wizard
- [ ] Wizard produces valid plans
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan-cli/src/commands/template/` - New command group
- `riotplan-cli/src/commands/plan/wizard.ts` - Wizard mode

## Dependencies

- Step 17 (Starter Templates)
- Step 10 (Plan Commands)

