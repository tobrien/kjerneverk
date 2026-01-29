# Step 07: Implement Checkpoint Viewing

## Objective

Create MCP tool to display detailed information about a specific checkpoint, including its metadata, captured files, and surrounding timeline context. Help users understand what a checkpoint contains before restoring to it.

## Background

Before restoring to a checkpoint, users need to see what state it represents. The checkpoint viewing tool should show the checkpoint's metadata, what files were captured, and the timeline context around that point.

## Tasks

### 1. Create Checkpoint Show MCP Tool

Add tool to `src/mcp/tools/checkpoint.ts`:
```typescript
export const checkpointTools = {
  // ... create, list tools
  
  riotplan_checkpoint_show: {
    description: "Show detailed information about a specific checkpoint",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea directory (defaults to current directory)"
        },
        checkpoint: {
          type: "string",
          description: "Checkpoint name to view"
        }
      },
      required: ["checkpoint"]
    }
  }
};
```

### 2. Implement Checkpoint Show Handler

```typescript
async function handleCheckpointShow(args: {
  path?: string;
  checkpoint: string;
}): Promise<{
  metadata: CheckpointMetadata;
  files: Array<{ path: string; preview: string }>;
  timelineContext: TimelineEvent[];
}> {
  const ideaPath = args.path || process.cwd();
  
  // Validate idea exists
  await validateIdeaPath(ideaPath);
  
  // Get checkpoint
  const checkpoint = await getCheckpoint(ideaPath, args.checkpoint);
  if (!checkpoint) {
    throw new Error(`Checkpoint '${args.checkpoint}' not found`);
  }
  
  // Get checkpoint path
  const checkpointPath = getCheckpointPath(
    ideaPath,
    checkpoint.timestamp,
    checkpoint.name
  );
  
  // Read captured files with previews
  const files = [];
  for (const fileInfo of checkpoint.filesSnapshot) {
    const filePath = path.join(checkpointPath, fileInfo.path);
    const content = await fs.readFile(filePath, "utf-8");
    
    // Get first 500 chars as preview
    const preview = content.length > 500 
      ? content.substring(0, 500) + "..."
      : content;
    
    files.push({
      path: fileInfo.path,
      preview
    });
  }
  
  // Get timeline context (5 events before and after)
  const timeline = await readTimeline(ideaPath);
  const position = checkpoint.timelinePosition;
  const contextStart = Math.max(0, position - 5);
  const contextEnd = Math.min(timeline.length, position + 5);
  const timelineContext = timeline.slice(contextStart, contextEnd);
  
  return {
    metadata: checkpoint,
    files,
    timelineContext
  };
}
```

### 3. Add Checkpoint Diff Utility

```typescript
export async function compareCheckpointToCurrent(
  ideaPath: string,
  checkpointName: string
): Promise<{
  filesAdded: string[];
  filesRemoved: string[];
  filesModified: string[];
}> {
  const checkpoint = await getCheckpoint(ideaPath, checkpointName);
  if (!checkpoint) {
    throw new Error(`Checkpoint '${checkpointName}' not found`);
  }
  
  // Get current files
  const currentFiles = new Set<string>();
  for (const file of ["IDEA.md", "SHAPING.md", "LIFECYCLE.md"]) {
    if (await fileExists(path.join(ideaPath, file))) {
      currentFiles.add(file);
    }
  }
  
  // Get checkpoint files
  const checkpointFiles = new Set(checkpoint.filesSnapshot.map(f => f.path));
  
  // Calculate differences
  const filesAdded = Array.from(currentFiles).filter(f => !checkpointFiles.has(f));
  const filesRemoved = Array.from(checkpointFiles).filter(f => !currentFiles.has(f));
  const filesModified = []; // TODO: implement content comparison
  
  return { filesAdded, filesRemoved, filesModified };
}
```

### 4. Add Formatted Output for Checkpoint Details

```typescript
function formatCheckpointDetails(
  metadata: CheckpointMetadata,
  files: Array<{ path: string; preview: string }>,
  timelineContext: TimelineEvent[]
): string {
  const date = new Date(metadata.timestamp);
  
  let output = `# Checkpoint: ${metadata.name}\n\n`;
  output += `**Created**: ${date.toLocaleString()}\n`;
  output += `**Stage**: ${metadata.stage}\n`;
  output += `**Message**: ${metadata.message}\n`;
  output += `**Timeline Position**: ${metadata.timelinePosition}\n\n`;
  
  output += `## Captured Files (${files.length})\n\n`;
  for (const file of files) {
    output += `### ${file.path}\n\n`;
    output += `\`\`\`\n${file.preview}\n\`\`\`\n\n`;
  }
  
  output += `## Timeline Context\n\n`;
  output += `Showing ${timelineContext.length} events around this checkpoint:\n\n`;
  for (const event of timelineContext) {
    const eventDate = new Date(event.timestamp);
    output += `- [${eventDate.toLocaleTimeString()}] ${event.type}\n`;
  }
  
  return output;
}
```

### 5. Add Checkpoint Content Reader

```typescript
export async function readCheckpointFile(
  ideaPath: string,
  checkpointName: string,
  fileName: string
): Promise<string> {
  const checkpoint = await getCheckpoint(ideaPath, checkpointName);
  if (!checkpoint) {
    throw new Error(`Checkpoint '${checkpointName}' not found`);
  }
  
  const checkpointPath = getCheckpointPath(
    ideaPath,
    checkpoint.timestamp,
    checkpoint.name
  );
  
  const filePath = path.join(checkpointPath, fileName);
  if (!await fileExists(filePath)) {
    throw new Error(`File '${fileName}' not found in checkpoint`);
  }
  
  return await fs.readFile(filePath, "utf-8");
}
```

## Acceptance Criteria

- [ ] riotplan_checkpoint_show tool is registered and callable
- [ ] Tool displays checkpoint metadata (name, timestamp, message, stage)
- [ ] Tool shows captured files with previews
- [ ] Tool shows timeline context around checkpoint
- [ ] Error handling for non-existent checkpoints
- [ ] File previews are limited to reasonable size
- [ ] Timeline context shows events before and after checkpoint
- [ ] Tests cover checkpoint viewing scenarios
- [ ] Manual test: view checkpoint details in hello-idea

## Testing

```bash
# Unit tests
npm test src/mcp/tools/checkpoint.test.ts

# Integration test - show checkpoint
{
  "tool": "riotplan_checkpoint_show",
  "arguments": {
    "path": "./plans/hello-idea",
    "checkpoint": "after-shaping"
  }
}

# Expected output includes:
# - Checkpoint metadata (name, timestamp, message, stage)
# - List of captured files with content previews
# - Timeline events around the checkpoint

# Test non-existent checkpoint
{
  "tool": "riotplan_checkpoint_show",
  "arguments": {
    "path": "./plans/hello-idea",
    "checkpoint": "does-not-exist"
  }
}
# Expected: Error message about checkpoint not found

# Verify checkpoint file reading
node -e "
const { readCheckpointFile } = require('./dist/history/checkpoint.js');

async function test() {
  const content = await readCheckpointFile(
    './plans/hello-idea',
    'after-shaping',
    'IDEA.md'
  );
  console.log(content);
}

test();
"
```

## Files Changed

- `src/mcp/tools/checkpoint.ts` - Add show tool
- `src/mcp/tools/checkpoint.test.ts` - Add show tests
- `src/history/checkpoint.ts` - Add file reading utilities
- `docs/tools.md` - Document checkpoint show tool

## Notes

- Limit file previews to avoid overwhelming output
- Timeline context helps understand what was happening at checkpoint time
- Consider adding diff view (current vs checkpoint) later
- Think about how to display large files efficiently
- Checkpoint viewing should be read-only (no modifications)
- Consider adding search within checkpoint files
