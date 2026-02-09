# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Integrated State Approach

**Description**: Add reflection as a first-class field in the step state model and the plan completion workflow. When step_complete is called, the agent passes a reflection string that gets persisted in plan state. Since STATUS.md is regenerated each time, reflections survive regeneration because they're in the underlying data model. A new 'Reflections' section appears in STATUS.md under each step. The execute_step prompt is updated to read STATUS.md (which includes prior reflections) before starting work. At plan completion, a new riotplan_step_complete call on the final step triggers retrospective generation — a new MCP tool (riotplan_generate_retrospective) reads all step reflections + the original plan + execution data and generates retrospective.md using a carefully crafted prompt designed for genuine model reasoning. The two blog posts are deliverables written as part of the plan. The retrospective prompt is the crown jewel — it must invite creative, surprising analysis, not templated output.

**Tradeoffs**:
- + Reflections are durable — survive STATUS.md regeneration because they're in the data model
- + Clean integration — step_complete already exists, just needs a reflection parameter
- + STATUS.md becomes the single source of truth for execution state AND reflection
- + Natural workflow — reflection happens right when the agent has full memory of what it just did
- - Requires schema change to step state model (migration concern for existing plans)
- - step_complete becomes a bigger operation (reflection text can be long)
- - STATUS.md grows significantly with reflections included — could become noisy for quick status checks
- - Tighter coupling between status tracking and reflection

**Assumptions**:
- Existing plans without reflections can be handled gracefully (reflection field is optional)
- The agent executing steps has enough context to write meaningful reflections at step_complete time
- STATUS.md regeneration is the right place to surface reflections to subsequent steps


### Approach: Layered Reflection Approach

**Description**: Keep step state and STATUS.md focused on execution tracking. Add reflection as a separate layer with its own files and tools. After step_complete, a new tool riotplan_step_reflect writes a reflection file to a reflections/ directory (e.g., reflections/01-reflection.md). The execute_step prompt is updated to read both the step file AND any prior reflection files before starting work. STATUS.md gets a lightweight 'Reflection' column (just a checkmark showing reflection exists) but the full content lives in separate files. At plan completion, riotplan_generate_retrospective reads all reflection files + plan data and generates retrospective.md. The reflection files are freeform prose — no schema, just the agent's genuine analysis. The retrospective prompt is designed to synthesize these into creative, high-value feedback. Blog posts are deliverables. The retrospective tool signals that a high-tier model should be used.

**Tradeoffs**:
- + Clean separation of concerns — status tracking vs reflection are different jobs
- + Reflection files can be rich and detailed without bloating STATUS.md
- + No schema migration — step state model stays as-is, new files are additive
- + Each reflection is a standalone document that can be read independently
- + Easier to reference individual step reflections from future plans
- - Two-tool workflow per step (step_complete + step_reflect) instead of one
- - Reflection could be forgotten if agent doesn't call the second tool
- - More files in the plan directory (reflections/ adds per-step files)
- - Need to ensure execute_step prompt reads reflection files (extra context loading)

**Assumptions**:
- Agents will reliably call step_reflect after step_complete if the prompt instructs them to
- Separate reflection files are better than embedded reflections for readability
- The extra file I/O per step is acceptable overhead


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

- [evidence/current-architecture.md](evidence/current-architecture.md) - Current RiotPlan execution architecture analysis

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Layered Reflection Approach

**Reasoning**: Clean separation of concerns, freeform standalone reflection files are better for rich prose and cross-plan referencing, avoids schema migration, STATUS.md stays focused on execution tracking. Two-tool risk is manageable through prompt design.

**Selected At**: 2026-02-09T03:46:50.985Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-09T03:42:41.954Z
**Next**: Select an approach and transition to 'built'
