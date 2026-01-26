# Step 22: Retrospectives

## Objective

Implement completion retrospectives: generate RETROSPECTIVE.md and OUTCOME.md when plans complete, capturing lessons learned.

## Background

From RIOTPLAN_ANALYSIS.md (R27):

> Plans shouldn't just end—they should teach.

Completion is an opportunity to learn:
1. What actually happened vs. what was planned
2. What worked well that should be repeated
3. What was difficult that future plans should avoid
4. How estimates compared to reality

## Tasks

### 1. Define Retrospective Structure

```typescript
export interface Retrospective {
  /** When plan started */
  startDate: Date;
  
  /** When plan completed */
  endDate: Date;
  
  /** Planned vs actual duration */
  duration: {
    planned?: string;
    actual: string;
  };
  
  /** Phase reflections */
  phases: Array<{
    name: string;
    whatWorked: string[];
    whatWasDifficult: string[];
    keyDecisions: string[];
  }>;
  
  /** Overall reflection */
  overall: {
    whatWouldWeDoDifferently: string[];
    recommendationsForSimilarPlans: string[];
  };
  
  /** Key decisions extracted from feedback */
  keyDecisions: Array<{
    feedbackId: string;
    summary: string;
    outcome: string;
  }>;
}

export interface Outcome {
  /** What was delivered */
  deliverables: string[];
  
  /** Artifacts produced */
  artifacts: Array<{
    name: string;
    type: string;
    location: string;
  }>;
  
  /** Metrics */
  metrics?: {
    stepsCompleted: number;
    stepsSkipped: number;
    feedbackRecords: number;
    revisionsCount: number;
  };
}
```

### 2. Implement Retrospective Generation

```typescript
export async function generateRetrospective(
  plan: Plan,
  options?: { interactive?: boolean }
): Promise<Retrospective> {
  const retro: Retrospective = {
    startDate: plan.state.startedAt || new Date(),
    endDate: plan.state.completedAt || new Date(),
    duration: {
      actual: calculateDuration(plan.state.startedAt, plan.state.completedAt)
    },
    phases: [],
    overall: {
      whatWouldWeDoDifferently: [],
      recommendationsForSimilarPlans: []
    },
    keyDecisions: extractKeyDecisions(plan.feedback || [])
  };
  
  // Group steps by phase if phases exist
  if (plan.phases) {
    for (const phase of plan.phases) {
      retro.phases.push({
        name: phase.name,
        whatWorked: [],
        whatWasDifficult: [],
        keyDecisions: []
      });
    }
  }
  
  // If interactive, prompt for reflections
  if (options?.interactive) {
    await promptForReflections(retro);
  }
  
  return retro;
}

function extractKeyDecisions(feedback: FeedbackRecord[]): Retrospective['keyDecisions'] {
  return feedback
    .filter(f => f.resolution) // Has a resolution
    .map(f => ({
      feedbackId: f.id,
      summary: f.title,
      outcome: f.resolution!
    }));
}
```

### 3. Generate Markdown Files

```typescript
export function generateRetrospectiveMd(retro: Retrospective): string {
  return `# Retrospective

## Overview

- **Started**: ${formatDate(retro.startDate)}
- **Completed**: ${formatDate(retro.endDate)}
- **Duration**: ${retro.duration.actual}${retro.duration.planned ? ` (planned: ${retro.duration.planned})` : ''}

## Phase Reflections

${retro.phases.map(phase => `
### ${phase.name}

**What worked:**
${phase.whatWorked.map(w => `- ${w}`).join('\n') || '- (none noted)'}

**What was difficult:**
${phase.whatWasDifficult.map(d => `- ${d}`).join('\n') || '- (none noted)'}

**Key decisions:**
${phase.keyDecisions.map(d => `- ${d}`).join('\n') || '- (none noted)'}
`).join('\n')}

## Overall Reflection

### What Would We Do Differently?

${retro.overall.whatWouldWeDoDifferently.map(w => `- ${w}`).join('\n') || '- (none noted)'}

### Recommendations for Similar Plans

${retro.overall.recommendationsForSimilarPlans.map(r => `- ${r}`).join('\n') || '- (none noted)'}

## Key Decisions Made

*Extracted from feedback records*

${retro.keyDecisions.map(d => `
### ${d.summary}
- **Feedback**: ${d.feedbackId}
- **Outcome**: ${d.outcome}
`).join('\n')}
`;
}

export function generateOutcomeMd(outcome: Outcome): string {
  return `# Outcome

## Deliverables

${outcome.deliverables.map(d => `- ${d}`).join('\n')}

## Artifacts Produced

| Name | Type | Location |
|------|------|----------|
${outcome.artifacts.map(a => `| ${a.name} | ${a.type} | ${a.location} |`).join('\n')}

## Metrics

- Steps completed: ${outcome.metrics?.stepsCompleted || 'N/A'}
- Steps skipped: ${outcome.metrics?.stepsSkipped || 'N/A'}
- Feedback records: ${outcome.metrics?.feedbackRecords || 'N/A'}
- Plan revisions: ${outcome.metrics?.revisionsCount || 'N/A'}
`;
}
```

### 4. CLI Command

```bash
$ riotplan complete --reflect

Completing: my-plan

Step 1: Generate Retrospective
  Enter reflections for each phase...
  
Phase: Research
  What worked well? > Using deep research for patterns
  What was difficult? > Scope kept expanding
  
Phase: Implementation
  What worked well? > Clear step boundaries
  What was difficult? > Integration challenges

Overall:
  What would you do differently? > Start with clearer scope
  Recommendations? > Always define integration points early

Step 2: Generate Outcome
  Deliverables? > Authentication module, API endpoints, documentation

✓ Created: RETROSPECTIVE.md
✓ Created: OUTCOME.md
✓ Plan marked complete
```

## Acceptance Criteria

- [ ] `generateRetrospective()` extracts key decisions
- [ ] Interactive mode prompts for reflections
- [ ] RETROSPECTIVE.md is well-formatted
- [ ] OUTCOME.md captures deliverables
- [ ] `riotplan complete --reflect` runs full flow
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan/src/completion/retrospective.ts` - New module
- `riotplan/src/completion/outcome.ts` - New module
- `riotplan-cli/src/commands/complete.ts` - Enhanced completion

## Dependencies

- Step 04 (Feedback Capture) - Extract decisions
- Step 06 (Status Generation) - Mark complete

