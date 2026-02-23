# Step 01: Extend SQLite Schema with Workspace Identifier

## Objective

Add workspaceId field to plans table and create migration to support workspace-scoped filtering

## Background

The current SQLite schema in riotplan-format/src/storage/schema.sql defines the plans table without workspace identification. Need to extend it with workspaceId field and create migration path.

## Tasks

### 1. 01.1

Add workspaceId column to plans table schema in riotplan-format/src/storage/schema.sql:

```sql
-- Core plan metadata (updated)
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    uuid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    workspace_id TEXT, -- NEW: workspace identifier for scoping
    stage TEXT NOT NULL DEFAULT 'idea',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    schema_version INTEGER NOT NULL DEFAULT 1
);

-- Index for workspace filtering
CREATE INDEX IF NOT EXISTS idx_plans_workspace ON plans(workspace_id);
```

This allows null workspace_id for backward compatibility while enabling efficient workspace-based queries.

### 2. 01.2

Update PlanMetadata interface in riotplan-format/src/types.ts to include workspaceId:

```typescript
export interface PlanMetadata {
    /** Unique plan identifier (code) */
    id: string;
    /** Globally unique identifier */
    uuid: string;
    /** Human-readable plan name */
    name: string;
    /** Plan description */
    description?: string;
    /** Workspace identifier for scoping plans */
    workspaceId?: string;
    /** Creation timestamp (ISO 8601) */
    createdAt: string;
    /** Last update timestamp (ISO 8601) */
    updatedAt: string;
    /** Current lifecycle stage */
    stage: PlanStage;
    /** Schema version for migrations */
    schemaVersion: number;
}
```

### 3. 01.3

Create schema migration in riotplan-format/src/storage/migrations/002-add-workspace-id.sql:

```sql
-- Migration 002: Add workspace_id to plans table
ALTER TABLE plans ADD COLUMN workspace_id TEXT;
CREATE INDEX IF NOT EXISTS idx_plans_workspace ON plans(workspace_id);

-- Update schema version
INSERT INTO schema_version (version) VALUES (2);
```

## Acceptance Criteria

- [ ] plans table includes workspace_id column with appropriate index
- [ ] PlanMetadata interface includes optional workspaceId field
- [ ] Migration script exists for upgrading existing databases

## Testing

Create test .plan file, verify workspace_id column exists and can be queried, test migration on existing plan database

## Files Changed

- `riotplan-format/src/storage/schema.sql`
- `riotplan-format/src/types.ts`
- `riotplan-format/src/storage/migrations/002-add-workspace-id.sql`

## Notes

Keep workspace_id optional for backward compatibility with existing plans
