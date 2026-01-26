# Step 13: Internal Dependencies

## Objective

Implement within-plan dependency tracking: steps can depend on other steps, and the system validates and respects these dependencies.

## Background

Steps often have dependencies: Step 5 can't start until Steps 1-4 are complete. This step implements:

- Dependency declaration in step files
- Dependency validation (no circular, valid references)
- Status propagation (blocked if dependency blocked)
- "Ready to execute" calculation

## Tasks

### 1. Add Dependency Parsing to Step Loading

Extend step loading to parse dependency declarations from step file headers:

```markdown
# Step 05: Implementation

**Dependencies**: 01, 02, 03, 04
```

### 2. Implement Dependency Validation

```typescript
export function validateDependencies(steps: PlanStep[]): ValidationResult {
  // Check: all dependencies exist
  // Check: no self-dependencies
  // Check: no circular dependencies (using topological sort)
  // Check: forward dependencies are warned
}
```

### 3. Implement Ready-to-Execute Logic

```typescript
export function getReadySteps(plan: Plan): PlanStep[] {
  return plan.steps.filter(step => {
    // Pending status
    if (step.status !== 'pending') return false;
    
    // All dependencies completed
    if (step.dependencies) {
      for (const depNum of step.dependencies) {
        const dep = plan.steps.find(s => s.number === depNum);
        if (!dep || dep.status !== 'completed') return false;
      }
    }
    
    return true;
  });
}
```

### 4. Add CLI Integration

- `riotplan status` shows blocked steps with reasons
- `riotplan step ready` lists steps ready to execute
- Dependency visualization in dashboard

## Acceptance Criteria

- [ ] Dependencies parsed from step files
- [ ] Circular dependencies detected
- [ ] `getReadySteps()` returns correct steps
- [ ] Status commands show dependency info
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan/src/steps/dependencies.ts` - New module
- `riotplan/src/plan/loader.ts` - Parse dependencies
- `riotplan-cli/src/commands/step/ready.ts` - New command

## Dependencies

- Step 02 (Plan Loading)
- Step 07 (Step Operations)

