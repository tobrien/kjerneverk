# Step 1: Extend Execution Packages with Tool-Use and Streaming

## Objective

Add tool-use support and streaming to the base execution interface and both provider implementations (Anthropic, OpenAI). This is the foundation that everything else builds on.

## Background

The current execution packages support one-shot `execute()` calls that return a complete response. They have no `tools` parameter in the Request interface and no streaming support. Both the Anthropic SDK (`client.messages.stream()`) and OpenAI SDK (`client.chat.completions.create({ stream: true })`) already have built-in streaming and tool-use support — we just need to expose it.

## Tasks

### @kjerneverk/execution (base package)
- [ ] Add `tools` parameter to the `Request` interface (array of tool definitions with name, description, parameters schema)
- [ ] Define `StreamChunk` type for streaming responses (text delta, tool call delta, usage)
- [ ] Add `executeStream()` method to the `Provider` interface returning `AsyncIterable<StreamChunk>`
- [ ] Keep existing `execute()` unchanged for backwards compatibility with one-shot generation
- [ ] Add `ToolDefinition` type that both providers can accept

### @kjerneverk/execution-anthropic
- [ ] Update `execute()` to pass `tools` from Request to `client.messages.create()` when present
- [ ] Handle `tool_use` content blocks in the response, map to `ToolCall` in ProviderResponse
- [ ] Implement `executeStream()` using `client.messages.stream()` 
- [ ] Yield `StreamChunk` for text deltas, tool call deltas, and final usage
- [ ] Handle tool_result messages in conversation history (for multi-turn tool use)

### @kjerneverk/execution-openai
- [ ] Update `execute()` to pass `tools` from Request to `client.chat.completions.create()` when present
- [ ] Handle `tool_calls` in the response, map to `ToolCall` in ProviderResponse
- [ ] Implement `executeStream()` using `client.chat.completions.create({ stream: true })`
- [ ] Yield `StreamChunk` for text deltas, tool call deltas, and final usage
- [ ] Handle tool role messages in conversation history (for multi-turn tool use)

### Testing
- [ ] Unit tests for tool definition serialization per provider
- [ ] Unit tests for streaming chunk parsing per provider
- [ ] Integration test: send a request with tools, verify tool_call comes back
- [ ] Integration test: stream a response, verify chunks arrive incrementally

## Acceptance Criteria

- Both providers accept tool definitions and return tool calls in responses
- Both providers support streaming via `executeStream()` returning `AsyncIterable<StreamChunk>`
- Existing `execute()` without tools continues to work unchanged (backwards compat for one-shot generation)
- Tool definitions use a provider-agnostic format that maps cleanly to both Anthropic and OpenAI schemas

## Key Files

- `execution/src/index.ts` — Request, Provider, ProviderResponse types
- `execution-anthropic/src/index.ts` — Anthropic provider
- `execution-openai/src/index.ts` — OpenAI provider

## Dependencies

None — this is the foundation layer.
