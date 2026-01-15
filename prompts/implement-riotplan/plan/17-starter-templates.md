# Step 17: Starter Templates

## Objective

Ship built-in templates for common scenarios, solving the "blank slate problem" that kills adoption.

## Background

From RIOTPLAN_ANALYSIS.md:

> New users staring at empty files don't know what a good plan looks like. Templates:
> - Lower barrier to entry (start immediately)
> - Encode best practices (learn by example)
> - Reduce decision fatigue (structure is provided)

## Tasks

### 1. Create Template Structure

```typescript
export interface PlanTemplate {
  /** Template ID */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Template category */
  category: 'development' | 'content' | 'research' | 'general';
  
  /** Default phases */
  phases?: Array<{
    name: string;
    description: string;
    stepTitles: string[];
  }>;
  
  /** Default steps (if no phases) */
  steps?: Array<{
    title: string;
    description: string;
  }>;
  
  /** SUMMARY.md template */
  summaryTemplate: string;
  
  /** Step content template */
  stepTemplate: string;
}
```

### 2. Implement Built-in Templates

| Template | Use Case | Phases/Steps |
|----------|----------|--------------|
| `feature` | New feature | Research → Design → Implement → Test → Deploy |
| `bugfix` | Bug fix | Reproduce → Investigate → Fix → Verify |
| `refactor` | Refactoring | Audit → Plan → Execute → Verify |
| `security` | Security work | Assess → Identify → Remediate → Verify |
| `migration` | Migration | Analyze → Plan → Execute → Validate → Cleanup |
| `research` | Research | Question → Gather → Analyze → Synthesize |
| `content` | Blog/docs | Brainstorm → Outline → Draft → Edit → Publish |
| `blank` | Empty | No pre-defined structure |

### 3. Create Templates Package

Create `riotplan-templates/`:

```
riotplan-templates/
├── src/
│   ├── index.ts
│   ├── templates/
│   │   ├── feature.ts
│   │   ├── bugfix.ts
│   │   ├── refactor.ts
│   │   ├── security.ts
│   │   ├── migration.ts
│   │   ├── research.ts
│   │   ├── content.ts
│   │   └── blank.ts
│   └── utils.ts
├── package.json
└── ...
```

### 4. Example Template (feature.ts)

```typescript
export const featureTemplate: PlanTemplate = {
  id: 'feature',
  name: 'Feature Development',
  description: 'Plan for developing a new feature',
  category: 'development',
  
  phases: [
    {
      name: 'Research',
      description: 'Understand requirements and constraints',
      stepTitles: ['Requirements Gathering', 'Technical Research']
    },
    {
      name: 'Design',
      description: 'Design the solution',
      stepTitles: ['Architecture Design', 'API Design']
    },
    {
      name: 'Implementation',
      description: 'Build the feature',
      stepTitles: ['Core Implementation', 'Integration']
    },
    {
      name: 'Verification',
      description: 'Verify it works',
      stepTitles: ['Testing', 'Documentation', 'Release']
    }
  ],
  
  summaryTemplate: `# {{name}}

## Overview

{{description}}

## Goals

1. Goal 1
2. Goal 2

## Success Criteria

- [ ] Feature is functional
- [ ] Tests pass
- [ ] Documentation updated
`,
  
  stepTemplate: `# Step {{number}}: {{title}}

## Objective

{{description}}

## Tasks

- [ ] Task 1
- [ ] Task 2

## Acceptance Criteria

- [ ] Criterion 1
`
};
```

### 5. Integrate with Plan Creation

Update `createPlan()`:

```typescript
export async function createPlan(
  config: CreatePlanConfig & { template?: string }
): Promise<CreatePlanResult> {
  const template = config.template 
    ? await getTemplate(config.template)
    : undefined;
  
  // Use template structure if provided
  const steps = template?.phases
    ? flattenPhaseSteps(template.phases)
    : config.steps;
  
  // Generate files using template content
  // ...
}
```

## Acceptance Criteria

- [ ] All 8 templates implemented
- [ ] Templates export from package
- [ ] `riotplan plan init -t feature` uses template
- [ ] Template content is well-written and useful
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan-templates/` - New package
- `riotplan/src/plan/creator.ts` - Template integration

## Dependencies

- Step 03 (Plan Creation)

## Notes

- Templates should be genuinely useful, not placeholder text
- Consider allowing user-defined templates later

