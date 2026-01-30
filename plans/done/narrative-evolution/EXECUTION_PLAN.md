# Execution Plan: Narrative Evolution with Checkpoints and Evidence

## Strategy

Implement narrative capture and checkpointing incrementally, starting with the data model and storage layer, then building up the MCP tools and integrations. The approach is to extend the existing timeline.jsonl format to support narrative chunks, then add checkpoint functionality, and finally integrate evidence gathering capabilities. Each step builds on the previous one, allowing for testing and validation along the way.

## Prerequisites

- [ ] RiotPlan codebase is accessible and buildable
- [ ] Understanding of current timeline.jsonl format and structure
- [ ] Familiarity with MCP tool implementation patterns in RiotPlan
- [ ] Access to test plans/ideas for validation
- [ ] Understanding of checkpoint requirements from hello-idea exploration

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Design Data Model | Define timeline event types for narratives and checkpoints, design checkpoint storage format |
| 02 | Extend Timeline Format | Add narrative_chunk event type to timeline.jsonl, update timeline writer/reader |
| 03 | Implement Narrative Capture | Create MCP tool to capture raw conversational input as timeline events |
| 04 | Design Checkpoint Storage | Define checkpoint format and storage structure in .history/ directory |
| 05 | Implement Checkpoint Creation | Build checkpoint creation tool that snapshots current state |
| 06 | Implement Checkpoint Listing | Build tool to list all checkpoints with timestamps and messages |
| 07 | Implement Checkpoint Viewing | Build tool to display checkpoint details and context |
| 08 | Implement Checkpoint Restoration | Build restoration mechanism to revert to previous checkpoint |
| 09 | Enhance Evidence Tools | Extend evidence tools to support model-assisted gathering |
| 10 | Integration and Testing | Test full workflow, update prompts, validate with real ideas |
| 11 | Create develop_plan Prompt | Build plan refinement workflow with feedback capture (foundation for later enhancements) |
| 12 | Create execute_plan Prompt | Build high-level execution workflow with intelligent state management |
| 13 | Document User Stories | Create story-driven documentation showing fast and thorough workflows |

## Quality Gates

After each step:
- [ ] Tests pass for new functionality
- [ ] Existing tests continue to pass (no regressions)
- [ ] TypeScript types are properly defined
- [ ] Code follows RiotPlan patterns and conventions
- [ ] Manual testing with sample idea confirms behavior
- [ ] Documentation updated if needed

## Notes

- Keep storage format simple and human-readable (JSONL + Markdown)
- Ensure backward compatibility with existing plans/ideas
- Test with the hello-idea we just created to validate real-world usage
- Consider how this integrates with existing explore_idea and shape_approach prompts
- Narrative chunks should be optional - don't break existing workflows
- Checkpoints should be lightweight - just mark a point in time, don't create heavy snapshots

---

*Last updated: 2026-01-29*
