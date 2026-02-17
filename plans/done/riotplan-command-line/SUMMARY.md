# RiotPlan Command Line — Plan Summary

## Overview

Build a full LLM-powered interactive CLI experience for RiotPlan that mirrors the MCP/Cursor workflow. The CLI manages a dedicated LLM session (via Anthropic or OpenAI API keys) with tool access, enabling users to explore ideas, build plans, and execute them from the terminal without needing an IDE.

## Selected Approach: Pragmatic Layered

Do the well-understood foundational work first (extend execution packages for both providers), then let the `explore` command shape the agent loop design. Each layer is independently useful, but real usage drives the API rather than abstract design.

## Key Architectural Decisions

1. **In-house agent loop** — Built into @kjerneverk/agentic. The core loop is simple (~20 lines). No third-party agent frameworks (Vercel AI SDK, etc.).
2. **Streaming from day one** — Both Anthropic and OpenAI SDKs provide async iterables. Essential for CLI UX.
3. **Enforceable tool scoping** — Each command (explore, build, execute, chat) gets precisely the tools its phase requires. Unlike MCP/Cursor, the CLI can prevent the model from bypassing structured tools.
4. **No backwards compatibility** — The old CLI commands (amend, analysis, elaborate, etc.) are replaced entirely.
5. **Plans as persistence** — Plan artifacts are the state. Chat transcripts stored in plan history for the record.
6. **Same prompts, same tools** — CLI and MCP paths share the same underlying tool implementations and prompt content.

## Commands

### LLM-Powered (interactive agent sessions):
- `riotplan explore [path|code] [description]` — Explore/develop an idea
- `riotplan build [path]` — Build a plan from a shaped idea
- `riotplan execute [path]` — Execute a plan step by step
- `riotplan chat [path]` — Open-ended conversation with plan context

### Utility (no LLM):
- `riotplan status [path]` — Show plan status
- `riotplan step list|start|complete [path]` — Step management
- `riotplan plan init|validate|archive` — Plan management
- `riotplan render [path]` — Render to formats
- `riotplan check-config` — Show configuration

## Packages Affected

- **@kjerneverk/execution** — Add `tools` to Request, add streaming types
- **@kjerneverk/execution-anthropic** — Add tool passing, add `executeStream()`
- **@kjerneverk/execution-openai** — Add tool passing, add `executeStream()`
- **@kjerneverk/agentic** — Build ConversationManager and AgentLoop
- **@kjerneverk/riotplan** — New CLI commands, tool definitions, prompt wiring
