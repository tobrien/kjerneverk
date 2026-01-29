# Idea and Shaping Stage Implementation - Complete

## Summary

Successfully implemented MCP tools and prompts for the Idea and Shaping stages of the plan lifecycle. This addresses the core issue: **AI was jumping straight to detailed execution plans without collaborative exploration**.

## What Was Built

### 12 New MCP Tools

**Idea Stage (6 tools)**
- `riotplan_idea_create` - Create lightweight idea
- `riotplan_idea_add_note` - Add thoughts
- `riotplan_idea_add_constraint` - Add constraints
- `riotplan_idea_add_question` - Add questions
- `riotplan_idea_add_evidence` - Attach files/images/docs
- `riotplan_idea_kill` - Kill idea with reason

**Shaping Stage (6 tools)**
- `riotplan_shaping_start` - Begin shaping
- `riotplan_shaping_add_approach` - Add approach with tradeoffs
- `riotplan_shaping_add_feedback` - Capture feedback
- `riotplan_shaping_add_evidence` - Add supporting evidence
- `riotplan_shaping_compare` - Compare approaches
- `riotplan_shaping_select` - Select approach

### 2 New MCP Prompts

**`/riotplan/explore_idea`**
- Guides collaborative idea exploration
- Asks open questions
- Captures constraints, questions, evidence
- Decides when to move to shaping

**`/riotplan/shape_approach`**
- Guides approach comparison
- Surfaces tradeoffs explicitly
- Gathers evidence
- Helps select best approach
- Only then generates detailed plan

## Files Created/Modified

### New Files
- `src/mcp/tools/idea.ts` - Idea stage tools (252 lines)
- `src/mcp/tools/shaping.ts` - Shaping stage tools (334 lines)
- `src/mcp/prompts/explore_idea.md` - Idea exploration prompt
- `src/mcp/prompts/shape_approach.md` - Approach shaping prompt

### Modified Files
- `src/mcp/tools/shared.ts` - Added utility functions
- `src/mcp/tools/index.ts` - Registered new tools
- `src/mcp/prompts/index.ts` - Registered new prompts

## Build Status

✅ **Build successful**
- All TypeScript compiles without errors
- MCP server builds correctly
- Tools ready to use in Cursor

## How It Works Now

### Before (What Happened Earlier)
```
User: "I have an idea for an 8-stage lifecycle"
AI: *immediately generates 12 detailed steps*
User: "Wait, I wasn't ready for that!"
```

### After (How It Should Work)
```
User: "I have an idea for an 8-stage lifecycle"
AI: Uses /riotplan/explore_idea prompt

AI: "Let's explore that. I'll create a lightweight idea."
   riotplan_idea_create({ code: "plan-lifecycle", description: "..." })

AI: "What's driving this? What constraints should we consider?"
User: "Don't want heavy state machine library. Keep it simple."
   riotplan_idea_add_constraint({ constraint: "No heavy state machine library" })

AI: "Any questions we need to answer?"
User: "How do we handle backward transitions?"
   riotplan_idea_add_question({ question: "How to handle backward transitions?" })

AI: "Ready to explore different approaches?"
User: "Yes"
   riotplan_shaping_start()

AI: "What approaches could we take?"
User: "Simple validation vs formal state machine"
   riotplan_shaping_add_approach({
     name: "Simple Validation",
     tradeoffs: ["Pro: Easy to understand", "Con: Less formal"],
     ...
   })

AI: "Let's compare these approaches"
   riotplan_shaping_compare()

AI: "Which feels right?"
User: "Simple validation"
   riotplan_shaping_select({ approach: "Simple Validation", ... })

AI: "Now I'll generate detailed steps based on our shaped understanding"
   riotplan_generate({ steps: 8 })
```

## Key Benefits

### For Users
- **No premature commitment** - Ideas don't force execution
- **Collaborative exploration** - AI asks, doesn't assume
- **Evidence-based** - Attach docs, diagrams, examples
- **Explicit tradeoffs** - See pros/cons before deciding
- **Transparent reasoning** - Know why decisions were made

### For AI Assistants
- **Structured exploration** - Clear workflow for thinking
- **Context gathering** - Collect constraints early
- **Decision support** - Help compare objectively
- **Commitment awareness** - Know when user is ready
- **Better plans** - Generate from shaped understanding

## Testing

To test the new tools:

```bash
# 1. Restart Cursor to load new MCP tools

# 2. Try the explore_idea prompt
/riotplan/explore_idea

# 3. Or use tools directly
riotplan_idea_create({
  code: "test-idea",
  description: "Testing the new workflow"
})

riotplan_idea_add_note({ note: "This is a test" })

riotplan_shaping_start()

riotplan_shaping_add_approach({
  name: "Approach 1",
  description: "First approach",
  tradeoffs: ["Pro: Simple", "Con: Limited"]
})
```

## Next Steps

1. **Test the workflow** - Try creating an idea and shaping it
2. **Refine based on usage** - Adjust prompts and tools
3. **Add CLI commands** - `riotplan idea create`, `riotplan shape add-approach`
4. **Document patterns** - Common workflows and examples
5. **Build remaining lifecycle stages** - Analyzed, Approved, etc.

## What This Solves

This directly addresses the problem from our conversation:

> "I had an idea, and I really wasn't ready for the model to take it away and build a fully developed plan yet. I really wanted it to stop at the plan-lifecycle-prompt.md and plan-lifecycle-description.txt level."

Now:
- **Idea stage** = That lightweight level you wanted
- **Shaping stage** = Where you provide feedback and add evidence
- **Built stage** = Only happens after you've shaped the approach

The lifecycle now supports **thinking before committing**.

## Files in This Plan

```
/Users/tobrien/gitw/kjerneverk/plans/plan-lifecycle/
  PROMPT.md                      # Original prompt
  SUMMARY.md                     # Executive summary
  STATUS.md                      # Current status
  OVERVIEW.md                    # High-level overview
  MCP-TOOLS-CREATED.md          # Detailed tool documentation
  IMPLEMENTATION-COMPLETE.md     # This file
```

## Build Verification

```bash
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build
# ✓ built in 1.36s
# ✓ built in 100ms
# MCP build complete!
```

All tools are now available in the riotplan MCP server!

---

**Status**: ✅ Implementation Complete
**Build**: ✅ Successful
**Ready**: ✅ For Testing
**Next**: Try the `/riotplan/explore_idea` prompt!
