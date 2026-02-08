# Narrative: Step 5 execution - enhanced explore_idea prompt for existing plans

**Date**: 2026-02-07T22:39:23.950Z
**Source**: typing
**Speaker**: assistant

---

Step 5 execution complete. Enhanced src/mcp/prompts/explore_idea.md to support resuming existing plans.

CHANGES:
- Added step 1: "Detect Existing Plan or Create New" - checks if user provided a path to existing plan files
- Added step 1a: "Extract or Gather Idea Details (New Plans Only)" - original workflow for new ideas
- Added step 1b: "Resume Existing Plan (Existing Plans Only)" - new workflow for existing plans
- When existing plan detected: reads status and history, summarizes state, asks where to pick up
- Added Example 5: showing resume workflow with actual plan
- Updated anti-patterns: don't create new idea when existing plan detected
- Updated success patterns: detect existing plans, summarize state before continuing

DETECTION LOGIC:
- If user provides a path, check for IDEA.md, SHAPING.md, STATUS.md, or LIFECYCLE.md
- If found → resume existing plan (step 1b)
- If not found → create new idea (step 1a)

RESUME WORKFLOW:
1. Call riotplan_status and riotplan_history_show to read current state
2. Summarize: stage, notes/constraints/questions count, last activity
3. Ask: "Where would you like to pick up?"
4. Continue exploration using same tools (add_note, add_constraint, etc.)

VERIFICATION:
- Build succeeded
- No Cursor command version found (only MCP prompt exists)
- All existing explore_idea functionality preserved
