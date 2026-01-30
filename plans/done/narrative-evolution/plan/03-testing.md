# Step 03: Implement Narrative Capture

## Objective

Create MCP tool to capture raw conversational input as narrative chunks in the timeline. This allows users to preserve full-fidelity conversational context alongside structured events.

## Background

Users need a way to capture their thinking as they explore ideas - sometimes this is structured (notes, constraints), sometimes it's free-form narrative. The narrative capture tool provides a way to record conversational input without forcing it into structured categories.

This is the first user-facing tool that leverages the timeline extensions from Step 02.

## Tasks

### 1. Create Narrative Capture MCP Tool

Add new tool to `src/mcp/tools/narrative.ts`:
```typescript
export const narrativeTools = {
  riotplan_narrative_add: {
    description: "Add raw narrative/conversational input to idea timeline",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea directory"
        },
        content: {
          type: "string",
          description: "Raw narrative content to capture"
        },
        context: {
          type: "string",
          description: "Optional context about this narrative chunk"
        }
      },
      required: ["content"]
    }
  }
};
```

### 2. Implement Narrative Add Handler

```typescript
async function handleNarrativeAdd(args: {
  path?: string;
  content: string;
  context?: string;
}): Promise<{ message: string }> {
  const ideaPath = args.path || process.cwd();
  
  // Validate idea exists
  await validateIdeaPath(ideaPath);
  
  // Add narrative chunk to timeline
  await addNarrativeChunk(ideaPath, args.content, "typing", args.context);
  
  return {
    message: "✅ Narrative added to timeline"
  };
}
```

### 3. Register Tool in MCP Server

Update `src/mcp/server.ts` to include narrative tools:
```typescript
import { narrativeTools } from "./tools/narrative.js";

// In tool registration
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    ...ideaTools,
    ...shapingTools,
    ...narrativeTools,
    // ... other tools
  ]
}));
```

### 4. Update Explore Idea Prompt

Modify `src/mcp/prompts/explore_idea.md` to mention narrative capture:
```markdown
## Capturing Thinking

As the user shares their thoughts, you can capture them as:
- **Structured notes**: Use riotplan_idea_add_note for discrete observations
- **Narrative chunks**: Use riotplan_narrative_add for longer conversational input
- **Constraints**: Use riotplan_idea_add_constraint for limitations
- **Questions**: Use riotplan_idea_add_question for unknowns

Choose based on the nature of the input - structured for specific points, narrative for flowing conversation.
```

### 5. Create Narrative Viewing Tool

Add tool to view narrative history:
```typescript
export const narrativeTools = {
  // ... add tool
  
  riotplan_narrative_list: {
    description: "List all narrative chunks in chronological order",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to idea directory"
        },
        limit: {
          type: "number",
          description: "Maximum number of chunks to return"
        }
      }
    }
  }
};
```

## Acceptance Criteria

- [ ] riotplan_narrative_add tool is registered and callable
- [ ] Narrative chunks are appended to timeline.jsonl correctly
- [ ] Tool validates idea path before adding narrative
- [ ] Tool returns clear success/error messages
- [ ] riotplan_narrative_list shows narrative history
- [ ] Explore idea prompt mentions narrative capture
- [ ] Tests cover narrative add/list functionality
- [ ] Manual test: add narrative to hello-idea and verify in timeline

## Testing

```bash
# Unit tests
npm test src/mcp/tools/narrative.test.ts

# Integration test with MCP
# 1. Start MCP server
npm run mcp

# 2. Call narrative add tool
{
  "tool": "riotplan_narrative_add",
  "arguments": {
    "path": "./plans/hello-idea",
    "content": "This is a test narrative chunk capturing free-form thinking about the idea.",
    "context": "Testing narrative capture functionality"
  }
}

# 3. Verify timeline contains narrative
cat plans/hello-idea/.history/timeline.jsonl | grep narrative_chunk

# 4. List narratives
{
  "tool": "riotplan_narrative_list",
  "arguments": {
    "path": "./plans/hello-idea"
  }
}
```

## Files Changed

- `src/mcp/tools/narrative.ts` (new) - Narrative capture tools
- `src/mcp/tools/narrative.test.ts` (new) - Tests for narrative tools
- `src/mcp/server.ts` - Register narrative tools
- `src/mcp/prompts/explore_idea.md` - Document narrative capture
- `docs/tools.md` - Document new MCP tools

## Notes

- Narrative chunks are optional - don't force users to use them
- Keep the API simple - just path and content
- Consider rate limiting if narratives get very large
- Think about how narratives appear in history views
- Narratives complement structured data, don't replace it
