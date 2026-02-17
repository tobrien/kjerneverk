# Step 06: Model Selection and Full CLI Flow Validation

## Objective

Add configurable model selection for plan generation (defaulting to a more capable model for build), and validate the complete `riotplan explore → shape → build` flow from a bare terminal produces Cursor+Opus quality plans.

## Background

The user's goal is IDE independence. Today, Cursor uses Opus-class models and has full codebase access. The CLI uses `claude-sonnet-4-20250514` (set in `common.ts` line 78, `getDefaultModel()`). For the conversational explore phase, sonnet is fine. But plan generation is a one-time, high-value output where model quality matters.

The `BuildSchema` in `riotplan/src/mcp/tools/build.ts` already accepts an optional `model` parameter (line 23). The `loadProvider()` in `provider-loader.ts` passes `options.model` through. But there's no way for the user to configure a default "build model" that's different from the "conversation model."

## Tasks

### Add build-model configuration
- [ ] Add `buildModel` to the RiotPlan config schema (in `riotplan/src/config/index.ts`)
- [ ] When `rp_build` is called without an explicit `model` parameter, check config for `buildModel`
- [ ] If `buildModel` is set, use it for the internal generation call (both agent and one-shot paths)
- [ ] If not set, default to the same model the conversation is using
- [ ] Document the config option: `buildModel: "claude-sonnet-4-20250514"` or `buildModel: "claude-opus-4-20250514"`

### Add --build-model CLI flag
- [ ] In `riotplan/src/cli/commands/explore.ts`, add `--build-model <model>` option
- [ ] Pass it through to the session context so `rp_build` can access it
- [ ] Also add it to the `riotplan build` command in `build-plan.ts`
- [ ] Display the build model in the startup banner if different from conversation model

### Full CLI flow validation (the real test)
- [ ] Test the complete flow from a bare terminal (no IDE):
  1. `riotplan explore new-feature "description"` - create and explore an idea
  2. Conversation: ask questions, add constraints, add evidence
  3. Tell the agent: "let's move to shaping"
  4. Conversation: agent proposes approaches, user selects one
  5. Tell the agent: "build the plan"
  6. Agent calls `rp_build` which now uses agent-powered generation with codebase tools
  7. Verify: generated plan has concrete file paths, interface names, method references
- [ ] Compare output quality against `plans/riotplan-command-line` (the Cursor-generated baseline)
- [ ] Test with different models: sonnet vs opus for the build step
- [ ] Test the full flow for a real project: plan something for the kjerneverk monorepo

### Validate explore agent → rp_build tool handoff
- [ ] Verify that when the explore agent calls `rp_build`, the build's internal agent gets access to the same file tools
- [ ] Verify the project index is reused (not rebuilt) from the explore session
- [ ] Verify the build agent can read files that the explore agent read earlier (same working directory context)
- [ ] Verify progress feedback shows in the terminal during the inner build agent's execution

### Document the CLI experience
- [ ] Update `riotplan/README.md` with the CLI workflow: explore → shape → build
- [ ] Document the `--build-model` flag and `buildModel` config option
- [ ] Add example session showing the full flow from terminal

## Acceptance Criteria

- [ ] `buildModel` config option allows a separate model for plan generation
- [ ] `--build-model` CLI flag overrides the config
- [ ] Full explore → shape → build flow works from bare terminal without IDE
- [ ] Generated plans include concrete file paths, class names, method references (not placeholders)
- [ ] Plan quality is comparable to Cursor+Opus generated plans
- [ ] Progress is visible throughout the entire flow
- [ ] Project index is reused across explore and build phases

## Key Files

- `riotplan/src/config/index.ts` (modify - add `buildModel` config)
- `riotplan/src/cli/commands/explore.ts` (modify - add `--build-model` option)
- `riotplan/src/cli/commands/build-plan.ts` (modify - add `--build-model` option)
- `riotplan/src/mcp/tools/build.ts` (modify - use configured build model)
- `riotplan/README.md` (modify - document CLI workflow)

## Dependencies

- Steps 1-5 (everything built and working)
