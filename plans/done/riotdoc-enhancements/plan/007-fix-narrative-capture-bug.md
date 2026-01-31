# Step 7: Fix Critical Narrative Capture Bug

## Objective

Fix the narrative capture bug that saves ONLY to timeline.jsonl. Must save to BOTH timeline.jsonl AND .history/prompts/ as numbered files.

**Why this is CRITICAL**: User is very frustrated about this bug. Mentioned multiple times (Timeline Events 72, 81). Said "I'm really not happy that I have to go back and tell you this again."

## Context from Evidence

### The Bug (Timeline Event 72, 73)

**Current behavior** (RiotPlan source code, line 312-329 of `src/mcp/tools/idea.ts`):
```typescript
export async function ideaAddNarrative(args) {
    await logEvent(ideaPath, {
        timestamp: formatTimestamp(),
        type: 'narrative_chunk',
        data: { content, source, context, speaker }
    });
    return `✅ Narrative chunk added to timeline (${args.content.length} characters)`;
}
```

**Problem**: Only logs to timeline.jsonl. Does NOT save to .history/prompts/.

**User frustration** (Timeline Event 72):
> "I think you called out to like riot plan idea add narrative and I see that it sent The sent the stuff to Ryan add narrative plan got a response narrative chunk adde and that's not really what I thought was gonna happen in the response it says narrative chunk added to the timeline, but I don't see it in the timeline and that's not really where I wanted it to be anyway I wanted it to be stored in the file system and something like the prompt directory"

### What User Wants (Timeline Event 72)

1. Save to timeline.jsonl (current behavior - keep this)
2. **ALSO** save to .history/prompts/NNN-description.md (NEW behavior)
3. Auto-number files: 001, 002, 003, etc.
4. Generate filename from context
5. Preserve full narrative content verbatim

### Why This Matters (Timeline Event 58, 59)

> "the prompt is the prompt telling the model exactly how to call this tool"

**User's insight**: The captured conversations should be reusable as PROMPTS. When you load a plan later, you should be able to read the conversation history and understand the full context.

**Current problem**: Narratives in timeline.jsonl are mixed with other events. Hard to extract just the conversations. Prompts directory makes conversations easily accessible.

## Tasks

### 1. Copy Fixed Implementation from RiotPlan

**Note**: This bug was supposedly fixed in RiotPlan (Timeline Event 83), but need to verify and copy to RiotDoc.

**Location**: `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/idea.ts` line 312-329

**New implementation should**:
```typescript
export async function ideaAddNarrative(args) {
    const ideaPath = args.path || process.cwd();
    
    // 1. Log to timeline (existing behavior)
    await logEvent(ideaPath, {
        timestamp: formatTimestamp(),
        type: 'narrative_chunk',
        data: { content: args.content, source: args.source, context: args.context, speaker: args.speaker }
    });
    
    // 2. ALSO save to .history/prompts/ (NEW behavior)
    const promptsDir = join(ideaPath, '.history', 'prompts');
    await mkdir(promptsDir, { recursive: true });
    
    // 3. Auto-number files
    const existingFiles = await readdir(promptsDir);
    const promptFiles = existingFiles.filter(f => /^\d{3}-.*\.md$/.test(f));
    const nextNumber = promptFiles.length + 1;
    const paddedNumber = String(nextNumber).padStart(3, '0');
    
    // 4. Generate filename from context
    const slug = (args.context || 'narrative')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
    const filename = `${paddedNumber}-${slug}.md`;
    
    // 5. Write file with full content
    const content = `# ${args.context || 'Narrative'}\n\n` +
        `**Date**: ${formatTimestamp()}\n` +
        `**Source**: ${args.source || 'unknown'}\n` +
        `**Speaker**: ${args.speaker || 'user'}\n\n` +
        `---\n\n${args.content}`;
    
    await writeFile(join(promptsDir, filename), content, 'utf-8');
    
    return `✅ Narrative saved to timeline and ${filename}`;
}
```

### 2. Add to RiotDoc

Copy the fixed implementation to RiotDoc:
- Create `src/history/` directory (if copying infrastructure from Step 5-6)
- Add `narrativeCapture.ts` with the fixed function
- Export from `src/history/index.ts`

### 3. Add MCP Tool

Register tool in RiotDoc MCP server:
```typescript
{
    name: "riotdoc_add_narrative",
    description: "Capture raw narrative content to both timeline and prompts directory. Use for user conversations, voice transcripts, or any free-form input.",
    inputSchema: {
        type: "object",
        properties: {
            path: { type: "string", description: "Document workspace path" },
            content: { type: "string", description: "Raw narrative content" },
            source: { type: "string", enum: ["typing", "voice", "paste", "import"] },
            context: { type: "string", description: "Context about this narrative" },
            speaker: { type: "string", description: "Who is speaking (user/assistant)" }
        },
        required: ["content"]
    }
}
```

### 4. Test Thoroughly

**Test Case 1**: Single narrative
- Call tool with test content
- Verify appears in timeline.jsonl
- Verify file created: .history/prompts/001-test.md
- Verify content matches exactly

**Test Case 2**: Multiple narratives
- Call tool 3 times
- Verify files numbered: 001, 002, 003
- Verify all in timeline.jsonl
- Verify all have separate files

**Test Case 3**: Long narrative
- Call with 5000+ character content
- Verify full content preserved
- Verify no truncation

**Test Case 4**: Special characters in context
- Call with context: "User's feedback about templates & approaches"
- Verify filename: 003-users-feedback-about-templates-approaches.md
- Verify special chars handled correctly

### 5. Update Documentation

Create `docs/narrative-capture.md`:
```markdown
# Narrative Capture

## Purpose
Captures raw conversational content to preserve full context and deliberation.

## Why Two Locations?

1. **timeline.jsonl**: All events in chronological order
2. **.history/prompts/NNN-xxx.md**: Conversations as reusable prompts

## Usage

```typescript
riotdoc_add_narrative({
    content: "Full user response here...",
    source: "voice",
    context: "User explaining template requirements",
    speaker: "user"
})
```

## File Naming

Files are auto-numbered: 001, 002, 003, etc.
Filename generated from context: "User feedback" → 001-user-feedback.md
```

## Acceptance Criteria

- [ ] Narratives saved to timeline.jsonl (existing behavior preserved)
- [ ] Narratives ALSO saved to .history/prompts/NNN-xxx.md (NEW behavior)
- [ ] Files auto-numbered sequentially (001, 002, 003...)
- [ ] Filename generated from context (slugified, max 50 chars)
- [ ] Full narrative content preserved verbatim (no truncation)
- [ ] MCP tool `riotdoc_add_narrative` works correctly
- [ ] Test cases pass (single, multiple, long, special chars)
- [ ] Documentation explains purpose and usage
- [ ] User can read .history/prompts/ files as conversation history

## Dependencies

- Step 5: History infrastructure copied from RiotPlan
- Step 6: Checkpoint infrastructure copied from RiotPlan
- RiotPlan bug fix at `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/idea.ts`

## Constraints Honored

- Constraint 9 (IDEA.md line 110): "Must capture narrative conversation feedback similar to RiotPlan's feedback system - preserving deliberation about document decisions"

## Evidence Referenced

- Timeline Event 72: User frustration about bug
- Timeline Event 73: Bug identified in source code (line 312-329)
- Timeline Event 81: User repeated frustration
- Timeline Event 83: Bug supposedly fixed in RiotPlan (verify this)
- Timeline Event 58, 59: "the prompt is the prompt" - conversations are reusable prompts

## Estimated Effort

3-4 hours

**Breakdown**:
- Copy fixed implementation from RiotPlan: 1 hour
- Add to RiotDoc: 1 hour
- Test thoroughly (4 test cases): 1 hour
- Documentation: 1 hour

## Notes

**CRITICAL**: This is the bug that frustrated the user most. Test thoroughly before marking complete.

**User quote** (Timeline Event 72): "I'm really not happy that I have to go back and tell you this again."

**Verification**: After implementation, call the tool and verify:
1. File appears in .history/prompts/ with correct number
2. Content in file matches input exactly
3. Timeline.jsonl also has the event
4. User can read the file and see full conversation
