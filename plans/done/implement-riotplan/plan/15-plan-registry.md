# Step 15: Plan Registry

## Objective

Implement a plan registry to track plans across multiple directories and repositories, enabling cross-project coordination.

## Background

Users manage plans across multiple locations:
- `~/gitw/kjerneverk/prompts/`
- `~/gitw/fjellgrunn/prompts/`
- `~/projects/personal/plans/`

The registry provides:
- Central index of all plans
- Quick lookup without scanning
- Metadata caching
- Cross-repo awareness

## Tasks

### 1. Design Registry Format

```typescript
// ~/.config/riotplan/registry.json
export interface PlanRegistry {
  version: string;
  lastUpdated: Date;
  
  /** Registered scan paths */
  scanPaths: string[];
  
  /** Known plans */
  plans: RegisteredPlan[];
  
  /** Contexts */
  contexts: ContextDefinition[];
}

export interface RegisteredPlan {
  /** Plan code */
  code: string;
  
  /** Absolute path */
  path: string;
  
  /** Plan name */
  name: string;
  
  /** Current status (cached) */
  status: TaskStatus;
  
  /** Progress (cached) */
  progress: number;
  
  /** Context assignment */
  context?: string;
  
  /** Last scanned */
  lastScanned: Date;
}
```

### 2. Implement Registry Management

```typescript
export async function getRegistry(): Promise<PlanRegistry>;
export async function saveRegistry(registry: PlanRegistry): Promise<void>;

export async function scanPath(path: string): Promise<RegisteredPlan[]>;
export async function refreshRegistry(): Promise<RefreshResult>;

export async function registerPlan(planPath: string): Promise<void>;
export async function unregisterPlan(planPath: string): Promise<void>;
```

### 3. Add CLI Commands

```bash
riotplan registry add <path>     # Add scan path
riotplan registry remove <path>  # Remove scan path
riotplan registry refresh        # Rescan all paths
riotplan registry list           # List registered plans
```

### 4. Integrate with Dashboard

Update dashboard to use registry for fast multi-plan view:

```typescript
export async function getDashboardData(): Promise<DashboardData> {
  const registry = await getRegistry();
  // Use cached data for speed
  // Background refresh if stale
}
```

## Acceptance Criteria

- [ ] Registry file created and managed
- [ ] `riotplan registry add` adds scan paths
- [ ] `riotplan registry refresh` scans and updates
- [ ] Dashboard uses registry for speed
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan/src/registry/index.ts` - New module
- `riotplan-cli/src/commands/registry.ts` - New commands

## Dependencies

- Step 02 (Plan Loading)
- Step 11 (Status Commands) - Dashboard

