# Narrative: Investigation of build.ts, generator.ts, and context.ts confirming structural disconnection between plan generation and idea artifacts

**Date**: 2026-02-08T06:50:51.304Z
**Source**: typing
**Speaker**: user

---

Investigation of the actual plan generation mechanism confirms the user's suspicion. The generation pipeline is structurally disconnected from the idea artifacts in three concrete ways:

1. BUILD TOOL (build.ts): Reads IDEA.md and SHAPING.md as raw text and concatenates them into a string ("--- IDEA CONTEXT ---\n" + ideaContent). Does NOT read evidence files, timeline/history, LIFECYCLE.md, or prompt history. The riotplan_read_context tool exists and does all of this, but build.ts doesn't use it.

2. AI GENERATOR (generator.ts): The system prompt is completely generic - "You are an expert project planner and software architect" with boilerplate instructions about breaking work into steps. No mention of: honoring constraints, referencing evidence, implementing the selected approach from SHAPING.md, grounding steps in artifacts rather than general knowledge. The user prompt similarly just asks for steps with no artifact-specific instructions.

3. NO VALIDATION: Nothing checks whether the generated plan actually incorporates constraints, references evidence, or implements the selected approach. The plan comes back as JSON and gets written to files with no verification.

The riotplan_read_context tool (context.ts) was built during the gathering-evidence work and it does everything needed: reads IDEA.md, SHAPING.md, LIFECYCLE.md, evidence files with previews, timeline history, extracts constraints and questions, extracts the selected approach. But the build pipeline doesn't use it. It's available for MCP clients to call manually, but the automated generation path completely bypasses it.

This means: when riotplan_build is called, the model generating the plan gets IDEA.md and SHAPING.md as a raw context dump, but never sees evidence, never sees history, and is never instructed to honor constraints or implement the selected approach. The "good plans" the user has seen were likely because the calling model (in Cursor) already had conversation context and was passing rich descriptions that happened to include the right details - not because the generation mechanism was connected to the artifacts.
