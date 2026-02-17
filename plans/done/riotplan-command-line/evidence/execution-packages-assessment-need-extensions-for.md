# Evidence: Execution packages assessment - need extensions for tool-use conversations

**Source**: codebase analysis
**Original Query**: Do the execution packages support tool-use conversation loops?
**Added**: 2026-02-09T14:06:10.797Z
**Gathering Method**: model-assisted

---

## Execution Packages Assessment

### @kjerneverk/execution (Base)
- Pure TypeScript interfaces, no SDK dependencies
- Provider interface with execute() method
- Request interface: messages, model, responseFormat, validator
- ProviderResponse: content, model, usage, toolCalls
- ModelRegistry tracks supportsToolCalls per model
- **GAP**: Request interface has NO tools parameter

### @kjerneverk/execution-anthropic
- Uses @anthropic-ai/sdk v0.52.0
- Only supports tools for json_schema response format, not general function calling
- No streaming (synchronous messages.create())
- **GAP**: Cannot pass tool definitions for general function calling

### @kjerneverk/execution-openai
- Uses openai v6.16.0 + tiktoken
- Returns toolCalls in ProviderResponse
- No tools parameter passed to SDK
- No streaming
- **GAP**: OpenAI SDK supports tools but provider doesn't expose them

### Summary of Gaps:
1. No `tools` parameter in Request interface
2. No streaming support in any provider
3. Anthropic provider only supports tools for json_schema mode
4. No conversation loop support
5. No tool result injection back into conversation

### What Would Be Needed:
1. Extend Request interface to include tools parameter
2. Update providers to pass tools to their respective SDKs
3. Add streaming support (important for CLI UX)
4. Build conversation loop on top
5. Handle tool_result messages in conversation history