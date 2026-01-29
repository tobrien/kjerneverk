# Step 02: Extend Timeline Format

## Objective

Implement support for narrative_chunk events in the timeline.jsonl format. Update timeline writer and reader to handle the new event type while maintaining backward compatibility.

## Background

The timeline.jsonl file is the core data structure that captures the evolution of ideas. Currently it handles structured events (notes, constraints, questions, evidence). We need to extend it to capture raw narrative chunks - the conversational input that provides context and nuance beyond structured data.

This step implements the data model designed in Step 01.

## Tasks

### 1. Add TypeScript Types

Update `src/types.ts` with new event types:
```typescript
export interface NarrativeChunkEvent {
  timestamp: string;
  type: "narrative_chunk";
  data: {
    content: string;
    source?: "typing" | "voice" | "paste";
    context?: string;
  };
}

export interface CheckpointCreatedEvent {
  timestamp: string;
  type: "checkpoint_created";
  data: {
    name: string;
    message: string;
    snapshotPath?: string;
  };
}

export type TimelineEvent = 
  | IdeaCreatedEvent
  | NoteAddedEvent
  | ConstraintAddedEvent
  | QuestionAddedEvent
  | EvidenceAddedEvent
  | NarrativeChunkEvent
  | CheckpointCreatedEvent
  | ... // existing types
```

### 2. Update Timeline Writer

Modify `src/history/timeline.ts` to support writing narrative chunks:
```typescript
export async function addNarrativeChunk(
  ideaPath: string,
  content: string,
  source?: string,
  context?: string
): Promise<void> {
  const event: NarrativeChunkEvent = {
    timestamp: new Date().toISOString(),
    type: "narrative_chunk",
    data: { content, source, context }
  };
  await appendToTimeline(ideaPath, event);
}
```

### 3. Update Timeline Reader

Ensure timeline reader handles new event types gracefully:
```typescript
export async function readTimeline(ideaPath: string): Promise<TimelineEvent[]> {
  const timelinePath = path.join(ideaPath, ".history", "timeline.jsonl");
  const lines = await fs.readFile(timelinePath, "utf-8");
  return lines
    .split("\n")
    .filter(line => line.trim())
    .map(line => JSON.parse(line) as TimelineEvent);
}
```

### 4. Add Timeline Filtering Utilities

Create utilities to filter timeline by event type:
```typescript
export function filterTimelineByType(
  timeline: TimelineEvent[],
  type: string
): TimelineEvent[] {
  return timeline.filter(event => event.type === type);
}

export function getNarrativeChunks(timeline: TimelineEvent[]): NarrativeChunkEvent[] {
  return filterTimelineByType(timeline, "narrative_chunk") as NarrativeChunkEvent[];
}
```

### 5. Update IDEA.md Renderer

Modify the IDEA.md renderer to optionally show narrative chunks:
- Don't show them by default (keep IDEA.md clean)
- Provide a way to view them (via history tool or separate view)
- Preserve existing rendering for structured events

## Acceptance Criteria

- [ ] TypeScript types are defined for narrative_chunk and checkpoint_created events
- [ ] Timeline writer can append narrative chunks to timeline.jsonl
- [ ] Timeline reader correctly parses new event types
- [ ] Filtering utilities work for extracting specific event types
- [ ] Existing timeline functionality is not broken (backward compatibility)
- [ ] Tests pass for timeline read/write operations
- [ ] Manual test: can append narrative chunk and read it back

## Testing

```bash
# Unit tests
npm test src/history/timeline.test.ts

# Integration test - create idea and add narrative chunk
riotplan idea create test-narrative "Testing narrative chunks"
# Add narrative chunk via new tool (will be created in next step)
# Verify timeline.jsonl contains the narrative_chunk event
cat .history/timeline.jsonl | grep narrative_chunk
```

## Files Changed

- `src/types.ts` - Add new event type definitions
- `src/history/timeline.ts` - Add narrative chunk writer and filtering utilities
- `src/history/timeline.test.ts` - Add tests for new event types
- `docs/data-model.md` - Document the timeline format extension

## Notes

- Keep timeline.jsonl append-only for simplicity
- Each line is a complete JSON object (JSONL format)
- Narrative chunks can be large - consider line length limits if needed
- Don't break existing tools that read timeline.jsonl
- Consider adding a timeline validation utility to check format correctness
