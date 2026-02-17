# Evidence: Agentic package assessment - tool infrastructure exists but no agent loop

**Source**: codebase analysis
**Original Query**: What does the agentic package provide for building an interactive CLI agent?
**Added**: 2026-02-09T14:06:04.045Z
**Gathering Method**: model-assisted

---

## @kjerneverk/agentic Package Assessment

### What it provides:
- ToolRegistry: registration, execution, batch execution, usage tracking
- ContextManager: tracks dynamically injected context with deduplication
- ToolGuard: security validation (parameter validation, allow/deny lists, prototype pollution detection)
- ToolSandbox: capability-based sandboxing (timeouts, concurrency limits, output size)
- Tool format conversion: toOpenAIFormat(), toAnthropicFormat()
- Types: Tool, ToolParameter, ConversationMessage, ToolCall, LLMClient interface

### What it does NOT provide:
- No agent loop (LLM call → parse tool calls → execute → feed back → repeat)
- No conversation turn management
- No automatic tool call parsing from LLM responses
- No multi-turn conversation handling
- Guide references ConversationBuilder, IterationStrategy, StrategyExecutor - but these are NOT implemented

### LLMClient Interface (defined but no implementations):
```typescript
interface LLMClient {
  complete(messages: ConversationMessage[], tools?: any[]): Promise<{
    content: string | null;
    tool_calls?: ToolCall[];
  }>;
}
```

### Assessment:
The package is a "tool execution framework" not a complete "agentic loop framework." Good for tool management and security. The agent loop, conversation management, and provider integration need to be built.