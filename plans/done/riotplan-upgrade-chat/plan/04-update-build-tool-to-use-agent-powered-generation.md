# Step 04: Update build.ts to Use Agent-Powered Generation

## Objective

Wire everything together in `riotplan/src/mcp/tools/build.ts` so that `rp_build` uses agent-powered generation when file tools are available (CLI context), and falls back to enhanced one-shot generation (with codebase context) when tools are not available (pure MCP context).

## Background

The current `buildPlan()` function in `riotplan/src/mcp/tools/build.ts` (line 27) follows this flow:
1. Load artifacts (`loadArtifacts()`)
2. Load provider (`loadProvider()`)
3. Build generation context
4. Call `generatePlan(generationContext, provider, { model })` - one-shot
5. Write output files (SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, plan/*.md, PROVENANCE.md)

The new flow adds two branches before step 4:
- **Agent mode** (CLI context): Call `generatePlanWithAgent()` with read-only tools
- **Enhanced one-shot mode** (MCP context): Call `generatePlan()` with injected codebase context

The output file writing (step 5) remains identical in both paths.

## Tasks

### Detect available context for agent mode
- [ ] In `buildPlan()`, check if read-only file tools can be loaded: try importing `readOnlyEnvironmentTools` from `riotplan/src/cli/tools/environment/index.js`
- [ ] If tools are available AND a provider supports streaming (`provider.executeStream` exists), use agent mode
- [ ] Add a new `agentMode?: boolean` parameter to `BuildSchema` to let users explicitly opt in/out
- [ ] Default behavior: use agent mode when tools are available, one-shot otherwise

### Wire up agent-powered generation
- [ ] Import `generatePlanWithAgent` from `generator.ts`
- [ ] Import `readOnlyEnvironmentTools` from the environment tools module
- [ ] Import `getProjectContext` from `project-context.ts`
- [ ] When agent mode is active:
  1. Call `getProjectContext(planPath)` to get codebase context (~500ms)
  2. Add `codebaseContext` to `generationContext`
  3. Call `generatePlanWithAgent(generationContext, provider, readOnlyEnvironmentTools, options)` instead of `generatePlan()`
  4. Handle the `GenerationResult` the same way as before

### Wire up enhanced one-shot fallback
- [ ] When agent mode is NOT active (no tools available):
  1. Still call `getProjectContext(planPath)` for codebase context
  2. Add `codebaseContext` to `generationContext`
  3. Call existing `generatePlan()` as before, but now with codebase context in the prompt
  4. This path already works but now produces better plans because of injected context

### Update progress callback
- [ ] Pass `onProgress` through to both generation paths
- [ ] For agent mode, the progress callback receives events from the agent loop (tool calls, text output)
- [ ] For one-shot mode, the existing streaming progress dots continue to work

### Handle errors gracefully
- [ ] If agent mode fails (e.g., agent doesn't call `write_plan`), log warning and fall back to one-shot
- [ ] If one-shot also fails, throw the original error
- [ ] Add try/catch around the agent path: `try { agentResult } catch { fallback to one-shot }`

## Acceptance Criteria

- [ ] `rp_build` uses agent-powered generation when run from CLI (tools available)
- [ ] `rp_build` falls back to enhanced one-shot when run from pure MCP (no file tools)
- [ ] Both paths inject codebase context from the project indexer
- [ ] Both paths produce identical output file structure (SUMMARY.md, etc.)
- [ ] `agentMode` parameter allows explicit control
- [ ] Graceful fallback from agent mode to one-shot on failure
- [ ] MCP tool interface (name, parameters, description) unchanged

## Key Files

- `riotplan/src/mcp/tools/build.ts` (modify - main orchestration changes)
- `riotplan/src/ai/generator.ts` (from Steps 1-2 - `generatePlanWithAgent()`)
- `riotplan/src/ai/project-context.ts` (from Step 3 - `getProjectContext()`)
- `riotplan/src/cli/tools/environment/index.ts` (reference - `readOnlyEnvironmentTools`)

## Dependencies

- Step 1 (write_plan tool)
- Step 2 (generatePlanWithAgent function)
- Step 3 (project context injection)
