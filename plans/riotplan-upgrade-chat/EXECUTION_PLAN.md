# RiotPlan Upgrade Chat — Execution Plan

## Strategy

Build the agent-powered plan generation in layers: first the tools and prompts (Step 1), then the agent loop integration (Step 2), then codebase context injection (Step 3), then wire everything into the build tool (Step 4), and finally validate end-to-end with progress feedback (Step 5).

## Phases

### Phase 1: Foundation (Steps 1-2)
Create the `write_plan` tool, the agent generation prompt, and the `generatePlanWithAgent()` function. This is the core new capability.

### Phase 2: Context (Step 3)
Auto-build the project index and inject codebase context. This improves BOTH the agent path and the one-shot fallback path.

### Phase 3: Integration (Steps 4-5)
Wire everything into `build.ts`, add progress feedback in the terminal, and validate end-to-end.

### Phase 4: Full Flow (Step 6)
Model selection for build quality, and validate the complete `explore → shape → build` flow from a bare terminal matches Cursor+Opus quality.

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Create write_plan Tool and Agent Generation Prompt | Build the write_plan tool for structured output + system prompt for codebase-aware generation |
| 02 | Create generatePlanWithAgent() | Build the agent loop integration in generator.ts using AgentLoop + read-only tools |
| 03 | Inject Project Index Context | Auto-build project index and format codebase context for prompt injection |
| 04 | Update build.ts | Wire agent mode and one-shot fallback in the build tool, with auto-detection |
| 05 | Progress Feedback and Validation | Terminal progress during agent build, end-to-end quality validation |
| 06 | Model Selection and Full CLI Flow | Configurable build model, full explore→shape→build validation from bare terminal |

## Execution Notes

- Steps 1-2 should be done together since write_plan is tested through generatePlanWithAgent
- Step 3 is somewhat independent and could be done in parallel with Steps 1-2
- Step 4 is the integration point — expect iteration here
- Step 5 is validation — run real builds and compare against Cursor-generated baseline
- Test with the kjerneverk monorepo as the target project

---

*Last updated: 2026-02-12*
