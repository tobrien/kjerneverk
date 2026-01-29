# Step 04: Design Checkpoint Storage

## Objective

Define and implement the checkpoint storage structure in the `.history/` directory. Create the foundation for saving and restoring idea state at specific points in time.

## Background

Checkpoints allow users to mark stopping points during ideation and provide recovery when exploration goes down a dead end. Unlike Git commits, checkpoints are lightweight markers that capture the state of the idea at a specific moment without heavy version control overhead.

Checkpoints need to:
- Be easy to create (low friction)
- Preserve enough context to restore state
- Be queryable (list, view details)
- Support restoration to any checkpoint

## Tasks

### 1. Define Checkpoint Directory Structure

Create checkpoint storage in `.history/checkpoints/`:
```
.history/
  timeline.jsonl
  checkpoints/
    2026-01-29T08-30-00-exploring-approaches/
      metadata.json
      IDEA.md
      SHAPING.md (if exists)
      LIFECYCLE.md
    2026-01-29T09-15-00-selected-approach/
      metadata.json
      IDEA.md
      SHAPING.md
      LIFECYCLE.md
```

### 2. Define Checkpoint Metadata Format

Create metadata.json structure:
```typescript
interface CheckpointMetadata {
  name: string;              // User-friendly name (e.g., "exploring-approaches")
  timestamp: string;         // ISO timestamp
  message: string;           // User description of checkpoint
  timelinePosition: number;  // Line number in timeline.jsonl
  stage: string;             // Current stage (idea, shaping, built, etc.)
  filesSnapshot: {
    path: string;
    size: number;
    modified: string;
  }[];
}
```

### 3. Implement Checkpoint Storage Module

Create `src/history/checkpoint.ts`:
```typescript
export async function createCheckpointStorage(ideaPath: string): Promise<void> {
  const checkpointDir = path.join(ideaPath, ".history", "checkpoints");
  await fs.mkdir(checkpointDir, { recursive: true });
}

export function getCheckpointPath(
  ideaPath: string,
  timestamp: string,
  name: string
): string {
  const sanitizedName = name.toLowerCase().replace(/\s+/g, "-");
  const checkpointId = `${timestamp.replace(/:/g, "-")}-${sanitizedName}`;
  return path.join(ideaPath, ".history", "checkpoints", checkpointId);
}
```

### 4. Implement Checkpoint Writer

```typescript
export async function saveCheckpoint(
  ideaPath: string,
  name: string,
  message: string
): Promise<string> {
  const timestamp = new Date().toISOString();
  const checkpointPath = getCheckpointPath(ideaPath, timestamp, name);
  
  // Create checkpoint directory
  await fs.mkdir(checkpointPath, { recursive: true });
  
  // Get current timeline position
  const timeline = await readTimeline(ideaPath);
  const timelinePosition = timeline.length;
  
  // Get current stage
  const lifecycle = await readLifecycle(ideaPath);
  
  // Snapshot current files
  const files = ["IDEA.md", "SHAPING.md", "LIFECYCLE.md"];
  const filesSnapshot = [];
  
  for (const file of files) {
    const srcPath = path.join(ideaPath, file);
    if (await fileExists(srcPath)) {
      const destPath = path.join(checkpointPath, file);
      await fs.copyFile(srcPath, destPath);
      
      const stats = await fs.stat(srcPath);
      filesSnapshot.push({
        path: file,
        size: stats.size,
        modified: stats.mtime.toISOString()
      });
    }
  }
  
  // Write metadata
  const metadata: CheckpointMetadata = {
    name,
    timestamp,
    message,
    timelinePosition,
    stage: lifecycle.currentStage,
    filesSnapshot
  };
  
  await fs.writeFile(
    path.join(checkpointPath, "metadata.json"),
    JSON.stringify(metadata, null, 2)
  );
  
  // Add checkpoint event to timeline
  await addCheckpointEvent(ideaPath, name, message, checkpointPath);
  
  return checkpointPath;
}
```

### 5. Implement Checkpoint Reader

```typescript
export async function listCheckpoints(ideaPath: string): Promise<CheckpointMetadata[]> {
  const checkpointDir = path.join(ideaPath, ".history", "checkpoints");
  
  if (!await fileExists(checkpointDir)) {
    return [];
  }
  
  const entries = await fs.readdir(checkpointDir);
  const checkpoints: CheckpointMetadata[] = [];
  
  for (const entry of entries) {
    const metadataPath = path.join(checkpointDir, entry, "metadata.json");
    if (await fileExists(metadataPath)) {
      const metadata = JSON.parse(await fs.readFile(metadataPath, "utf-8"));
      checkpoints.push(metadata);
    }
  }
  
  return checkpoints.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export async function getCheckpoint(
  ideaPath: string,
  name: string
): Promise<CheckpointMetadata | null> {
  const checkpoints = await listCheckpoints(ideaPath);
  return checkpoints.find(cp => cp.name === name) || null;
}
```

## Acceptance Criteria

- [ ] Checkpoint directory structure is created in `.history/checkpoints/`
- [ ] Checkpoint metadata format is well-defined and documented
- [ ] saveCheckpoint() creates checkpoint with all necessary files
- [ ] listCheckpoints() returns all checkpoints in chronological order
- [ ] getCheckpoint() retrieves specific checkpoint by name
- [ ] Checkpoint names are sanitized for filesystem safety
- [ ] Tests cover checkpoint storage operations
- [ ] Manual test: create checkpoint and verify directory structure

## Testing

```bash
# Unit tests
npm test src/history/checkpoint.test.ts

# Integration test
node -e "
const { saveCheckpoint, listCheckpoints } = require('./dist/history/checkpoint.js');

async function test() {
  // Create checkpoint
  const path = await saveCheckpoint(
    './plans/hello-idea',
    'test-checkpoint',
    'Testing checkpoint storage'
  );
  console.log('Created:', path);
  
  // List checkpoints
  const checkpoints = await listCheckpoints('./plans/hello-idea');
  console.log('Checkpoints:', checkpoints);
}

test();
"

# Verify filesystem
ls -la plans/hello-idea/.history/checkpoints/
cat plans/hello-idea/.history/checkpoints/*/metadata.json
```

## Files Changed

- `src/history/checkpoint.ts` (new) - Checkpoint storage implementation
- `src/history/checkpoint.test.ts` (new) - Tests for checkpoint storage
- `src/types.ts` - Add CheckpointMetadata type
- `docs/checkpoints.md` (new) - Document checkpoint format and usage

## Notes

- Keep checkpoints lightweight - only snapshot key files
- Don't snapshot evidence files (they might be large)
- Checkpoint names should be human-friendly
- Consider checkpoint cleanup/pruning strategy for later
- Timestamps use ISO format for sortability
- Sanitize checkpoint names to avoid filesystem issues
