# Step 06: Implement Checkpoint Listing

## Objective

Create MCP tool to list all checkpoints for an idea, showing when they were created and what they capture. Provide clear visibility into checkpoint history.

## Background

Users need to see what checkpoints exist before they can restore to one. The listing tool should show checkpoints in chronological order with enough information to understand what each checkpoint represents.

## Tasks

### 1. Create Checkpoint List MCP Tool

Add tool to `src/mcp/tools/checkpoint.ts`:
```typescript
export const checkpointTools = {
  // ... create tool
  
  riotplan_checkpoint_list: {
    description: "List all checkpoints for an idea in chronological order",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea directory (defaults to current directory)"
        }
      }
    }
  }
};
```

### 2. Implement Checkpoint List Handler

```typescript
async function handleCheckpointList(args: {
  path?: string;
}): Promise<{
  checkpoints: Array<{
    name: string;
    timestamp: string;
    message: string;
    stage: string;
    filesCount: number;
  }>;
}> {
  const ideaPath = args.path || process.cwd();
  
  // Validate idea exists
  await validateIdeaPath(ideaPath);
  
  // Get all checkpoints
  const checkpoints = await listCheckpoints(ideaPath);
  
  if (checkpoints.length === 0) {
    return {
      checkpoints: []
    };
  }
  
  // Format checkpoint info
  const formatted = checkpoints.map(cp => ({
    name: cp.name,
    timestamp: cp.timestamp,
    message: cp.message,
    stage: cp.stage,
    filesCount: cp.filesSnapshot.length
  }));
  
  return { checkpoints: formatted };
}
```

### 3. Add Formatted Output Helper

```typescript
function formatCheckpointList(checkpoints: CheckpointMetadata[]): string {
  if (checkpoints.length === 0) {
    return "No checkpoints found.";
  }
  
  let output = `Found ${checkpoints.length} checkpoint(s):\n\n`;
  
  for (const cp of checkpoints) {
    const date = new Date(cp.timestamp);
    const formattedDate = date.toLocaleString();
    
    output += `📍 ${cp.name}\n`;
    output += `   Created: ${formattedDate}\n`;
    output += `   Stage: ${cp.stage}\n`;
    output += `   Message: ${cp.message}\n`;
    output += `   Files: ${cp.filesSnapshot.length}\n\n`;
  }
  
  return output;
}
```

### 4. Add Checkpoint Count Utility

```typescript
export async function getCheckpointCount(ideaPath: string): Promise<number> {
  const checkpoints = await listCheckpoints(ideaPath);
  return checkpoints.length;
}

export async function hasCheckpoints(ideaPath: string): Promise<boolean> {
  const count = await getCheckpointCount(ideaPath);
  return count > 0;
}
```

### 5. Update Status Tool to Show Checkpoint Info

Modify `riotplan_status` to include checkpoint count:
```typescript
async function handleStatus(args: { path?: string; verbose?: boolean }) {
  // ... existing status logic
  
  // Add checkpoint info
  const checkpointCount = await getCheckpointCount(ideaPath);
  
  return {
    // ... existing status fields
    checkpoints: {
      count: checkpointCount,
      hasCheckpoints: checkpointCount > 0
    }
  };
}
```

## Acceptance Criteria

- [ ] riotplan_checkpoint_list tool is registered and callable
- [ ] Tool returns all checkpoints in chronological order
- [ ] Each checkpoint shows name, timestamp, message, stage, and file count
- [ ] Empty checkpoint list returns clear message
- [ ] Formatted output is readable and informative
- [ ] Status tool shows checkpoint count
- [ ] Tests cover checkpoint listing scenarios
- [ ] Manual test: list checkpoints in hello-idea

## Testing

```bash
# Unit tests
npm test src/mcp/tools/checkpoint.test.ts

# Integration test - list checkpoints
{
  "tool": "riotplan_checkpoint_list",
  "arguments": {
    "path": "./plans/hello-idea"
  }
}

# Expected output format:
# {
#   "checkpoints": [
#     {
#       "name": "after-shaping",
#       "timestamp": "2026-01-29T08:30:00.000Z",
#       "message": "Captured state after selecting approach",
#       "stage": "shaping",
#       "filesCount": 3
#     }
#   ]
# }

# Test with no checkpoints
{
  "tool": "riotplan_checkpoint_list",
  "arguments": {
    "path": "./plans/some-new-idea"
  }
}
# Expected: Empty array

# Test status includes checkpoint info
{
  "tool": "riotplan_status",
  "arguments": {
    "path": "./plans/hello-idea",
    "verbose": true
  }
}
# Expected: status includes checkpoints.count field
```

## Files Changed

- `src/mcp/tools/checkpoint.ts` - Add list tool
- `src/mcp/tools/checkpoint.test.ts` - Add list tests
- `src/mcp/tools/status.ts` - Add checkpoint count to status
- `src/history/checkpoint.ts` - Add count/has utilities
- `docs/tools.md` - Document checkpoint list tool

## Notes

- Sort checkpoints chronologically (oldest first)
- Consider adding filters (by stage, by date range) later
- Keep output concise but informative
- Think about how to display many checkpoints (pagination?)
- Consider adding "latest checkpoint" to status output
- Formatted timestamps should be human-readable
