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
