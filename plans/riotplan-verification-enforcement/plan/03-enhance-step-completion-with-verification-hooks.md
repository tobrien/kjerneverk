# Step 03: Enhance Step Completion with Verification Hooks

## Objective

Integrate verification engine into the step completion flow with proper error handling and user interaction

## Background

The current completeStep() function in src/steps/operations.ts simply sets status without validation. We need to add verification while maintaining the existing API and behavior.

## Tasks

### 1. 03.1

Enhance the completeStep function in src/steps/operations.ts to integrate verification:

```typescript
export async function completeStep(
    plan: Plan,
    stepNumber: number,
    notes?: string,
    options?: { force?: boolean; skipVerification?: boolean }
): Promise<PlanStep> {
    const step = plan.steps.find((s) => s.number === stepNumber);
    if (!step) {
        throw new Error(`Step ${stepNumber} not found`);
    }
    
    // Load configuration
    const config = await loadConfig(plan.metadata.path);
    const verificationConfig = config.verification || {};
    
    // Skip verification if disabled or requested
    if (!options?.skipVerification && verificationConfig.checkAcceptanceCriteria) {
        const engine = new VerificationEngine();
        const result = await engine.verifyStepCompletion(plan, stepNumber, {
            ...verificationConfig,
            force: options?.force
        });
        
        if (engine.shouldBlock(result, verificationConfig)) {
            throw new VerificationError(result.messages.join('\n'));
        }
    }
    
    return {
        ...step,
        status: "completed",
        completedAt: new Date(),
        notes,
    };
}
```

This maintains backward compatibility while adding verification as an opt-in enhancement.

### 2. 03.2

Create src/verification/errors.ts with custom error types:

```typescript
export class VerificationError extends Error {
    constructor(
        message: string,
        public details: VerificationResult
    ) {
        super(message);
        this.name = 'VerificationError';
    }
}

export class AcceptanceCriteriaError extends VerificationError {
    constructor(uncheckedCriteria: AcceptanceCriterion[]) {
        const message = `Step has ${uncheckedCriteria.length} unchecked acceptance criteria`;
        super(message, {
            isValid: false,
            level: 'error',
            messages: uncheckedCriteria.map(c => `- [ ] ${c.text}`),
            acceptanceCriteria: uncheckedCriteria
        });
    }
}
```

Custom errors provide structured information for CLI handling and user feedback.

### 3. 03.3

Add automatic retrospective generation when transitioning to completed state. Create src/retrospective/auto-generator.ts:

```typescript
export async function generateStepRetrospective(
    plan: Plan, 
    step: PlanStep, 
    config: RiotPlanConfig
): Promise<void> {
    if (!config.verification?.autoRetrospective) return;
    
    // Check if this completes the entire plan
    const allStepsComplete = plan.steps.every(s => 
        s.status === 'completed' || s.status === 'skipped'
    );
    
    if (allStepsComplete) {
        // Generate plan-level retrospective
        const retrospective = await generateRetrospective(plan);
        await writeRetrospective(plan.metadata.path, retrospective);
    }
}
```

This leverages the existing retrospective generation system but adds automatic triggering.

## Acceptance Criteria

- [ ] completeStep() integrates verification without breaking existing API
- [ ] Verification errors provide clear, actionable messages
- [ ] Force flag bypasses verification as expected
- [ ] Automatic retrospectives generate when plans complete
- [ ] Performance impact is minimal (verification cached where possible)

## Testing

Integration tests for step completion with verification enabled/disabled, error handling, and retrospective generation

## Files Changed

- `src/steps/operations.ts`
- `src/verification/errors.ts`
- `src/retrospective/auto-generator.ts`

## Notes

This step integrates verification into the core workflow while maintaining backward compatibility
