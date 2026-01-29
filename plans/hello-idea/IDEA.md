# Idea: hello-idea

## Core Concept

Exploration of how we develop an idea before turning it into a plan. This will demonstrate the ideation process, including capturing notes, constraints, questions, and evidence as we shape our thinking before committing to a formal plan structure.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- User has been creating complex plans for some time and wants to formalize the process of turning ideas into plans with a common structure.
- Current tools like Cursor are great at simple, one-page plans, but the real power lies in plans that can define much larger ideas.
- User now spends far more time writing plans than code or documents - this indicates plans have become a primary thinking and communication tool.
- Evidence can come from many sources: URLs, web resources, filesystem documents, medical data, dietary information - depends on domain
- Most difficult ideas need assistance thinking through various execution options - this is where shaping/exploration helps before committing to a plan
- Some ideas benefit from offline processing - long walks, thinking time - not just immediate execution
- Many ideas never become plans - the process of ideation itself reveals that execution isn't worth it. These get archived or ignored.
- Some interesting ideas get captured with recordings/notes but never executed due to distraction - the 'someday weekend project' category.
- Long-lived architectural ideas often need regeneration from scratch after months pass - checkpointing could help preserve thinking at key moments.
- The explore_idea prompt is successfully capturing conversational context into a persistent history - this addresses the 'losing the conversation' problem.
- FEATURE REQUEST: RiotPlan should capture raw user input alongside the structured JSONL timeline. The summarization is useful but we're losing full-fidelity conversational context that contains nuance and detail.
- User has 'idea burst' days - one or two days every two weeks where tens or hundreds of ideas emerge. These need to be captured quickly without friction.
- Ideas become archived through neglect - when enough time passes, the creator forgets what they were about. This suggests need for better context preservation.
- Primary content creation method is dictation via protokoll (redaksjon project), then processing transcripts into plans. Voice-to-plan pipeline is core workflow.
- Evidence definition: data, documents, presentations, images, data - anything that needs to be referenced. Can be manually attached or automatically gathered by asking models to search and assemble relevant materials.
- CRITICAL FEEDBACK: Need a develop_plan prompt similar to explore_idea that captures feedback on generated plans. Must support both wide feedback (change all steps) and narrow feedback (specific sentences). Should store plan pre/post feedback and auto-create checkpoints for each feedback item.
- FEEDBACK ON EXPLORE_IDEA: Need to capture the WHOLE conversation - not just user answers, but also the questions they were responding to. Full conversational context is critical.

## Constraints

- _Add constraints..._
- Ideation is unbounded and highly variable - some ideas form in minutes, others take weeks
- Ideas should be free-form (notes, evidence, questions), but plans must have linear structure (steps, STATUS, EXECUTION PLAN)
- Must work with filesystem and Markdown - avoid complicated storage mechanisms
- Currently individual but stored in GitHub for potential collaboration

## Questions

- _Add questions..._
- How do we know when an idea is ready to become a plan? There's a range of certainty - some are obvious in minutes, others remain uncertain until implementation.
- How do we handle ideas that split into multiple plans during development? Need a way to cleanly separate concerns without losing context.
- How do we track the evolution of long-lived ideas without creating rigid, cult-like processes? Need lightweight checkpointing without full Git complexity.
- How do we preserve the rich conversational context that leads to ideas? We're constantly losing valuable thinking in ephemeral chat sessions.

## Evidence

_Attach relevant documents, images, or files_
- [/Users/tobrien/gitw/kjerneverk/plans/done/reverse-engineer-riotplan](/Users/tobrien/gitw/kjerneverk/plans/done/reverse-engineer-riotplan) - The original plan that started RiotPlan - example of a plan that evolved significantly over time
- [/Users/tobrien/gitw/kjerneverk/riotplan/guide/create.md](/Users/tobrien/gitw/kjerneverk/riotplan/guide/create.md) - Current plan creation guide that user follows - documents the manual process that RiotPlan is systematizing
- [/Users/tobrien/gitw/grunnverk/plans/frobank](/Users/tobrien/gitw/grunnverk/plans/frobank) - Example of 'someday weekend project' - idea captured during burst day but not yet executed
- [/Users/tobrien/gitw/grunnverk/plans/rulechecker](/Users/tobrien/gitw/grunnverk/plans/rulechecker) - Example of 'someday weekend project' - idea captured during burst day but not yet executed
- [/Users/tobrien/gitw/grunnverk/plans/samling](/Users/tobrien/gitw/grunnverk/plans/samling) - Example of 'someday weekend project' - idea captured during burst day but not yet executed
- [/Users/tobrien/gitw/grunnverk/plans/shadowguide](/Users/tobrien/gitw/grunnverk/plans/shadowguide) - Example of 'someday weekend project' - idea captured during burst day but not yet executed
- [/Users/tobrien/gitw/grunnverk/plans/vaktpost](/Users/tobrien/gitw/grunnverk/plans/vaktpost) - Example of 'someday weekend project' - idea captured during burst day but not yet executed
- [/Users/tobrien/gitw/tobrien/activity/notes/2026/1](/Users/tobrien/gitw/tobrien/activity/notes/2026/1) - Directory containing voice transcripts from protokoll - shows the voice-to-plan content creation pipeline

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-29T07:43:08.667Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
