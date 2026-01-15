# Step 01: Type System Enhancement

## Objective

Extend the existing type definitions in `@riotprompt/riotplan` to support feedback capture, evidence tracking, embedded versioning, and the full plan lifecycle defined in RIOTPLAN_ANALYSIS.md.

## Background

The existing `src/types.ts` in riotplan provides a solid foundation with types for:
- `Plan`, `PlanStep`, `PlanPhase`, `PlanState`
- `Blocker`, `Issue`
- `StatusDocument`, `ExecutionPlanDocument`
- `PLAN_CONVENTIONS`

However, the analysis identified additional requirements:
- Feedback records for deliberation capture
- Evidence tracking for inception phase materials
- Revision/version history embedded in plans
- Contexts (work, personal, etc.)
- Cross-plan relationships and spawning

## Tasks

### 1. Add Feedback Types

```typescript
// Feedback record for deliberation capture
export interface FeedbackRecord {
  /** Unique identifier (e.g., "001", "002") */
  id: string;
  
  /** Title/subject of the feedback */
  title: string;
  
  /** When created */
  createdAt: Date;
  
  /** Participants in the discussion */
  participants: FeedbackParticipant[];
  
  /** Platform where feedback occurred */
  platform: FeedbackPlatform;
  
  /** Plan version this feedback relates to */
  planVersion?: string;
  
  /** Related file references (file:lines) */
  context?: FeedbackContext[];
  
  /** What was proposed before feedback */
  proposed?: string;
  
  /** The feedback given */
  feedback: string;
  
  /** Discussion/debate content */
  discussion?: string;
  
  /** Resolution/outcome */
  resolution?: string;
  
  /** Changes made as a result */
  changes?: string[];
  
  /** Open questions remaining */
  openQuestions?: string[];
  
  /** Filename (e.g., "001-initial-review.md") */
  filename: string;
}

export interface FeedbackParticipant {
  name: string;
  type: 'human' | 'ai';
  model?: string; // e.g., "claude-sonnet-4-20250514"
}

export type FeedbackPlatform = 
  | 'cursor'
  | 'chatgpt'
  | 'slack'
  | 'email'
  | 'meeting'
  | 'voice'
  | 'document'
  | 'other';

export interface FeedbackContext {
  file: string;
  startLine?: number;
  endLine?: number;
  content?: string;
}
```

### 2. Add Evidence Types

```typescript
// Evidence for inception phase
export interface EvidenceRecord {
  /** Unique identifier */
  id: string;
  
  /** Evidence type */
  type: EvidenceType;
  
  /** Title/description */
  title: string;
  
  /** When gathered */
  createdAt: Date;
  
  /** Source of evidence */
  source?: string;
  
  /** Filename */
  filename: string;
  
  /** Summary of key findings */
  summary?: string;
  
  /** Tags for categorization */
  tags?: string[];
}

export type EvidenceType = 
  | 'case-study'      // what-happened-in-*.md
  | 'research'        // research-*.md
  | 'analysis'        // analysis-*.md
  | 'example'         // example-*.md
  | 'external-review' // External AI review
  | 'reference';      // Reference material
```

### 3. Add Revision/History Types

```typescript
// Embedded version tracking
export interface PlanRevision {
  /** Version string (e.g., "0.1", "0.2") */
  version: string;
  
  /** When this revision was created */
  createdAt: Date;
  
  /** Commit message/description */
  message?: string;
  
  /** Author */
  author?: string;
  
  /** Feedback record that triggered this revision */
  feedbackId?: string;
}

export interface PlanHistory {
  /** All revisions in order */
  revisions: PlanRevision[];
  
  /** Current version */
  currentVersion: string;
  
  /** Milestones (explicit cleanup points) */
  milestones?: PlanMilestone[];
}

export interface PlanMilestone {
  name: string;
  version: string;
  createdAt: Date;
  description?: string;
}
```

### 4. Add Context Types

```typescript
// Plan contexts (work, personal, etc.)
export interface PlanContext {
  /** Context identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Parent context (for hierarchy) */
  parent?: string;
  
  /** Default for this directory? */
  isDefault?: boolean;
}

export type ContextId = string; // e.g., "work", "personal", "work/kjerneverk"
```

### 5. Add Cross-Plan Relationship Types

```typescript
// Cross-plan dependencies and spawning
export interface PlanRelationship {
  /** Type of relationship */
  type: RelationshipType;
  
  /** Related plan path */
  planPath: string;
  
  /** Specific step(s) involved */
  steps?: number[];
  
  /** Reason for relationship */
  reason?: string;
  
  /** When established */
  createdAt: Date;
}

export type RelationshipType = 
  | 'spawned-from'   // This plan was spawned from another
  | 'spawned'        // This plan spawned another
  | 'blocks'         // This plan blocks another
  | 'blocked-by'     // This plan is blocked by another
  | 'related';       // General relationship
```

### 6. Extend Existing Types

Update `Plan` interface:

```typescript
export interface Plan {
  // ... existing fields ...
  
  /** Feedback records */
  feedback?: FeedbackRecord[];
  
  /** Evidence files */
  evidence?: EvidenceRecord[];
  
  /** Revision history */
  history?: PlanHistory;
  
  /** Context assignment */
  context?: ContextId;
  
  /** Relationships to other plans */
  relationships?: PlanRelationship[];
}
```

Update `PlanFiles` interface:

```typescript
export interface PlanFiles {
  // ... existing fields ...
  
  /** Feedback directory files */
  feedbackDir?: string;
  feedbackFiles?: string[];
  
  /** Evidence directory files */
  evidenceDir?: string;
  evidenceFiles?: string[];
  
  /** History directory */
  historyDir?: string;
  
  /** CHANGELOG.md */
  changelog?: string;
}
```

### 7. Add Plan Status Constants

```typescript
// Expand PLAN_CONVENTIONS
export const PLAN_CONVENTIONS = {
  // ... existing ...
  
  standardFiles: {
    // ... existing ...
    changelog: "CHANGELOG.md",
  },
  
  standardDirs: {
    // ... existing ...
    feedback: "feedback",
    evidence: "evidence",
    history: ".history",
  },
  
  feedbackPattern: /^(\d{3})-(.+)\.md$/,
  evidencePattern: /^(what-happened-|research-|analysis-|example-)(.+)\.md$/,
} as const;
```

## Acceptance Criteria

- [ ] All new types are defined in `src/types.ts`
- [ ] Types are exported from `src/index.ts`
- [ ] TypeScript compiles without errors
- [ ] JSDoc comments on all public types
- [ ] Types align with RIOTPLAN_ANALYSIS.md requirements (R9, R10, R14, R19)
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/types.test.ts
import { describe, it, expect } from 'vitest';
import type { 
  FeedbackRecord, 
  EvidenceRecord, 
  PlanRevision,
  PlanRelationship 
} from '../src/types';

describe('Extended Types', () => {
  it('should allow creating a FeedbackRecord', () => {
    const feedback: FeedbackRecord = {
      id: '001',
      title: 'Initial Review',
      createdAt: new Date(),
      participants: [
        { name: 'Tim', type: 'human' },
        { name: 'Claude', type: 'ai', model: 'claude-sonnet-4-20250514' }
      ],
      platform: 'cursor',
      feedback: 'Consider adding feedback capture',
      filename: '001-initial-review.md'
    };
    expect(feedback.id).toBe('001');
  });
  
  // ... more tests
});
```

## Files Changed

- `riotplan/src/types.ts` - Extended with new types
- `riotplan/src/index.ts` - Export new types
- `riotplan/tests/types.test.ts` - Type tests

## Notes

- Keep backward compatibility with existing types
- Consider creating separate files if types.ts grows too large
- These types will be used by feedback capture (Step 04) and status parsing (Step 05)

## References

- RIOTPLAN_ANALYSIS.md: Part 1 (Plan Structure), R9, R10, R14, R19
- Existing `riotplan/src/types.ts`

