# Getting Started with RiotPlan

This guide will help you get started with RiotPlan for managing your AI-assisted workflows.

## Installation

```bash
npm install @riotprompt/riotplan @riotprompt/riotplan-cli
```

## Creating Your First Plan

### Using the CLI

The easiest way to create a plan is using the CLI:

```bash
# Create a basic plan
npx riotplan plan init my-first-plan

# Create from a template
npx riotplan plan template use feature my-feature
```

### Programmatically

```typescript
import { createPlan } from "@riotprompt/riotplan";

const result = await createPlan({
    code: "my-plan",
    name: "My First Plan",
    basePath: "./plans",
    description: "Learning RiotPlan",
    steps: [
        { title: "Setup", description: "Initial setup" },
        { title: "Implementation", description: "Core work" },
        { title: "Testing", description: "Verify everything" },
    ],
});

console.log(`Plan created at: ${result.path}`);
```

## Loading a Plan

```typescript
import { loadPlan } from "@riotprompt/riotplan";

const plan = await loadPlan("./plans/my-plan");

console.log(`Plan: ${plan.metadata.name}`);
console.log(`Status: ${plan.state.status}`);
console.log(`Progress: ${plan.state.progress}%`);
```

## Working with Steps

### Listing Steps

```typescript
for (const step of plan.steps) {
    console.log(`${step.number}. ${step.title} - ${step.status}`);
}
```

### Updating Step Status

```typescript
import { startStep, completeStep } from "@riotprompt/riotplan";

// Start working on step 1
const started = await startStep(plan, 1);

// ... do the work ...

// Mark as complete
const completed = await completeStep(plan, 1);
```

## Validating Plans

```typescript
import { validatePlan } from "@riotprompt/riotplan";

const result = await validatePlan(plan);

if (result.valid) {
    console.log("Plan is valid!");
} else {
    for (const error of result.errors) {
        console.error(`${error.code}: ${error.message}`);
    }
}
```

## Next Steps

- [Creating Plans](./creating-plans.md) - Detailed plan creation guide
- [Using Templates](./templates.md) - Work with plan templates
- [Dependencies](./dependencies.md) - Manage step dependencies

