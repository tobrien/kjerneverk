# Ideation History and Checkpointing System

## Overview

Capture all ideation inputs with timestamps and support checkpointing at key decision points.

## File Structure

```
idea-name/
  IDEA.md                    # Current state
  SHAPING.md                 # Current shaping state
  LIFECYCLE.md               # Lifecycle tracking
  .history/                  # NEW: Complete ideation history
    timeline.jsonl           # Timestamped event log (JSON Lines)
    checkpoints/             # Named checkpoints
      initial.json           # Checkpoint snapshots
      after-constraints.json
      approach-selected.json
    prompts/                 # Captured prompts at checkpoints
      initial.md
      after-constraints.md
      approach-selected.md
```

## Timeline Format (timeline.jsonl)

Each line is a JSON object representing an event:

```jsonl
{"timestamp":"2026-01-29T10:30:00.000Z","type":"idea_created","data":{"code":"feature-x","description":"Initial concept"}}
{"timestamp":"2026-01-29T10:32:15.123Z","type":"note_added","data":{"note":"Users need real-time updates"}}
{"timestamp":"2026-01-29T10:35:42.456Z","type":"constraint_added","data":{"constraint":"Must work on mobile"}}
{"timestamp":"2026-01-29T10:40:00.789Z","type":"checkpoint_created","data":{"name":"after-constraints","message":"Captured constraints, ready to explore approaches"}}
{"timestamp":"2026-01-29T10:45:30.012Z","type":"shaping_started","data":{}}
{"timestamp":"2026-01-29T10:50:15.345Z","type":"approach_added","data":{"name":"REST with Polling","tradeoffs":["Pro: Simple","Con: Latency"]}}
{"timestamp":"2026-01-29T11:00:00.678Z","type":"feedback_added","data":{"feedback":"Polling feels wasteful"}}
{"timestamp":"2026-01-29T11:10:45.901Z","type":"checkpoint_created","data":{"name":"approach-selected","message":"Selected SSE approach"}}
```

## Event Types

### Idea Stage Events
- `idea_created` - Initial idea creation
- `note_added` - Thought or observation added
- `constraint_added` - Constraint captured
- `question_added` - Question raised
- `evidence_added` - Document/image attached
- `idea_killed` - Idea abandoned

### Shaping Stage Events
- `shaping_started` - Transitioned to shaping
- `approach_added` - New approach proposed
- `feedback_added` - Feedback captured
- `evidence_added` - Supporting evidence
- `approach_compared` - Comparison performed
- `approach_selected` - Decision made

### Checkpoint Events
- `checkpoint_created` - Manual checkpoint
- `checkpoint_restored` - Rolled back to checkpoint

## Checkpoint Structure

### Checkpoint Metadata (.history/checkpoints/{name}.json)

```json
{
  "name": "after-constraints",
  "timestamp": "2026-01-29T10:40:00.789Z",
  "message": "Captured constraints, ready to explore approaches",
  "stage": "idea",
  "snapshot": {
    "idea": {
      "code": "feature-x",
      "description": "Initial concept",
      "notes": ["Users need real-time updates"],
      "constraints": ["Must work on mobile", "No WebSockets everywhere"],
      "questions": ["How to handle offline users?"],
      "evidence": []
    }
  },
  "context": {
    "filesChanged": ["IDEA.md"],
    "eventsSinceLastCheckpoint": 5
  }
}
```

### Prompt Capture (.history/prompts/{name}.md)

```markdown
# Checkpoint: after-constraints
**Timestamp**: 2026-01-29T10:40:00.789Z
**Stage**: idea

## Conversation Context

### User Input
> "We need to make sure this works on mobile and doesn't require WebSockets everywhere"

### AI Response
> "I've added those constraints. Let me capture this checkpoint before we move to exploring approaches."

## Current State

### Idea: feature-x
Real-time notifications for users

### Notes
- Users need real-time updates

### Constraints
- Must work on mobile
- No WebSockets everywhere

### Questions
- How to handle offline users?

## Next Steps
Ready to transition to shaping and explore implementation approaches.
```

## New MCP Tools

### `riotplan_checkpoint_create`

```typescript
{
  name: "riotplan_checkpoint_create",
  description: "Create a named checkpoint of current ideation state with prompt capture",
  inputSchema: {
    path: string,           // Plan path
    name: string,           // Checkpoint name (kebab-case)
    message: string,        // Description of why checkpoint created
    capturePrompt: boolean  // Capture current conversation context (default: true)
  }
}
```

### `riotplan_checkpoint_list`

```typescript
{
  name: "riotplan_checkpoint_list",
  description: "List all checkpoints for a plan",
  inputSchema: {
    path: string  // Plan path
  }
}
```

### `riotplan_checkpoint_show`

```typescript
{
  name: "riotplan_checkpoint_show",
  description: "Show details of a specific checkpoint",
  inputSchema: {
    path: string,      // Plan path
    checkpoint: string // Checkpoint name
  }
}
```

### `riotplan_checkpoint_restore`

```typescript
{
  name: "riotplan_checkpoint_restore",
  description: "Restore plan to a previous checkpoint state",
  inputSchema: {
    path: string,      // Plan path
    checkpoint: string // Checkpoint name
  }
}
```

### `riotplan_history_show`

```typescript
{
  name: "riotplan_history_show",
  description: "Show ideation history timeline",
  inputSchema: {
    path: string,           // Plan path
    since: string,          // Optional: ISO timestamp
    eventType: string,      // Optional: Filter by event type
    limit: number           // Optional: Max events to show
  }
}
```

## Implementation Details

### Automatic History Logging

Every tool call automatically logs to timeline:

```typescript
async function logEvent(planPath: string, event: HistoryEvent) {
  const historyDir = join(planPath, '.history');
  await mkdir(historyDir, { recursive: true });
  
  const timelinePath = join(historyDir, 'timeline.jsonl');
  const line = JSON.stringify(event) + '\n';
  
  await appendFile(timelinePath, line);
}
```

### Checkpoint Creation

```typescript
async function createCheckpoint(
  planPath: string,
  name: string,
  message: string,
  capturePrompt: boolean
) {
  // 1. Create checkpoint directory
  const checkpointDir = join(planPath, '.history', 'checkpoints');
  await mkdir(checkpointDir, { recursive: true });
  
  // 2. Snapshot current state
  const snapshot = await captureCurrentState(planPath);
  
  // 3. Save checkpoint metadata
  const checkpoint = {
    name,
    timestamp: new Date().toISOString(),
    message,
    stage: snapshot.stage,
    snapshot,
    context: {
      filesChanged: await getChangedFiles(planPath),
      eventsSinceLastCheckpoint: await countEventsSinceLastCheckpoint(planPath)
    }
  };
  
  await writeFile(
    join(checkpointDir, `${name}.json`),
    JSON.stringify(checkpoint, null, 2)
  );
  
  // 4. Capture prompt if requested
  if (capturePrompt) {
    await capturePromptContext(planPath, name, snapshot);
  }
  
  // 5. Log checkpoint event
  await logEvent(planPath, {
    timestamp: checkpoint.timestamp,
    type: 'checkpoint_created',
    data: { name, message }
  });
}
```

### Prompt Capture

```typescript
async function capturePromptContext(
  planPath: string,
  checkpointName: string,
  snapshot: any
) {
  const promptDir = join(planPath, '.history', 'prompts');
  await mkdir(promptDir, { recursive: true });
  
  // Build prompt markdown
  const prompt = `# Checkpoint: ${checkpointName}
**Timestamp**: ${new Date().toISOString()}
**Stage**: ${snapshot.stage}

## Current State

${formatSnapshot(snapshot)}

## Files at This Point

${await listFiles(planPath)}

## Timeline Leading Here

${await formatRecentEvents(planPath, 10)}
`;
  
  await writeFile(
    join(promptDir, `${checkpointName}.md`),
    prompt
  );
}
```

## Usage Examples

### During Idea Exploration

```typescript
// User adds several constraints
riotplan_idea_add_constraint({ constraint: "Must work on mobile" })
riotplan_idea_add_constraint({ constraint: "No external dependencies" })
riotplan_idea_add_question({ question: "How to handle offline?" })

// User: "Let's checkpoint this before moving on"
riotplan_checkpoint_create({
  name: "constraints-captured",
  message: "Captured all constraints and key questions"
})

// Later, view the checkpoint
riotplan_checkpoint_show({ checkpoint: "constraints-captured" })
```

### During Shaping

```typescript
// Add multiple approaches
riotplan_shaping_add_approach({ name: "Approach 1", ... })
riotplan_shaping_add_approach({ name: "Approach 2", ... })
riotplan_shaping_add_feedback({ feedback: "Approach 1 feels too complex" })

// User: "Checkpoint before we decide"
riotplan_checkpoint_create({
  name: "before-decision",
  message: "All approaches captured, ready to decide"
})

// Make decision
riotplan_shaping_select({ approach: "Approach 2", ... })

// User: "Actually, let's go back"
riotplan_checkpoint_restore({ checkpoint: "before-decision" })
```

### Viewing History

```typescript
// Show full timeline
riotplan_history_show({})

// Show only checkpoints
riotplan_history_show({ eventType: "checkpoint_created" })

// Show recent events
riotplan_history_show({ limit: 10 })

// Show events since checkpoint
riotplan_history_show({ 
  since: "2026-01-29T10:40:00.789Z" 
})
```

## CLI Commands

```bash
# Create checkpoint
riotplan checkpoint create "constraints-captured" \
  --message "Captured all constraints"

# List checkpoints
riotplan checkpoint list

# Show checkpoint
riotplan checkpoint show constraints-captured

# Restore checkpoint
riotplan checkpoint restore constraints-captured

# Show history
riotplan history
riotplan history --since 2026-01-29
riotplan history --type checkpoint_created
riotplan history --limit 20
```

## Benefits

### Complete Audit Trail
- Every action timestamped
- Full history in timeline.jsonl
- Easy to parse and analyze

### Checkpointing
- Save state at key decision points
- Name checkpoints meaningfully
- Restore if you change your mind
- Compare different paths

### Prompt Capture
- See conversation context at each checkpoint
- Understand reasoning behind decisions
- Share context with others
- Resume work later with full context

### Debugging
- Trace how idea evolved
- See what influenced decisions
- Identify when things went off track
- Learn from the process

## File Sizes

- `timeline.jsonl` - Grows linearly with events (~200 bytes/event)
- Checkpoints - One JSON file per checkpoint (~2-5 KB each)
- Prompts - One markdown file per checkpoint (~1-3 KB each)

For a typical idea with 50 events and 5 checkpoints:
- Timeline: ~10 KB
- Checkpoints: ~15 KB
- Prompts: ~10 KB
- **Total: ~35 KB**

Very reasonable overhead for complete history!

## Next Steps

1. Implement history logging in all existing tools
2. Add checkpoint tools
3. Add history viewing tools
4. Update prompts to suggest checkpoints at key moments
5. Add CLI commands
6. Create visualization tool (optional)

This gives you complete transparency into the ideation process!
