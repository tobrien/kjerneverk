# RiotPlan Prompt Update - Narrative Capture

## Date
January 29, 2026

## Issue Identified
The `/riotplan/explore_idea` Cursor prompt was not capturing full narrative/conversational content from users. It only extracted structured notes, constraints, and questions, losing valuable context.

## Root Cause
The `explore_idea.md` prompt file did not include instructions for using the `riotplan_idea_add_narrative` tool, even though:
- The tool exists in the MCP server code
- It's registered and available
- Other prompts (like `develop_plan.md`) use it extensively

## Changes Made

### File Updated
`/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/prompts/explore_idea.md`

### Changes
1. Added section explaining TWO-STEP capture process:
   - FIRST: Capture full narrative with `riotplan_idea_add_narrative`
   - THEN: Extract structured information (notes, constraints, questions, evidence)

2. Updated example conversation to demonstrate narrative capture in action

3. Added explanation of why both approaches are valuable:
   - Narrative preserves full context and nuance
   - Structured data makes information actionable
   - Timeline shows both conversation and decisions

## Build Status
✅ Built successfully at 2026-01-29 15:22 PST
✅ Updated prompt copied to `dist/mcp/prompts/explore_idea.md`
✅ Verified: 2 occurrences of `riotplan_idea_add_narrative` in built prompt

## Next Steps
1. **Restart Cursor's MCP connection** to pick up the updated prompt
   - Toggle the RiotPlan MCP server off/on in Cursor settings
   - OR restart Cursor entirely

2. **Test the updated prompt** by running `/riotplan/explore_idea` again

3. **Verify narrative capture** by checking that user's full conversational responses appear in `.history/timeline.jsonl` as `narrative_chunk` events

## Expected Behavior After Update
When using `/riotplan/explore_idea`:
- User provides detailed response (especially voice transcriptions)
- AI captures FULL TEXT as narrative chunk first
- AI then extracts structured notes/constraints/questions
- Timeline contains both raw narrative AND structured data
- Full context is preserved for future reference

## Files Changed
- `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/prompts/explore_idea.md`
- `/Users/tobrien/gitw/kjerneverk/riotplan/dist/mcp/prompts/explore_idea.md` (built)
