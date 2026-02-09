# Idea: riotplan-command-line

## Core Concept

Build a full LLM-powered interactive CLI experience for RiotPlan that mirrors the MCP/Cursor workflow. The current CLI commands don't match the MCP tools/prompts/resources. Need to create commands like explore_idea, build, gather evidence, print plan info, and execute - all backed by an interactive LLM chat session (via OPENAI_API_KEY or ANTHROPIC_API_KEY). The LLM needs access to tools similar to what Cursor provides (file reading, lookups, command execution) so it can do the same kind of deep exploration and planning work.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- The current AI usage in RiotPlan is one-shot generation: you feed artifacts in, get a plan out. The CLI experience needs a fundamentally different pattern - an interactive conversation loop where the LLM can call tools, ask questions, and iterate. This is the core architectural challenge.
- The kjerneverk monorepo already has execution packages (execution-anthropic, execution-openai, execution-gemini) that handle direct API communication. The 'agentic' package likely contains tool-use infrastructure. These are building blocks for the interactive CLI experience.
- Critical finding: The agentic package has ToolRegistry, tool format conversion, and security/sandboxing, but NO agent loop. The execution packages can call LLMs but can't pass tool definitions or handle tool-use conversations. Building the CLI agent requires work at both levels: extending execution packages to support tools+streaming, AND building the agent loop that orchestrates multi-turn conversations with tool use.
- The user is right that the tool set is straightforward. CodePuppy's core is just 6 tools: list_files, read_file, grep, edit_file, delete_file, run_shell_command. The complexity isn't in the tools themselves but in the agent loop that orchestrates multi-turn conversations with tool use. CodePuppy uses pydantic_ai which handles this natively. RiotPlan (TypeScript) needs to build this loop.
- Session persistence approach: Plans ARE the persistence. Chat transcripts should be stored alongside plan artifacts (similar to how .history/prompts/ already captures conversation context). The plan's state (IDEA.md, SHAPING.md, STATUS.md) survives across sessions. The chat transcript is supplementary record, not the primary state.
- Command structure decision: Four primary commands - 'riotplan explore [path]', 'riotplan build [path]', 'riotplan execute [path]', 'riotplan chat [path]'. Each launches a purpose-built agent session with a specific system prompt derived from the corresponding MCP prompt. The 'chat' command is a generic fallback for ad-hoc interactions.
- Decision: Build the agent loop in-house within @kjerneverk/agentic. The loop is genuinely simple (~20 lines of core logic). The agentic package already has ToolRegistry, format converters, and LLMClient interface. This also completes what was originally planned for that package (ConversationBuilder, StrategyExecutor). No need for Vercel AI SDK or similar.
- Streaming is straightforward, not a Phase 2 concern. Both Anthropic SDK (client.messages.stream()) and OpenAI SDK (client.chat.completions.create({stream: true})) provide async iterables. The current providers just never needed streaming because they did one-shot generation. Adding executeStream() to the Provider interface is ~30-40 lines per provider. Should be included in the foundational work, not deferred.
- Decision: Build the agent loop in-house. The core loop is ~20 lines of code (call LLM with tools, parse tool calls, execute, feed results back, repeat). The agentic package already has ToolRegistry and format converters. No need for Vercel AI SDK or similar — part of the point is demonstrating this isn't something requiring third-party frameworks.
- Decision: Streaming is day-one, not deferred. Both Anthropic (client.messages.stream()) and OpenAI (client.chat.completions.create({stream: true})) SDKs provide async iterables. Adding executeStream() to the Provider interface is ~30-40 lines per provider. Essential for CLI chat UX.
- Critical architectural insight: The CLI and MCP paths share the same fundamental architecture — one model does the thinking, RiotPlan provides plan-management tools and prompts, and the host (Cursor or CLI) provides environment tools (file read, grep, shell). The CLI just needs to provide everything that Cursor + MCP provide together: the model hosting, the agent loop, the prompts as system messages, the RiotPlan tools as LLM tool-use functions, AND the environment tools that Cursor normally provides. The underlying tool implementations can be shared.
- Important advantage of CLI over MCP/Cursor: the CLI has stricter tool control. In Cursor, the model has all of Cursor's native tools (file editing, shell, etc.) PLUS MCP tools — the MCP server cannot restrict what Cursor's tools do. In the CLI, we define the complete tool set. If we don't give the model a write_file tool during 'explore', it physically cannot edit files — it can only modify plans through RiotPlan's structured tools (idea_add_note, idea_add_evidence, etc.). This makes plan integrity enforceable at the tool level.
- Tool scoping per command becomes a design feature: 'explore' gets read-only file tools + RiotPlan idea tools (no file editing). 'build' gets read-only file tools + RiotPlan build tools. 'execute' gets full file tools (read, write, edit) + RiotPlan step tools + shell. 'chat' gets everything. This is precise, intentional control that MCP can't enforce.
- This is freeing. The existing CLI was built around an older "analysis → generate" workflow that predates the lifecycle model. Rather than trying to evolve those commands, we can start fresh with the commands that match how RiotPlan actually works now: explore, build, execute, chat. Plus utility commands like status, step list, etc. that don't need an LLM session.

## Constraints

- _Add constraints..._
- Must work with existing API keys: OPENAI_API_KEY, ANTHROPIC_API_KEY (and potentially GOOGLE_API_KEY) - no new auth infrastructure needed
- The CLI LLM experience needs tool access similar to what Cursor provides - file reading, file lookup, information search, and command execution - not just a bare conversational interface
- CLI commands should map to the most frequently used MCP entry points: explore_idea, build plan, gather evidence, print plan info, execute plan - not a 1:1 mapping of all 36 MCP tools
- Must leverage existing execution packages (execution-anthropic, execution-openai, execution-gemini) and the agentic package in the kjerneverk monorepo
- No backwards compatibility requirement with existing CLI commands. The old CLI (amend, amendments, analysis, elaborate, feedback, generate, render, verify) can be replaced entirely. Just make the new interface work.

## Questions

- _Add questions..._
- What does the 'agentic' package in the monorepo provide? Does it already have tool-use loop infrastructure (tool definitions, execution loops, response parsing) that we can reuse for the CLI agent?
- What tools should the CLI agent have access to? At minimum: read files, search files, read plan artifacts. But should it also be able to run shell commands, write files, or make git operations?
- How should the interactive terminal experience work? A REPL-style chat? A rich TUI with markdown rendering? Plain text with streaming responses? How do we handle tool-use visibility (show the user what the LLM is doing)?
- Should each CLI command (explore, build, execute) launch its own agent session with a tailored system prompt (matching the MCP prompts), or should there be one generic 'riotplan chat' command?
- How do we handle the MCP prompts in CLI context? The explore_idea prompt, for example, has detailed instructions about when to call which tools. Should the CLI agent get the same prompt as its system message, with RiotPlan tools wired in as LLM tool-use functions?
- What about cost management? Cursor users don't pay per-token for the LLM. CLI users calling APIs directly will incur costs. Should there be token budgets, model tier selection, or cost warnings?
- Should CLI sessions be resumable? If I run 'riotplan explore my-plan' and have a 20-turn conversation, close the terminal, and come back later with the same command, should it pick up where I left off? How does conversation history persist?
- CodePuppy uses pydantic_ai which provides the agent loop natively. For our TypeScript implementation, should we: (a) use the Anthropic/OpenAI SDKs directly and build a minimal agent loop, (b) use an existing TypeScript agent framework like Vercel AI SDK, LangChain.js, or similar, or (c) build it into the @kjerneverk/agentic package as the missing ConversationBuilder/StrategyExecutor that was planned but never implemented?
- Should the RiotPlan CLI agent have write access to non-plan files? During 'explore' you mainly read and add to plan artifacts. During 'execute' the LLM might need to write code, run tests, edit source files. Should write tools be scoped to the command type?
- Should the RiotPlan tool implementations be refactored to have a shared core that both the MCP tool handlers and the CLI tool-use functions call? Or should the CLI tools call the MCP tool implementations directly (they're just async functions under the hood)?

## Evidence

_Attach relevant documents, images, or files_
- [Gap analysis between CLI commands and MCP tools-prompts-resources](evidence/gap-analysis-between-cli-commands-and-mcp-tools-pr.md) (codebase analysis)
- [Existing AI provider infrastructure in RiotPlan codebase](evidence/existing-ai-provider-infrastructure-in-riotplan-co.md) (codebase analysis)
- [Agentic package assessment - tool infrastructure exists but no agent loop](evidence/agentic-package-assessment-tool-infrastructure-exi.md) (codebase analysis)
- [Execution packages assessment - need extensions for tool-use conversations](evidence/execution-packages-assessment-need-extensions-for.md) (codebase analysis)
- [CodePuppy tool analysis - reference implementation for CLI agent tools](evidence/codepuppy-tool-analysis-reference-implementation-f.md) (GitHub repository analysis)
- [User story - Maria the nonprofit director organizing a community garden project](evidence/user-story-maria-the-nonprofit-director-organizing.md)
- [Architecture comparison - how CLI agent mirrors the Cursor MCP model](evidence/architecture-comparison-how-cli-agent-mirrors-the.md) (conversation analysis)
- [CLI control advantage over MCP - enforceable tool scoping and plan integrity](evidence/cli-control-advantage-over-mcp-enforceable-tool-sc.md) (architectural analysis)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-02-09T14:02:17.469Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
