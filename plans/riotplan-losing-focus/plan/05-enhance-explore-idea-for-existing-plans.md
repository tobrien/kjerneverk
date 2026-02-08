# Step 5: Enhance explore_idea Prompt for Existing Plans

**Recommended Model**: Sonnet 4.5
**Rationale**: Prompt engineering with awareness of the plan lifecycle and directory detection logic. Needs to understand how explore_idea currently works and extend it thoughtfully. Not mechanical, but not requiring the deepest model either.

**Depends on**: Nothing (can run in parallel)

## Objective

Modify the `explore_idea` prompt so it can detect and resume exploration of existing plans, not just create new ones. The user should be able to say "explore_idea /path/to/existing-plan" and resume where they left off.

## Background

Currently, `explore_idea` (in `src/mcp/prompts/explore_idea.md` and the Cursor command at `.cursor/commands/explore_idea.md`) only handles creating new ideas. The user wants to be able to:
1. Give it a file path to an existing plan
2. Have it sense the current directory/context and detect an existing plan
3. Resume exploration with the same guardrails as a new idea

## Tasks

- [ ] Update `explore_idea.md` prompt to add a "Resume Existing Plan" workflow
- [ ] Add detection logic: if user provides a path that contains IDEA.md, SHAPING.md, or STATUS.md, treat as existing plan
- [ ] When resuming, read the existing plan state (notes, constraints, questions, evidence, stage)
- [ ] Summarize current state to the user: "This plan is in [stage] with [N] notes, [N] questions..."
- [ ] Continue exploration from where it left off
- [ ] Add examples showing resume usage
- [ ] Update the Cursor command version if it exists at `.cursor/commands/explore_idea.md`
- [ ] Add anti-pattern: don't create a new idea when one already exists at the path

## New Workflow Section

```markdown
### 1b. Detect Existing Plan

**If the user provides a path or directory:**
- Check if IDEA.md, SHAPING.md, or STATUS.md exists at that path
- If yes, this is an EXISTING plan - do NOT create a new idea
- Read the current state using riotplan_status and riotplan_history_show
- Summarize what exists and ask: "Where would you like to pick up?"

**If the user is in a directory that contains a plan:**
- Detect the plan automatically
- Ask: "I see an existing plan here ([name]). Want to continue exploring it?"
```

## Files Changed

- `src/mcp/prompts/explore_idea.md` - Main prompt file
- `.cursor/commands/explore_idea.md` - Cursor command version (if exists)

## Acceptance Criteria

- explore_idea with a path to an existing plan resumes exploration
- explore_idea in a plan directory detects the existing plan
- Current plan state is summarized before continuing
- New idea is NOT created when an existing plan is detected
- All existing explore_idea functionality still works for new ideas
