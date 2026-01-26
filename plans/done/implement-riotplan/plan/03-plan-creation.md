# Step 03: Plan Creation

## Objective

Implement `createPlan()` function to scaffold new plan directories with all standard files, proper structure, and optionally from templates.

## Background

Users need to create new plans quickly. The `createPlan()` function must:
1. Create directory structure
2. Generate standard files (SUMMARY.md, EXECUTION_PLAN.md, STATUS.md)
3. Create initial step files
4. Initialize feedback/ and evidence/ directories
5. Support template-based creation (basic support; full templates in Phase 5)

## Tasks

### 1. Create Plan Creator Module

Create `src/plan/creator.ts`:

```typescript
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plan, PlanStep } from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface CreatePlanConfig {
  /** Plan code/slug (directory name) */
  code: string;
  
  /** Human-readable name */
  name: string;
  
  /** Base path for plan (plan created as subdirectory) */
  basePath: string;
  
  /** Plan description */
  description?: string;
  
  /** Initial steps */
  steps?: Array<{ title: string; description?: string }>;
  
  /** Context assignment */
  context?: string;
  
  /** Author name */
  author?: string;
  
  /** Create feedback directory */
  createFeedbackDir?: boolean;
  
  /** Create evidence directory */
  createEvidenceDir?: boolean;
  
  /** Template to use (basic support) */
  template?: 'blank' | 'default';
}

export interface CreatePlanResult {
  /** Created plan */
  plan: Plan;
  
  /** Path where plan was created */
  path: string;
  
  /** Files that were created */
  filesCreated: string[];
}
```

### 2. Implement Directory Creation

```typescript
async function createPlanDirectories(
  planPath: string,
  options: { feedback?: boolean; evidence?: boolean }
): Promise<string[]> {
  const dirs: string[] = [];
  
  // Create main directory
  await mkdir(planPath, { recursive: true });
  dirs.push(planPath);
  
  // Create plan/ subdirectory for steps
  const planDir = join(planPath, PLAN_CONVENTIONS.standardDirs.plan);
  await mkdir(planDir, { recursive: true });
  dirs.push(planDir);
  
  // Create feedback/ if requested
  if (options.feedback) {
    const feedbackDir = join(planPath, PLAN_CONVENTIONS.standardDirs.feedback);
    await mkdir(feedbackDir, { recursive: true });
    dirs.push(feedbackDir);
  }
  
  // Create evidence/ if requested
  if (options.evidence) {
    const evidenceDir = join(planPath, PLAN_CONVENTIONS.standardDirs.evidence);
    await mkdir(evidenceDir, { recursive: true });
    dirs.push(evidenceDir);
  }
  
  return dirs;
}
```

### 3. Implement File Generators

```typescript
function generateSummaryMd(config: CreatePlanConfig): string {
  const date = new Date().toISOString().split('T')[0];
  
  return `# ${config.name}

## Overview

${config.description || 'Description of this plan.'}

## Goals

1. Goal 1
2. Goal 2
3. Goal 3

## Scope

### In Scope

- Item 1
- Item 2

### Out of Scope

- Item 1

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

---

*Plan created: ${date}*
${config.author ? `*Author: ${config.author}*` : ''}
`;
}

function generateExecutionPlanMd(config: CreatePlanConfig): string {
  const steps = config.steps || [
    { title: 'Setup', description: 'Initial setup and prerequisites' },
    { title: 'Implementation', description: 'Core implementation work' },
    { title: 'Testing', description: 'Verify everything works' }
  ];
  
  let stepsSection = '';
  steps.forEach((step, i) => {
    const num = String(i + 1).padStart(2, '0');
    stepsSection += `| ${num} | ${step.title} | ${step.description || ''} |\n`;
  });
  
  return `# Execution Plan: ${config.name}

## Strategy

Describe the overall approach and strategy for this plan.

## Prerequisites

- [ ] Prerequisite 1
- [ ] Prerequisite 2

## Steps

| Step | Name | Description |
|------|------|-------------|
${stepsSection}

## Quality Gates

After each step:
- [ ] Tests pass
- [ ] Lint passes
- [ ] Code review complete

## Notes

Additional notes about the execution approach.

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;
}

function generateStatusMd(config: CreatePlanConfig): string {
  const date = new Date().toISOString().split('T')[0];
  const steps = config.steps || [
    { title: 'Setup' },
    { title: 'Implementation' },
    { title: 'Testing' }
  ];
  
  let stepsTable = '';
  steps.forEach((step, i) => {
    const num = String(i + 1).padStart(2, '0');
    stepsTable += `| ${num} | ${step.title} | ⬜ | - | - | |\n`;
  });
  
  return `# ${config.name} Status

## Current State

| Field | Value |
|-------|-------|
| **Status** | ⬜ PLANNING |
| **Current Step** | - |
| **Last Completed** | - |
| **Started** | - |
| **Last Updated** | ${date} |
| **Progress** | 0% (0/${steps.length} steps) |

## Step Progress

| Step | Name | Status | Started | Completed | Notes |
|------|------|--------|---------|-----------|-------|
${stepsTable}

## Blockers

None currently.

## Issues

None currently.

## Notes

---

*Last updated: ${date}*
`;
}

function generateStepMd(
  stepNum: number, 
  title: string, 
  description?: string
): string {
  const num = String(stepNum).padStart(2, '0');
  
  return `# Step ${num}: ${title}

## Objective

${description || 'Describe the objective of this step.'}

## Background

Provide context and rationale for this step.

## Tasks

### 1. Task 1

Description of task 1.

### 2. Task 2

Description of task 2.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Testing

Describe how to verify this step is complete.

## Files Changed

- File 1
- File 2

## Notes

Additional notes for this step.
`;
}
```

### 4. Implement createPlan Function

```typescript
export async function createPlan(
  config: CreatePlanConfig
): Promise<CreatePlanResult> {
  const planPath = join(config.basePath, config.code);
  const filesCreated: string[] = [];
  
  // Validate code
  if (!/^[a-z0-9-]+$/.test(config.code)) {
    throw new Error(
      `Invalid plan code: ${config.code}. Use lowercase letters, numbers, and hyphens only.`
    );
  }
  
  // Create directories
  await createPlanDirectories(planPath, {
    feedback: config.createFeedbackDir ?? true,
    evidence: config.createEvidenceDir ?? true
  });
  
  // Generate and write SUMMARY.md
  const summaryPath = join(planPath, PLAN_CONVENTIONS.standardFiles.summary);
  await writeFile(summaryPath, generateSummaryMd(config));
  filesCreated.push(summaryPath);
  
  // Generate and write EXECUTION_PLAN.md
  const execPath = join(planPath, PLAN_CONVENTIONS.standardFiles.executionPlan);
  await writeFile(execPath, generateExecutionPlanMd(config));
  filesCreated.push(execPath);
  
  // Generate and write STATUS.md
  const statusPath = join(planPath, PLAN_CONVENTIONS.standardFiles.status);
  await writeFile(statusPath, generateStatusMd(config));
  filesCreated.push(statusPath);
  
  // Create step files
  const steps = config.steps || [
    { title: 'Setup', description: 'Initial setup and prerequisites' },
    { title: 'Implementation', description: 'Core implementation work' },
    { title: 'Testing', description: 'Verify everything works' }
  ];
  
  const createdSteps: PlanStep[] = [];
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepNum = i + 1;
    const code = step.title.toLowerCase().replace(/\s+/g, '-');
    const filename = `${String(stepNum).padStart(2, '0')}-${code}.md`;
    const stepPath = join(planPath, PLAN_CONVENTIONS.standardDirs.plan, filename);
    
    await writeFile(stepPath, generateStepMd(stepNum, step.title, step.description));
    filesCreated.push(stepPath);
    
    createdSteps.push({
      number: stepNum,
      code,
      filename,
      title: step.title,
      description: step.description,
      status: 'pending',
      filePath: stepPath
    });
  }
  
  // Construct Plan object
  const plan: Plan = {
    metadata: {
      code: config.code,
      name: config.name,
      description: config.description,
      author: config.author,
      path: planPath,
      createdAt: new Date()
    },
    files: {
      summary: PLAN_CONVENTIONS.standardFiles.summary,
      status: PLAN_CONVENTIONS.standardFiles.status,
      executionPlan: PLAN_CONVENTIONS.standardFiles.executionPlan,
      steps: createdSteps.map(s => s.filename),
      subdirectories: [PLAN_CONVENTIONS.standardDirs.plan],
      feedbackDir: config.createFeedbackDir ? PLAN_CONVENTIONS.standardDirs.feedback : undefined,
      evidenceDir: config.createEvidenceDir ? PLAN_CONVENTIONS.standardDirs.evidence : undefined
    },
    steps: createdSteps,
    state: {
      status: 'pending',
      lastUpdatedAt: new Date(),
      blockers: [],
      issues: [],
      progress: 0
    },
    context: config.context
  };
  
  return { plan, path: planPath, filesCreated };
}
```

### 5. Update Index Exports

In `src/index.ts`:

```typescript
export { 
  createPlan, 
  type CreatePlanConfig, 
  type CreatePlanResult 
} from './plan/creator.js';
```

## Acceptance Criteria

- [ ] `createPlan()` creates valid directory structure
- [ ] All standard files are generated correctly
- [ ] Step files are numbered and named correctly
- [ ] feedback/ and evidence/ directories created when requested
- [ ] Generated plan can be loaded with `loadPlan()`
- [ ] Clear error messages for invalid inputs
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/creator.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPlan, loadPlan } from '../src/index';
import { rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('createPlan', () => {
  let testDir: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `riotplan-test-${Date.now()}`);
  });
  
  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true });
    } catch {}
  });
  
  it('should create a valid plan structure', async () => {
    const result = await createPlan({
      code: 'test-plan',
      name: 'Test Plan',
      basePath: testDir,
      description: 'A test plan'
    });
    
    expect(result.plan.metadata.code).toBe('test-plan');
    expect(result.filesCreated.length).toBeGreaterThan(0);
    
    // Verify files exist
    for (const file of result.filesCreated) {
      await expect(access(file)).resolves.not.toThrow();
    }
  });
  
  it('should create custom steps', async () => {
    const result = await createPlan({
      code: 'custom-steps',
      name: 'Custom Steps Plan',
      basePath: testDir,
      steps: [
        { title: 'First', description: 'Do first thing' },
        { title: 'Second', description: 'Do second thing' }
      ]
    });
    
    expect(result.plan.steps.length).toBe(2);
    expect(result.plan.steps[0].title).toBe('First');
    expect(result.plan.steps[1].title).toBe('Second');
  });
  
  it('should be loadable after creation', async () => {
    const result = await createPlan({
      code: 'loadable-plan',
      name: 'Loadable Plan',
      basePath: testDir
    });
    
    const loaded = await loadPlan(result.path);
    expect(loaded.metadata.code).toBe('loadable-plan');
  });
  
  it('should reject invalid codes', async () => {
    await expect(createPlan({
      code: 'Invalid Code!',
      name: 'Test',
      basePath: testDir
    })).rejects.toThrow(/Invalid plan code/);
  });
});
```

## Files Changed

- `riotplan/src/plan/creator.ts` - New file
- `riotplan/src/index.ts` - Export createPlan
- `riotplan/tests/creator.test.ts` - Tests

## Notes

- Basic template support here; full templates in Step 17
- Generated markdown follows conventions from existing plans
- Consider making generators configurable in future

## Dependencies

- Step 01 (Type System Enhancement)
- Step 02 (Plan Loading) - For verification tests

## References

- RIOTPLAN_ANALYSIS.md: R1 (Plan Management)
- Existing plan structures in kjerneverk/prompts/

