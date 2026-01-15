# Step 21: History Management

## Objective

Implement embedded version tracking and history lifecycle management, enabling cleanup at milestones while preserving key decisions.

## Background

From RIOTPLAN_ANALYSIS.md (R14, R25):

- Plans need version history without requiring Git
- But history can become unwieldy
- Solution: cleanup at milestones, with Git as safety net

## Tasks

### 1. Implement Embedded Versioning

```typescript
// .history/ directory structure
export interface HistoryEntry {
  version: string;
  createdAt: Date;
  message?: string;
  author?: string;
  feedbackId?: string;
  
  /** 'snapshot' for v0.1, 'diff' for subsequent */
  type: 'snapshot' | 'diff';
  
  /** Path to content in .history/ */
  contentPath: string;
}

export async function saveRevision(
  plan: Plan,
  options: { message?: string; author?: string }
): Promise<HistoryEntry>;

export async function listRevisions(
  planPath: string
): Promise<HistoryEntry[]>;

export async function getRevision(
  planPath: string,
  version: string
): Promise<Plan>;
```

### 2. Implement Revision Commands

```bash
riotplan revision save "Added security steps"  # Save current state
riotplan revision list                          # List all revisions
riotplan revision show v0.3                     # Show plan at v0.3
riotplan revision restore v0.3                  # Restore to v0.3
```

### 3. Implement Milestones

```typescript
export interface Milestone {
  name: string;
  version: string;
  createdAt: Date;
  description?: string;
  protected: boolean;  // Won't be cleaned up
}

export async function createMilestone(
  planPath: string,
  name: string,
  options?: { description?: string }
): Promise<Milestone>;

export async function listMilestones(
  planPath: string
): Promise<Milestone[]>;
```

### 4. Implement Cleanup

```typescript
export interface CleanupOptions {
  /** Keep these versions */
  keepVersions?: string[];
  
  /** Keep milestones */
  keepMilestones?: boolean;
  
  /** Commit to Git first */
  commitFirst?: boolean;
  
  /** Generate summary of decisions */
  summarize?: boolean;
  
  /** Dry run */
  dryRun?: boolean;
}

export interface CleanupResult {
  /** Versions removed */
  removed: string[];
  
  /** Versions kept */
  kept: string[];
  
  /** Summary generated */
  summary?: string;
  
  /** Git commit hash */
  gitCommit?: string;
}

export async function cleanup(
  planPath: string,
  options: CleanupOptions
): Promise<CleanupResult>;
```

### 5. CLI Commands

```bash
riotplan milestone create "Phase 1 Complete" --description "Core done"
riotplan milestone list
riotplan cleanup --commit --summarize
riotplan cleanup --keep-versions v0.1,v0.8,v0.15
riotplan cleanup --dry-run  # Preview only
```

### 6. Feedback Protection

```typescript
export async function protectFeedback(
  planPath: string,
  feedbackId: string
): Promise<void>;

// Protected feedback won't be removed during cleanup
// Marked in feedback file:
// <!-- riotplan:protected -->
```

## Acceptance Criteria

- [ ] `saveRevision()` creates history entries
- [ ] `listRevisions()` shows all versions
- [ ] `getRevision()` renders plan at any version
- [ ] Milestones can be created and listed
- [ ] Cleanup removes intermediate versions
- [ ] Protected feedback is preserved
- [ ] `--dry-run` previews cleanup
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan/src/history/` - New module
- `riotplan-cli/src/commands/revision/` - New commands
- `riotplan-cli/src/commands/milestone.ts` - Milestone commands
- `riotplan-cli/src/commands/cleanup.ts` - Cleanup command

## Dependencies

- Step 01 (Type System Enhancement)
- Step 04 (Feedback Capture)

