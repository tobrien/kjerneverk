# Creating Plans

This guide covers different ways to create and structure plans in RiotPlan.

## Plan Structure

Every plan consists of:

```
my-plan/
├── SUMMARY.md           # Overview and goals
├── EXECUTION_PLAN.md    # Detailed step breakdown (optional)
├── STATUS.md            # Current state (auto-generated)
├── plan/                # Step files
│   ├── 01-step-one.md
│   ├── 02-step-two.md
│   └── ...
├── feedback/            # Feedback records (optional)
└── evidence/            # Evidence artifacts (optional)
```

## Creating Plans

### Using the CLI

```bash
# Basic plan
npx riotplan plan init my-plan

# With options
npx riotplan plan init my-plan \
    --description "My plan description" \
    --steps 5 \
    --path ./plans
```

### Using Templates

```bash
# List available templates
npx riotplan plan template list

# Create from template
npx riotplan plan template use feature my-feature
```

### Programmatically

```typescript
import { createPlan } from "@riotprompt/riotplan";

const result = await createPlan({
    code: "my-plan",
    name: "My Plan Name",
    basePath: "./plans",
    description: "What this plan accomplishes",
    author: "Your Name",
    steps: [
        { title: "First Step", description: "Initial setup work" },
        { title: "Second Step", description: "Main implementation" },
        { title: "Third Step", description: "Testing and validation" },
    ],
});
```

## Step Files

Each step file should follow this structure:

```markdown
# Step 1: First Step

## Overview

Brief description of what this step accomplishes.

## Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Acceptance Criteria

- Criterion 1
- Criterion 2

## Dependencies

- Requires: (none for first step)

## Notes

Any additional notes or context.
```

## Best Practices

1. **Clear naming**: Use descriptive codes like `user-auth` or `data-migration`
2. **Small steps**: Break large tasks into manageable steps
3. **Dependencies**: Document step dependencies explicitly
4. **Acceptance criteria**: Define what "done" means for each step
5. **Regular updates**: Update STATUS.md as you progress

## Next Steps

- [Using Templates](./templates.md)
- [Managing Dependencies](./dependencies.md)

