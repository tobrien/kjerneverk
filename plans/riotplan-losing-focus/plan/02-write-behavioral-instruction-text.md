# Step 2: Write and Validate Behavioral Instruction Text

**Recommended Model**: Opus 4.5
**Rationale**: This is the single most critical piece of the entire plan. The exact wording of these instructions determines whether models actually change their behavior. This requires deep understanding of how language models interpret instructions, what phrasing they respond to, and how to be assertive without being so verbose the model starts ignoring it. Worth using the best available model.

**Depends on**: Nothing - start here

## Objective

Design the behavioral instruction text that will be embedded in every RiotPlan MCP tool description. This text tells the model: you are in planning mode, stay focused on the plan, do not execute code changes.

## Background

The core problem: models drift from "documenting the exploration" to "having a conversation" to "implementing things." The behavioral preamble needs to prevent all three failure modes:
1. Forgetting to update the plan with insights
2. Switching from plan development to plan execution without being asked
3. Ignoring RiotPlan in favor of the IDE's own planning system

## Tasks

- [ ] Draft behavioral preamble text (target: 1-3 sentences, concise but assertive)
- [ ] Include instruction to stay in planning mode
- [ ] Include instruction to not execute code changes unless in execution mode
- [ ] Include instruction to capture insights into the plan continuously
- [ ] Include instruction to ask before transitioning between stages
- [ ] Test the text by reading it as if you were a model seeing it for the first time - is it clear? Actionable? Hard to ignore?
- [ ] Consider whether different tool categories (idea tools, shaping tools, execution tools) need different preambles

## Design Constraints

- Must be SHORT enough that models don't skip over it (long descriptions get deprioritized)
- Must be ASSERTIVE enough that models follow it even when the conversation pulls toward implementation
- Must not conflict with the functional description of the tool
- Must work across different models (Claude, GPT, Gemini)
- Should mention RiotPlan by name to establish authority

## Candidate Directions

Direction A (Authority): "RiotPlan is managing this planning session. Do not execute code changes. Capture all insights into the plan using RiotPlan tools."

Direction B (Mode): "You are in RiotPlan planning mode. Stay focused on plan development - do not implement or execute. Update the plan with every insight."

Direction C (Contextual): "IMPORTANT: When using RiotPlan tools, you are in plan development mode. All discussion should be captured in the plan. Do not write code or make changes unless the user explicitly moves to execution mode."

## Deliverable

A finalized text string (or 2-3 variants for different tool categories) ready to be applied in Step 1.

## Acceptance Criteria

- Text is concise (under 50 words per preamble)
- Text addresses all three failure modes
- Text is model-agnostic (works with Claude, GPT, Gemini)
- Text has been reviewed for clarity and assertiveness
