# Step 08: Implement Checkpoint Restoration

## Objective

Create MCP tool to restore an idea to a previous checkpoint state. Enable recovery from dead ends by reverting to a known good state while preserving the timeline history.

## Background

The core value of checkpoints is the ability to restore to them when exploration goes down a dead end. Restoration should:
- Revert files to checkpoint state
- Preserve the timeline (don't delete history)
- Add a restoration event to timeline
- Be safe (confirm before destructive operations)

This is the most critical and complex checkpoint feature.

## Tasks

### 1. Create Checkpoint Restore MCP Tool

Add tool to `src/mcp/tools/checkpoint.ts`:
```typescript
export const checkpointTools = {
  // ... create, list, show tools
  
  riotplan_checkpoint_restore: {
    description: "Restore idea to a previous checkpoint state",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea directory (defaults to current directory)"
        },
        checkpoint: {
          type: "string",
          description: "Checkpoint name to restore to"
        }
      },
      required: ["checkpoint"]
    }
  }
};
```

### 2. Implement Checkpoint Restore Handler

```typescript
async function handleCheckpointRestore(args: {
  path?: string;
  checkpoint: string;
}): Promise<{
  message: string;
  restoredFiles: string[];
  timelinePosition: number;
}> {
  const ideaPath = args.path || process.cwd();
  
  // Validate idea exists
  await validateIdeaPath(ideaPath);
  
  // Get checkpoint
  const checkpoint = await getCheckpoint(ideaPath, args.checkpoint);
  if (!checkpoint) {
    throw new Error(`Checkpoint '${args.checkpoint}' not found`);
  }
  
  // Restore checkpoint
  const result = await restoreCheckpoint(ideaPath, args.checkpoint);
  
  return {
    message: `✅ Restored to checkpoint: ${args.checkpoint}`,
    restoredFiles: result.restoredFiles,
    timelinePosition: checkpoint.timelinePosition
  };
}
```

### 3. Implement Restore Logic

```typescript
export async function restoreCheckpoint(
  ideaPath: string,
  checkpointName: string
): Promise<{
  restoredFiles: string[];
  backupPath: string;
}> {
  const checkpoint = await getCheckpoint(ideaPath, checkpointName);
  if (!checkpoint) {
    throw new Error(`Checkpoint '${checkpointName}' not found`);
  }
  
  const checkpointPath = getCheckpointPath(
    ideaPath,
    checkpoint.timestamp,
    checkpoint.name
  );
  
  // Create backup of current state before restoring
  const backupPath = await createRestoreBackup(ideaPath);
  
  // Restore files from checkpoint
  const restoredFiles: string[] = [];
  for (const fileInfo of checkpoint.filesSnapshot) {
    const srcPath = path.join(checkpointPath, fileInfo.path);
    const destPath = path.join(ideaPath, fileInfo.path);
    
    await fs.copyFile(srcPath, destPath);
    restoredFiles.push(fileInfo.path);
  }
  
  // Add restoration event to timeline
  await addRestorationEvent(
    ideaPath,
    checkpointName,
    checkpoint.timestamp,
    restoredFiles
  );
  
  return { restoredFiles, backupPath };
}
```

### 4. Implement Restore Backup

```typescript
async function createRestoreBackup(ideaPath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const backupPath = path.join(
    ideaPath,
    ".history",
    "restore-backups",
    `backup-${timestamp}`
  );
  
  await fs.mkdir(backupPath, { recursive: true });
  
  // Backup current files
  const files = ["IDEA.md", "SHAPING.md", "LIFECYCLE.md"];
  for (const file of files) {
    const srcPath = path.join(ideaPath, file);
    if (await fileExists(srcPath)) {
      const destPath = path.join(backupPath, file);
      await fs.copyFile(srcPath, destPath);
    }
  }
  
  return backupPath;
}
```

### 5. Add Restoration Timeline Event

```typescript
async function addRestorationEvent(
  ideaPath: string,
  checkpointName: string,
  checkpointTimestamp: string,
  restoredFiles: string[]
): Promise<void> {
  const event = {
    timestamp: new Date().toISOString(),
    type: "checkpoint_restored",
    data: {
      checkpointName,
      checkpointTimestamp,
      restoredFiles
    }
  };
  
  await appendToTimeline(ideaPath, event);
}
```

### 6. Add Restore Safety Checks

```typescript
async function validateRestoreOperation(
  ideaPath: string,
  checkpointName: string
): Promise<{ safe: boolean; warnings: string[] }> {
  const warnings: string[] = [];
  
  // Check if there are uncommitted changes
  const hasUncommitted = await hasUncommittedChanges(ideaPath);
  if (hasUncommitted) {
    warnings.push("There are uncommitted changes that will be lost");
  }
  
  // Check if checkpoint is very old
  const checkpoint = await getCheckpoint(ideaPath, checkpointName);
  if (checkpoint) {
    const age = Date.now() - new Date(checkpoint.timestamp).getTime();
    const daysOld = age / (1000 * 60 * 60 * 24);
    
    if (daysOld > 30) {
      warnings.push(`Checkpoint is ${Math.floor(daysOld)} days old`);
    }
  }
  
  return {
    safe: warnings.length === 0,
    warnings
  };
}
```

### 7. Add Restore Undo Capability

```typescript
export async function undoLastRestore(ideaPath: string): Promise<string> {
  // Find most recent restore backup
  const backupDir = path.join(ideaPath, ".history", "restore-backups");
  const backups = await fs.readdir(backupDir);
  
  if (backups.length === 0) {
    throw new Error("No restore backups found");
  }
  
  // Sort by timestamp (newest first)
  backups.sort().reverse();
  const latestBackup = backups[0];
  const backupPath = path.join(backupDir, latestBackup);
  
  // Restore from backup
  const files = ["IDEA.md", "SHAPING.md", "LIFECYCLE.md"];
  for (const file of files) {
    const srcPath = path.join(backupPath, file);
    if (await fileExists(srcPath)) {
      const destPath = path.join(ideaPath, file);
      await fs.copyFile(srcPath, destPath);
    }
  }
  
  return backupPath;
}
```

## Acceptance Criteria

- [ ] riotplan_checkpoint_restore tool is registered and callable
- [ ] Tool restores files from checkpoint to current state
- [ ] Current state is backed up before restoration
- [ ] Restoration event is added to timeline
- [ ] Timeline history is preserved (not truncated)
- [ ] Error handling for non-existent checkpoints
- [ ] Safety checks warn about uncommitted changes
- [ ] Restore backups are created and accessible
- [ ] Tests cover restoration scenarios
- [ ] Manual test: restore checkpoint in hello-idea and verify state

## Testing

```bash
# Unit tests
npm test src/mcp/tools/checkpoint.test.ts

# Integration test - restore checkpoint
# 1. Create checkpoint
{
  "tool": "riotplan_checkpoint_create",
  "arguments": {
    "path": "./plans/hello-idea",
    "name": "before-changes",
    "message": "State before making changes"
  }
}

# 2. Make some changes to IDEA.md
echo "New content" >> plans/hello-idea/IDEA.md

# 3. Restore to checkpoint
{
  "tool": "riotplan_checkpoint_restore",
  "arguments": {
    "path": "./plans/hello-idea",
    "checkpoint": "before-changes"
  }
}

# 4. Verify IDEA.md is restored
cat plans/hello-idea/IDEA.md
# Should not contain "New content"

# 5. Verify timeline contains restoration event
cat plans/hello-idea/.history/timeline.jsonl | grep checkpoint_restored

# 6. Verify backup was created
ls -la plans/hello-idea/.history/restore-backups/
```

## Files Changed

- `src/mcp/tools/checkpoint.ts` - Add restore tool
- `src/mcp/tools/checkpoint.test.ts` - Add restore tests
- `src/history/checkpoint.ts` - Add restore logic and backup utilities
- `src/types.ts` - Add checkpoint_restored event type
- `docs/tools.md` - Document checkpoint restore tool
- `docs/checkpoints.md` - Document restoration process and safety

## Notes

- Always create backup before restoring (safety first)
- Don't truncate timeline - restoration is just another event
- Consider adding confirmation prompt for destructive restores
- Think about how to handle files that didn't exist at checkpoint time
- Restore backups allow "undo" of restoration
- Consider cleanup strategy for old restore backups
- Timeline preservation is critical - never delete history
