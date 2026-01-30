# Narrative Capture Implementation Status

**Date**: 2026-01-29
**Context**: User requested implementation of conversation/narrative capture for RiotDoc

---

## What We Discovered

### 1. The Feature EXISTS in RiotPlan Source Code

Location: `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/idea.ts`

The `riotplan_idea_add_narrative` tool is:
- ✅ Fully implemented
- ✅ Properly exported in `index.ts`
- ✅ Registered in the tools array
- ✅ Has execution handler in switch statement
- ❌ **NOT available in Cursor's MCP tool list**

### 2. What the Tool Does

```typescript
{
  name: "riotplan_idea_add_narrative",
  description: "Add raw narrative content to the timeline. Use this to capture conversational context, thinking-out-loud, or any free-form input that doesn't fit structured categories. Narrative chunks preserve full-fidelity context.",
  inputSchema: {
    path: string,
    content: string,  // Raw narrative content
    source?: "typing" | "voice" | "paste" | "import",
    context?: string  // Context about what prompted this narrative
  }
}
```

The tool:
- Logs narrative chunks to `.history/timeline.jsonl` as `narrative_chunk` events
- Does NOT add to IDEA.md (keeps timeline separate)
- Preserves full-fidelity conversational context
- Allows specifying source (typing, voice, etc.)

### 3. Checkpoint System Works

The `riotplan_checkpoint_create` tool:
- ✅ Creates `.history/checkpoints/{name}.json` with state snapshot
- ✅ Creates `.history/prompts/{name}.md` with prompt context
- ✅ Captures current IDEA.md, LIFECYCLE.md content
- ✅ Includes recent timeline events
- ❌ Does NOT capture raw conversation (only structured state)

### 4. What We Did Manually

Since the narrative tool isn't available in Cursor, we manually:

1. Created `.history/prompts/001-narrative-capture-discussion.md` - Meta-discussion about the feature
2. Created `.history/prompts/002-full-conversation-capture.md` - Full conversation with user
3. Created `narrative-capture-implementation` checkpoint - Structured state snapshot
4. Added `narrative_chunk` events to timeline.jsonl - Raw conversation content
5. Updated IDEA.md with implementation status note

---

## The Problem

**Root Cause**: The `riotplan_idea_add_narrative` tool exists in source but Cursor can't see it.

**Possible Reasons**:
1. RiotPlan MCP server needs to be rebuilt/restarted
2. Tool wasn't included in the deployed build
3. Cursor's MCP cache needs refreshing
4. MCP server connection issue (got "Not connected" error when trying other tools)

---

## What the User Wants

Based on the conversation, the user wants:

1. **Automatic conversation capture**: Full dialogue preserved, not just structured notes
2. **Prompt context**: Conversations saved in format usable as prompts to regenerate/update plans
3. **No manual intervention**: Should happen automatically or be very easy to trigger
4. **No loss of content**: Rich narrative and deliberation preserved

The user's key insight:
> "the prompt is the prompt telling the model exactly how to call this tool"

Meaning: The captured conversation should provide enough context for an AI to understand the plan and continue working on it.

---

## Next Steps

### Immediate (User Should Do)

1. **Restart RiotPlan MCP server** or rebuild it
   - Check if server is running: Look for RiotPlan in Cursor's MCP settings
   - Rebuild: `cd /Users/tobrien/gitw/kjerneverk/riotplan && npm run build`
   - Restart Cursor to refresh MCP connections

2. **Verify tool availability**
   - Try calling `riotplan_idea_add_narrative` from Cursor
   - If it works, test with a simple narrative chunk

### Short-term (Implementation)

1. **Use the narrative tool** once available:
   ```typescript
   riotplan_idea_add_narrative({
     path: "/path/to/idea",
     content: "Full conversation text here...",
     source: "typing",
     context: "Discussing feature implementation"
   })
   ```

2. **Enhance checkpoint creation** to capture raw conversation:
   - Modify `capturePromptContext` in `history.ts` to include narrative chunks
   - Or create separate "conversation checkpoint" that explicitly captures dialogue

3. **Create Cursor prompt** that automatically uses narrative tool:
   - When user provides long-form input, capture it as narrative
   - When having extended conversations, periodically save to timeline

### Long-term (Architecture)

1. **Separate narrative from structured data**:
   - Timeline has both structured events AND narrative chunks
   - IDEA.md stays clean with extracted insights
   - Prompts include both for full context

2. **Make it automatic**:
   - Cursor prompt automatically captures user messages as narratives
   - Checkpoint creation includes conversation context
   - No manual intervention required

3. **Provide tools to work with narratives**:
   - Search/query narrative chunks
   - Extract insights from narratives into structured notes
   - Regenerate plan from narrative + structured state

---

## Files Created

1. `.history/prompts/001-narrative-capture-discussion.md` - Meta-discussion
2. `.history/prompts/002-full-conversation-capture.md` - Full conversation
3. `.history/checkpoints/narrative-capture-implementation.json` - State snapshot
4. `.history/prompts/narrative-capture-implementation.md` - Checkpoint prompt
5. `.history/timeline.jsonl` - Added narrative_chunk events (2 entries)
6. `NARRATIVE-CAPTURE-STATUS.md` - This document

---

## Timeline Events Added

```jsonl
{"timestamp":"2026-01-29T23:19:30.000Z","type":"narrative_chunk","data":{"content":"USER: Hey, I just changed riot plan to capture narrative conversation content...[truncated]","source":"typing","context":"Discussing feature implementation"}}

{"timestamp":"2026-01-29T23:25:00.000Z","type":"narrative_chunk","data":{"content":"FULL CONVERSATION CAPTURE:\n\nUSER: Hey, I just changed riot plan...[full conversation with all actions]","source":"typing","context":"Complete conversation about implementing narrative capture, including all user frustrations and assistant actions"}}
```

---

## Key Insight

The narrative capture feature **is implemented** in RiotPlan, but **not accessible** in Cursor. This is a deployment/connection issue, not a missing feature. Once the MCP server is restarted or Cursor's connection is refreshed, the tool should work as designed.

The user's frustration is valid - if a feature is implemented, it should be available. The disconnect between "implemented in source" and "available in Cursor" is the problem to solve.
