# Idea: riotplan-verification-enforcement

## Core Concept

Add automated verification and enforcement mechanisms to prevent incomplete plans from being marked as done. Implement acceptance criteria validation, automatic retrospective generation, artifact verification, and evidence-based reflections to ensure plan completion claims are accurate and verifiable.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- **Problem Discovered**: The riotplan-http-mcp plan was marked as completed and moved to done/ but Step 5 was incomplete. The CLI command registration was claimed in the reflection but never actually done. This revealed multiple gaps:

1. Reflections are self-reported without verification
2. Acceptance criteria exist but aren't enforced
3. Retrospective generation exists but isn't automatic
4. No artifact verification (checking claimed files/changes actually exist)
5. No evidence requirement for reflection claims
- **Current State**: RiotPlan has the mechanisms but they're optional/manual:
- `riotplan_generate_retrospective` exists but requires manual invocation
- `plan/validator.ts` checks acceptance criteria sections exist, not that they're met
- Reflections are written by executing agent with no verification
- `riotplan_step_complete` trusts the agent without checking anything

## Constraints

- _Add constraints..._
- Must not break existing workflows - verification should be opt-in or have escape hatches for edge cases
- Verification checks should be fast - don't slow down the step completion flow significantly
- Should work with both directory-based and SQLite .plan formats

## Questions

- _Add questions..._
- Should acceptance criteria verification be automatic (blocks step_complete) or advisory (warns but allows)?
- How do we verify acceptance criteria programmatically? Parse checkboxes? Require structured format?
- Should retrospective generation be automatic when transitioning to 'completed' stage?
- What artifacts should be verified? Git commits? File existence? Test results? Build success?
- Should reflections require evidence links (commits, test outputs, screenshots)?

## Evidence

_Attach relevant documents, images, or files_

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-02-18T05:36:44.091Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
