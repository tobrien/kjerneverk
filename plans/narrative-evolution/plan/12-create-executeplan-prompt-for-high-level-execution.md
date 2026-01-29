# Step 12: Create execute_plan Prompt for High-Level Execution

## Objective

Create an execute_plan prompt that provides a high-level, intelligent execution workflow. Instead of requiring users to manually track which step to execute next, the prompt automatically examines plan state, determines the current step, and guides execution.

## Background

Currently, RiotPlan has low-level tools like `execute_step` and `track_progress` that require the user to know which step they're on. This is too granular. Users want to say "execute the plan" and have the system:
1. Check plan status to see where execution is
2. Determine which step should be started next
3. Guide execution of that step
4. Handle step completion and move to next step
5. Provide a conversational, guided experience

This is similar to how `explore_idea` guides ideation and `develop_plan` guides refinement - we need `execute_plan` to guide execution.

## Tasks

### 1. Create execute_plan Prompt File

Create `src/mcp/prompts/execute_plan.md`:
```markdown
# Execute Plan

## Purpose

Guide intelligent, high-level plan execution. This prompt automatically manages execution state, determines which step to work on, and provides a conversational workflow for completing the plan.

## When to Use

- User wants to execute a plan
- User says "let's execute this plan" or "start working on this"
- Continuing execution of a partially completed plan
- Need to guide user through plan steps

## Workflow

### 1. Check Plan Status

Start by understanding current execution state:
```
riotplan_status({
  path: "./path/to/plan",
  verbose: true
})
```

Analyze the response:
- How many steps are complete?
- Which step is currently in progress?
- Which step should be started next?
- Are there any blockers?

### 2. Determine Next Action

Based on status:

**If no steps started:**
- "Let's start executing this plan. The first step is: [Step 01 title]"
- Show step objective and key tasks
- Ask if user is ready to begin

**If step in progress:**
- "We're currently working on Step [N]: [title]"
- Show what's been done so far
- Ask what needs to be done next

**If step complete, next step pending:**
- "Step [N] is complete! Ready to move to Step [N+1]: [title]?"
- Show next step objective
- Ask if user wants to continue

**If all steps complete:**
- "Congratulations! All steps are complete."
- Show summary of what was accomplished
- Ask if plan needs any final review

### 3. Execute Current Step

When working on a step:

1. **Read the step file** to understand tasks:
```
# Read step details
cat ./plan/[NN]-step-name.md
```

2. **Guide through tasks**:
- Show what needs to be done
- Help user complete each task
- Answer questions about the step
- Make code changes if needed

3. **Check acceptance criteria**:
- Review acceptance criteria for the step
- Confirm each criterion is met
- Run tests if specified

4. **Mark step complete** when done:
```
riotplan_step_complete({
  path: "./path/to/plan",
  step: N
})
```

### 4. Handle Blockers

If user encounters a blocker:
- Capture the blocker description
- Add it to plan status
- Discuss how to resolve it
- Consider if plan needs adjustment

### 5. Iterate

Continue execution loop:
- Complete current step
- Move to next step
- Repeat until plan is complete

## Key Principles

1. **Intelligent State Management**: Always check status first
2. **Conversational**: Make it feel like pair programming
3. **Guided**: Lead user through each step
4. **Flexible**: Handle interruptions and resumption
5. **Context-Aware**: Remember what's been done

## Example Conversation

**User**: "Let's execute this plan"

**AI**: *Checks status*
```
riotplan_status({ path: "./plans/narrative-evolution" })
```

**AI**: "This plan has 12 steps. None have been started yet. Let's begin with Step 01: Design Data Model.

The objective is to define timeline event types for narratives and checkpoints. The main tasks are:
1. Define narrative_chunk event type
2. Define checkpoint_created event type
3. Define checkpoint storage format
4. Document event type registry
5. Design checkpoint metadata format

Ready to start?"

**User**: "Yes, let's do it"

**AI**: *Reads step file*
```
cat ./plans/narrative-evolution/plan/01-setup.md
```

**AI**: "Great! Let's start by defining the narrative_chunk event type. Based on the step, it should have this structure:
```typescript
{
  timestamp: string;
  type: "narrative_chunk";
  data: {
    content: string;
    source?: string;
    context?: string;
  }
}
```

Should I create the types file with this definition?"

**User**: "Yes"

**AI**: *Creates file*

**AI**: "Done! Now let's define the checkpoint_created event type..."

*Continues through all tasks*

**AI**: "All tasks for Step 01 are complete. Let me mark this step as done."
```
riotplan_step_complete({ path: "./plans/narrative-evolution", step: 1 })
```

**AI**: "Step 01 complete! Ready to move to Step 02: Extend Timeline Format?"

## Anti-Patterns

❌ Don't ask user which step to work on - figure it out from status
❌ Don't lose track of where you are in execution
❌ Don't skip checking status before starting
❌ Don't complete steps without doing the work

✅ Do check status at the start
✅ Do guide user through each task
✅ Do mark steps complete when done
✅ Do handle resumption gracefully

## State Transitions

```
No steps started → Start Step 01
Step N in progress → Continue Step N
Step N complete → Start Step N+1
All steps complete → Plan finished
```

## Integration with Other Prompts

- **After develop_plan**: Once plan is refined, transition to execute_plan
- **During execution**: May need to return to develop_plan if changes needed
- **Checkpointing**: Create checkpoints at step boundaries

## Notes

- This is the high-level execution interface users want
- Low-level tools (execute_step, track_progress) are still available but not primary interface
- Focus on intelligent state management and guidance
- Make execution feel like pair programming
- Handle long-running plans that span multiple sessions
```

### 2. Enhance Status Tool for Execution Context

Update `riotplan_status` to provide execution-ready information:
```typescript
async function handleStatus(args: {
  path?: string;
  verbose?: boolean;
}): Promise<{
  // ... existing fields
  execution: {
    nextStep?: {
      number: number;
      title: string;
      objective: string;
    };
    currentStep?: {
      number: number;
      title: string;
      status: string;
    };
    recommendation: string; // "start_step_1" | "continue_step_N" | "start_step_N" | "complete"
  };
}> {
  // ... existing logic
  
  // Add execution context
  const steps = await getSteps(planPath);
  const inProgress = steps.find(s => s.status === "in_progress");
  const nextPending = steps.find(s => s.status === "pending");
  
  let recommendation = "complete";
  let nextStep, currentStep;
  
  if (inProgress) {
    recommendation = `continue_step_${inProgress.number}`;
    currentStep = {
      number: inProgress.number,
      title: inProgress.title,
      status: "in_progress"
    };
  } else if (nextPending) {
    recommendation = `start_step_${nextPending.number}`;
    nextStep = {
      number: nextPending.number,
      title: nextPending.title,
      objective: await getStepObjective(planPath, nextPending.number)
    };
  }
  
  return {
    // ... existing fields
    execution: {
      nextStep,
      currentStep,
      recommendation
    }
  };
}
```

### 3. Add Step Reading Utility

```typescript
export async function getStepContent(
  planPath: string,
  stepNumber: number
): Promise<{
  title: string;
  objective: string;
  tasks: string[];
  acceptanceCriteria: string[];
  content: string;
}> {
  const stepFile = await findStepFile(planPath, stepNumber);
  const content = await fs.readFile(stepFile, "utf-8");
  
  // Parse step file
  const objective = extractSection(content, "## Objective");
  const tasks = extractTasks(content);
  const acceptanceCriteria = extractAcceptanceCriteria(content);
  
  return {
    title: extractTitle(content),
    objective,
    tasks,
    acceptanceCriteria,
    content
  };
}
```

### 4. Register Prompt in MCP Server

Update `src/mcp/server.ts`:
```typescript
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "explore_idea",
      description: "Guide exploration of a new idea",
      arguments: [...]
    },
    {
      name: "shape_approach",
      description: "Explore and compare different approaches",
      arguments: [...]
    },
    {
      name: "create_plan",
      description: "Create a new plan with AI-generated steps",
      arguments: [...]
    },
    {
      name: "develop_plan",
      description: "Refine a generated plan through structured feedback",
      arguments: [...]
    },
    {
      name: "execute_plan",
      description: "Execute a plan with intelligent state management and guidance",
      arguments: [
        {
          name: "planPath",
          description: "Path to the plan to execute",
          required: true
        }
      ]
    },
    // ... other prompts
  ]
}));
```

### 5. Add Execution Checkpoint Support

Integrate with checkpoint system:
```typescript
// Automatically create checkpoints at step boundaries
async function completeStepWithCheckpoint(
  planPath: string,
  stepNumber: number
): Promise<void> {
  // Mark step complete
  await completeStep(planPath, stepNumber);
  
  // Create checkpoint
  const step = await getStep(planPath, stepNumber);
  await createCheckpoint(
    planPath,
    `after-step-${stepNumber}`,
    `Completed: ${step.title}`
  );
}
```

### 6. Update Documentation

Create `docs/execution-workflow.md`:
```markdown
# Plan Execution Workflow

## Overview

RiotPlan provides a high-level execution workflow through the `execute_plan` prompt.

## Starting Execution

Simply say: "Let's execute this plan" or "Start working on this plan"

The system will:
1. Check current status
2. Determine which step to work on
3. Guide you through the step
4. Mark steps complete as you finish them
5. Move to the next step

## Resuming Execution

If you stop mid-execution, just say: "Continue executing the plan"

The system remembers where you left off and continues from there.

## Example Session

[Full example of executing a plan from start to finish]

## Best Practices

- Let the system manage state - don't manually track steps
- Create checkpoints at natural stopping points
- Use develop_plan if you need to adjust the plan during execution
- Focus on one step at a time
```

## Acceptance Criteria

- [ ] execute_plan.md prompt is created with complete workflow
- [ ] Prompt automatically checks plan status
- [ ] Prompt determines which step to work on based on status
- [ ] Prompt guides user through step tasks
- [ ] Prompt marks steps complete when done
- [ ] Status tool provides execution context (nextStep, currentStep, recommendation)
- [ ] Step reading utility extracts objective, tasks, and acceptance criteria
- [ ] Prompt is registered in MCP server
- [ ] Checkpoint integration at step boundaries
- [ ] Documentation explains execution workflow
- [ ] Tests cover execution state management
- [ ] Manual test: execute a multi-step plan from start to finish

## Testing

```bash
# Integration test - start execution
# Use MCP prompt: execute_plan with planPath="./plans/narrative-evolution"

# Expected flow:
# 1. System checks status
# 2. System says "Let's start with Step 01"
# 3. System shows step objective and tasks
# 4. User works through tasks with system guidance
# 5. System marks step complete
# 6. System moves to Step 02
# 7. Repeat

# Test resumption
# 1. Stop mid-execution (e.g., after completing Step 03)
# 2. Later: Use execute_plan prompt again
# 3. System should say "We're on Step 04, ready to continue?"

# Test completion
# 1. Complete all steps
# 2. System should congratulate and summarize
```

## Files Changed

- `src/mcp/prompts/execute_plan.md` (new) - High-level execution prompt
- `src/mcp/tools/status.ts` - Add execution context to status
- `src/history/steps.ts` - Add step reading utilities
- `src/mcp/server.ts` - Register execute_plan prompt
- `docs/execution-workflow.md` (new) - Document execution workflow
- `docs/prompts.md` - Document execute_plan prompt

## Notes

- This is the interface users want - high-level and intelligent
- Low-level tools still exist but aren't the primary interface
- Focus on state management and guidance
- Make it feel like pair programming
- Handle long-running plans that span sessions
- Integrate with checkpointing for safety
- Consider how this works with develop_plan (plan changes during execution)
- Think about parallel execution of independent steps (future enhancement)
