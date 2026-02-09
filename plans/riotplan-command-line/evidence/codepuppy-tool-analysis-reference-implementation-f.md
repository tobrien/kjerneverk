# Evidence: CodePuppy tool analysis - reference implementation for CLI agent tools

**Source**: GitHub repository analysis
**Source URL**: https://github.com/mpfaffenberger/code_puppy/tree/main/code_puppy/tools
**Original Query**: What tools does CodePuppy implement that we'd need for a similar CLI experience?
**Added**: 2026-02-09T14:22:18.745Z
**Gathering Method**: model-assisted

---

## CodePuppy Tool Set (https://github.com/mpfaffenberger/code_puppy/tree/main/code_puppy/tools)

CodePuppy is a Python-based CLI agent that provides a good reference for the tools needed. Its core tool set is actually quite straightforward:

### Core File Tools (file_operations.py):
1. **list_files** - Directory listing using ripgrep (--files), with ignore patterns, smart home directory detection, recursive/non-recursive modes
2. **read_file** - File reading with optional line range (start_line, num_lines), token counting (~4 chars/token), 10k token safety limit
3. **grep** - Search using ripgrep with JSON output, max 50 matches, 5MB file size limit

### File Modification Tools (file_modifications.py):
4. **edit_file** - Three modes: full content write, targeted text replacements (old_str/new_str pairs), snippet deletion. Generates unified diffs.
5. **delete_file** - Safe deletion with diff generation

### Shell Execution (command_runner.py):
6. **run_shell_command** - Full streaming shell execution with timeouts, background mode, Ctrl-X/Ctrl-C handling, cross-platform support, process group management

### Agent Tools (agent_tools.py):
7. **list_agents** - List available sub-agents
8. **invoke_agent** - Invoke sub-agents with session persistence (pickle-based message history), DBOS workflow support, session IDs with hash suffixes for uniqueness

### Other Tools:
- ask_user_question/ - Interactive terminal input for user clarification
- browser/ - Browser automation
- display.py - UI display
- scheduler_tools.py - Task scheduling
- skills_tools.py - Skills management
- subagent_context.py - Sub-agent context tracking

### Key Architectural Patterns:
- Uses pydantic_ai as the agent framework (Agent class, RunContext, tools decorator)
- Structured output via Pydantic models (ListFileOutput, ReadFileOutput, GrepOutput, ShellCommandOutput)
- Message bus pattern for UI updates (emit_info, emit_error, emit_warning, emit_shell_line)
- Permission system for file modifications (plugin-based callbacks)
- Sub-agent sessions persisted to filesystem via pickle + JSON metadata

### Mapping to RiotPlan CLI Needs:
For RiotPlan, we'd need:
1. **File tools**: read_file, list_files, grep - for the LLM to explore codebase and plan artifacts
2. **RiotPlan tools**: MCP tool operations (idea_add_note, idea_add_evidence, shaping_add_approach, etc.) wrapped as LLM-callable tools
3. **Shell tools**: run_command for evidence gathering, running tests, etc.
4. **User interaction**: ask user for clarification during interactive sessions

The key insight: CodePuppy uses pydantic_ai which natively handles the agent loop (LLM call → tool call → execute → feed back → repeat). RiotPlan is TypeScript-based and would need to build this loop, likely using the Anthropic/OpenAI SDKs directly or extending the execution packages.