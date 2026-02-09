# Step 03: Update execute_step Prompt to Read Prior Step Reflections

## Objective

Modify the plan execution prompts so that when an agent starts a new step, it receives all prior step reflections as context. This creates the inter-step learning channel — step 5 learns from what happened in steps 1-4.

## Background

The execution prompts (`src/mcp/prompts/execute_plan.md` and `execute_step.md`) currently instruct the agent to read the step file and check STATUS.md. They do not read reflection files. This step changes the execution workflow so prior reflections are part of the context.

## Tasks

### 3.1 Update execute_step.md prompt

In `src/mcp/prompts/execute_step.md`, add instructions:
- Before starting a step, read all reflection files from `reflections/` for prior completed steps
- Present prior reflections as "Lessons from prior steps" context
- Instruct the agent to consider these reflections when making decisions
- Frame them as communication from prior executions: "The agent that executed step N noted the following..."

### 3.2 Update execute_plan.md prompt

In `src/mcp/prompts/execute_plan.md`, add instructions:
- After completing a step, the agent MUST call `riotplan_step_reflect` before moving to the next step
- The reflection should capture: time taken, deviations from the plan, surprises encountered, blockers hit, and most importantly — what could have been done differently to make this step more straightforward
- Make it clear this is NOT a summary — it's genuine self-reflection about the execution experience
- Emphasize: be honest, be creative, be specific. Generic reflections like "everything went as planned" are not useful.

### 3.3 Add reflection instructions to step completion workflow

After `riotplan_step_complete`, the prompt should enforce:
1. Pause and reflect on what just happened
2. Call `riotplan_step_reflect` with genuine analysis
3. Only then proceed to the next step

### 3.4 Consider model-tier signaling

Add a note in the prompt that step reflections benefit from thoughtful reasoning. If the executing model has extended thinking capabilities, this is a good place to use them.

## Acceptance Criteria

- [ ] execute_step.md instructs reading prior reflections before starting
- [ ] execute_plan.md mandates reflection after each step completion
- [ ] Reflection instructions emphasize genuine reasoning over templated responses
- [ ] The "what could be done differently" question is prominently featured
- [ ] Prior reflections are framed as inter-step communication

## Key Files

- `src/mcp/prompts/execute_step.md` (modified)
- `src/mcp/prompts/execute_plan.md` (modified)

## Dependencies

- Step 01 (reflection tool must exist)

## Notes

This is arguably the most important step in the plan. The prompts are what determine whether reflections are genuine or rote. Spend time crafting language that invites real analysis, not checkbox compliance. Consider: "If you were explaining to a colleague what surprised you about this step, what would you say?"
