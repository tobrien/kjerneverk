# Step 06: STATUS.md Generation

## Objective

Implement STATUS.md generation to produce properly formatted status documents from plan state, enabling automatic updates after step completion.

## Background

STATUS.md is the human-readable, machine-updateable record of plan progress. Generation needs to:

1. Produce consistent, well-formatted markdown
2. Include all standard sections
3. Calculate progress correctly
4. Preserve notes and custom content where possible
5. Support incremental updates (not just full regeneration)

## Tasks

### 1. Create Status Generator Module

Create `src/status/generator.ts`:

```typescript
import type { 
  Plan, 
  PlanState, 
  PlanStep, 
  StatusDocument,
  TaskStatus 
} from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface GenerateStatusOptions {
  /** Preserve existing notes section */
  preserveNotes?: boolean;
  
  /** Existing STATUS.md content (for preservation) */
  existingContent?: string;
  
  /** Include phase progress if phases defined */
  includePhases?: boolean;
  
  /** Date format for timestamps */
  dateFormat?: 'iso' | 'short' | 'long';
}

export function generateStatus(
  plan: Plan,
  options: GenerateStatusOptions = {}
): string {
  // Implementation
}
```

### 2. Implement Date Formatting

```typescript
function formatDate(date: Date | undefined, format: string): string {
  if (!date) return '-';
  
  switch (format) {
    case 'iso':
      return date.toISOString().split('T')[0];
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
    default:
      return date.toISOString().split('T')[0];
  }
}

function getStatusEmoji(status: TaskStatus): string {
  return PLAN_CONVENTIONS.statusEmoji[status] || '⬜';
}

function getStatusDisplay(status: TaskStatus): string {
  const emoji = getStatusEmoji(status);
  const text = status.toUpperCase().replace('_', ' ');
  return `${emoji} ${text}`;
}
```

### 3. Implement Section Generators

```typescript
function generateCurrentStateSection(
  plan: Plan,
  dateFormat: string
): string {
  const { state, steps } = plan;
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = steps.length > 0
    ? Math.round((completedCount / steps.length) * 100)
    : 0;
  
  const currentStep = state.currentStep 
    ? steps.find(s => s.number === state.currentStep)
    : undefined;
  const lastCompleted = state.lastCompletedStep
    ? steps.find(s => s.number === state.lastCompletedStep)
    : undefined;
  
  return `## Current State

| Field | Value |
|-------|-------|
| **Status** | ${getStatusDisplay(state.status)} |
| **Current Step** | ${currentStep ? `${String(currentStep.number).padStart(2, '0')} - ${currentStep.title}` : '-'} |
| **Last Completed** | ${lastCompleted ? `${String(lastCompleted.number).padStart(2, '0')} - ${lastCompleted.title}` : '-'} |
| **Started** | ${formatDate(state.startedAt, dateFormat)} |
| **Last Updated** | ${formatDate(state.lastUpdatedAt, dateFormat)} |
| **Progress** | ${progress}% (${completedCount}/${steps.length} steps) |
`;
}

function generatePhaseProgressSection(plan: Plan): string {
  if (!plan.phases || plan.phases.length === 0) return '';
  
  let content = `## Phase Progress

| Phase | Steps | Status | Progress |
|-------|-------|--------|----------|
`;

  for (const phase of plan.phases) {
    const phaseSteps = plan.steps.filter(s => phase.steps.includes(s.number));
    const completed = phaseSteps.filter(s => s.status === 'completed').length;
    const progress = `${completed}/${phaseSteps.length}`;
    const stepRange = `${String(phase.steps[0]).padStart(2, '0')}-${String(phase.steps[phase.steps.length - 1]).padStart(2, '0')}`;
    
    content += `| **${phase.name}** | ${stepRange} | ${getStatusEmoji(phase.status)} ${phase.status} | ${progress} |\n`;
  }
  
  return content + '\n';
}

function generateStepProgressSection(
  steps: PlanStep[],
  dateFormat: string
): string {
  let content = `## Step Progress

| Step | Name | Status | Started | Completed | Notes |
|------|------|--------|---------|-----------|-------|
`;

  for (const step of steps) {
    const num = String(step.number).padStart(2, '0');
    const started = formatDate(step.startedAt, dateFormat);
    const completed = formatDate(step.completedAt, dateFormat);
    const notes = step.notes || '';
    
    content += `| ${num} | ${step.title} | ${getStatusEmoji(step.status)} | ${started} | ${completed} | ${notes} |\n`;
  }
  
  return content + '\n';
}

function generateBlockersSection(plan: Plan): string {
  const { blockers } = plan.state;
  
  if (blockers.length === 0) {
    return `## Blockers

None currently.

`;
  }
  
  let content = `## Blockers

`;
  for (const blocker of blockers) {
    content += `- ${blocker.description}`;
    if (blocker.affectedSteps.length > 0) {
      content += ` (affects steps: ${blocker.affectedSteps.join(', ')})`;
    }
    content += '\n';
  }
  
  return content + '\n';
}

function generateIssuesSection(plan: Plan): string {
  const { issues } = plan.state;
  
  if (issues.length === 0) {
    return `## Issues

None currently.

`;
  }
  
  let content = `## Issues

`;
  for (const issue of issues) {
    content += `- **${issue.title}**: ${issue.description}\n`;
  }
  
  return content + '\n';
}

function generateNotesSection(
  plan: Plan, 
  existingNotes?: string
): string {
  let notes = existingNotes || '';
  
  return `## Notes

${notes}

`;
}
```

### 4. Implement Main generateStatus Function

```typescript
export function generateStatus(
  plan: Plan,
  options: GenerateStatusOptions = {}
): string {
  const {
    preserveNotes = true,
    existingContent,
    includePhases = true,
    dateFormat = 'short'
  } = options;
  
  // Extract existing notes if preserving
  let existingNotes: string | undefined;
  if (preserveNotes && existingContent) {
    const notesMatch = existingContent.match(
      /## Notes\s*\n([\s\S]*?)(?=\n---|\n##|$)/
    );
    if (notesMatch) {
      existingNotes = notesMatch[1].trim();
    }
  }
  
  // Build document
  let content = `# ${plan.metadata.name} Status

`;
  
  // Current state
  content += generateCurrentStateSection(plan, dateFormat);
  content += '\n';
  
  // Phase progress (if applicable)
  if (includePhases && plan.phases && plan.phases.length > 0) {
    content += generatePhaseProgressSection(plan);
  }
  
  // Step progress
  content += generateStepProgressSection(plan.steps, dateFormat);
  
  // Blockers
  content += generateBlockersSection(plan);
  
  // Issues
  content += generateIssuesSection(plan);
  
  // Notes
  content += generateNotesSection(plan, existingNotes);
  
  // Footer
  content += `---

**Status Legend**:
- ${PLAN_CONVENTIONS.statusEmoji.pending} Pending
- ${PLAN_CONVENTIONS.statusEmoji.in_progress} In Progress
- ${PLAN_CONVENTIONS.statusEmoji.completed} Completed
- ${PLAN_CONVENTIONS.statusEmoji.failed} Failed
- ${PLAN_CONVENTIONS.statusEmoji.blocked} Blocked
- ${PLAN_CONVENTIONS.statusEmoji.skipped} Skipped

*Last updated: ${formatDate(new Date(), dateFormat)}*
`;
  
  return content;
}
```

### 5. Implement Incremental Update Function

```typescript
export interface UpdateStatusOptions {
  /** Step that was completed/updated */
  step?: number;
  
  /** New status for step */
  stepStatus?: TaskStatus;
  
  /** Add blocker */
  addBlocker?: string;
  
  /** Remove blocker by description match */
  removeBlocker?: string;
  
  /** Add issue */
  addIssue?: { title: string; description: string };
  
  /** Add note */
  addNote?: string;
}

export function updateStatus(
  plan: Plan,
  updates: UpdateStatusOptions
): Plan {
  const updatedPlan = { ...plan };
  const updatedState = { ...plan.state };
  const updatedSteps = [...plan.steps];
  
  // Update step status
  if (updates.step !== undefined && updates.stepStatus) {
    const stepIndex = updatedSteps.findIndex(s => s.number === updates.step);
    if (stepIndex >= 0) {
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        status: updates.stepStatus,
        startedAt: updates.stepStatus === 'in_progress' 
          ? new Date() 
          : updatedSteps[stepIndex].startedAt,
        completedAt: updates.stepStatus === 'completed'
          ? new Date()
          : updatedSteps[stepIndex].completedAt
      };
      
      // Update plan state
      if (updates.stepStatus === 'in_progress') {
        updatedState.currentStep = updates.step;
        if (updatedState.status === 'pending') {
          updatedState.status = 'in_progress';
          updatedState.startedAt = new Date();
        }
      } else if (updates.stepStatus === 'completed') {
        updatedState.lastCompletedStep = updates.step;
        
        // Check if all complete
        const allComplete = updatedSteps.every(
          s => s.status === 'completed' || s.status === 'skipped'
        );
        if (allComplete) {
          updatedState.status = 'completed';
          updatedState.completedAt = new Date();
        }
      }
    }
  }
  
  // Add blocker
  if (updates.addBlocker) {
    updatedState.blockers = [
      ...updatedState.blockers,
      {
        id: `blocker-${Date.now()}`,
        description: updates.addBlocker,
        severity: 'medium',
        affectedSteps: [],
        createdAt: new Date()
      }
    ];
  }
  
  // Remove blocker
  if (updates.removeBlocker) {
    updatedState.blockers = updatedState.blockers.filter(
      b => !b.description.includes(updates.removeBlocker!)
    );
  }
  
  // Add issue
  if (updates.addIssue) {
    updatedState.issues = [
      ...updatedState.issues,
      {
        id: `issue-${Date.now()}`,
        title: updates.addIssue.title,
        description: updates.addIssue.description,
        severity: 'medium',
        createdAt: new Date()
      }
    ];
  }
  
  // Update timestamp
  updatedState.lastUpdatedAt = new Date();
  
  // Calculate progress
  const completedCount = updatedSteps.filter(
    s => s.status === 'completed'
  ).length;
  updatedState.progress = updatedSteps.length > 0
    ? Math.round((completedCount / updatedSteps.length) * 100)
    : 0;
  
  return {
    ...updatedPlan,
    steps: updatedSteps,
    state: updatedState
  };
}
```

### 6. Update Index Exports

In `src/index.ts`:

```typescript
export {
  generateStatus,
  updateStatus,
  type GenerateStatusOptions,
  type UpdateStatusOptions
} from './status/generator.js';
```

## Acceptance Criteria

- [ ] `generateStatus()` produces valid STATUS.md
- [ ] Output matches expected format from existing plans
- [ ] Progress calculation is accurate
- [ ] Notes are preserved when updating
- [ ] `updateStatus()` correctly modifies plan state
- [ ] Step status changes trigger appropriate state updates
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/status-generator.test.ts
import { describe, it, expect } from 'vitest';
import { generateStatus, updateStatus, createPlan, loadPlan } from '../src/index';

describe('generateStatus', () => {
  it('should generate valid STATUS.md', async () => {
    const { plan } = await createPlan({
      code: 'test',
      name: 'Test Plan',
      basePath: '/tmp/riotplan-test'
    });
    
    const status = generateStatus(plan);
    
    expect(status).toContain('# Test Plan Status');
    expect(status).toContain('## Current State');
    expect(status).toContain('## Step Progress');
    expect(status).toContain('## Blockers');
    expect(status).toContain('## Issues');
  });
  
  it('should calculate progress correctly', async () => {
    const plan: Plan = {
      // ... minimal plan with 2/4 steps completed
    };
    
    const status = generateStatus(plan);
    expect(status).toContain('50%');
    expect(status).toContain('2/4 steps');
  });
});

describe('updateStatus', () => {
  it('should update step status', () => {
    const plan = { /* ... */ };
    
    const updated = updateStatus(plan, {
      step: 1,
      stepStatus: 'completed'
    });
    
    expect(updated.steps[0].status).toBe('completed');
    expect(updated.state.lastCompletedStep).toBe(1);
  });
  
  it('should add blockers', () => {
    const plan = { /* ... */ };
    
    const updated = updateStatus(plan, {
      addBlocker: 'Waiting on dependency'
    });
    
    expect(updated.state.blockers.length).toBe(1);
  });
});
```

## Files Changed

- `riotplan/src/status/generator.ts` - New file
- `riotplan/src/index.ts` - Export functions
- `riotplan/tests/status-generator.test.ts` - Tests

## Notes

- Generated output should be human-readable and editable
- Consider supporting custom templates in future
- Incremental updates are important for CLI usage

## Dependencies

- Step 01 (Type System Enhancement)
- Step 05 (Status Parsing) - For roundtrip testing

## References

- RIOTPLAN_ANALYSIS.md: R2 (Status Tracking)
- STATUS.md format from existing plans

