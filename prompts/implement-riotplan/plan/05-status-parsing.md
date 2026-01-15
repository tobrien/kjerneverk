# Step 05: STATUS.md Parsing

## Objective

Implement comprehensive parsing of STATUS.md files to extract plan state, step progress, blockers, and issues into structured `PlanState` and `StatusDocument` objects.

## Background

STATUS.md files are the primary source of truth for plan state. They follow a consistent structure:

1. **Current State** section with status, current step, progress
2. **Step Progress** table with per-step status
3. **Blockers** section
4. **Issues** section
5. **Notes** section

The loader in Step 02 does basic parsing; this step provides complete, robust parsing.

## Tasks

### 1. Create Status Parser Module

Create `src/status/parser.ts`:

```typescript
import type { 
  PlanState, 
  StatusDocument, 
  TaskStatus, 
  Blocker, 
  Issue,
  PlanStep 
} from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface ParseStatusOptions {
  /** Steps to cross-reference for status updates */
  steps?: PlanStep[];
}

export interface ParseStatusResult {
  /** Parsed status document */
  document: StatusDocument;
  
  /** Derived plan state */
  state: PlanState;
  
  /** Parsing warnings */
  warnings: string[];
}
```

### 2. Implement Status Section Parsing

```typescript
function parseCurrentState(content: string): StatusDocument['currentState'] {
  const state: StatusDocument['currentState'] = {
    status: 'pending'
  };
  
  // Extract from table format
  const tableMatch = content.match(
    /\|\s*\*\*Status\*\*\s*\|\s*([⬜🔄✅❌⏸️⏭️]?)\s*(\w+)/
  );
  if (tableMatch) {
    state.status = parseStatusEmoji(tableMatch[1]) || 
                   parseStatusText(tableMatch[2]);
  }
  
  // Current step
  const currentMatch = content.match(
    /\|\s*\*\*Current Step\*\*\s*\|\s*([^|]+)/
  );
  if (currentMatch && currentMatch[1].trim() !== '-') {
    state.currentStep = currentMatch[1].trim();
  }
  
  // Last completed
  const lastMatch = content.match(
    /\|\s*\*\*Last Completed\*\*\s*\|\s*([^|]+)/
  );
  if (lastMatch && lastMatch[1].trim() !== '-') {
    state.lastCompleted = lastMatch[1].trim();
  }
  
  // Started date
  const startedMatch = content.match(
    /\|\s*\*\*Started\*\*\s*\|\s*([^|]+)/
  );
  if (startedMatch && startedMatch[1].trim() !== '-') {
    state.startedAt = startedMatch[1].trim();
  }
  
  // Last updated
  const updatedMatch = content.match(
    /\|\s*\*\*Last Updated\*\*\s*\|\s*([^|]+)/
  );
  if (updatedMatch) {
    state.lastUpdated = updatedMatch[1].trim();
  }
  
  return state;
}

function parseStatusEmoji(emoji: string): TaskStatus | null {
  const emojiMap = Object.entries(PLAN_CONVENTIONS.statusEmoji)
    .reduce((acc, [status, e]) => {
      acc[e] = status as TaskStatus;
      return acc;
    }, {} as Record<string, TaskStatus>);
  
  return emojiMap[emoji] || null;
}

function parseStatusText(text: string): TaskStatus {
  const normalized = text.toLowerCase().replace(/[^a-z_]/g, '');
  const valid: TaskStatus[] = [
    'pending', 'in_progress', 'completed', 'failed', 'blocked', 'skipped'
  ];
  
  if (valid.includes(normalized as TaskStatus)) {
    return normalized as TaskStatus;
  }
  
  // Handle variations
  if (normalized.includes('progress') || normalized.includes('inprogress')) {
    return 'in_progress';
  }
  if (normalized.includes('complete') || normalized.includes('done')) {
    return 'completed';
  }
  if (normalized.includes('block')) {
    return 'blocked';
  }
  if (normalized.includes('skip')) {
    return 'skipped';
  }
  if (normalized.includes('fail') || normalized.includes('error')) {
    return 'failed';
  }
  
  return 'pending';
}
```

### 3. Implement Step Progress Parsing

```typescript
function parseStepProgress(content: string): StatusDocument['stepProgress'] {
  const steps: StatusDocument['stepProgress'] = [];
  
  // Find the step progress table
  const tableMatch = content.match(
    /\|\s*Step\s*\|\s*Name\s*\|.*?\n\|[-\s|]+\n([\s\S]*?)(?=\n\n|\n##|$)/i
  );
  
  if (!tableMatch) return steps;
  
  const tableRows = tableMatch[1].split('\n').filter(row => row.trim());
  
  for (const row of tableRows) {
    const cells = row.split('|').map(c => c.trim()).filter(c => c);
    
    if (cells.length >= 3) {
      const step = cells[0];
      const name = cells[1];
      const statusStr = cells[2];
      const started = cells[3] || undefined;
      const completed = cells[4] || undefined;
      const notes = cells[5] || undefined;
      
      // Parse status from emoji or text
      const status = parseStatusEmoji(statusStr) || 
                     parseStatusText(statusStr);
      
      steps.push({
        step,
        name,
        status,
        started: started !== '-' ? started : undefined,
        completed: completed !== '-' ? completed : undefined,
        notes: notes !== '-' ? notes : undefined
      });
    }
  }
  
  return steps;
}
```

### 4. Implement Blockers/Issues Parsing

```typescript
function parseBlockers(content: string): string[] {
  const blockers: string[] = [];
  
  // Find blockers section
  const section = extractSection(content, 'Blockers');
  if (!section || section.includes('None')) return blockers;
  
  // Parse as list items
  const listItems = section.match(/^[-*]\s+(.+)$/gm);
  if (listItems) {
    for (const item of listItems) {
      const text = item.replace(/^[-*]\s+/, '').trim();
      if (text && !text.toLowerCase().includes('none')) {
        blockers.push(text);
      }
    }
  }
  
  return blockers;
}

function parseIssues(content: string): string[] {
  const issues: string[] = [];
  
  // Find issues section
  const section = extractSection(content, 'Issues');
  if (!section || section.includes('None')) return issues;
  
  // Parse as list items
  const listItems = section.match(/^[-*]\s+(.+)$/gm);
  if (listItems) {
    for (const item of listItems) {
      const text = item.replace(/^[-*]\s+/, '').trim();
      if (text && !text.toLowerCase().includes('none')) {
        issues.push(text);
      }
    }
  }
  
  return issues;
}

function parseNotes(content: string): string | undefined {
  const section = extractSection(content, 'Notes');
  if (!section || section.trim() === '') return undefined;
  return section.trim();
}

function extractSection(content: string, name: string): string | undefined {
  const regex = new RegExp(
    `##\\s*${name}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n##|\\n---|\$)`,
    'i'
  );
  const match = content.match(regex);
  return match ? match[1].trim() : undefined;
}
```

### 5. Implement Main parseStatus Function

```typescript
export function parseStatus(
  content: string,
  options: ParseStatusOptions = {}
): ParseStatusResult {
  const warnings: string[] = [];
  
  // Extract title
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown Plan';
  
  // Parse sections
  const currentState = parseCurrentState(content);
  const stepProgress = parseStepProgress(content);
  const blockers = parseBlockers(content);
  const issues = parseIssues(content);
  const notes = parseNotes(content);
  
  // Build document
  const document: StatusDocument = {
    title,
    currentState,
    stepProgress,
    blockers,
    issues,
    notes
  };
  
  // Calculate progress
  const completedSteps = stepProgress.filter(
    s => s.status === 'completed'
  ).length;
  const progress = stepProgress.length > 0
    ? Math.round((completedSteps / stepProgress.length) * 100)
    : 0;
  
  // Build state
  const state: PlanState = {
    status: currentState.status,
    lastUpdatedAt: currentState.lastUpdated 
      ? new Date(currentState.lastUpdated) 
      : new Date(),
    blockers: blockers.map((desc, i) => ({
      id: `blocker-${i + 1}`,
      description: desc,
      severity: 'medium',
      affectedSteps: [],
      createdAt: new Date()
    })),
    issues: issues.map((desc, i) => ({
      id: `issue-${i + 1}`,
      title: desc.substring(0, 50),
      description: desc,
      severity: 'medium',
      createdAt: new Date()
    })),
    progress
  };
  
  // Cross-reference with steps if provided
  if (options.steps) {
    const currentStepNum = extractStepNumber(currentState.currentStep);
    if (currentStepNum) state.currentStep = currentStepNum;
    
    const lastStepNum = extractStepNumber(currentState.lastCompleted);
    if (lastStepNum) state.lastCompletedStep = lastStepNum;
    
    // Validate step count
    if (stepProgress.length !== options.steps.length) {
      warnings.push(
        `Step count mismatch: STATUS.md has ${stepProgress.length}, ` +
        `plan has ${options.steps.length}`
      );
    }
  }
  
  return { document, state, warnings };
}

function extractStepNumber(stepRef?: string): number | undefined {
  if (!stepRef) return undefined;
  const match = stepRef.match(/(\d+)/);
  return match ? parseInt(match[1]) : undefined;
}
```

### 6. Update Index Exports

In `src/index.ts`:

```typescript
export {
  parseStatus,
  type ParseStatusOptions,
  type ParseStatusResult
} from './status/parser.js';
```

## Acceptance Criteria

- [ ] `parseStatus()` correctly parses STATUS.md files
- [ ] Handles both emoji and text status indicators
- [ ] Extracts step progress from tables
- [ ] Parses blockers and issues lists
- [ ] Returns warnings for parsing issues
- [ ] Works with various STATUS.md format variations
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/status-parser.test.ts
import { describe, it, expect } from 'vitest';
import { parseStatus } from '../src/index';

describe('parseStatus', () => {
  const sampleStatus = `# My Plan Status

## Current State

| Field | Value |
|-------|-------|
| **Status** | 🔄 IN_PROGRESS |
| **Current Step** | 03 |
| **Last Completed** | 02 |
| **Started** | 2026-01-10 |
| **Last Updated** | 2026-01-14 |
| **Progress** | 40% (2/5 steps) |

## Step Progress

| Step | Name | Status | Started | Completed | Notes |
|------|------|--------|---------|-----------|-------|
| 01 | Setup | ✅ | 2026-01-10 | 2026-01-10 | |
| 02 | Foundation | ✅ | 2026-01-11 | 2026-01-12 | |
| 03 | Core | 🔄 | 2026-01-13 | - | In progress |
| 04 | Testing | ⬜ | - | - | |
| 05 | Release | ⬜ | - | - | |

## Blockers

- Waiting on dependency X

## Issues

None currently.

## Notes

Additional notes here.
`;

  it('should parse current state', () => {
    const result = parseStatus(sampleStatus);
    expect(result.document.currentState.status).toBe('in_progress');
    expect(result.document.currentState.currentStep).toBe('03');
    expect(result.document.currentState.lastCompleted).toBe('02');
  });
  
  it('should parse step progress', () => {
    const result = parseStatus(sampleStatus);
    expect(result.document.stepProgress.length).toBe(5);
    expect(result.document.stepProgress[0].status).toBe('completed');
    expect(result.document.stepProgress[2].status).toBe('in_progress');
  });
  
  it('should parse blockers', () => {
    const result = parseStatus(sampleStatus);
    expect(result.document.blockers.length).toBe(1);
    expect(result.document.blockers[0]).toContain('dependency X');
  });
  
  it('should calculate progress', () => {
    const result = parseStatus(sampleStatus);
    expect(result.state.progress).toBe(40);
  });
  
  it('should handle missing sections gracefully', () => {
    const minimal = `# Plan Status

## Current State

| Field | Value |
|-------|-------|
| **Status** | ⬜ PENDING |
`;
    
    const result = parseStatus(minimal);
    expect(result.document.currentState.status).toBe('pending');
    expect(result.document.stepProgress).toEqual([]);
    expect(result.warnings.length).toBe(0);
  });
});
```

## Files Changed

- `riotplan/src/status/parser.ts` - New file
- `riotplan/src/index.ts` - Export parseStatus
- `riotplan/tests/status-parser.test.ts` - Tests

## Notes

- Parser is intentionally forgiving of format variations
- STATUS.md files may be hand-edited; parser handles inconsistencies
- Consider supporting YAML frontmatter in future

## Dependencies

- Step 01 (Type System Enhancement)

## References

- RIOTPLAN_ANALYSIS.md: R2 (Status Tracking)
- STATUS.md files in existing kjerneverk plans

