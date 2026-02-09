# Step 06: Wire Retrospective into Plan Completion Workflow

## Objective

Make retrospective generation an automatic part of the plan completion workflow, so it happens naturally when the last step finishes rather than requiring a separate manual invocation.

## Background

The user wants retrospective generation to be: (1) a callable command, (2) automatic when the last step completes, and (3) part of a plan-complete workflow. This step wires the trigger so that when the final step is completed, the system signals that a retrospective should be generated.

## Tasks

### 6.1 Update step_complete to detect plan completion

In `src/mcp/tools/step.ts`, when `step_complete` is called:
- After marking the step as completed, check if all steps are now done
- If all steps are done, include a message in the response: "All steps completed. Generate plan retrospective with riotplan_generate_retrospective. Recommend using highest-tier model available."
- Do NOT auto-generate the retrospective in code — the agent should invoke it, giving the user the opportunity to switch models if desired

### 6.2 Update execute_plan.md prompt

In `src/mcp/prompts/execute_plan.md`:
- Add a "Plan Completion" section at the end
- After all steps are completed and reflected upon:
  1. Signal that plan execution is complete
  2. Recommend switching to highest-tier model for retrospective
  3. Call `riotplan_generate_retrospective`
  4. The retrospective is the final act of plan execution

### 6.3 Consider the model-switching workflow

Document the recommended workflow:
1. Agent executes steps with variable-tier models
2. Agent completes final step and writes final reflection
3. System signals: "Plan complete. Retrospective recommended with highest-tier model."
4. User switches model (if desired)
5. Agent calls `riotplan_generate_retrospective`
6. Retrospective is generated with full creative reasoning

### 6.4 Add tests

- Test that completing the final step triggers the retrospective signal
- Test that non-final step completions don't trigger the signal
- Test the response message includes retrospective instructions

## Acceptance Criteria

- [ ] Completing the last step signals that retrospective should be generated
- [ ] Signal recommends highest-tier model
- [ ] execute_plan.md includes plan completion workflow with retrospective
- [ ] The agent is instructed (not forced) to generate the retrospective — allows model switching
- [ ] Tests pass

## Key Files

- `src/mcp/tools/step.ts` (modified)
- `src/mcp/prompts/execute_plan.md` (modified)

## Dependencies

- Step 05 (retrospective tool must exist)
- Step 03 (execute_plan.md already modified for reflections)
