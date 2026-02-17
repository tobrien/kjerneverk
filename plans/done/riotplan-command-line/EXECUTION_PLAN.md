# RiotPlan Command Line — Execution Plan

## Approach: Pragmatic Layered

Build foundational layers first (execution packages), then let the explore command drive the agent loop design. Validate end-to-end before building remaining commands.

## Phases

### Phase 1: Foundation (Steps 1-2)
Extend execution packages with tool-use and streaming support for both providers. This is well-understood, well-scoped work.

### Phase 2: Agent Loop + First Command (Steps 3-5)
Build the agent loop in @kjerneverk/agentic driven by the needs of the explore command. Define tool sets. Wire up explore end-to-end.

### Phase 3: Remaining Commands (Steps 6-7)
Build the build, execute, and chat commands using the proven infrastructure. Replace old CLI commands.

## Execution Notes

- Steps 1-2 can potentially be worked in parallel (Anthropic and OpenAI providers are independent)
- Step 3 (agent loop) and Step 4 (tool definitions) inform each other — build them together
- Step 5 (explore command) is the first full integration point — expect iteration here
- Steps 6-7 should go faster since the pattern is proven by explore
- Each step should be validated with real API calls, not just unit tests
