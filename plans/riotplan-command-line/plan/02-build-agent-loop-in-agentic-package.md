# Step 2: Build the Agent Loop in @kjerneverk/agentic

## Objective

Implement the multi-turn conversational agent loop that orchestrates LLM calls with tool use. This is the core infrastructure that all CLI commands will use.

## Background

The agentic package already has `ToolRegistry` (tool registration, execution, batch execution), tool format converters (`toOpenAIFormat()`, `toAnthropicFormat()`), `ToolGuard` (security), `ToolSandbox` (capability limits), and type definitions (`ConversationMessage`, `ToolCall`, `LLMClient`). What's missing is the actual orchestration loop — the thing that calls the LLM, parses tool calls, executes them, feeds results back, and repeats until the LLM is done.

The package guide references `ConversationBuilder`, `IterationStrategy`, and `StrategyExecutor` but these were never implemented. This step builds them.

## Tasks

### ConversationManager
- [ ] Build `ConversationManager` class that manages message history (system, user, assistant, tool messages)
- [ ] Support adding messages, retrieving history, serializing/deserializing for persistence
- [ ] Handle provider-specific message format differences (Anthropic vs OpenAI role names, tool result formats)
- [ ] Support conversation truncation/windowing for long sessions (token budget awareness)

### AgentLoop
- [ ] Build `AgentLoop` class that orchestrates the LLM ↔ tool cycle:
  1. Send messages + tool definitions to LLM via execution provider
  2. Parse response for tool calls
  3. Execute tool calls via ToolRegistry
  4. Format tool results as messages
  5. Feed back to LLM
  6. Repeat until LLM responds with text (no tool calls)
- [ ] Support streaming: yield text chunks to caller as they arrive, accumulate tool calls
- [ ] Support configurable max iterations (prevent infinite loops)
- [ ] Support cancellation (user can interrupt mid-loop)
- [ ] Emit events for observability: tool_call_start, tool_call_complete, llm_request, llm_response

### Integration with ToolRegistry
- [ ] AgentLoop uses ToolRegistry to execute tools (already has security/sandboxing)
- [ ] AgentLoop uses format converters to serialize tools for the provider
- [ ] Tool results are automatically formatted as conversation messages

### Integration with Execution Providers
- [ ] AgentLoop accepts an execution Provider (from Step 1)
- [ ] Uses `executeStream()` for streaming responses
- [ ] Falls back to `execute()` if streaming not available
- [ ] Provider-agnostic: works with both Anthropic and OpenAI

### Testing
- [ ] Unit test: agent loop with mock provider and mock tools — verify tool call → execute → feed back cycle
- [ ] Unit test: max iteration limit prevents infinite loops
- [ ] Unit test: streaming chunks are yielded during tool-free responses
- [ ] Integration test: real provider + simple tool (e.g., calculator) — verify end-to-end loop

## Acceptance Criteria

- AgentLoop can run a multi-turn conversation with tool use against either provider
- Streaming text is yielded to the caller in real-time
- Tool calls are executed via ToolRegistry with security/sandboxing
- Conversation history is managed by ConversationManager
- The loop terminates when the LLM responds with text and no tool calls
- Max iteration guard prevents runaway loops

## Key Files

- `agentic/src/index.ts` — Exports (add ConversationManager, AgentLoop)
- `agentic/src/loop.ts` — AgentLoop implementation (new)
- `agentic/src/conversation.ts` — ConversationManager implementation (new)
- `agentic/src/registry.ts` — Existing ToolRegistry

## Dependencies

- Step 1 (execution packages with tool-use and streaming support)
