# Step 05: Add Progress Feedback and Validate End-to-End

## Objective

Ensure the agent-powered build provides visible progress in the terminal during generation, and validate the full flow end-to-end by generating a plan and comparing quality against the Cursor-generated baseline.

## Background

The terminal in `riotplan/src/cli/terminal.ts` already has:
- Tool spinner (`startToolSpinner`/`stopToolSpinner`) for long-running tools like `rp_build`
- Thinking indicator (`showThinking`/`hideThinking`) for waiting periods
- Token usage display for each turn

When `rp_build` is called from the explore agent, the terminal shows `📝 rp_build...` and then nothing until it completes. With agent-powered generation, the inner agent loop makes multiple tool calls that should be reported.

## Tasks

### Surface inner agent activity to terminal
- [ ] In `riotplan/src/mcp/tools/build.ts`, use the `onProgress` callback to emit structured progress events
- [ ] Agent mode progress events should include: "Indexing project...", "Exploring codebase...", "Reading [filename]...", "Generating plan...", "Plan complete (N steps)"
- [ ] The `write_plan` tool in `build.ts` can intercept inner `AgentChunk` events and forward them to `onProgress`
- [ ] In `riotplan/src/cli/terminal.ts`, update the tool spinner to show sub-activity: instead of just `⠹ rp_build... (5s)`, show `⠹ rp_build: reading src/ai/generator.ts... (12s)`

### Update terminal for sub-tool display
- [ ] Extend `startToolSpinner()` in `terminal.ts` to accept an optional `updateMessage(msg: string)` callback
- [ ] The spinner can update its message while running: `⠹ rp_build: exploring 3/5 files... (8s)`
- [ ] Keep the spinner animation smooth - only update the message, not the spinner character

### End-to-end validation
- [ ] Test: Run `riotplan explore riotplan-format` → ask it to build → verify agent explores codebase
- [ ] Test: Verify generated step files include actual file paths (not "_List files that will be modified..._")
- [ ] Test: Verify steps reference real interfaces and class names from the codebase
- [ ] Test: Compare generated plan quality against `plans/riotplan-command-line` as the baseline
- [ ] Test: Verify fallback works - disable tools and confirm one-shot still generates a plan
- [ ] Test: Verify MCP server mode works - `rp_build` through MCP should use one-shot with codebase context

### Performance validation
- [ ] Measure: project index build time (target: <500ms for kjerneverk monorepo)
- [ ] Measure: agent-powered generation time (expect 2-5 minutes depending on codebase size)
- [ ] Measure: one-shot with codebase context time (expect ~30-60 seconds, same as before)
- [ ] Ensure index cache is working - second build should be instant

## Acceptance Criteria

- [ ] Terminal shows progress during agent-powered build (file reads, tool calls)
- [ ] Spinner updates with current activity message
- [ ] Generated plans include concrete file paths, interface names, and method references
- [ ] Plans pass quality comparison: each step has non-placeholder "Files Changed" section
- [ ] Each step has "Key Files" with actual paths from the codebase
- [ ] Each step has "Dependencies" referencing other steps
- [ ] Fallback to one-shot works when tools unavailable
- [ ] Performance within expected ranges

## Key Files

- `riotplan/src/cli/terminal.ts` (modify - spinner sub-activity, progress display)
- `riotplan/src/mcp/tools/build.ts` (modify - progress event forwarding)
- `riotplan/src/ai/generator.ts` (modify - progress from agent loop)

## Dependencies

- Step 4 (everything wired together)
