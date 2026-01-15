# Step 07: Step Operations

## Objective

Implement step manipulation operations: insert, remove, move, block, unblock, and complete—with automatic file renumbering.

## Background

Plans evolve. Steps need to be:
- Added during planning
- Removed when unnecessary
- Reordered when dependencies change
- Blocked when waiting on external work
- Completed when done

The key challenge is **automatic renumbering**: when step 03 is inserted, 03→04, 04→05, etc.

## Tasks

### 1. Create Steps Module

Create `src/steps/operations.ts`:

```typescript
import { readdir, rename, readFile, writeFile, rm } from 'node:fs/promises';
import { join, basename } from 'node:path';
import type { Plan, PlanStep, TaskStatus } from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface InsertStepOptions {
  /** Step title */
  title: string;
  
  /** Step description */
  description?: string;
  
  /** Position to insert (1-based). If omitted, appends. */
  position?: number;
  
  /** Insert after this step number */
  after?: number;
  
  /** Initial status */
  status?: TaskStatus;
}

export interface InsertStepResult {
  /** Inserted step */
  step: PlanStep;
  
  /** Files that were renamed */
  renamedFiles: Array<{ from: string; to: string }>;
  
  /** Created file path */
  createdFile: string;
}
```

### 2. Implement File Renumbering

```typescript
interface StepFile {
  number: number;
  code: string;
  filename: string;
  path: string;
}

async function getStepFiles(planPath: string): Promise<StepFile[]> {
  const planDir = join(planPath, PLAN_CONVENTIONS.standardDirs.plan);
  const entries = await readdir(planDir);
  const stepFiles: StepFile[] = [];
  
  for (const entry of entries) {
    const match = entry.match(PLAN_CONVENTIONS.stepPattern);
    if (match) {
      stepFiles.push({
        number: parseInt(match[1]),
        code: match[2],
        filename: entry,
        path: join(planDir, entry)
      });
    }
  }
  
  return stepFiles.sort((a, b) => a.number - b.number);
}

function generateStepFilename(number: number, code: string): string {
  return `${String(number).padStart(2, '0')}-${code}.md`;
}

async function renumberSteps(
  planPath: string,
  fromNumber: number,
  delta: number // +1 for insert, -1 for remove
): Promise<Array<{ from: string; to: string }>> {
  const planDir = join(planPath, PLAN_CONVENTIONS.standardDirs.plan);
  const stepFiles = await getStepFiles(planPath);
  const renames: Array<{ from: string; to: string }> = [];
  
  // Sort in reverse for positive delta (avoid collisions)
  const sortedFiles = delta > 0 
    ? stepFiles.filter(f => f.number >= fromNumber).reverse()
    : stepFiles.filter(f => f.number > fromNumber);
  
  for (const file of sortedFiles) {
    const newNumber = file.number + delta;
    const newFilename = generateStepFilename(newNumber, file.code);
    const newPath = join(planDir, newFilename);
    
    if (file.filename !== newFilename) {
      await rename(file.path, newPath);
      renames.push({ from: file.filename, to: newFilename });
      
      // Update step number reference inside the file
      const content = await readFile(newPath, 'utf-8');
      const updatedContent = content.replace(
        /^#\s+Step\s+\d+:/m,
        `# Step ${String(newNumber).padStart(2, '0')}:`
      );
      await writeFile(newPath, updatedContent);
    }
  }
  
  return renames;
}
```

### 3. Implement insertStep

```typescript
export async function insertStep(
  plan: Plan,
  options: InsertStepOptions
): Promise<InsertStepResult> {
  const planDir = join(plan.metadata.path, PLAN_CONVENTIONS.standardDirs.plan);
  
  // Determine position
  let position: number;
  if (options.position !== undefined) {
    position = options.position;
  } else if (options.after !== undefined) {
    position = options.after + 1;
  } else {
    position = plan.steps.length + 1;
  }
  
  // Validate position
  if (position < 1 || position > plan.steps.length + 1) {
    throw new Error(
      `Invalid position ${position}. Must be between 1 and ${plan.steps.length + 1}`
    );
  }
  
  // Renumber existing steps
  const renamedFiles = await renumberSteps(plan.metadata.path, position, 1);
  
  // Generate new step
  const code = options.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const filename = generateStepFilename(position, code);
  const filePath = join(planDir, filename);
  
  // Generate content
  const content = generateStepContent(position, options.title, options.description);
  await writeFile(filePath, content);
  
  // Create step object
  const step: PlanStep = {
    number: position,
    code,
    filename,
    title: options.title,
    description: options.description,
    status: options.status || 'pending',
    filePath
  };
  
  return {
    step,
    renamedFiles,
    createdFile: filePath
  };
}

function generateStepContent(
  number: number,
  title: string,
  description?: string
): string {
  const num = String(number).padStart(2, '0');
  return `# Step ${num}: ${title}

## Objective

${description || 'Describe the objective of this step.'}

## Background

Provide context and rationale for this step.

## Tasks

### 1. Task 1

Description of task 1.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Testing

Describe how to verify this step is complete.

## Files Changed

- File 1

## Notes

`;
}
```

### 4. Implement removeStep

```typescript
export interface RemoveStepResult {
  /** Removed step */
  removedStep: PlanStep;
  
  /** Files that were renamed */
  renamedFiles: Array<{ from: string; to: string }>;
  
  /** Deleted file path */
  deletedFile: string;
}

export async function removeStep(
  plan: Plan,
  stepNumber: number
): Promise<RemoveStepResult> {
  // Find step
  const step = plan.steps.find(s => s.number === stepNumber);
  if (!step) {
    throw new Error(`Step ${stepNumber} not found`);
  }
  
  // Delete file
  await rm(step.filePath);
  
  // Renumber remaining steps
  const renamedFiles = await renumberSteps(plan.metadata.path, stepNumber, -1);
  
  return {
    removedStep: step,
    renamedFiles,
    deletedFile: step.filePath
  };
}
```

### 5. Implement moveStep

```typescript
export interface MoveStepResult {
  /** Moved step */
  step: PlanStep;
  
  /** New position */
  newPosition: number;
  
  /** Files that were renamed */
  renamedFiles: Array<{ from: string; to: string }>;
}

export async function moveStep(
  plan: Plan,
  fromNumber: number,
  toNumber: number
): Promise<MoveStepResult> {
  if (fromNumber === toNumber) {
    throw new Error('Source and destination are the same');
  }
  
  const step = plan.steps.find(s => s.number === fromNumber);
  if (!step) {
    throw new Error(`Step ${fromNumber} not found`);
  }
  
  if (toNumber < 1 || toNumber > plan.steps.length) {
    throw new Error(`Invalid destination ${toNumber}`);
  }
  
  const planDir = join(plan.metadata.path, PLAN_CONVENTIONS.standardDirs.plan);
  const renamedFiles: Array<{ from: string; to: string }> = [];
  
  // Temporary rename to avoid collision
  const tempPath = join(planDir, `__temp_${step.filename}`);
  await rename(step.filePath, tempPath);
  
  // Renumber affected steps
  if (fromNumber < toNumber) {
    // Moving down: shift steps up
    for (let i = fromNumber + 1; i <= toNumber; i++) {
      const s = plan.steps.find(st => st.number === i);
      if (s) {
        const newFilename = generateStepFilename(i - 1, s.code);
        const newPath = join(planDir, newFilename);
        await rename(s.filePath, newPath);
        renamedFiles.push({ from: s.filename, to: newFilename });
      }
    }
  } else {
    // Moving up: shift steps down
    for (let i = fromNumber - 1; i >= toNumber; i--) {
      const s = plan.steps.find(st => st.number === i);
      if (s) {
        const newFilename = generateStepFilename(i + 1, s.code);
        const newPath = join(planDir, newFilename);
        await rename(s.filePath, newPath);
        renamedFiles.push({ from: s.filename, to: newFilename });
      }
    }
  }
  
  // Move step to final position
  const newFilename = generateStepFilename(toNumber, step.code);
  const newPath = join(planDir, newFilename);
  await rename(tempPath, newPath);
  renamedFiles.push({ from: step.filename, to: newFilename });
  
  // Update step number in file content
  const content = await readFile(newPath, 'utf-8');
  const updatedContent = content.replace(
    /^#\s+Step\s+\d+:/m,
    `# Step ${String(toNumber).padStart(2, '0')}:`
  );
  await writeFile(newPath, updatedContent);
  
  return {
    step: { ...step, number: toNumber, filename: newFilename, filePath: newPath },
    newPosition: toNumber,
    renamedFiles
  };
}
```

### 6. Implement Status Change Functions

```typescript
export async function blockStep(
  plan: Plan,
  stepNumber: number,
  reason: string
): Promise<PlanStep> {
  const step = plan.steps.find(s => s.number === stepNumber);
  if (!step) {
    throw new Error(`Step ${stepNumber} not found`);
  }
  
  return {
    ...step,
    status: 'blocked',
    notes: reason
  };
}

export async function unblockStep(
  plan: Plan,
  stepNumber: number
): Promise<PlanStep> {
  const step = plan.steps.find(s => s.number === stepNumber);
  if (!step) {
    throw new Error(`Step ${stepNumber} not found`);
  }
  
  return {
    ...step,
    status: 'pending',
    notes: undefined
  };
}

export async function completeStep(
  plan: Plan,
  stepNumber: number,
  notes?: string
): Promise<PlanStep> {
  const step = plan.steps.find(s => s.number === stepNumber);
  if (!step) {
    throw new Error(`Step ${stepNumber} not found`);
  }
  
  return {
    ...step,
    status: 'completed',
    completedAt: new Date(),
    notes
  };
}

export async function startStep(
  plan: Plan,
  stepNumber: number
): Promise<PlanStep> {
  const step = plan.steps.find(s => s.number === stepNumber);
  if (!step) {
    throw new Error(`Step ${stepNumber} not found`);
  }
  
  return {
    ...step,
    status: 'in_progress',
    startedAt: new Date()
  };
}
```

### 7. Update Index Exports

In `src/index.ts`:

```typescript
export {
  insertStep,
  removeStep,
  moveStep,
  blockStep,
  unblockStep,
  completeStep,
  startStep,
  type InsertStepOptions,
  type InsertStepResult,
  type RemoveStepResult,
  type MoveStepResult
} from './steps/operations.js';
```

## Acceptance Criteria

- [ ] `insertStep()` adds step at correct position
- [ ] Files are automatically renumbered
- [ ] Step content headers are updated
- [ ] `removeStep()` deletes file and renumbers
- [ ] `moveStep()` reorders correctly
- [ ] Status change functions work correctly
- [ ] No file collisions during renumbering
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/step-operations.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPlan, loadPlan, insertStep, removeStep, moveStep } from '../src/index';
import { rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('Step Operations', () => {
  let testDir: string;
  let planPath: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `riotplan-steps-test-${Date.now()}`);
    const result = await createPlan({
      code: 'test-plan',
      name: 'Test Plan',
      basePath: testDir,
      steps: [
        { title: 'First' },
        { title: 'Second' },
        { title: 'Third' }
      ]
    });
    planPath = result.path;
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true });
  });
  
  describe('insertStep', () => {
    it('should insert at position and renumber', async () => {
      const plan = await loadPlan(planPath);
      
      const result = await insertStep(plan, {
        title: 'New Step',
        position: 2
      });
      
      expect(result.step.number).toBe(2);
      
      // Verify files
      const planDir = join(planPath, 'plan');
      const files = await readdir(planDir);
      expect(files).toContain('01-first.md');
      expect(files).toContain('02-new-step.md');
      expect(files).toContain('03-second.md');
      expect(files).toContain('04-third.md');
    });
    
    it('should append when no position given', async () => {
      const plan = await loadPlan(planPath);
      
      const result = await insertStep(plan, {
        title: 'Appended'
      });
      
      expect(result.step.number).toBe(4);
    });
  });
  
  describe('removeStep', () => {
    it('should remove and renumber', async () => {
      const plan = await loadPlan(planPath);
      
      await removeStep(plan, 2);
      
      const planDir = join(planPath, 'plan');
      const files = await readdir(planDir);
      expect(files.length).toBe(2);
      expect(files).toContain('01-first.md');
      expect(files).toContain('02-third.md');
    });
  });
  
  describe('moveStep', () => {
    it('should move step down', async () => {
      const plan = await loadPlan(planPath);
      
      await moveStep(plan, 1, 3);
      
      const reloaded = await loadPlan(planPath);
      expect(reloaded.steps[0].title).toBe('Second');
      expect(reloaded.steps[2].title).toBe('First');
    });
  });
});
```

## Files Changed

- `riotplan/src/steps/operations.ts` - New file
- `riotplan/src/index.ts` - Export functions
- `riotplan/tests/step-operations.test.ts` - Tests

## Notes

- Renumbering is the complex part; test thoroughly
- Consider adding `splitStep()` and `mergeSteps()` later
- File content updates should preserve formatting

## Dependencies

- Step 01 (Type System Enhancement)
- Step 02 (Plan Loading) - For tests
- Step 03 (Plan Creation) - For tests

## References

- RIOTPLAN_ANALYSIS.md: R3 (Step Operations)

