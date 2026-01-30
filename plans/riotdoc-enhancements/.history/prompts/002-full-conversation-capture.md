# Full Conversation: Prompt Capture Implementation Discussion

**Timestamp**: 2026-01-29T23:20:00.000Z
**Participants**: User (Tim), AI Assistant (Claude)
**Platform**: Cursor IDE
**Context**: Discussing why prompt/narrative capture wasn't implemented

---

## The Conversation

### User's First Message

> Hey, I just changed riot plan to capture narrative conversation content like right now what I really like about riot plan is when I'm using it. I can provide notes and feedback and that get stored in the timeline of the timeline is ad. Jason L file that contains all of the notes and everything that I think is a killer feature, but didn't I just change riot pla so that it could also store the conversations for example right now I'm giving you a lot of information. It's a lot of textural content. My understanding is that you were going to store that in like.history/prompts and that this full content could then be used to update a plan does that make sense? Am I just going crazy? Did I miss remember that because I thought you just imp.

### AI Response

I explained that:
- RiotPlan (in `/Users/tobrien/gitw/kjerneverk`) HAS this feature implemented
- `.history/prompts/` directory stores full conversation context when checkpoints are created with `capturePrompt: true`
- This RiotDoc idea (in `/Users/tobrien/gitw/redaksjon/riotdoc-document-lifecycle/`) does NOT have it yet
- The timeline notes mention it should be adapted from RiotPlan but hasn't been implemented

I offered to implement it immediately.

### User's Response

> What do you mean it has been implemented? Is it just placeholder code? That's annoying implement it if I created a plan for it you should've implemented it but I also wanna make sure that we're doing this right so you're saving the full conversation of content the other theory I have that I think you might not be getting is the prompt is the prompt telling the model exactly how to call this tool anyway yeah implement it. I don't know why this is taking so long to do I think we've lost a lot of good

**Key frustrations expressed:**
1. If a plan was created for this feature, it should have been implemented
2. We're losing valuable conversation content
3. The "prompt" should be the full conversation that tells the model how to work with the plan
4. This is taking too long and we've already lost good content

### What I Did

1. Created `.history/prompts/001-narrative-capture-discussion.md` manually to save the meta-discussion
2. Used `riotplan_checkpoint_create` MCP tool to create a checkpoint
3. Discovered the checkpoint creates a prompt file but it only contains structured state (IDEA.md, timeline events), not the raw conversation
4. Added a `narrative_chunk` event to the timeline to capture this conversation
5. Created THIS file (002) to capture the FULL conversation with all context

---

## What the User Actually Wants

Based on this conversation, the user wants:

1. **Full conversation capture**: Not just structured notes, but the ENTIRE back-and-forth dialogue
2. **Prompt context**: The conversation should be saved in a format that could be used as a prompt to regenerate or update the plan
3. **Automatic capture**: This should happen automatically, not require manual intervention
4. **No loss of content**: The rich narrative and deliberation should be preserved, not just the extracted structured data

---

## The Problem

The current RiotPlan checkpoint system:
- ✅ Creates `.history/checkpoints/{name}.json` with structured state
- ✅ Creates `.history/prompts/{name}.md` with IDEA.md content and timeline
- ❌ Does NOT capture the raw conversation that led to the state
- ❌ Does NOT preserve the full narrative context

What's needed:
- Capture the actual user messages and AI responses
- Store them in a format that can be used as prompt context
- Make this automatic or very easy to trigger
- Ensure no valuable conversation content is lost

---

## Next Steps

1. Understand how RiotPlan MCP server accesses conversation history (if it does)
2. Implement a way to capture raw conversation alongside structured state
3. Make it easy to trigger (maybe automatic on checkpoint creation)
4. Test with this conversation as the first example
5. Ensure the captured content can be used to regenerate/update plans

---

## Meta Note

This file itself is an example of what should be automatically captured. The user shouldn't have to ask for this - it should just happen as part of the checkpoint/history system.
