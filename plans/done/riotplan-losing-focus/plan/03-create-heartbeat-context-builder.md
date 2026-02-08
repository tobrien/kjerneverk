# Step 3: Create Heartbeat Context Builder Function

**Recommended Model**: Sonnet 4.5
**Rationale**: Requires understanding the plan state model (LIFECYCLE.md, STATUS.md, IDEA.md) and designing a function that reads and formats contextual information. Moderate complexity - not mechanical, but not requiring deep prompt engineering either.

**Depends on**: Nothing (can run in parallel with Steps 1-2)

## Objective

Create a function that generates a contextual heartbeat string to be appended to every RiotPlan tool response. The heartbeat reminds the model of its current context: what plan it's working on, what stage it's in, what it just did, and what it should do next.

## Background

The user wants every RiotPlan tool response to project confidence and control. The heartbeat should tell the model: "I (RiotPlan) am in charge, I know the state, follow my lead." More context is better, but it must be concise enough that models don't ignore it.

## Tasks

- [ ] Create a new file `src/mcp/heartbeat.ts` (or add to `src/mcp/tools/shared.ts`)
- [ ] Implement `generateHeartbeat(planDirectory: string)` function
- [ ] Read plan stage from LIFECYCLE.md (idea, shaping, built, executing, done)
- [ ] Read plan name/code from directory name or IDEA.md
- [ ] Determine last action from timeline.jsonl (last entry)
- [ ] Generate stage-appropriate next action suggestion
- [ ] Format as a compact footer string
- [ ] Handle edge cases: missing files, unreadable state, no plan directory
- [ ] Add TypeScript types for heartbeat output

## Output Format

```
---
📋 RiotPlan Active | Plan: riotplan-losing-focus | Stage: idea | Dir: /plans/riotplan-losing-focus
Last: Added note about transition protocol | Next: Continue exploring or move to shaping
⚠️ Stay in plan mode. Capture insights with RiotPlan tools. Do not implement.
---
```

## Stage-Specific Next Actions

| Stage | Suggested Next |
|-------|---------------|
| idea | Continue exploring, add notes/constraints/questions, or move to shaping |
| shaping | Add approaches, compare tradeoffs, or select an approach |
| built | Review steps, validate plan, or begin execution |
| executing | Complete current step, mark progress, or report blockers |

## Files Changed

- `src/mcp/heartbeat.ts` (new) OR `src/mcp/tools/shared.ts` (extended)

## Acceptance Criteria

- Function reads real plan state from filesystem
- Output is concise (3-5 lines max)
- Handles missing/corrupt state gracefully (returns generic reminder)
- Includes stage-appropriate guidance
- TypeScript compiles cleanly
