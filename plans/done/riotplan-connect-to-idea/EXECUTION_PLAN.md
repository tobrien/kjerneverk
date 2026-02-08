# Execution Plan: riotplan-connect-to-idea

## Strategy

Implement the "Rich Prompt with Reasoning Gate" approach to connect plan generation to idea artifacts. The work progresses through the generation pipeline: first wire the data (step 1), then rewrite prompts to use it (step 2), extend the response schema with analysis and provenance (step 3), add token budget management (step 4), implement validation (step 5), expose the tool through MCP (step 6), and finally test end-to-end (step 7).

## Prerequisites

- [ ] Understanding of requirements from IDEA.md
- [ ] Review selected approach from SHAPING.md

## Steps

| Step | Name | Description | Model Recommendation |
|------|------|-------------|---------------------|
| 01 | Extend GenerationContext and wire read_context into build.ts | Refactor build.ts to load ALL idea artifacts via read_context logic before passing to generator. Extend GenerationContext to carry structured artifact data. | **Sonnet** - Straightforward TypeScript refactoring |
| 02 | Rewrite generator system and user prompts for artifact-aware generation | Replace generic generator prompts with artifact-aware prompts that instruct the model to honor constraints, implement selected approach, reference evidence. | **Opus** - Prompt design requires careful language |
| 03 | Extend response schema with analysis section and per-step provenance | Add mandatory 'analysis' section to response schema where model demonstrates understanding, and per-step 'provenance' fields citing constraints and evidence. | **Sonnet** - JSON schema extension and TypeScript |
| 04 | Implement smart tiering for token budget management | Add token budget awareness so large artifacts don't overflow context. Implement tiering: constraints always full, evidence summarized if large, history abbreviated if needed. | **Sonnet** - Algorithm implementation with clear requirements |
| 05 | Implement post-generation validation and PROVENANCE.md output | After generation, validate constraints are addressed, evidence is referenced, selected approach is reflected. Produce PROVENANCE.md documenting how artifacts shaped the plan. | **Sonnet** - New modules with clear interfaces |
| 06 | Update MCP tool registration and expose riotplan_build | Ensure riotplan_build is properly registered and exposed through MCP server so AI assistants can trigger artifact-aware plan generation. | **Sonnet** (or faster) - Registration/wiring step |
| 07 | End-to-end testing with a real idea-to-plan generation | Test complete artifact-aware generation pipeline using a real idea directory. Verify plan is genuinely grounded in artifacts, not just generally competent. | **Opus** - Testing requires judgment and qualitative evaluation |

## Quality Gates

After each step:
- [ ] Code compiles/runs
- [ ] Tests pass
- [ ] Documentation updated

## Notes

- Step 1 (✅ completed): Successfully extended GenerationContext and wired artifact loading. All tests pass.
- Steps 2 and 7 recommended for Opus due to prompt design and qualitative evaluation needs
- Steps 3-6 recommended for Sonnet as straightforward implementation work
- Follow the step-by-step approach
- Update STATUS.md as you progress
- Use riotplan_step_start and riotplan_step_complete for tracking

---

*Last updated: 2026-02-08*
