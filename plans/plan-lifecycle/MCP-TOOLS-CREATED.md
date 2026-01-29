# MCP Tools for Idea and Shaping Stages

## What We Built

Created MCP tools and prompts to support the early stages of plan development - Idea and Shaping - where thinking is cheap and commitment is deferred.

## New MCP Tools

### Idea Stage Tools (6 tools)

**`riotplan_idea_create`**
- Create a lightweight idea (no commitment)
- Just IDEA.md and LIFECYCLE.md
- Parameters: code, description, directory

**`riotplan_idea_add_note`**
- Add thoughts as they evolve
- Parameters: path, note

**`riotplan_idea_add_constraint`**
- Capture constraints (e.g., "Must work on mobile")
- Parameters: path, constraint

**`riotplan_idea_add_question`**
- Add questions that need answering
- Parameters: path, question

**`riotplan_idea_add_evidence`**
- Attach documents, images, diagrams
- Parameters: path, evidencePath, description

**`riotplan_idea_kill`**
- Kill an idea with reason
- Parameters: path, reason

### Shaping Stage Tools (6 tools)

**`riotplan_shaping_start`**
- Transition from idea to shaping
- Creates SHAPING.md
- Parameters: path

**`riotplan_shaping_add_approach`**
- Add an approach to consider
- Include tradeoffs and assumptions
- Parameters: path, name, description, tradeoffs[], assumptions[]

**`riotplan_shaping_add_feedback`**
- Capture feedback about approaches
- Parameters: path, feedback

**`riotplan_shaping_add_evidence`**
- Add evidence to support decisions
- Can relate to specific approaches
- Parameters: path, evidencePath, description, relatedTo

**`riotplan_shaping_compare`**
- Compare all approaches side-by-side
- Shows tradeoffs for each
- Parameters: path

**`riotplan_shaping_select`**
- Select an approach
- Document reasoning
- Prepares for transition to 'built'
- Parameters: path, approach, reason

## New MCP Prompts

### `explore_idea`

Guides collaborative idea exploration:
1. Create the idea
2. Ask open-ended questions
3. Capture thoughts, constraints, questions
4. Gather evidence
5. Decide next steps (shape, kill, or wait)

**When to use**: User mentions a new concept, not ready to commit

### `shape_approach`

Guides approach comparison and selection:
1. Start shaping
2. Identify approaches
3. Capture tradeoffs for each
4. Gather feedback and evidence
5. Compare side-by-side
6. Select approach
7. Transition to built

**When to use**: Ready to explore implementation options

## File Structure

### Idea Stage
```
idea-name/
  IDEA.md           # Core concept, notes, constraints, questions
  LIFECYCLE.md      # Stage tracking
```

### Shaping Stage
```
shaping-name/
  IDEA.md           # Original idea (preserved)
  SHAPING.md        # Approaches, feedback, evidence
  LIFECYCLE.md      # Stage tracking (updated to 'shaping')
```

## Example Workflow

### 1. User Has Idea

**User**: "I'm thinking about adding real-time notifications"

**AI**: Uses `/riotplan/explore_idea` prompt

```typescript
riotplan_idea_create({
  code: "real-time-notifications",
  description: "Add real-time notifications so users don't have to refresh"
})
```

### 2. Explore Together

**AI**: "What's driving this? What constraints should we consider?"

**User**: "Users miss updates. Must work on mobile. Can't require WebSockets everywhere."

```typescript
riotplan_idea_add_note({ note: "Users miss important updates" })
riotplan_idea_add_constraint({ constraint: "Must work on mobile" })
riotplan_idea_add_constraint({ constraint: "Can't require WebSockets everywhere" })
```

**AI**: "Any questions we need to answer?"

**User**: "How do we handle offline users? What's the latency requirement?"

```typescript
riotplan_idea_add_question({ question: "How do we handle offline users?" })
riotplan_idea_add_question({ question: "What's the latency requirement?" })
```

**User**: "Here's a diagram from a similar system" [attaches]

```typescript
riotplan_idea_add_evidence({
  evidencePath: "./diagrams/similar-system.png",
  description: "Example from Slack's notification system"
})
```

### 3. Ready to Shape

**AI**: "Ready to explore implementation approaches?"

**User**: "Yes"

```typescript
riotplan_shaping_start()
```

### 4. Add Approaches

```typescript
riotplan_shaping_add_approach({
  name: "REST API with Polling",
  description: "Traditional REST with 30s polling",
  tradeoffs: [
    "Pro: Simple, well understood",
    "Pro: Works with existing infrastructure",
    "Con: Higher latency (up to 30s)",
    "Con: More server load from constant polling"
  ],
  assumptions: ["30s latency acceptable", "Server can handle load"]
})

riotplan_shaping_add_approach({
  name: "WebSockets",
  description: "Persistent WebSocket connections for real-time updates",
  tradeoffs: [
    "Pro: True real-time (< 1s latency)",
    "Pro: Lower server load",
    "Con: More complex infrastructure",
    "Con: Mobile battery concerns",
    "Con: Requires new infrastructure"
  ],
  assumptions: ["Team can maintain WebSocket infrastructure"]
})

riotplan_shaping_add_approach({
  name: "Server-Sent Events (SSE)",
  description: "One-way server push over HTTP",
  tradeoffs: [
    "Pro: Real-time (< 5s latency)",
    "Pro: Simpler than WebSockets",
    "Pro: Works over HTTP",
    "Con: One-way only (server to client)"
  ],
  assumptions: ["One-way is sufficient for notifications"]
})
```

### 5. Gather Feedback

**User**: "Polling feels wasteful. WebSockets might be overkill. SSE is interesting but I'm not sure about browser support."

```typescript
riotplan_shaping_add_feedback({
  feedback: "Polling feels wasteful. WebSockets might be overkill. SSE is interesting but concerned about browser support."
})
```

**User**: "Here's caniuse data for SSE" [attaches]

```typescript
riotplan_shaping_add_evidence({
  evidencePath: "https://caniuse.com/eventsource",
  description: "97% browser support for SSE",
  relatedTo: "Server-Sent Events (SSE)"
})
```

### 6. Compare and Select

```typescript
riotplan_shaping_compare()
// Shows all approaches with tradeoffs

riotplan_shaping_select({
  approach: "Server-Sent Events (SSE)",
  reason: "Balances real-time updates with infrastructure simplicity. 97% browser support addresses concerns. Simpler than WebSockets, more efficient than polling."
})
```

### 7. Build Detailed Plan

**AI**: "Ready to build detailed plan?"

**User**: "Yes"

```typescript
riotplan_transition({
  stage: "built",
  reason: "Approach selected: SSE"
})

// NOW generate detailed steps based on the shaped approach
riotplan_generate({ steps: 8 })
```

## Key Benefits

### For Users
- **No premature commitment**: Ideas don't obligate execution
- **Collaborative exploration**: AI asks questions, captures thinking
- **Evidence-based decisions**: Attach docs, diagrams, examples
- **Explicit tradeoffs**: See pros/cons before committing
- **Transparent reasoning**: Document why decisions were made

### For AI Assistants
- **Structured exploration**: Clear workflow for early-stage thinking
- **Context gathering**: Collect constraints, questions, evidence
- **Decision support**: Help compare options objectively
- **Commitment awareness**: Know when user is ready to commit
- **Better plans**: Generate steps based on shaped understanding

## What Changed

This addresses the problem from our conversation:
- ❌ Before: AI jumped straight to detailed steps
- ✅ After: AI explores idea → shapes approach → then builds plan

The lifecycle now supports:
1. **Idea** - Cheap thinking
2. **Shaping** - Approach comparison
3. **Built** - Detailed plan (only after shaping)

## Files Created

- `src/mcp/tools/idea.ts` - Idea stage tools
- `src/mcp/tools/shaping.ts` - Shaping stage tools
- `src/mcp/tools/shared.ts` - Shared utilities
- `src/mcp/prompts/explore_idea.md` - Idea exploration prompt
- `src/mcp/prompts/shape_approach.md` - Approach shaping prompt
- `src/mcp/tools/index.ts` - Updated to register new tools
- `src/mcp/prompts/index.ts` - Updated to register new prompts

## Next Steps

1. Build and test the MCP server
2. Try the workflow with the plan-lifecycle idea
3. Refine based on usage
4. Add CLI commands for idea/shaping stages
5. Document the workflow

## Testing

```bash
# Build
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build

# Test via MCP
# The tools should now be available in Cursor
```

Try it:
1. Use `/riotplan/explore_idea` prompt
2. Create an idea
3. Add notes, constraints, questions
4. Transition to shaping
5. Add approaches with tradeoffs
6. Compare and select
7. Generate detailed plan

This is the workflow you wanted - collaborative exploration before commitment!
