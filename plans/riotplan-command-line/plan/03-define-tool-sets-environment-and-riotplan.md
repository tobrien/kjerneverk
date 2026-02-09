# Step 3: Define Tool Sets — Environment Tools and RiotPlan Tool Wrappers

## Objective

Create the two categories of tools the CLI agent needs: environment tools (file system access, search, shell) and RiotPlan tools (wrapping existing MCP tool implementations as LLM-callable functions).

## Background

The CLI agent needs tools in two categories:

1. **Environment tools** — Replace what Cursor provides natively (file reading, searching, command execution). Modeled after CodePuppy's straightforward approach: `read_file`, `list_files`, `grep`, `run_command`.

2. **RiotPlan tools** — The same operations the MCP server exposes (idea_add_note, idea_add_evidence, shaping_add_approach, etc.), but registered as LLM tool-use functions instead of going through MCP. The underlying implementations already exist in the riotplan codebase — we wrap them.

Tools are defined using the agentic package's `Tool` interface and registered with `ToolRegistry`.

## Tasks

### Environment Tools (in @kjerneverk/riotplan, src/cli/tools/environment/)
- [ ] `read_file` — Read file contents with optional line range (start_line, num_lines). Token-safe with size limits.
- [ ] `list_files` — List directory contents, recursive or non-recursive. Use ripgrep for performance. Ignore patterns for node_modules, .git, etc.
- [ ] `grep` — Search file contents using ripgrep. Return file path, line number, line content. Max results limit.
- [ ] `run_command` — Execute shell commands with timeout, output capture, streaming. Safety considerations (allow/deny lists optional).
- [ ] `write_file` — Write or overwrite file contents. Only available in execute/chat tool scopes.
- [ ] `edit_file` — Targeted text replacements (old_str/new_str). Only available in execute/chat tool scopes.

### RiotPlan Tools (in @kjerneverk/riotplan, src/cli/tools/riotplan/)

Wrap existing MCP tool implementations. Each wrapper:
1. Defines the tool schema (name, description, parameters) using the agentic Tool interface
2. Calls the same underlying function that the MCP tool handler calls
3. Returns structured results

#### Idea tools:
- [ ] `rp_idea_add_note` — Add note to IDEA.md
- [ ] `rp_idea_add_constraint` — Add constraint
- [ ] `rp_idea_add_question` — Add question
- [ ] `rp_idea_add_evidence` — Add evidence (inline content or file reference)
- [ ] `rp_idea_add_narrative` — Add narrative to timeline
- [ ] `rp_idea_kill` — Abandon idea with reason

#### Shaping tools:
- [ ] `rp_shaping_start` — Begin shaping
- [ ] `rp_shaping_add_approach` — Add approach with tradeoffs
- [ ] `rp_shaping_add_feedback` — Add feedback
- [ ] `rp_shaping_compare` — Compare approaches
- [ ] `rp_shaping_select` — Select approach

#### Build/execution tools:
- [ ] `rp_build` — Generate detailed plan from artifacts
- [ ] `rp_step_start` — Mark step started
- [ ] `rp_step_complete` — Mark step completed
- [ ] `rp_step_reflect` — Add reflection to step
- [ ] `rp_status` — Get plan status
- [ ] `rp_read_context` — Read consolidated plan context

#### Utility tools:
- [ ] `rp_transition` — Move between lifecycle stages
- [ ] `rp_checkpoint_create` — Save state snapshot
- [ ] `rp_history_show` — View timeline

### Tool Set Definitions (scoped per command)
- [ ] Define `exploreToolSet` — read_file, list_files, grep + idea tools (NO write tools)
- [ ] Define `buildToolSet` — read_file, list_files, grep + build tools + shaping tools
- [ ] Define `executeToolSet` — ALL file tools (read + write + edit) + step tools + run_command
- [ ] Define `chatToolSet` — Everything

### Testing
- [ ] Unit test each environment tool with mock filesystem
- [ ] Unit test each RiotPlan tool wrapper calls the correct underlying function
- [ ] Verify tool schemas serialize correctly for both Anthropic and OpenAI formats
- [ ] Verify tool set scoping — explore set does not include write_file

## Acceptance Criteria

- All environment tools work standalone and return structured results
- All RiotPlan tool wrappers correctly call existing implementations
- Tool sets are defined per command with appropriate scoping
- explore tool set has NO file write capabilities (enforceable boundary)
- All tools have proper descriptions that help the LLM use them correctly

## Key Files

- `riotplan/src/cli/tools/environment/` — Environment tool implementations
- `riotplan/src/cli/tools/riotplan/` — RiotPlan tool wrappers
- `riotplan/src/cli/tools/index.ts` — Tool set definitions and exports

## Dependencies

- Step 2 (agentic package Tool interface and ToolRegistry)
- Existing MCP tool implementations in riotplan (for wrapping)
