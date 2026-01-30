# Step 05: Implement Checkpoint Creation

## Objective

Create MCP tool for checkpoint creation that allows users to mark stopping points during ideation. Make it easy and low-friction to create checkpoints.

## Background

Users need to create checkpoints at natural stopping points - after an hour of work, before exploring a new direction, or when they want to preserve current thinking before making changes. The checkpoint creation tool should be simple to use and provide clear feedback.

## Tasks

### 1. Create Checkpoint MCP Tool

Add tool to `src/mcp/tools/checkpoint.ts`:
```typescript
export const checkpointTools = {
  riotplan_checkpoint_create: {
    description: "Create a checkpoint to save current idea state",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea directory (defaults to current directory)"
        },
        name: {
          type: "string",
          description: "Short name for this checkpoint (e.g., 'exploring-approaches')"
        },
        message: {
          type: "string",
          description: "Description of what this checkpoint captures"
        }
      },
      required: ["name", "message"]
    }
  }
};
```

### 2. Implement Checkpoint Create Handler

```typescript
async function handleCheckpointCreate(args: {
  path?: string;
  name: string;
  message: string;
}): Promise<{ message: string; checkpointPath: string }> {
  const ideaPath = args.path || process.cwd();
  
  // Validate idea exists
  await validateIdeaPath(ideaPath);
  
  // Validate checkpoint name
  if (!/^[a-z0-9-]+$/.test(args.name)) {
    throw new Error("Checkpoint name must be lowercase alphanumeric with hyphens");
  }
  
  // Check if checkpoint with this name already exists
  const existing = await getCheckpoint(ideaPath, args.name);
  if (existing) {
    throw new Error(`Checkpoint '${args.name}' already exists`);
  }
  
  // Create checkpoint
  const checkpointPath = await saveCheckpoint(ideaPath, args.name, args.message);
  
  return {
    message: `✅ Checkpoint created: ${args.name}`,
    checkpointPath
  };
}
```

### 3. Add Checkpoint Validation

```typescript
function validateCheckpointName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error("Checkpoint name cannot be empty");
  }
  
  if (name.length > 50) {
    throw new Error("Checkpoint name must be 50 characters or less");
  }
  
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(
      "Checkpoint name must be lowercase alphanumeric with hyphens (e.g., 'exploring-approaches')"
    );
  }
}

function validateCheckpointMessage(message: string): void {
  if (!message || message.trim().length === 0) {
    throw new Error("Checkpoint message cannot be empty");
  }
  
  if (message.length > 500) {
    throw new Error("Checkpoint message must be 500 characters or less");
  }
}
```

### 4. Register Tool in MCP Server

Update `src/mcp/server.ts`:
```typescript
import { checkpointTools } from "./tools/checkpoint.js";

// In tool registration
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    ...ideaTools,
    ...shapingTools,
    ...narrativeTools,
    ...checkpointTools,
    // ... other tools
  ]
}));

// In tool execution
case "riotplan_checkpoint_create":
  return await handleCheckpointCreate(params.arguments);
```

### 5. Update Prompts to Mention Checkpoints

Update `src/mcp/prompts/explore_idea.md`:
```markdown
## Creating Checkpoints

At natural stopping points, you can create checkpoints:
- After significant exploration
- Before trying a new direction
- When the user wants to preserve current thinking

```
riotplan_checkpoint_create({
  name: "exploring-approaches",
  message: "Captured state after exploring three different approaches"
})
```

Checkpoints allow the user to return to this point later if needed.
```

## Acceptance Criteria

- [ ] riotplan_checkpoint_create tool is registered and callable
- [ ] Tool validates checkpoint name format
- [ ] Tool prevents duplicate checkpoint names
- [ ] Tool validates idea path exists
- [ ] Checkpoint is saved with correct metadata
- [ ] Timeline event is added for checkpoint creation
- [ ] Clear success message is returned
- [ ] Error messages are helpful and actionable
- [ ] Tests cover checkpoint creation scenarios
- [ ] Manual test: create checkpoint in hello-idea

## Testing

```bash
# Unit tests
npm test src/mcp/tools/checkpoint.test.ts

# Integration test - valid checkpoint
{
  "tool": "riotplan_checkpoint_create",
  "arguments": {
    "path": "./plans/hello-idea",
    "name": "after-shaping",
    "message": "Captured state after selecting the Narrative Evolution approach"
  }
}

# Test validation - invalid name
{
  "tool": "riotplan_checkpoint_create",
  "arguments": {
    "path": "./plans/hello-idea",
    "name": "Invalid Name With Spaces",
    "message": "This should fail"
  }
}
# Expected: Error about checkpoint name format

# Test duplicate prevention
{
  "tool": "riotplan_checkpoint_create",
  "arguments": {
    "path": "./plans/hello-idea",
    "name": "after-shaping",
    "message": "Trying to create duplicate"
  }
}
# Expected: Error about checkpoint already existing

# Verify checkpoint was created
ls -la plans/hello-idea/.history/checkpoints/
cat plans/hello-idea/.history/checkpoints/*/metadata.json
```

## Files Changed

- `src/mcp/tools/checkpoint.ts` - Checkpoint creation tool
- `src/mcp/tools/checkpoint.test.ts` - Tests for checkpoint tools
- `src/mcp/server.ts` - Register checkpoint tools
- `src/mcp/prompts/explore_idea.md` - Document checkpoint creation
- `src/mcp/prompts/shape_approach.md` - Document checkpoint creation
- `docs/tools.md` - Document checkpoint MCP tools

## Notes

- Keep checkpoint creation simple - just name and message
- Validate inputs to prevent filesystem issues
- Prevent duplicate names to avoid confusion
- Consider suggesting checkpoint names based on current stage
- Checkpoints are markers, not branches - keep it simple
- Think about when prompts should suggest creating checkpoints
