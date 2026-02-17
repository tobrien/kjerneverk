# Step 5: Validate Explore End-to-End

## Objective

Run the explore command against real projects, validate the experience matches what we envisioned in the user stories, and iterate on issues discovered.

## Background

This is the integration validation step. Everything has been built in isolation — now we test the full vertical: user types in terminal → CLI sends to LLM with tools → LLM calls tools → tools execute against real filesystem/plan → results fed back → LLM responds → user sees streaming output.

The user stories (Maria organizing a garden, Jake planning an API migration) describe the target experience. This step validates against those stories.

## Tasks

### Functional Validation
- [ ] Test: Create a new idea from scratch, have a 10+ turn conversation, verify all artifacts are created correctly
- [ ] Test: Resume an existing idea, verify context is loaded and conversation continues naturally
- [ ] Test: LLM proactively reads project files during exploration (codebase awareness)
- [ ] Test: LLM adds evidence based on research/file reading
- [ ] Test: Tool call indicators are visible but not distracting
- [ ] Test: `/done` exits cleanly with summary
- [ ] Test: Ctrl-C interrupts gracefully without losing state
- [ ] Test: Chat transcript is saved and readable

### Provider Validation
- [ ] Test with Anthropic (Claude Sonnet or Opus) — verify tool use works correctly
- [ ] Test with OpenAI (GPT-4o) — verify tool use works correctly
- [ ] Compare experience quality between providers

### UX Iteration
- [ ] Review streaming output formatting — is it readable in a terminal?
- [ ] Review tool call indicators — too verbose? too quiet?
- [ ] Review session startup — is the banner helpful or noisy?
- [ ] Review session resume — does it provide enough context to pick up where you left off?
- [ ] Review summary on exit — does it capture what happened?

### Edge Cases
- [ ] Test with no API key set — clear error message?
- [ ] Test with invalid API key — graceful failure?
- [ ] Test with very long conversation — token limits handled?
- [ ] Test with plan in non-standard location — path resolution works?
- [ ] Test tool execution failure — LLM handles gracefully?

### Fix Issues
- [ ] Address any tool schema issues discovered during testing
- [ ] Fix any streaming rendering issues
- [ ] Adjust system prompt if LLM behavior is off
- [ ] Tune tool descriptions if LLM misuses tools

## Acceptance Criteria

- The explore experience feels comparable to using explore_idea through Cursor/MCP
- Works reliably with both Anthropic and OpenAI
- All plan artifacts (IDEA.md, evidence files, timeline) are correctly created
- Edge cases are handled gracefully
- A developer can explore an idea in their project and the LLM intelligently reads relevant files

## Dependencies

- Step 4 (explore command fully built)
