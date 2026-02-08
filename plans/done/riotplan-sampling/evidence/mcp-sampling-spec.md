# MCP Sampling Specification

Source: https://modelcontextprotocol.io/specification/2025-11-25/client/sampling
Retrieved: 2026-02-07

## Key Findings

### API Signature

**Request (sampling/createMessage):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "What is the capital of France?"
        }
      }
    ],
    "modelPreferences": {
      "hints": [{"name": "claude-3-sonnet"}],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5,
      "costPriority": 0.3
    },
    "systemPrompt": "You are a helpful assistant.",
    "maxTokens": 100
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "role": "assistant",
    "content": {
      "type": "text",
      "text": "The capital of France is Paris."
    },
    "model": "claude-3-sonnet-20240307",
    "stopReason": "endTurn"
  }
}
```

### How MCP Server Accesses Sampling

- Clients that support sampling MUST declare the `sampling` capability during initialization
- Server sends `sampling/createMessage` request via JSON-RPC
- NO server API keys required - client maintains control over model access

### Supported Parameters

**YES - These are supported:**
- `systemPrompt`: System prompt string
- `maxTokens`: Maximum tokens to generate
- `modelPreferences.hints`: Suggest specific models (e.g., "claude-3-sonnet")
- `modelPreferences.intelligencePriority`: 0-1 scale
- `modelPreferences.speedPriority`: 0-1 scale
- `modelPreferences.costPriority`: 0-1 scale
- `messages`: Array of user/assistant messages
- `tools`: Array of tool definitions (if client declares `sampling.tools` capability)
- `toolChoice`: Control tool usage (auto/required/none)

**NOT MENTIONED - May not be supported:**
- `temperature`: Not in the spec
- Streaming: Not mentioned in the spec

### Error Handling

**Common error codes:**
- `-1`: User rejected sampling request
- `-32602`: Invalid params (e.g., tool result missing, mixed content)

**Example error:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -1,
    "message": "User rejected sampling request"
  }
}
```

### Capabilities Declaration

**Basic sampling:**
```json
{
  "capabilities": {
    "sampling": {}
  }
}
```

**With tool use support:**
```json
{
  "capabilities": {
    "sampling": {
      "tools": {}
    }
  }
}
```

### Security & User Control

- Spec says there SHOULD always be a human in the loop
- Applications SHOULD provide UI to review sampling requests
- Users should be able to view/edit prompts before sending
- Clients SHOULD implement user approval controls
- Clients SHOULD implement rate limiting

### Multi-turn Tool Loop

Servers can implement agentic behaviors:
1. Send sampling request with tools
2. Receive tool use requests from LLM
3. Execute tools
4. Send new sampling request with tool results
5. Repeat as needed

### Content Types Supported

- Text: `{"type": "text", "text": "..."}`
- Image: `{"type": "image", "data": "base64...", "mimeType": "image/jpeg"}`
- Audio: `{"type": "audio", "data": "base64...", "mimeType": "audio/wav"}`

### Cross-API Compatibility

Designed to work across Claude, OpenAI, Gemini, etc.
- Uses "user" and "assistant" roles
- Tool use in "assistant" role
- Tool results in "user" role
- Parallel tool use supported

## Key Insights for RiotPlan

1. **Detection**: Server can detect if client supports sampling by checking capabilities during initialization
2. **No streaming mentioned**: Spec doesn't mention streaming - appears to be all-or-nothing
3. **Temperature not in spec**: May not be available as a parameter
4. **User approval**: Cursor/clients may show approval dialogs - need to handle user rejection
5. **Error handling**: Need to handle `-1` (user rejected) and `-32602` (invalid params) errors
6. **Model hints**: Can suggest models but client makes final decision
