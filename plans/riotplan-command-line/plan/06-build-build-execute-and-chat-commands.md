# Step 6: Build the Build, Execute, and Chat Commands

## Objective

Build the remaining three LLM-powered CLI commands using the proven infrastructure from explore. Each command gets its own system prompt and scoped tool set.

## Background

The explore command validated the full stack: execution packages → agent loop → tool sets → terminal UX. The remaining commands follow the same pattern but with different tool scoping and system prompts. The terminal I/O, session management, and agent loop infrastructure are reused directly.

## Tasks

### `riotplan build [path]`
- [ ] Implement command: reads plan artifacts, launches agent session for plan building
- [ ] System prompt: derived from MCP create_plan/develop_plan prompts
- [ ] Tool set: read-only file tools + shaping tools + build tools + read_context
- [ ] Flow: agent reads IDEA.md/SHAPING.md/evidence, can ask clarifying questions, then generates the plan
- [ ] The actual plan generation can either use the existing AI generator (one-shot) or go through the agent conversation — decide based on what works better
- [ ] Output: SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, plan/*.md step files

### `riotplan execute [path]`
- [ ] Implement command: loads plan, identifies current step, launches agent session for execution
- [ ] System prompt: derived from MCP execute_plan/execute_step prompts
- [ ] Tool set: ALL file tools (read + write + edit) + step tools + run_command + grep
- [ ] Flow: agent reads current step, understands tasks, implements them, marks step complete
- [ ] Auto-track: calls rp_step_start at beginning, rp_step_complete when done
- [ ] Step navigation: agent can move to next step or user can specify which step
- [ ] Reflection: agent writes step reflection after completing a step

### `riotplan chat [path]`
- [ ] Implement command: generic conversation with full plan context and all tools
- [ ] System prompt: general RiotPlan assistant prompt with plan context
- [ ] Tool set: everything (all file tools + all RiotPlan tools + run_command)
- [ ] No specific workflow — user-directed conversation
- [ ] Optional: plan path can be omitted for a general-purpose session

### Shared Infrastructure
- [ ] Extract common command setup: provider detection, model selection, terminal I/O, session management
- [ ] `createAgentSession(config)` factory that all four commands use
- [ ] Config includes: system prompt, tool set, plan path, provider/model overrides

### Testing
- [ ] Test build: create a plan from a well-developed idea, verify output quality
- [ ] Test execute: run a step, verify files are modified and step is tracked
- [ ] Test chat: have a freeform conversation about a plan, verify flexibility
- [ ] Test: verify tool scoping — build cannot write files, execute can
- [ ] Test with both providers

## Acceptance Criteria

- All four commands work with the same underlying infrastructure
- Each command has appropriate tool scoping (build: read-only, execute: full access, chat: everything)
- System prompts are derived from existing MCP prompts (same behavioral expectations)
- Session transcripts are saved for all commands
- A user can explore → build → execute a plan entirely from the CLI

## Key Files

- `riotplan/src/cli/commands/build.ts`
- `riotplan/src/cli/commands/execute.ts`
- `riotplan/src/cli/commands/chat.ts`
- `riotplan/src/cli/commands/common.ts` — Shared session factory

## Dependencies

- Step 5 (explore validated end-to-end, patterns proven)
- Steps 1-3 (all infrastructure)
