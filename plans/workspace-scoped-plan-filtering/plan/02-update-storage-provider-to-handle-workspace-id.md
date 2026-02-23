# Step 02: Update Storage Provider to Handle Workspace ID

## Objective

Modify SqliteStorageProvider to read, write, and query plans by workspaceId

## Background

The SqliteStorageProvider in riotplan-format/src/storage/sqlite-provider.ts handles plan metadata operations. Need to extend it to support workspaceId in all CRUD operations.

## Tasks

### 1. 02.1

Update SqliteStorageProvider.initialize() in riotplan-format/src/storage/sqlite-provider.ts to include workspace_id:

```typescript
const stmt = this.db.prepare(`
    INSERT INTO plans (code, uuid, name, description, workspace_id, stage, created_at, updated_at, schema_version)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const result = stmt.run(
    metadata.id,
    uuid,
    metadata.name,
    metadata.description || null,
    metadata.workspaceId || null, // NEW
    metadata.stage,
    metadata.createdAt,
    metadata.updatedAt,
    metadata.schemaVersion
);
```

### 2. 02.2

Update SqliteStorageProvider.getMetadata() to return workspace_id:

```typescript
const row = this.db.prepare(`
    SELECT code, uuid, name, description, workspace_id, stage, 
           created_at, updated_at, schema_version
    FROM plans 
    WHERE id = ?
`).get(this.getPlanId()) as RowType | undefined;

if (row) {
    return {
        success: true,
        data: {
            id: row.code,
            uuid: row.uuid,
            name: row.name,
            description: row.description || undefined,
            workspaceId: row.workspace_id || undefined, // NEW
            stage: row.stage as PlanStage,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            schemaVersion: row.schema_version,
        },
    };
}
```

### 3. 02.3

Add updateWorkspaceId() method to SqliteStorageProvider:

```typescript
async updateWorkspaceId(workspaceId: string | null): Promise<StorageResult<void>> {
    try {
        const stmt = this.db.prepare(
            'UPDATE plans SET workspace_id = ?, updated_at = ? WHERE id = ?'
        );
        
        stmt.run(
            workspaceId,
            new Date().toISOString(),
            this.getPlanId()
        );
        
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update workspace ID',
        };
    }
}
```

## Acceptance Criteria

- [ ] SqliteStorageProvider can initialize plans with workspaceId
- [ ] getMetadata() returns workspaceId field
- [ ] updateWorkspaceId() method successfully updates workspace identifier

## Testing

Create plan with workspaceId, verify metadata retrieval includes workspace, test workspace update operation

## Files Changed

- `riotplan-format/src/storage/sqlite-provider.ts`

## Notes

Keep workspaceId nullable to support plans without workspace assignment
