# Conversation: Narrative Capture Discussion

**Timestamp**: 2026-01-29T23:30:00.000Z
**Stage**: idea
**Context**: User discovered that RiotPlan's prompt capture feature wasn't implemented in RiotDoc yet

## User's Concern

User asked about the `.history/prompts/` feature that was supposed to capture full conversation content. They were frustrated because:

1. They thought it had been implemented when a plan was created
2. They're losing valuable narrative conversation content
3. The feature exists in RiotPlan (in `/Users/tobrien/gitw/kjerneverk`) but not in this RiotDoc idea

## Key Points from User

> "I just changed riot plan to capture narrative conversation content like right now what I really like about riot plan is when I'm using it. I can provide notes and feedback and that get stored in the timeline of the timeline is ad. Jason L file that contains all of the notes and everything that I think is a killer feature"

> "didn't I just change riot pla so that it could also store the conversations for example right now I'm giving you a lot of information. It's a lot of textural content. My understanding is that you were going to store that in like.history/prompts and that this full content could then be used to update a plan"

> "What do you mean it has been implemented? Is it just placeholder code? That's annoying implement it if I created a plan for it you should've implemented it"

> "you're saving the full conversation of content the other theory I have that I think you might not be getting is the prompt is the prompt telling the model exactly how to call this tool"

> "I don't know why this is taking so long to do I think we've lost a lot of good"

## What Was Discovered

1. **RiotPlan HAS this feature** (in `/Users/tobrien/gitw/kjerneverk`):
   - `.history/prompts/` directory stores full conversation context
   - Created when checkpoints are made with `capturePrompt: true`
   - Contains markdown files with full conversation, current state, timeline events

2. **RiotDoc does NOT have it yet**:
   - This is just an idea in `/Users/tobrien/gitw/redaksjon/riotdoc-document-lifecycle/`
   - Timeline notes mention it should be adapted from RiotPlan
   - Not implemented yet

3. **Format of prompt files** (from RiotPlan example):
   - Checkpoint name and timestamp
   - Current stage
   - Full snapshot of IDEA.md, SHAPING.md, LIFECYCLE.md
   - Recent timeline events
   - Files at that point

## User's Understanding of "Prompt"

The user mentioned: "the prompt is the prompt telling the model exactly how to call this tool"

This suggests they want:
- The full conversation context (what they're saying)
- The AI's responses
- The context that would be used to regenerate or update the plan
- NOT just a summary, but the FULL narrative content

## What Needs to Happen

1. **Immediate**: Save THIS conversation as a prompt file
2. **Short-term**: Implement prompt capture for RiotDoc idea
3. **Medium-term**: Make it automatic or easy to trigger
4. **Long-term**: Ensure RiotPlan in redaksjon workspace has this feature too

## Current State

**IDEA.md** contains 40 notes including:
- Document lifecycle design
- Built-in document types (blog post, podcast script)
- Version numbering (v0.1 → v1.0)
- Feedback system requirements
- Note that RiotDoc already exists at `/Users/tobrien/gitw/kjerneverk/riotdoc`

**Timeline** has 48 events tracking the evolution of this idea

**Missing**: Full conversational context that led to these structured notes

## Action Items

1. ✅ Create this prompt file to capture current conversation
2. ⏳ Find actual RiotPlan implementation code (not just docs)
3. ⏳ Implement checkpoint creation with prompt capture
4. ⏳ Add MCP tool for creating checkpoints
5. ⏳ Test with this conversation as first example

---

This file was created manually to preserve the conversation that was about to be lost. Future prompt files should be created automatically by the checkpoint system.
