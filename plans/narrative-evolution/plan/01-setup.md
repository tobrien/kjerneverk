# Step 01: Design Data Model

## Objective

Define the data model for narrative chunks and checkpoints in the timeline format. Establish clear event types, data structures, and storage conventions that will guide implementation.

## Background

Currently, RiotPlan's timeline.jsonl captures structured events like `note_added`, `constraint_added`, `question_added`, etc. We need to extend this to support:
1. Raw narrative chunks (conversational input that doesn't fit structured categories)
2. Checkpoint markers (points in time where user wants to save state)
3. Evidence gathering events (both manual and model-assisted)

The design must maintain backward compatibility with existing timeline readers and keep the format simple and human-readable.

## Tasks

### 1. Define Narrative Chunk Event Type

Design the `narrative_chunk` event type structure:
```typescript
{
  timestamp: string;
  type: "narrative_chunk";
  data: {
    content: string;        // Raw user input
    source?: string;        // "typing" | "voice" | "paste"
    context?: string;       // Optional context about what prompted this
  }
}
```

### 2. Define Checkpoint Event Type

Design the `checkpoint_created` event type structure:
```typescript
{
  timestamp: string;
  type: "checkpoint_created";
  data: {
    name: string;           // User-provided checkpoint name
    message: string;        // Description of what's being checkpointed
    snapshotPath?: string;  // Optional path to full snapshot
  }
}
```

### 3. Define Checkpoint Storage Format

Design checkpoint storage in `.history/checkpoints/` directory:
- Each checkpoint gets a directory: `.history/checkpoints/{timestamp}-{name}/`
- Contains snapshot of current state at that moment
- Includes metadata file with checkpoint info

### 4. Document Event Type Registry

Update event type registry to include new types:
- `narrative_chunk` - Raw conversational input
- `checkpoint_created` - Checkpoint marker
- `evidence_gathered` - Model-assisted evidence gathering

### 5. Design Checkpoint Metadata Format

Define checkpoint metadata structure:
```typescript
{
  name: string;
  timestamp: string;
  message: string;
  timelinePosition: number;  // Position in timeline.jsonl
  filesSnapshot: string[];   // List of files at checkpoint
}
```

## Acceptance Criteria

- [ ] Event type structures are clearly defined with TypeScript types
- [ ] Checkpoint storage format is documented
- [ ] Design maintains backward compatibility with existing timeline readers
- [ ] Format is simple and human-readable (JSONL + Markdown)
- [ ] Design supports both structured and free-form input
- [ ] Checkpoint restoration strategy is clear

## Testing

- Review design with existing timeline.jsonl examples
- Verify event structures are complete and unambiguous
- Confirm checkpoint storage doesn't conflict with existing .history/ structure
- Validate that design supports the use cases from hello-idea exploration

## Files Changed

- `docs/data-model.md` (new) - Document event types and checkpoint format
- `src/types.ts` - Add TypeScript types for new event structures

## Notes

- Keep it simple - don't over-engineer the checkpoint format
- Narrative chunks should be optional - existing workflows shouldn't require them
- Consider how checkpoints interact with Git - they're lightweight markers, not Git commits
- Think about how to query/filter timeline for specific event types
- Checkpoint names should be human-friendly (like Git tags, not SHAs)
