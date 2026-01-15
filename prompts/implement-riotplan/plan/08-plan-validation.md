# Step 08: Plan Validation

## Objective

Implement comprehensive plan validation to verify structure, numbering, dependencies, and content—providing actionable error messages and optional auto-fix capabilities.

## Background

Plans can become invalid through:
- Manual editing errors
- Missing required files
- Step numbering gaps
- Circular dependencies
- Inconsistent status

Validation should:
1. Check all structural requirements
2. Report clear, actionable errors
3. Optionally auto-fix simple issues
4. Support progressive enhancement (partial plans OK)

## Tasks

### 1. Create Validation Module

Create `src/plan/validator.ts`:

```typescript
import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plan, PlanStep } from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface ValidationResult {
  /** Is the plan valid? */
  valid: boolean;
  
  /** Errors (must fix) */
  errors: ValidationError[];
  
  /** Warnings (should fix) */
  warnings: ValidationWarning[];
  
  /** Info (observations) */
  info: ValidationInfo[];
  
  /** Auto-fixable issues */
  fixable: FixableIssue[];
}

export interface ValidationError {
  code: string;
  message: string;
  path?: string;
  step?: number;
}

export interface ValidationWarning {
  code: string;
  message: string;
  path?: string;
  step?: number;
}

export interface ValidationInfo {
  code: string;
  message: string;
}

export interface FixableIssue {
  code: string;
  description: string;
  fix: () => Promise<void>;
}

export interface ValidateOptions {
  /** Check step content */
  validateContent?: boolean;
  
  /** Check dependencies */
  validateDependencies?: boolean;
  
  /** Check STATUS.md consistency */
  validateStatus?: boolean;
  
  /** Strict mode (warnings become errors) */
  strict?: boolean;
}
```

### 2. Implement Structure Validation

```typescript
async function validateStructure(
  planPath: string
): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Check directory exists
  try {
    await access(planPath);
  } catch {
    errors.push({
      code: 'DIR_NOT_FOUND',
      message: `Plan directory not found: ${planPath}`,
      path: planPath
    });
    return { errors, warnings };
  }
  
  // Check for SUMMARY.md
  const summaryPath = join(planPath, PLAN_CONVENTIONS.standardFiles.summary);
  try {
    await access(summaryPath);
  } catch {
    warnings.push({
      code: 'MISSING_SUMMARY',
      message: 'SUMMARY.md not found',
      path: summaryPath
    });
  }
  
  // Check for STATUS.md
  const statusPath = join(planPath, PLAN_CONVENTIONS.standardFiles.status);
  try {
    await access(statusPath);
  } catch {
    warnings.push({
      code: 'MISSING_STATUS',
      message: 'STATUS.md not found',
      path: statusPath
    });
  }
  
  // Check for EXECUTION_PLAN.md
  const execPath = join(planPath, PLAN_CONVENTIONS.standardFiles.executionPlan);
  try {
    await access(execPath);
  } catch {
    warnings.push({
      code: 'MISSING_EXEC_PLAN',
      message: 'EXECUTION_PLAN.md not found',
      path: execPath
    });
  }
  
  // Check for plan/ directory or step files
  const planDir = join(planPath, PLAN_CONVENTIONS.standardDirs.plan);
  try {
    await access(planDir);
    const files = await readdir(planDir);
    const stepFiles = files.filter(f => PLAN_CONVENTIONS.stepPattern.test(f));
    if (stepFiles.length === 0) {
      warnings.push({
        code: 'NO_STEPS',
        message: 'No step files found in plan/ directory'
      });
    }
  } catch {
    // Plan directory doesn't exist; check root for step files
    const rootFiles = await readdir(planPath);
    const stepFiles = rootFiles.filter(f => PLAN_CONVENTIONS.stepPattern.test(f));
    if (stepFiles.length === 0) {
      warnings.push({
        code: 'NO_STEPS',
        message: 'No step files found'
      });
    }
  }
  
  return { errors, warnings };
}
```

### 3. Implement Step Numbering Validation

```typescript
async function validateStepNumbering(
  planPath: string
): Promise<{ 
  errors: ValidationError[]; 
  warnings: ValidationWarning[];
  fixable: FixableIssue[];
}> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const fixable: FixableIssue[] = [];
  
  // Get step files
  const planDir = join(planPath, PLAN_CONVENTIONS.standardDirs.plan);
  let stepFiles: string[] = [];
  
  try {
    const files = await readdir(planDir);
    stepFiles = files.filter(f => PLAN_CONVENTIONS.stepPattern.test(f));
  } catch {
    // Plan dir doesn't exist; check root
    const files = await readdir(planPath);
    stepFiles = files.filter(f => PLAN_CONVENTIONS.stepPattern.test(f));
  }
  
  if (stepFiles.length === 0) return { errors, warnings, fixable };
  
  // Extract numbers
  const numbers: number[] = [];
  for (const file of stepFiles) {
    const match = file.match(PLAN_CONVENTIONS.stepPattern);
    if (match) {
      numbers.push(parseInt(match[1]));
    }
  }
  
  numbers.sort((a, b) => a - b);
  
  // Check for gaps
  for (let i = 0; i < numbers.length; i++) {
    const expected = i + 1;
    if (numbers[i] !== expected) {
      if (numbers[i] > expected) {
        warnings.push({
          code: 'STEP_GAP',
          message: `Gap in step numbering: expected ${expected}, found ${numbers[i]}`,
          step: numbers[i]
        });
        
        // Add fixable
        fixable.push({
          code: 'FIX_STEP_GAP',
          description: `Renumber steps to close gap at ${expected}`,
          fix: async () => {
            // Implement renumbering
          }
        });
      }
    }
  }
  
  // Check for duplicates
  const seen = new Set<number>();
  for (const num of numbers) {
    if (seen.has(num)) {
      errors.push({
        code: 'DUPLICATE_STEP',
        message: `Duplicate step number: ${num}`,
        step: num
      });
    }
    seen.add(num);
  }
  
  // Check doesn't start at 0
  if (numbers[0] === 0) {
    warnings.push({
      code: 'STEP_ZERO',
      message: 'Step numbering should start at 01, not 00'
    });
  }
  
  return { errors, warnings, fixable };
}
```

### 4. Implement Content Validation

```typescript
async function validateStepContent(
  step: PlanStep
): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  try {
    const content = await readFile(step.filePath, 'utf-8');
    
    // Check for title
    if (!content.match(/^#\s+/m)) {
      warnings.push({
        code: 'MISSING_TITLE',
        message: `Step ${step.number} missing title heading`,
        step: step.number,
        path: step.filePath
      });
    }
    
    // Check for objective section
    if (!content.match(/##\s+Objective/i)) {
      warnings.push({
        code: 'MISSING_OBJECTIVE',
        message: `Step ${step.number} missing Objective section`,
        step: step.number
      });
    }
    
    // Check for acceptance criteria
    if (!content.match(/##\s+Acceptance Criteria/i)) {
      warnings.push({
        code: 'MISSING_ACCEPTANCE',
        message: `Step ${step.number} missing Acceptance Criteria section`,
        step: step.number
      });
    }
    
    // Check step number in title matches filename
    const titleMatch = content.match(/^#\s+Step\s+(\d+)/m);
    if (titleMatch) {
      const titleNum = parseInt(titleMatch[1]);
      if (titleNum !== step.number) {
        errors.push({
          code: 'STEP_NUMBER_MISMATCH',
          message: `Step ${step.number} has title "Step ${titleNum}" - mismatch`,
          step: step.number
        });
      }
    }
    
  } catch (e) {
    errors.push({
      code: 'STEP_UNREADABLE',
      message: `Cannot read step file: ${step.filePath}`,
      step: step.number
    });
  }
  
  return { errors, warnings };
}
```

### 5. Implement Dependency Validation

```typescript
function validateDependencies(
  steps: PlanStep[]
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  const stepNumbers = new Set(steps.map(s => s.number));
  
  for (const step of steps) {
    if (!step.dependencies) continue;
    
    for (const dep of step.dependencies) {
      // Check dependency exists
      if (!stepNumbers.has(dep)) {
        errors.push({
          code: 'INVALID_DEPENDENCY',
          message: `Step ${step.number} depends on non-existent step ${dep}`,
          step: step.number
        });
      }
      
      // Check for self-dependency
      if (dep === step.number) {
        errors.push({
          code: 'SELF_DEPENDENCY',
          message: `Step ${step.number} depends on itself`,
          step: step.number
        });
      }
      
      // Check for backward dependency
      if (dep > step.number) {
        warnings.push({
          code: 'FORWARD_DEPENDENCY',
          message: `Step ${step.number} depends on later step ${dep}`,
          step: step.number
        });
      }
    }
  }
  
  // Check for circular dependencies
  const circular = detectCircularDependencies(steps);
  for (const cycle of circular) {
    errors.push({
      code: 'CIRCULAR_DEPENDENCY',
      message: `Circular dependency detected: ${cycle.join(' → ')}`
    });
  }
  
  return { errors, warnings };
}

function detectCircularDependencies(steps: PlanStep[]): number[][] {
  const cycles: number[][] = [];
  const visited = new Set<number>();
  const inStack = new Set<number>();
  const path: number[] = [];
  
  const stepMap = new Map(steps.map(s => [s.number, s]));
  
  function dfs(stepNum: number): boolean {
    if (inStack.has(stepNum)) {
      // Found cycle
      const cycleStart = path.indexOf(stepNum);
      cycles.push([...path.slice(cycleStart), stepNum]);
      return true;
    }
    
    if (visited.has(stepNum)) return false;
    
    visited.add(stepNum);
    inStack.add(stepNum);
    path.push(stepNum);
    
    const step = stepMap.get(stepNum);
    if (step?.dependencies) {
      for (const dep of step.dependencies) {
        dfs(dep);
      }
    }
    
    path.pop();
    inStack.delete(stepNum);
    return false;
  }
  
  for (const step of steps) {
    dfs(step.number);
  }
  
  return cycles;
}
```

### 6. Implement Main validatePlan Function

```typescript
export async function validatePlan(
  planPath: string,
  options: ValidateOptions = {}
): Promise<ValidationResult> {
  const {
    validateContent = true,
    validateDependencies: checkDeps = true,
    validateStatus = true,
    strict = false
  } = options;
  
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
    fixable: []
  };
  
  // Structure validation
  const structure = await validateStructure(planPath);
  result.errors.push(...structure.errors);
  result.warnings.push(...structure.warnings);
  
  // Step numbering
  const numbering = await validateStepNumbering(planPath);
  result.errors.push(...numbering.errors);
  result.warnings.push(...numbering.warnings);
  result.fixable.push(...numbering.fixable);
  
  // Try to load plan for further validation
  try {
    const { loadPlan } = await import('./loader.js');
    const plan = await loadPlan(planPath, { parseStatus: validateStatus });
    
    // Content validation
    if (validateContent) {
      for (const step of plan.steps) {
        const content = await validateStepContent(step);
        result.errors.push(...content.errors);
        result.warnings.push(...content.warnings);
      }
    }
    
    // Dependency validation
    if (checkDeps) {
      const deps = validateDependencies(plan.steps);
      result.errors.push(...deps.errors);
      result.warnings.push(...deps.warnings);
    }
    
    // Info
    result.info.push({
      code: 'PLAN_LOADED',
      message: `Plan "${plan.metadata.name}" loaded with ${plan.steps.length} steps`
    });
    
  } catch (e) {
    result.errors.push({
      code: 'LOAD_FAILED',
      message: `Failed to load plan: ${(e as Error).message}`
    });
  }
  
  // Determine validity
  if (strict) {
    result.valid = result.errors.length === 0 && result.warnings.length === 0;
  } else {
    result.valid = result.errors.length === 0;
  }
  
  return result;
}
```

### 7. Update Index Exports

In `src/index.ts`:

```typescript
export {
  validatePlan,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidateOptions
} from './plan/validator.js';
```

## Acceptance Criteria

- [ ] `validatePlan()` checks all structural requirements
- [ ] Step numbering issues are detected
- [ ] Content validation catches missing sections
- [ ] Circular dependencies are detected
- [ ] Fixable issues are identified
- [ ] Clear, actionable error messages
- [ ] Works with partial/incomplete plans
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/validator.test.ts
import { describe, it, expect } from 'vitest';
import { validatePlan } from '../src/index';
import { join } from 'node:path';

describe('validatePlan', () => {
  const fixturesPath = join(__dirname, 'fixtures');
  
  it('should pass valid plan', async () => {
    const result = await validatePlan(join(fixturesPath, 'valid-plan'));
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
  
  it('should detect missing files', async () => {
    const result = await validatePlan(join(fixturesPath, 'minimal-plan'));
    expect(result.warnings.some(w => w.code === 'MISSING_STATUS')).toBe(true);
  });
  
  it('should detect step numbering gaps', async () => {
    const result = await validatePlan(join(fixturesPath, 'plan-with-gaps'));
    expect(result.warnings.some(w => w.code === 'STEP_GAP')).toBe(true);
  });
  
  it('should detect circular dependencies', async () => {
    const result = await validatePlan(join(fixturesPath, 'circular-deps'));
    expect(result.errors.some(e => e.code === 'CIRCULAR_DEPENDENCY')).toBe(true);
  });
});
```

## Files Changed

- `riotplan/src/plan/validator.ts` - New file
- `riotplan/src/index.ts` - Export validatePlan
- `riotplan/tests/validator.test.ts` - Tests
- `riotplan/tests/fixtures/` - Additional test plans

## Notes

- Progressive enhancement: partial plans are OK, just warn
- Consider adding `--fix` capability to auto-fix issues
- Validation should be fast for large plans

## Dependencies

- Step 01 (Type System Enhancement)
- Step 02 (Plan Loading)

## References

- RIOTPLAN_ANALYSIS.md: R1 (Plan Management - validate)

