# Step 02: Create Verification Engine with Enforcement Logic

## Objective

Build the core verification engine that can check acceptance criteria and enforce completion rules based on configuration

## Background

The verification types already exist in src/verification/types.ts, but we need a centralized engine that can check acceptance criteria, evaluate completion status, and apply enforcement rules.

## Tasks

### 1. 02.1

Create src/verification/engine.ts with the core verification engine:

```typescript
export interface VerificationResult {
    isValid: boolean;
    level: 'passed' | 'warning' | 'error';
    messages: string[];
    acceptanceCriteria?: AcceptanceCriterion[];
    artifacts?: string[];
}

export interface VerificationOptions {
    enforcement: 'advisory' | 'interactive' | 'strict';
    checkAcceptanceCriteria: boolean;
    checkArtifacts: boolean;
    force?: boolean;  // --force flag bypass
}

export class VerificationEngine {
    async verifyStepCompletion(
        plan: Plan, 
        stepNumber: number, 
        options: VerificationOptions
    ): Promise<VerificationResult>
    
    private async checkAcceptanceCriteria(step: PlanStep): Promise<AcceptanceCriterion[]>
    private async checkArtifacts(step: PlanStep): Promise<string[]>
    private shouldBlock(result: VerificationResult, options: VerificationOptions): boolean
}
```

The engine consolidates all verification logic and makes enforcement decisions based on configuration.

### 2. 02.2

Implement acceptance criteria parsing logic that reads step markdown files and extracts checkboxes:

```typescript
private async checkAcceptanceCriteria(step: PlanStep): Promise<AcceptanceCriterion[]> {
    const content = await fs.readFile(step.filePath, 'utf-8');
    const criteria: AcceptanceCriterion[] = [];
    
    // Parse markdown checkboxes: - [x] completed, - [ ] pending
    const checkboxRegex = /^\s*-\s*\[([ x])\]\s*(.+)$/gm;
    let match;
    
    while ((match = checkboxRegex.exec(content)) !== null) {
        criteria.push({
            text: match[2].trim(),
            checked: match[1] === 'x',
            stepNumber: step.number
        });
    }
    
    return criteria;
}
```

This leverages the existing AcceptanceCriterion interface and provides concrete checkbox parsing.

### 3. 02.3

Add enforcement logic that determines whether to block, warn, or prompt based on configuration:

```typescript
private shouldBlock(result: VerificationResult, options: VerificationOptions): boolean {
    // --force flag always bypasses
    if (options.force) return false;
    
    // Advisory mode never blocks
    if (options.enforcement === 'advisory') return false;
    
    // Strict mode blocks on any failure
    if (options.enforcement === 'strict' && result.level === 'error') return true;
    
    // Interactive mode handled by caller (prompts user)
    return false;
}
```

This implements the three-level enforcement model from the selected approach.

## Acceptance Criteria

- [ ] VerificationEngine can check acceptance criteria in markdown files
- [ ] Engine correctly implements advisory/interactive/strict enforcement levels
- [ ] Force flag bypasses all verification checks
- [ ] Engine returns structured results with clear messages

## Testing

Unit tests for checkbox parsing, enforcement logic, and integration with existing verification types

## Files Changed

- `src/verification/engine.ts`

## Notes

This is the core engine that powers all verification functionality
