# Step 14: External Dependencies

## Objective

Implement cross-plan dependencies: steps can depend on external plans, and status propagates when external plans complete.

## Background

From RIOTPLAN_ANALYSIS.md: Plans have dependencies spanning repositories:

```
kjerneverk/secure-riotprompt Step 7
  └── BLOCKED on fjellgrunn/security-logging-features
```

This step implements:

- External plan references
- Link creation and management
- Status synchronization

## Tasks

### 1. Add External Dependency Types

```typescript
export interface ExternalDependency {
  /** Type of external reference */
  type: 'plan' | 'step';
  
  /** Path to external plan (relative or absolute) */
  planPath: string;
  
  /** Specific step number (if type is 'step') */
  stepNumber?: number;
  
  /** Description of dependency */
  reason?: string;
  
  /** Current status of external plan/step */
  status?: TaskStatus;
  
  /** When last checked */
  lastChecked?: Date;
}
```

### 2. Implement Link Management

```typescript
export async function linkPlan(
  plan: Plan,
  stepNumber: number,
  externalPlanPath: string,
  options?: { reason?: string; stepNumber?: number }
): Promise<void>;

export async function unlinkPlan(
  plan: Plan,
  stepNumber: number,
  externalPlanPath: string
): Promise<void>;

export async function syncExternalDependencies(
  plan: Plan
): Promise<SyncResult>;
```

### 3. Add CLI Commands

```bash
riotplan link <step> <path>      # Link external plan
riotplan unlink <step> <path>    # Remove link
riotplan sync                    # Sync all external deps
```

### 4. Implement Status Propagation

When syncing:
- Load external plan
- Check status of linked step/plan
- Update local step status if needed
- Report changes

## Acceptance Criteria

- [ ] Can link steps to external plans
- [ ] `riotplan sync` updates status from external plans
- [ ] Blocked status propagates correctly
- [ ] Clear output showing external dependencies
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan/src/dependencies/external.ts` - New module
- `riotplan-cli/src/commands/link.ts` - New command
- `riotplan-cli/src/commands/sync.ts` - New command

## Dependencies

- Step 13 (Internal Dependencies)
- Step 02 (Plan Loading)

