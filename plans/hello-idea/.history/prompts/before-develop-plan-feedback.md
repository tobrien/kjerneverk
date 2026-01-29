# Checkpoint: before-develop-plan-feedback

**Timestamp**: 2026-01-29T15:20:12.256Z
**Stage**: shaping
**Message**: Captured state before discussing develop_plan prompt requirements. User identified need for plan refinement workflow with feedback capture.

## Current State

**Current Stage**: shaping

### IDEA.md

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


### SHAPING.md

# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Narrative Evolution with Checkpoints and Evidence

**Description**: Preserve full conversational narrative alongside structured timeline. Support free-form exploration through typing/speaking. Provide lightweight checkpoints for stopping points and backtracking. Integrate evidence (documents, data, images) as first-class citizens that can be manually attached or automatically gathered by models searching relevant directories.

**Tradeoffs**:
- Pro: Preserves full-fidelity conversational context that structured summaries lose
- Pro: Checkpoints enable recovery from dead ends without losing work
- Pro: Evidence integration makes ideas grounded in real data/documents
- Pro: Model-assisted evidence gathering reduces manual work
- Pro: Low complexity - no audio processing, no special burst-day handling
- Con: Storage grows with full conversation history (but text is cheap)
- Con: Need to design checkpoint UX carefully to avoid friction
- Con: Model-assisted evidence gathering requires good search/retrieval capabilities
- Con: May need to handle evidence that becomes stale or moves

**Assumptions**:
- Filesystem and Markdown remain the storage mechanism
- Conversations are primarily text-based (audio transcription happens externally)
- Evidence files are accessible via filesystem paths or URLs
- Models have capability to search directories and assess relevance
- Users will manually create checkpoints at natural stopping points


### Approach: Hybrid Timeline

**Description**: Single unified timeline mixing structured events (notes, constraints, questions) and raw narrative chunks. Everything is chronological - you can see exactly when each piece of thinking happened. Evidence is attached at specific timeline points. The timeline tells the complete story of how the idea evolved.

**Tradeoffs**:
- Pro: Complete chronological history - see exactly how thinking evolved
- Pro: No artificial separation between 'structured' and 'conversational' data
- Pro: Easy to understand - just read top to bottom to see the journey
- Pro: Natural for checkpointing - just mark a point in the timeline
- Pro: Preserves context - why a constraint was added is visible in surrounding narrative
- Con: Harder to extract pure structured data (need to filter timeline)
- Con: Timeline can get very long for complex ideas
- Con: Querying specific types (all constraints) requires scanning timeline
- Con: May need good tooling to navigate/search long timelines

**Assumptions**:
- Timeline stored as append-only JSONL for simplicity
- Each entry has timestamp, type, and data
- Narrative chunks captured as distinct timeline entries
- Tools can filter/query timeline by type when needed
- Checkpoints are just special timeline markers


### Approach: Dual-Track: Living Document + Immutable Log

**Description**: Maintain two parallel artifacts: (1) A living IDEA.md document that gets edited/refined as thinking evolves - this is what you read to understand current state. (2) An immutable append-only log capturing every change, conversation, and decision - this is the historical record. Checkpoints snapshot the living document at key moments.

**Tradeoffs**:
- Pro: Living document is clean and readable - shows current thinking without historical noise
- Pro: Can edit and refine the IDEA.md as understanding improves
- Pro: Immutable log preserves complete history for forensics
- Pro: Familiar pattern - like Git working tree + commit history
- Pro: Easy to share current state (just share IDEA.md)
- Con: Two sources of truth to maintain
- Con: Reconciling living doc and log can be complex
- Con: Risk of living doc and log diverging
- Con: More complex implementation than pure timeline
- Con: Harder to see 'the journey' - need to replay log

**Assumptions**:
- IDEA.md is the 'current state' that gets edited
- Log is append-only JSONL that never changes
- Checkpoints create snapshots of IDEA.md at specific log points
- Tools can reconstruct any checkpoint by replaying log
- Users primarily interact with IDEA.md, log is for history


## Feedback

_Feedback will be added here as you provide it_

### 2026-01-29T08:18:35.097Z

RiotPlan should stay out of the audio business. Transcription is a separate concern. Adding too much complexity makes tools difficult to use (learned from KodrDriv experience).

### 2026-01-29T08:18:36.190Z

Don't optimize around 'crazy days' with 50 recordings. The system should work regardless of how manic the ideation process gets.

### 2026-01-29T08:18:37.256Z

Very appealing - capturing input as narrative/story while developing ideas through typing or speaking is rewarding and natural.

### 2026-01-29T08:18:38.434Z

Important for establishing stopping points after an hour of work. Critical for recovering from dead ends - need ability to backtrack when exploration goes wrong.

### 2026-01-29T08:23:09.663Z

Choosing Hybrid Timeline because I never really know if I'm going to show up with rigorous, structured thought or if I'm running at an idea with just a feeling and some hope. Need a system that handles both modes equally well.

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Narrative Evolution with Checkpoints and Evidence

**Reasoning**: This approach best handles the variability in how ideas emerge - sometimes structured and rigorous, sometimes just feelings and hope. Preserving full conversational narrative alongside structured timeline ensures we don't lose the rich context that leads to good decisions. Checkpoints provide stopping points and recovery from dead ends. Evidence integration grounds ideas in real data and documents.

**Selected At**: 2026-01-29T08:24:57.553Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-01-29T08:13:28.574Z
**Next**: Select an approach and transition to 'built'




## Files at This Point

- IDEA.md
- LIFECYCLE.md
- SHAPING.md

## Recent Timeline

- 1/29/2026, 12:18:37 AM: feedback_added - {"feedback":"Very appealing - capturing input as narrative/story while developing ideas through typing or speaking is rewarding and natural."}
- 1/29/2026, 12:18:38 AM: feedback_added - {"feedback":"Important for establishing stopping points after an hour of work. Critical for recovering from dead ends - need ability to backtrack when exploration goes wrong."}
- 1/29/2026, 12:21:11 AM: note_added - {"note":"Evidence definition: data, documents, presentations, images, data - anything that needs to be referenced. Can be manually attached or automatically gathered by asking models to search and assemble relevant materials."}
- 1/29/2026, 12:21:17 AM: approach_added - {"name":"Narrative Evolution with Checkpoints and Evidence","description":"Preserve full conversational narrative alongside structured timeline. Support free-form exploration through typing/speaking. Provide lightweight checkpoints for stopping points and backtracking. Integrate evidence (documents, data, images) as first-class citizens that can be manually attached or automatically gathered by models searching relevant directories.","tradeoffs":["Pro: Preserves full-fidelity conversational context that structured summaries lose","Pro: Checkpoints enable recovery from dead ends without losing work","Pro: Evidence integration makes ideas grounded in real data/documents","Pro: Model-assisted evidence gathering reduces manual work","Pro: Low complexity - no audio processing, no special burst-day handling","Con: Storage grows with full conversation history (but text is cheap)","Con: Need to design checkpoint UX carefully to avoid friction","Con: Model-assisted evidence gathering requires good search/retrieval capabilities","Con: May need to handle evidence that becomes stale or moves"],"assumptions":["Filesystem and Markdown remain the storage mechanism","Conversations are primarily text-based (audio transcription happens externally)","Evidence files are accessible via filesystem paths or URLs","Models have capability to search directories and assess relevance","Users will manually create checkpoints at natural stopping points"]}
- 1/29/2026, 12:22:32 AM: approach_added - {"name":"Hybrid Timeline","description":"Single unified timeline mixing structured events (notes, constraints, questions) and raw narrative chunks. Everything is chronological - you can see exactly when each piece of thinking happened. Evidence is attached at specific timeline points. The timeline tells the complete story of how the idea evolved.","tradeoffs":["Pro: Complete chronological history - see exactly how thinking evolved","Pro: No artificial separation between 'structured' and 'conversational' data","Pro: Easy to understand - just read top to bottom to see the journey","Pro: Natural for checkpointing - just mark a point in the timeline","Pro: Preserves context - why a constraint was added is visible in surrounding narrative","Con: Harder to extract pure structured data (need to filter timeline)","Con: Timeline can get very long for complex ideas","Con: Querying specific types (all constraints) requires scanning timeline","Con: May need good tooling to navigate/search long timelines"],"assumptions":["Timeline stored as append-only JSONL for simplicity","Each entry has timestamp, type, and data","Narrative chunks captured as distinct timeline entries","Tools can filter/query timeline by type when needed","Checkpoints are just special timeline markers"]}
- 1/29/2026, 12:23:09 AM: feedback_added - {"feedback":"Choosing Hybrid Timeline because I never really know if I'm going to show up with rigorous, structured thought or if I'm running at an idea with just a feeling and some hope. Need a system that handles both modes equally well."}
- 1/29/2026, 12:24:07 AM: approach_added - {"name":"Dual-Track: Living Document + Immutable Log","description":"Maintain two parallel artifacts: (1) A living IDEA.md document that gets edited/refined as thinking evolves - this is what you read to understand current state. (2) An immutable append-only log capturing every change, conversation, and decision - this is the historical record. Checkpoints snapshot the living document at key moments.","tradeoffs":["Pro: Living document is clean and readable - shows current thinking without historical noise","Pro: Can edit and refine the IDEA.md as understanding improves","Pro: Immutable log preserves complete history for forensics","Pro: Familiar pattern - like Git working tree + commit history","Pro: Easy to share current state (just share IDEA.md)","Con: Two sources of truth to maintain","Con: Reconciling living doc and log can be complex","Con: Risk of living doc and log diverging","Con: More complex implementation than pure timeline","Con: Harder to see 'the journey' - need to replay log"],"assumptions":["IDEA.md is the 'current state' that gets edited","Log is append-only JSONL that never changes","Checkpoints create snapshots of IDEA.md at specific log points","Tools can reconstruct any checkpoint by replaying log","Users primarily interact with IDEA.md, log is for history"]}
- 1/29/2026, 12:24:57 AM: approach_selected - {"approach":"Narrative Evolution with Checkpoints and Evidence","reason":"This approach best handles the variability in how ideas emerge - sometimes structured and rigorous, sometimes just feelings and hope. Preserving full conversational narrative alongside structured timeline ensures we don't lose the rich context that leads to good decisions. Checkpoints provide stopping points and recovery from dead ends. Evidence integration grounds ideas in real data and documents."}
- 1/29/2026, 7:20:09 AM: note_added - {"note":"CRITICAL FEEDBACK: Need a develop_plan prompt similar to explore_idea that captures feedback on generated plans. Must support both wide feedback (change all steps) and narrow feedback (specific sentences). Should store plan pre/post feedback and auto-create checkpoints for each feedback item."}
- 1/29/2026, 7:20:10 AM: note_added - {"note":"FEEDBACK ON EXPLORE_IDEA: Need to capture the WHOLE conversation - not just user answers, but also the questions they were responding to. Full conversational context is critical."}

---

This checkpoint captures the state of the plan at this moment in time.
You can restore to this checkpoint using: `riotplan_checkpoint_restore({ checkpoint: "before-develop-plan-feedback" })`
