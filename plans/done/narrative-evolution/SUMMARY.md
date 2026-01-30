# Narrative Evolution with Checkpoints and Evidence

## Overview

Implement Narrative Evolution with Checkpoints and Evidence approach in RiotPlan. This will enhance the idea exploration process by: (1) Preserving full conversational narrative alongside structured timeline events, (2) Supporting free-form exploration through typing/speaking without forcing structure, (3) Providing lightweight checkpoints for stopping points and backtracking from dead ends, (4) Integrating evidence (documents, data, images) as first-class citizens that can be manually attached or automatically gathered by models. The system must handle variability in how ideas emerge - sometimes structured and rigorous, sometimes just feelings and hope. Storage remains filesystem-based with Markdown, avoiding complicated mechanisms. Focus on capturing the complete journey of how ideas evolve while maintaining queryable structure.

## Goals

1. Capture full conversational narrative alongside structured timeline events without losing context
2. Enable lightweight checkpointing for stopping points and recovery from dead ends
3. Integrate evidence as first-class citizens with both manual and model-assisted gathering
4. Support variable ideation modes - from rigorous structure to exploratory feelings
5. Maintain filesystem/Markdown simplicity while adding rich capture capabilities

## Scope

### In Scope

- Extend timeline.jsonl to capture raw narrative chunks alongside structured events
- Implement checkpoint creation, listing, viewing, and restoration
- Add evidence gathering capabilities (manual attachment and model-assisted search)
- Create MCP tools for narrative capture and checkpoint management
- Update existing idea/shaping tools to capture conversational context
- Design storage format for narrative chunks and checkpoints
- Build checkpoint restoration mechanism

### Out of Scope

- Audio transcription (handled by external tools like protokoll)
- Burst-day specific optimizations (system should work naturally at any pace)
- Complex version control systems (keep it lightweight)
- Real-time collaboration features (GitHub-based collaboration is sufficient)
- Automated evidence staleness detection (manual management for now)

## Success Criteria

- [ ] Timeline captures both structured events and raw narrative chunks chronologically
- [ ] Users can create checkpoints at any point during ideation/shaping
- [ ] Users can view checkpoint history and see what was captured at each point
- [ ] Users can restore to any previous checkpoint when hitting dead ends
- [ ] Evidence can be manually attached with descriptions
- [ ] Models can search directories and gather relevant evidence when asked
- [ ] Full conversational context is preserved and queryable
- [ ] System handles both structured and free-form input naturally
- [ ] Storage remains simple filesystem/Markdown with JSONL timeline
- [ ] Existing idea/shaping workflows continue to work seamlessly

---

*Plan created: 2026-01-29*
