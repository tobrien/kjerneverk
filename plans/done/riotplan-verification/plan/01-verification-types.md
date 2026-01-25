# Step 01: Verification Types

## Objective

Define the type system for verification results, criteria, and reports.

## Background

Verification needs consistent types for:
- Verification criteria (must/should/could)
- Coverage results
- Completion status
- Gap reporting

## Tasks

### 1.1 Create Verification Types

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/verification/types.ts`:

```typescript
/**
 * Priority level for verification criteria
 */
export type CriteriaPriority = "must" | "should" | "could";

/**
 * Status of a verification criterion
 */
export type CriteriaStatus = "covered" | "partial" | "missing" | "unknown";

/**
 * A single verification criterion extracted from analysis
 */
export interface VerificationCriterion {
    id: string;
    text: string;
    priority: CriteriaPriority;
    source: string;  // File/section it came from
    lineNumber?: number;
}

/**
 * Result of checking a single criterion
 */
export interface CriterionResult {
    criterion: VerificationCriterion;
    status: CriteriaStatus;
    matchedSteps: number[];  // Step numbers that address this
    notes?: string;
}

/**
 * Coverage report for analysis → plan verification
 */
export interface CoverageReport {
    /** Total criteria checked */
    totalCriteria: number;
    
    /** Fully covered criteria */
    covered: CriterionResult[];
    
    /** Partially covered criteria */
    partial: CriterionResult[];
    
    /** Missing criteria */
    missing: CriterionResult[];
    
    /** Coverage by priority */
    byPriority: {
        must: { total: number; covered: number; partial: number; missing: number };
        should: { total: number; covered: number; partial: number; missing: number };
        could: { total: number; covered: number; partial: number; missing: number };
    };
    
    /** Overall coverage percentage (weighted by priority) */
    coverageScore: number;
    
    /** Generated verification questions */
    questions: string[];
}

/**
 * Step completion status
 */
export type StepCompletionStatus = 
    | "complete"      // All acceptance criteria met
    | "partial"       // Some criteria met
    | "incomplete"    // Marked done but criteria not met
    | "pending"       // Not started
    | "skipped";      // Intentionally skipped

/**
 * Acceptance criterion from a step file
 */
export interface AcceptanceCriterion {
    text: string;
    checked: boolean;
    stepNumber: number;
}

/**
 * Result of checking step completion
 */
export interface StepCompletionResult {
    stepNumber: number;
    stepTitle: string;
    status: StepCompletionStatus;
    acceptanceCriteria: AcceptanceCriterion[];
    markedStatus: string;  // What STATUS.md says
    notes?: string;
}

/**
 * Completion report for plan → execution verification
 */
export interface CompletionReport {
    /** Total steps */
    totalSteps: number;
    
    /** Steps by completion status */
    complete: StepCompletionResult[];
    partial: StepCompletionResult[];
    incomplete: StepCompletionResult[];
    pending: StepCompletionResult[];
    
    /** Overall completion percentage */
    completionScore: number;
    
    /** Outstanding items */
    outstandingItems: string[];
}

/**
 * Full verification report
 */
export interface VerificationReport {
    planPath: string;
    timestamp: Date;
    
    /** Analysis → Plan coverage (if analysis exists) */
    coverage?: CoverageReport;
    
    /** Plan → Execution completion */
    completion?: CompletionReport;
    
    /** Overall health score (0-100) */
    healthScore: number;
    
    /** Summary messages */
    summary: string[];
    
    /** Recommendations */
    recommendations: string[];
}
```

### 1.2 Create Verification Constants

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/verification/constants.ts`:

```typescript
/**
 * Weight multipliers for coverage scoring by priority
 */
export const PRIORITY_WEIGHTS = {
    must: 1.0,
    should: 0.7,
    could: 0.3,
} as const;

/**
 * Patterns for detecting criteria in markdown
 */
export const CRITERIA_PATTERNS = {
    /** Checkbox item: - [ ] or - [x] */
    checkbox: /^[-*]\s*\[([x ])\]\s*(.+)$/gm,
    
    /** Section headers for criteria */
    mustHaveHeader: /^###?\s*Must\s+Have/i,
    shouldHaveHeader: /^###?\s*Should\s+Have/i,
    couldHaveHeader: /^###?\s*Could\s+Have/i,
    
    /** Verification criteria section */
    verificationSection: /^##\s*Verification\s+Criteria/im,
} as const;

/**
 * Minimum scores for "healthy" status
 */
export const HEALTH_THRESHOLDS = {
    coverage: {
        good: 80,
        warning: 60,
        critical: 40,
    },
    completion: {
        good: 90,
        warning: 70,
        critical: 50,
    },
} as const;
```

### 1.3 Export Verification Module

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/verification/index.ts`:

```typescript
export * from "./types.js";
export * from "./constants.js";
```

## Acceptance Criteria

- [ ] All verification types defined
- [ ] Priority levels defined (must/should/could)
- [ ] Coverage report structure defined
- [ ] Completion report structure defined
- [ ] Constants for weights and patterns
- [ ] TypeScript compiles without errors

## Testing

```typescript
describe("Verification Types", () => {
    it("should allow creating a coverage report", () => {
        const report: CoverageReport = {
            totalCriteria: 10,
            covered: [],
            partial: [],
            missing: [],
            byPriority: {
                must: { total: 5, covered: 4, partial: 1, missing: 0 },
                should: { total: 3, covered: 2, partial: 0, missing: 1 },
                could: { total: 2, covered: 1, partial: 0, missing: 1 },
            },
            coverageScore: 85,
            questions: [],
        };
        expect(report.coverageScore).toBe(85);
    });
});
```

## Files Changed

- `riotplan/src/verification/types.ts` (new)
- `riotplan/src/verification/constants.ts` (new)
- `riotplan/src/verification/index.ts` (new)

## Notes

These types form the foundation for the verification system. The priority-weighted scoring ensures "must have" criteria count more than "nice to have" ones.
