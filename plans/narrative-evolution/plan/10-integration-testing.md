# Step 10: Integration and Testing

## Objective

Test the complete Narrative Evolution with Checkpoints and Evidence workflow end-to-end. Validate that all features work together seamlessly and update documentation and prompts to reflect the new capabilities.

## Background

This is the final step that brings everything together. We need to:
- Test the full workflow from idea creation through checkpointing
- Validate integration between narrative capture, checkpoints, and evidence
- Update prompts to guide users through the new features
- Document the complete workflow
- Ensure backward compatibility with existing ideas

## Tasks

### 1. Create End-to-End Test Suite

Create `tests/integration/narrative-evolution.test.ts`:
```typescript
describe("Narrative Evolution Integration", () => {
  let testIdeaPath: string;
  
  beforeEach(async () => {
    // Create test idea
    testIdeaPath = await createTestIdea("narrative-test");
  });
  
  afterEach(async () => {
    // Cleanup
    await fs.rm(testIdeaPath, { recursive: true });
  });
  
  it("should support full narrative evolution workflow", async () => {
    // 1. Add narrative chunks
    await addNarrativeChunk(testIdeaPath, "Initial thinking about the problem...");
    await addNarrativeChunk(testIdeaPath, "Considering different approaches...");
    
    // 2. Add structured data
    await addNote(testIdeaPath, "Key insight from exploration");
    await addConstraint(testIdeaPath, "Must work with existing system");
    
    // 3. Create checkpoint
    await saveCheckpoint(testIdeaPath, "initial-exploration", "After first exploration");
    
    // 4. Continue exploration
    await addNarrativeChunk(testIdeaPath, "Exploring approach A in detail...");
    await addQuestion(testIdeaPath, "How does this integrate with X?");
    
    // 5. Create another checkpoint
    await saveCheckpoint(testIdeaPath, "approach-a-explored", "After exploring approach A");
    
    // 6. Try different direction
    await addNarrativeChunk(testIdeaPath, "Actually, approach B might be better...");
    
    // 7. Restore to previous checkpoint
    await restoreCheckpoint(testIdeaPath, "initial-exploration");
    
    // 8. Verify state was restored
    const timeline = await readTimeline(testIdeaPath);
    const narratives = getNarrativeChunks(timeline);
    
    // Should have restoration event
    const restorations = timeline.filter(e => e.type === "checkpoint_restored");
    expect(restorations).toHaveLength(1);
    
    // Timeline should preserve all history
    expect(timeline.length).toBeGreaterThan(10);
  });
  
  it("should support evidence gathering workflow", async () => {
    // 1. Manually add evidence
    await addEvidence(testIdeaPath, "/path/to/doc.md", "Relevant documentation");
    
    // 2. Search for evidence
    const results = await searchEvidence(testIdeaPath, "./plans", "planning process");
    expect(results.length).toBeGreaterThan(0);
    
    // 3. Verify evidence in timeline
    const timeline = await readTimeline(testIdeaPath);
    const evidenceEvents = timeline.filter(e => e.type === "evidence_added");
    expect(evidenceEvents.length).toBeGreaterThan(1);
  });
  
  it("should maintain backward compatibility", async () => {
    // Create idea without narrative features
    const oldStylePath = await createTestIdea("old-style");
    
    // Add only structured data (old way)
    await addNote(oldStylePath, "A note");
    await addConstraint(oldStylePath, "A constraint");
    
    // Should work without narrative chunks
    const timeline = await readTimeline(oldStylePath);
    expect(timeline.length).toBe(3); // created + note + constraint
    
    // Should be able to add narrative to old idea
    await addNarrativeChunk(oldStylePath, "Adding narrative later");
    
    const updatedTimeline = await readTimeline(oldStylePath);
    expect(updatedTimeline.length).toBe(4);
  });
});
```

### 2. Test MCP Tool Integration

Create `tests/integration/mcp-tools.test.ts`:
```typescript
describe("MCP Tools Integration", () => {
  it("should handle narrative capture via MCP", async () => {
    const result = await callMCPTool("riotplan_narrative_add", {
      path: testIdeaPath,
      content: "Testing narrative capture through MCP"
    });
    
    expect(result.message).toContain("✅");
  });
  
  it("should handle checkpoint lifecycle via MCP", async () => {
    // Create
    const createResult = await callMCPTool("riotplan_checkpoint_create", {
      path: testIdeaPath,
      name: "test-checkpoint",
      message: "Testing checkpoint creation"
    });
    expect(createResult.message).toContain("created");
    
    // List
    const listResult = await callMCPTool("riotplan_checkpoint_list", {
      path: testIdeaPath
    });
    expect(listResult.checkpoints).toHaveLength(1);
    
    // Show
    const showResult = await callMCPTool("riotplan_checkpoint_show", {
      path: testIdeaPath,
      checkpoint: "test-checkpoint"
    });
    expect(showResult.metadata.name).toBe("test-checkpoint");
    
    // Restore
    const restoreResult = await callMCPTool("riotplan_checkpoint_restore", {
      path: testIdeaPath,
      checkpoint: "test-checkpoint"
    });
    expect(restoreResult.message).toContain("Restored");
  });
});
```

### 3. Update Explore Idea Prompt

Update `src/mcp/prompts/explore_idea.md` with narrative and checkpoint guidance:
```markdown
## Capturing the Journey

As you explore the idea with the user, you have multiple ways to capture their thinking:

### Structured Capture
- **Notes**: Use `riotplan_idea_add_note` for discrete observations
- **Constraints**: Use `riotplan_idea_add_constraint` for limitations
- **Questions**: Use `riotplan_idea_add_question` for unknowns
- **Evidence**: Use `riotplan_idea_add_evidence` for supporting materials

### Narrative Capture
- **Narrative chunks**: Use `riotplan_narrative_add` for longer conversational input
- Captures the full context and nuance of the conversation
- Preserves the "why" behind structured decisions
- Use when the user is thinking out loud or exploring freely

### Checkpointing
Create checkpoints at natural stopping points:
- After significant exploration
- Before trying a new direction
- When the user wants to preserve current thinking

```
riotplan_checkpoint_create({
  name: "after-initial-exploration",
  message: "Captured state after exploring the problem space"
})
```

Checkpoints allow the user to return to this point later if needed.

### Evidence Gathering
Help the user find relevant evidence:
- Manual: `riotplan_idea_add_evidence` for known files
- Search: `riotplan_evidence_search` to find related materials

```
riotplan_evidence_search({
  searchPath: "./docs",
  query: "authentication patterns",
  maxResults: 5
})
```
```

### 4. Update Shape Approach Prompt

Update `src/mcp/prompts/shape_approach.md` to mention checkpoints:
```markdown
## Checkpointing During Shaping

Shaping often involves exploring multiple approaches. Create checkpoints to mark progress:

- After adding all approaches: `"all-approaches-captured"`
- After gathering feedback: `"feedback-complete"`
- Before selecting approach: `"ready-to-decide"`

This allows returning to earlier states if the selected approach doesn't work out.
```

### 5. Create User Documentation

Create `docs/narrative-evolution.md`:
```markdown
# Narrative Evolution with Checkpoints and Evidence

## Overview

RiotPlan supports capturing the full journey of how ideas evolve, not just the final structured output.

## Features

### Narrative Chunks
Capture conversational thinking alongside structured data...

### Checkpoints
Mark stopping points and enable recovery from dead ends...

### Evidence Gathering
Ground ideas in real data and documents...

## Workflow Example

[Complete example of using all features together]

## Best Practices

- Use narrative for context, structured data for facts
- Create checkpoints before major direction changes
- Gather evidence early to ground thinking
- Don't over-checkpoint - use at natural stopping points
```

### 6. Validate with Real Ideas

Test with actual ideas from the workspace:
```bash
# Test with hello-idea
cd plans/hello-idea

# Add narrative
riotplan narrative add "Testing narrative capture with real idea"

# Create checkpoint
riotplan checkpoint create "testing-features" "Validating narrative evolution features"

# List checkpoints
riotplan checkpoint list

# Search for evidence
riotplan evidence search ../done "planning execution"

# Verify timeline
cat .history/timeline.jsonl | jq .
```

### 7. Performance Testing

Test with large timelines and many checkpoints:
```typescript
describe("Performance", () => {
  it("should handle large timelines efficiently", async () => {
    // Add 1000 events
    for (let i = 0; i < 1000; i++) {
      await addNarrativeChunk(testIdeaPath, `Event ${i}`);
    }
    
    // Reading should still be fast
    const start = Date.now();
    const timeline = await readTimeline(testIdeaPath);
    const duration = Date.now() - start;
    
    expect(timeline.length).toBe(1001); // +1 for creation event
    expect(duration).toBeLessThan(100); // < 100ms
  });
  
  it("should handle many checkpoints", async () => {
    // Create 50 checkpoints
    for (let i = 0; i < 50; i++) {
      await saveCheckpoint(testIdeaPath, `checkpoint-${i}`, `Checkpoint ${i}`);
    }
    
    // Listing should be fast
    const start = Date.now();
    const checkpoints = await listCheckpoints(testIdeaPath);
    const duration = Date.now() - start;
    
    expect(checkpoints.length).toBe(50);
    expect(duration).toBeLessThan(200); // < 200ms
  });
});
```

## Acceptance Criteria

- [ ] End-to-end tests pass for complete workflow
- [ ] MCP tool integration tests pass
- [ ] Backward compatibility tests pass with existing ideas
- [ ] Performance tests show acceptable speed
- [ ] Explore idea prompt includes narrative and checkpoint guidance
- [ ] Shape approach prompt mentions checkpointing
- [ ] User documentation is complete and clear
- [ ] Manual testing with real ideas succeeds
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Documentation is updated

## Testing

```bash
# Run all tests
npm test

# Run integration tests specifically
npm test tests/integration/

# Run performance tests
npm test tests/performance/

# Manual end-to-end test
./scripts/test-narrative-evolution.sh

# Validate with hello-idea
cd plans/hello-idea
riotplan narrative add "Final validation test"
riotplan checkpoint create "final-test" "Testing complete implementation"
riotplan checkpoint list
riotplan checkpoint show final-test
```

## Files Changed

- `tests/integration/narrative-evolution.test.ts` (new)
- `tests/integration/mcp-tools.test.ts` (new)
- `tests/performance/timeline.test.ts` (new)
- `src/mcp/prompts/explore_idea.md` - Add narrative and checkpoint guidance
- `src/mcp/prompts/shape_approach.md` - Add checkpoint guidance
- `docs/narrative-evolution.md` (new) - User documentation
- `docs/tools.md` - Update with all new tools
- `README.md` - Add narrative evolution to features list
- `scripts/test-narrative-evolution.sh` (new) - Manual test script

## Notes

- This step validates everything works together
- Focus on real-world usage patterns
- Performance is important - timeline can get large
- Documentation should be clear and example-driven
- Backward compatibility is critical - don't break existing ideas
- Consider creating video walkthrough of features
- Think about what metrics to track (checkpoint usage, narrative frequency, etc.)
