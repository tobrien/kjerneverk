# Step 11: Create develop_plan Prompt for Plan Refinement

## Objective

Create a develop_plan prompt (similar to explore_idea) that guides the plan refinement process. This prompt should capture user feedback on generated plans, store feedback in history, and support both wide (structural) and narrow (specific) feedback.

## Background

After a plan is generated, users need to refine it based on their feedback. The develop_plan prompt provides a structured workflow for:
- Capturing feedback on the plan (both wide and narrow)
- Storing feedback events in timeline history
- Making changes in response to feedback
- Creating a guided, conversational refinement process

This is the starting point for plan refinement capabilities. Later steps will add checkpointing and full conversation capture.

## Tasks

### 1. Create develop_plan Prompt File

Create `src/mcp/prompts/develop_plan.md`:
```markdown
# Develop Plan

## Purpose

Guide collaborative refinement of a generated plan through structured feedback capture. This prompt helps iterate on plans after initial generation, capturing the evolution of thinking as the plan is refined.

## When to Use

- After a plan has been generated (via riotplan_create)
- User wants to provide feedback on the plan
- Plan needs refinement based on new insights
- Iterating on plan structure or content

## Workflow

### 1. Review Current Plan

Start by understanding the current plan state:
```
riotplan_status({
  path: "./path/to/plan",
  verbose: true
})
```

Read key plan files:
- SUMMARY.md - Overall goals and scope
- EXECUTION_PLAN.md - Strategy and steps
- Individual step files - Detailed tasks

### 2. Gather Feedback

Ask the user what feedback they have:
- "What aspects of the plan need refinement?"
- "Are there steps that should be added, removed, or reordered?"
- "Is there specific content in steps that needs adjustment?"

Feedback can be:
- **Wide/Structural**: Changes to overall approach, step order, scope
- **Narrow/Specific**: Changes to specific sentences, tasks, or details

### 3. Capture Feedback Events

For each piece of feedback, add to plan history:
```
riotplan_plan_feedback_add({
  path: "./path/to/plan",
  feedback: "User's feedback text",
  type: "structural" | "content" | "clarification",
  scope: "wide" | "narrow",
  targetStep?: 3  // If feedback is about specific step
})
```

### 4. Make Changes Based on Feedback

After capturing feedback, make the requested changes:
- Edit SUMMARY.md if scope/goals change
- Edit EXECUTION_PLAN.md if strategy changes
- Add/remove/reorder steps as needed
- Edit specific step files for content changes

Document what you changed in response to feedback.

### 5. Confirm Changes

After making changes, confirm with user:
- Show what was changed
- Ask if changes address the feedback
- Capture any additional feedback

### 6. Iterate

Continue gathering feedback and making changes until user is satisfied.

## Key Principles

1. **Capture Everything**: Every piece of feedback goes into history
2. **Wide and Narrow**: Support both structural and content feedback
3. **Conversational**: Make it feel like a dialogue, not a form
4. **Transparent**: Show what changed and why
5. **Iterative**: Multiple rounds of feedback are expected

## Example Conversation

**AI**: "I've generated the plan. What feedback do you have?"

**User**: "The overall approach looks good, but I think we need more steps for the testing phase. Also, in step 3, the description of the API integration is too vague."

**AI**: *Captures two feedback items*
```
// Wide feedback about structure
riotplan_plan_feedback_add({
  feedback: "Need more steps for testing phase - current coverage is insufficient",
  type: "structural",
  scope: "wide"
})

// Narrow feedback about specific content
riotplan_plan_feedback_add({
  feedback: "Step 3 API integration description is too vague",
  type: "content",
  scope: "narrow",
  targetStep: 3
})
```

**AI**: "I'll address both. First, let me break down the testing phase into 3 separate steps covering unit tests, integration tests, and end-to-end tests. Second, I'll expand step 3 to include specific API endpoints and authentication details."

*Makes changes*

**AI**: "I've updated the plan. The testing phase now has steps 8, 9, and 10 covering different test types. Step 3 now includes specific API endpoint details. Does this address your feedback?"

**User**: "Much better! One more thing - step 5 should come before step 4 because we need the database schema before we can implement the models."

*Continues iteration*

## Anti-Patterns

❌ Don't make changes without capturing feedback first
❌ Don't lose track of what feedback led to what changes
❌ Don't assume you know what user wants - ask clarifying questions
❌ Don't skip showing what changed

✅ Do capture every piece of feedback
✅ Do ask clarifying questions
✅ Do show before/after when making changes
✅ Do iterate until user is satisfied

## Transition Criteria

**Continue Developing**: User has more feedback
**Ready to Execute**: User is satisfied with plan, ready to start execution
**Back to Shaping**: Feedback reveals need to reconsider approach

## Notes

- This is the starting point for plan refinement
- Later enhancements will add automatic checkpointing
- Later enhancements will capture full conversation (questions + answers)
- Focus on making feedback capture natural and conversational
```

### 2. Create Plan Feedback MCP Tool

Add tool to `src/mcp/tools/plan.ts`:
```typescript
export const planTools = {
  riotplan_plan_feedback_add: {
    description: "Add feedback about a plan to its history",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to plan directory"
        },
        feedback: {
          type: "string",
          description: "The feedback text"
        },
        type: {
          type: "string",
          enum: ["structural", "content", "clarification"],
          description: "Type of feedback"
        },
        scope: {
          type: "string",
          enum: ["wide", "narrow"],
          description: "Scope of feedback (wide=affects multiple steps, narrow=specific detail)"
        },
        targetStep: {
          type: "number",
          description: "Step number if feedback is about specific step"
        }
      },
      required: ["feedback", "type", "scope"]
    }
  }
};
```

### 3. Implement Feedback Handler

```typescript
async function handlePlanFeedbackAdd(args: {
  path?: string;
  feedback: string;
  type: "structural" | "content" | "clarification";
  scope: "wide" | "narrow";
  targetStep?: number;
}): Promise<{ message: string }> {
  const planPath = args.path || process.cwd();
  
  // Validate plan exists
  await validatePlanPath(planPath);
  
  // Add feedback event to plan timeline
  await addPlanFeedbackEvent(
    planPath,
    args.feedback,
    args.type,
    args.scope,
    args.targetStep
  );
  
  return {
    message: "✅ Feedback captured"
  };
}
```

### 4. Implement Plan Timeline

Create `.history/plan-timeline.jsonl` for plans (similar to idea timeline):
```typescript
export async function addPlanFeedbackEvent(
  planPath: string,
  feedback: string,
  type: string,
  scope: string,
  targetStep?: number
): Promise<void> {
  const event = {
    timestamp: new Date().toISOString(),
    type: "plan_feedback_added",
    data: {
      feedback,
      feedbackType: type,
      scope,
      targetStep
    }
  };
  
  await appendToPlanTimeline(planPath, event);
}

async function appendToPlanTimeline(
  planPath: string,
  event: any
): Promise<void> {
  const historyDir = path.join(planPath, ".history");
  await fs.mkdir(historyDir, { recursive: true });
  
  const timelinePath = path.join(historyDir, "plan-timeline.jsonl");
  await fs.appendFile(timelinePath, JSON.stringify(event) + "\n");
}
```

### 5. Register Prompt in MCP Server

Update `src/mcp/server.ts` to include develop_plan prompt:
```typescript
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "explore_idea",
      description: "Guide exploration of a new idea",
      arguments: [...]
    },
    {
      name: "create_plan",
      description: "Create a new plan with AI-generated steps",
      arguments: [...]
    },
    {
      name: "shape_approach",
      description: "Explore and compare different approaches",
      arguments: [...]
    },
    {
      name: "develop_plan",
      description: "Refine a generated plan through structured feedback",
      arguments: [
        {
          name: "planPath",
          description: "Path to the plan to develop",
          required: true
        }
      ]
    },
    // ... other prompts
  ]
}));
```

### 6. Add Plan Feedback Viewing Tool

```typescript
export const planTools = {
  // ... feedback add tool
  
  riotplan_plan_feedback_list: {
    description: "List all feedback captured for a plan",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to plan directory"
        }
      }
    }
  }
};

async function handlePlanFeedbackList(args: {
  path?: string;
}): Promise<{ feedback: any[] }> {
  const planPath = args.path || process.cwd();
  
  const timeline = await readPlanTimeline(planPath);
  const feedbackEvents = timeline.filter(e => e.type === "plan_feedback_added");
  
  return {
    feedback: feedbackEvents.map(e => ({
      timestamp: e.timestamp,
      feedback: e.data.feedback,
      type: e.data.feedbackType,
      scope: e.data.scope,
      targetStep: e.data.targetStep
    }))
  };
}
```

## Acceptance Criteria

- [ ] develop_plan.md prompt file is created with complete workflow
- [ ] riotplan_plan_feedback_add tool is implemented and registered
- [ ] Plan timeline (.history/plan-timeline.jsonl) is created for plans
- [ ] Feedback events are captured with type, scope, and target step
- [ ] riotplan_plan_feedback_list shows all captured feedback
- [ ] Prompt is registered in MCP server
- [ ] Tests cover feedback capture and listing
- [ ] Manual test: use develop_plan prompt to refine a plan

## Testing

```bash
# Unit tests
npm test src/mcp/tools/plan.test.ts

# Integration test - add feedback
{
  "tool": "riotplan_plan_feedback_add",
  "arguments": {
    "path": "./plans/narrative-evolution",
    "feedback": "Need more detail in step 3 about API integration",
    "type": "content",
    "scope": "narrow",
    "targetStep": 3
  }
}

# List feedback
{
  "tool": "riotplan_plan_feedback_list",
  "arguments": {
    "path": "./plans/narrative-evolution"
  }
}

# Verify timeline
cat plans/narrative-evolution/.history/plan-timeline.jsonl

# Test with develop_plan prompt
# Use MCP prompt: develop_plan with planPath="./plans/narrative-evolution"
# Provide feedback and verify it's captured
```

## Files Changed

- `src/mcp/prompts/develop_plan.md` (new) - Plan refinement prompt
- `src/mcp/tools/plan.ts` (new) - Plan feedback tools
- `src/mcp/tools/plan.test.ts` (new) - Tests for plan tools
- `src/mcp/server.ts` - Register develop_plan prompt and tools
- `src/history/plan-timeline.ts` (new) - Plan timeline utilities
- `src/types.ts` - Add plan feedback event types
- `docs/prompts.md` - Document develop_plan prompt
- `docs/tools.md` - Document plan feedback tools

## Notes

- This is the foundation for plan refinement - start simple
- Later steps will add automatic checkpointing after each feedback item
- Later steps will add full conversation capture (questions + answers)
- Keep feedback capture lightweight and natural
- Wide vs narrow distinction helps understand impact of changes
- Plan timeline is separate from idea timeline (different lifecycle)
- Consider how feedback relates to plan changes (traceability)
