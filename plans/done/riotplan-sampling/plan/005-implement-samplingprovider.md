# Step 5: Implement SamplingProvider Class

## Objective

Implement the core SamplingProvider class that sends sampling requests to MCP clients and handles responses.

## Context

**Why this step**: Core functionality of execution-sampling package. Implements Provider interface to be drop-in replacement for direct providers.

**From evidence/riotplan-ai-usage-audit.md**:
> "Clean Provider interface makes execution-sampling a drop-in replacement for execution-anthropic/openai/gemini."

**Why now**: Package structure from Step 4 exists. This is the main implementation work of Phase 2.

## Tasks

- [ ] Define SamplingProvider class implementing Provider interface
- [ ] Implement `execute(request, options)` method:
  - Convert Request to MCP sampling/createMessage format
  - Send sampling request to client
  - Handle response and convert back to Provider format
  - Return Response object
- [ ] Implement request conversion:
  - Extract messages from Request
  - Map systemPrompt to MCP format
  - Set maxTokens parameter
  - Add modelPreferences (hints, priorities)
- [ ] Implement response conversion:
  - Extract content from MCP response
  - Map stopReason
  - Handle model information
- [ ] Add session context tracking (sessionId, clientName)
- [ ] Implement timeout handling
- [ ] Add request/response logging

## Acceptance Criteria

- [ ] Implements Provider interface exactly
- [ ] Converts Request → MCP sampling request correctly
- [ ] Converts MCP response → Response correctly
- [ ] Handles all MCP sampling parameters (from evidence/mcp-sampling-spec.md)
- [ ] Timeout handling works
- [ ] Logging provides debugging information
- [ ] Unit tests with mock MCP client pass

## Constraints

**From evidence/mcp-sampling-spec.md**:
- Must use `sampling/createMessage` JSON-RPC method
- Must include messages, systemPrompt, maxTokens
- Must handle error codes: -1 (rejected), -32602 (invalid params)

**Technical**:
- Must match Provider interface from RiotPlan
- No breaking changes to interface

## Dependencies

**Requires**: 
- Step 4 (Package structure)

**Blocks**: 
- Step 6 (Error handling and tests)
- Step 7 (RiotPlan integration)

## Evidence

**MCP Sampling API** (evidence/mcp-sampling-spec.md):
```json
{
  "jsonrpc": "2.0",
  "method": "sampling/createMessage",
  "params": {
    "messages": [{"role": "user", "content": {"type": "text", "text": "..."}}],
    "systemPrompt": "You are a helpful assistant",
    "maxTokens": 1000,
    "modelPreferences": {
      "hints": [{"name": "claude-3-sonnet"}],
      "intelligencePriority": 0.8
    }
  }
}
```

**Provider Interface** (evidence/riotplan-ai-usage-audit.md):
- `execute(request: Request, options: ExecutionOptions): Promise<Response>`
- Request has: model, messages, responseFormat, etc.
- Response has: content, model, stopReason, etc.

## Estimated Effort

**12 hours**

- 4h: Core execute() implementation
- 3h: Request/response conversion
- 3h: Session context and logging
- 2h: Initial testing with mocks

## Notes

- Start with simple text-only messages
- Image/audio support can be added later
- Tool use support is optional (check capabilities.sampling.tools)
- Consider caching client connection
- Add detailed error messages for debugging

## Related Files

- `src/ai/provider-types.d.ts` in RiotPlan - Provider interface
- `src/ai/generator.ts` in RiotPlan - How Provider is used
- Evidence files for MCP spec
