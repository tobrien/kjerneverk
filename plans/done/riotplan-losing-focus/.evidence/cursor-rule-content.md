---
description: RiotPlan planning system integration - defer to RiotPlan for all planning activity
globs: ["**/plans/**", "**/IDEA.md", "**/SHAPING.md", "**/STATUS.md"]
---

# RiotPlan Owns Planning in This Project

## Rule: Defer to RiotPlan for All Planning Activity

When working in plan directories or with RiotPlan MCP tools, **RiotPlan owns the planning process**. Do not compete with it.

### Required Behaviors

1. **Do not create Cursor plans**: When you detect planning activity, do NOT offer to create a Cursor-native plan (the checkbox-style plan). RiotPlan is already managing the plan.

2. **Stay in plan development mode**: When using RiotPlan tools, you are exploring or shaping a plan—not implementing it. Do not write code or make file changes unless the user explicitly says to execute.

3. **Capture insights in the plan**: Every significant thought, decision, or finding should be captured using RiotPlan tools (`riotplan_idea_add_note`, `riotplan_idea_add_narrative`, etc.). Do not just discuss—document.

4. **Ask before transitioning stages**: Do not move from idea → shaping → execution without explicit user consent. Ask: "Are you ready to move to [next stage]?" and wait for confirmation.

### When This Rule Applies

- When you see RiotPlan MCP tools being used
- When working in directories containing `IDEA.md`, `SHAPING.md`, `STATUS.md`, or `LIFECYCLE.md`
- When the user mentions working on "a plan" or "an idea" in the context of RiotPlan

### What You Should Do

✅ Use RiotPlan tools to capture notes, constraints, questions, and narratives
✅ Ask clarifying questions to explore the idea
✅ Propose approaches and tradeoffs during shaping
✅ Wait for user to explicitly request implementation
✅ Mark steps complete using `riotplan_step_complete` during execution

### What You Should NOT Do

❌ Offer to create a Cursor plan when RiotPlan is active
❌ Start implementing code during idea or shaping stages
❌ Have extended conversations without capturing insights in the plan
❌ Transition between stages (idea → shaping → built → executing) without asking
❌ Ignore RiotPlan tools in favor of direct file editing

### Example Scenarios

❌ **WRONG**: User is exploring an idea → You start writing implementation code

✅ **CORRECT**: User is exploring an idea → You ask questions, add notes, capture constraints

❌ **WRONG**: User discusses a solution → You implement it immediately

✅ **CORRECT**: User discusses a solution → You add it as a note and ask "Should we move to shaping to compare approaches?"

❌ **WRONG**: Cursor detects planning activity → You offer "Want me to create a plan for this?"

✅ **CORRECT**: Cursor detects planning activity → You check if a RiotPlan already exists and use RiotPlan tools

### Rationale

RiotPlan provides structured ideation, shaping, and execution tracking. When it's active, all planning activity should flow through RiotPlan to maintain a coherent record of the thought process. Competing planning systems create confusion and lose context.
