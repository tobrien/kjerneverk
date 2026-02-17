# Step 01: Add UUID Support to riotplan-format

## Objective

Extend PlanMetadata schema with UUID field and update storage providers to support UUID-based identification

## Background

Constraint 4 requires UUID identifiers for all major entities. Current PlanMetadata uses string 'id' field for plan code, need to add separate 'uuid' field for unique identification across the system.

## Tasks

### 1. 01.1

Add uuid field to PlanMetadata interface in riotplan-format/src/types.ts:

```typescript
export interface PlanMetadata {
  /** Unique plan identifier (code) */
  id: string;
  /** Globally unique identifier */
  uuid: string;
  /** Human-readable plan name */
  name: string;
  // ... existing fields
}
```

This separates the human-readable plan code (id) from the system-wide unique identifier (uuid).

### 2. 01.2

Update SQLite schema in riotplan-format/src/storage/schema.sql to add uuid column:

```sql
ALTER TABLE plan_metadata ADD COLUMN uuid TEXT UNIQUE;
CREATE UNIQUE INDEX idx_plan_metadata_uuid ON plan_metadata(uuid);
```

Also update SqliteStorageProvider to generate UUIDs on plan creation using crypto.randomUUID().

### 3. 01.3

Update DirectoryStorageProvider in riotplan-format/src/storage/directory-provider.ts to handle UUID generation and persistence in plan metadata files.

### 4. 01.4

Add UUID generation utility functions in riotplan-format/src/storage/utils.ts:

```typescript
export function generatePlanUuid(): string {
  return crypto.randomUUID();
}

export function abbreviateUuid(uuid: string): string {
  return uuid.substring(0, 8);
}

export function formatPlanFilename(uuid: string, slug: string): string {
  return `${abbreviateUuid(uuid)}-${slug}.plan`;
}
```

## Acceptance Criteria

- [ ] PlanMetadata interface includes uuid field
- [ ] SQLite schema supports UUID column with unique constraint
- [ ] Both storage providers generate and persist UUIDs
- [ ] UUID utility functions available for filename generation

## Testing

Update existing riotplan-format tests to verify UUID generation and uniqueness, test both SQLite and Directory providers handle UUIDs correctly

## Files Changed

- `riotplan-format/src/types.ts`
- `riotplan-format/src/storage/schema.sql`
- `riotplan-format/src/storage/sqlite-provider.ts`
- `riotplan-format/src/storage/directory-provider.ts`
- `riotplan-format/src/storage/utils.ts`

## Notes

This step establishes the foundation for UUID-based plan identification required by the HTTP server architecture.
