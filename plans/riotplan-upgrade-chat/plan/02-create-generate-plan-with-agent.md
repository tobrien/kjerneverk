# Step 02: Create generatePlanWithAgent() in generator.ts

## Objective

Build the `generatePlanWithAgent()` function that uses `AgentLoop` with read-only file tools to generate codebase-aware plans, replacing the one-shot LLM call for environments that support it.

## Background

The current `generatePlan()` function (line 141 of `riotplan/src/ai/generator.ts`) makes a single streaming call to collect JSON. The new `generatePlanWithAgent()` will:

1. Create a `ToolRegistry` with read-only tools + `write_plan`
2. Create a `ConversationManager` with the build-agent system prompt
3. Create an `AgentLoop` with the provider
4. Run the agent with the user prompt containing artifacts + codebase context
5. Wait for the agent to call `write_plan`, then return the result

The `AgentLoop.create()` interface (from `agentic/src/loop.ts` line 148) takes `{ provider, toolRegistry, conversation, model, maxIterations }`. The `runStream()` method yields `AgentChunk` objects.

## Tasks

### Build generatePlanWithAgent()
- [ ] Add `generatePlanWithAgent()` to `riotplan/src/ai/generator.ts` alongside existing `generatePlan()`
- [ ] Signature: `async function generatePlanWithAgent(context: GenerationContext, provider: Provider, tools: Tool[], options: GenerationOptionsWithProgress): Promise<GenerationResult>`
- [ ] The `tools` parameter receives read-only environment tools from the caller (build.ts provides these)
- [ ] Create a `ToolRegistry` and register: the provided read-only tools + the `write_plan` tool from Step 1
- [ ] Use a Promise-based pattern for `write_plan`: create a `planPromise` that resolves when `write_plan` is called by the agent
- [ ] Create `ConversationManager` with system prompt from `build-agent.md`
- [ ] Create `AgentLoop` with `maxIterations: 30` (agent needs room to explore but shouldn't run forever)

### Create the provider adapter
- [ ] The `generatePlanWithAgent()` receives a `Provider` (from execution packages) but `AgentLoop` needs an `AgentProvider` (from agentic)
- [ ] Create an adapter function `toAgentProvider(provider: Provider, model: string): AgentProvider` that wraps the execution `Provider`
- [ ] This is the same adapter pattern used in `common.ts` (lines 382-458) - extract it to a shared location or duplicate inline
- [ ] Must support `executeStream()` for streaming

### Run the agent and collect the plan
- [ ] Build the user prompt using `buildAgentUserPrompt()` from Step 1
- [ ] Call `agentLoop.runStream(userPrompt)` and iterate through chunks
- [ ] Report progress via `onProgress` callback: 'started' when agent begins, 'streaming' as text arrives, tool calls shown
- [ ] When `write_plan` tool is called by the agent, `planPromise` resolves with the `GeneratedPlan`
- [ ] If the agent runs out of iterations without calling `write_plan`, fall back to parsing any text output as JSON
- [ ] If all else fails, throw a clear error: "Agent did not produce a plan within N iterations"

### Apply the same tiering and validation
- [ ] Apply token budget tiering to artifacts before passing to the agent (reuse existing `calculateTiering()` and `applyEvidenceTiering()`)
- [ ] After receiving the plan from `write_plan`, run `validatePlan()` as before
- [ ] Return `GenerationResult` with plan + tiering, same as `generatePlan()`

## Acceptance Criteria

- [ ] `generatePlanWithAgent()` produces a `GenerationResult` identical in structure to `generatePlan()`
- [ ] Agent can read files, search code, and query project index during generation
- [ ] Agent calls `write_plan` with valid JSON matching `GeneratedPlan` interface
- [ ] Progress callbacks fire during agent execution (started, streaming, complete)
- [ ] Graceful fallback if agent fails to call `write_plan`
- [ ] Token tiering and validation work the same as one-shot mode

## Key Files

- `riotplan/src/ai/generator.ts` (modify - add `generatePlanWithAgent()`, `toAgentProvider()`)
- `riotplan/src/ai/tools/write-plan.ts` (from Step 1)
- `riotplan/src/ai/prompts/build-agent.md` (from Step 1)

## Dependencies

- Step 1 (write_plan tool and system prompt)
