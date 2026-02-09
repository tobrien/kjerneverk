# Step 4: Build the Explore Command and Terminal UX

## Objective

Build the `riotplan explore` command — the first complete LLM-powered CLI command. This is the integration point where execution packages, agent loop, tool sets, and terminal I/O come together.

## Background

`riotplan explore` is the most common entry point into the RiotPlan experience. It creates or resumes idea exploration with an interactive LLM chat session. The system prompt comes from the existing MCP `explore_idea` prompt. The tool set is scoped to read-only file access + RiotPlan idea tools (no file writing).

This step also establishes the terminal UX patterns (input handling, streaming output, session management) that all other commands will reuse.

## Tasks

### Command Implementation
- [ ] Implement `riotplan explore [path|code] [description]` command using Commander.js (existing CLI framework)
- [ ] Two modes: create new idea (code + description provided) or resume existing (path to plan directory)
- [ ] Detect provider from environment: ANTHROPIC_API_KEY → Anthropic, OPENAI_API_KEY → OpenAI
- [ ] Display startup banner: plan name, provider/model, plan directory
- [ ] Inject system prompt from explore_idea prompt content (same content MCP uses)
- [ ] Register exploreToolSet with the agent loop
- [ ] Start the interactive session

### Terminal I/O
- [ ] Input: readline-based user input with prompt (`you> `)
- [ ] Output: stream LLM text responses to stdout in real-time (from executeStream)
- [ ] Tool call visibility: show brief indicators when tools are called (e.g., `🔍 Reading src/...`, `📝 Added note`)
- [ ] Handle `/done` command to end the session gracefully
- [ ] Handle Ctrl-C to interrupt gracefully (cancel current LLM request, don't lose state)
- [ ] Handle empty input (ignore or re-prompt)

### Session Management
- [ ] On session start: if resuming, load plan status and show summary ("Resuming, last session had N notes, N constraints...")
- [ ] On session end: show summary of what was captured ("8 notes, 3 constraints, 5 questions, 2 evidence files")
- [ ] Store chat transcript in plan's .history/ directory (alongside existing prompt captures)
- [ ] Transcript format: timestamped messages, both user and assistant

### Provider Configuration
- [ ] `--provider` flag to explicitly select (anthropic, openai)
- [ ] `--model` flag to select specific model (defaults to sensible choice per provider)
- [ ] Auto-detect from available API keys if not specified
- [ ] Clear error message if no API key found

### Testing
- [ ] Manual test: create a new idea, have a multi-turn conversation, verify IDEA.md is populated
- [ ] Manual test: resume an existing idea, verify context is loaded
- [ ] Manual test: verify streaming output appears incrementally
- [ ] Manual test: verify tool calls are visible but not overwhelming
- [ ] Test with both Anthropic and OpenAI providers

## Acceptance Criteria

- `riotplan explore my-idea "description"` launches an interactive chat that feels like the Cursor explore_idea experience
- The LLM can read files, search the codebase, and add notes/constraints/questions/evidence through RiotPlan tools
- The LLM CANNOT write files (tool set enforcement)
- Streaming responses appear in real-time
- Session can be resumed with `riotplan explore ./plans/my-idea`
- Chat transcript is saved in plan history
- Works with both Anthropic and OpenAI

## Key Files

- `riotplan/src/cli/commands/explore.ts` — Command implementation
- `riotplan/src/cli/terminal.ts` — Terminal I/O handling (reusable)
- `riotplan/src/cli/session.ts` — Session management (reusable)
- `riotplan/src/mcp/prompts/explore-idea.ts` — Existing prompt content (reuse)

## Dependencies

- Step 1 (execution packages with tools + streaming)
- Step 2 (agent loop in agentic)
- Step 3 (tool sets)
