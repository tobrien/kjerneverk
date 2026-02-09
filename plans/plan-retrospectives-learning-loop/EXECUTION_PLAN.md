# Plan Retrospectives Learning Loop — Execution Plan

## Execution Instructions

1. **Read STATUS.md first** to check current progress
2. **Find the next pending step** in the sequence below
3. **Read the step's detailed plan file** in `plan/`
4. **Execute the step** following its tasks and acceptance criteria
5. **Reflect after completing each step** using `riotplan_step_reflect`

## Important: Reflection is Mandatory

After completing each step, you MUST call `riotplan_step_reflect` before moving to the next step. Capture:
- What surprised you about this step
- Where you deviated from the plan
- What could have been done differently
- What the next step should know

This plan is literally about building the reflection system — practice what we preach.

## Execution Sequence

### Phase 1: Foundation (Steps 1-2)

Build the core reflection infrastructure.

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 1 | Create step reflection tool and reflections/ structure | `plan/01-create-step-reflection-tool-and-reflections-directory-structure.md` | 60 min |
| 2 | Update STATUS.md generator for reflection indicators | `plan/02-update-statusmd-generator-to-show-reflection-indicators.md` | 30 min |

### Phase 2: Inter-Step Learning (Step 3)

Wire reflections into the execution workflow.

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 3 | Update execute_step prompt for prior reflections | `plan/03-update-executestep-prompt-to-read-prior-step-reflections.md` | 45 min |

### Phase 3: Retrospective Generation (Steps 4-6)

Build the plan-level retrospective system.

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 4 | Design retrospective generation prompt | `plan/04-design-and-implement-retrospective-generation-prompt.md` | 60 min |
| 5 | Create riotplan_generate_retrospective tool | `plan/05-create-riotplangenerateretrospective-mcp-tool.md` | 45 min |
| 6 | Wire retrospective into plan completion | `plan/06-wire-retrospective-into-plan-completion-workflow.md` | 30 min |

### Phase 4: Cross-Plan Learning (Step 7)

Close the outer learning loop.

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 7 | Add retrospective referencing to idea exploration | `plan/07-add-retrospective-referencing-to-idea-exploration-flow.md` | 45 min |

### Phase 5: Content (Step 8)

Write about what we built and learned.

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 8 | Write blog posts | `plan/08-write-blog-posts---model-tier-map-and-self-reflection-in-llm-collaboration.md` | 90 min |

## Model Tier Recommendations

- **Steps 1-3, 5-7**: Sonnet or Opus — standard implementation work
- **Step 4**: Opus (highest tier) — prompt design is the most critical deliverable
- **Step 8**: Opus (highest tier) — blog posts require creative, thoughtful writing
- **Retrospective for this plan**: Opus 4.6 — practice what we preach

## Quality Gates

- After Step 2: Reflection tool works end-to-end (write → read → display in STATUS.md)
- After Step 6: Full execution workflow works (execute step → reflect → next step reads reflection → plan completes → retrospective generated)
- After Step 7: Cross-plan referencing works (reference retrospective during new idea exploration)
