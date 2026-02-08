# MCP Client Detection and Identification

Source: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
Retrieved: 2026-02-07

## How to Detect Client Identity

During the initialization phase, the client sends an `initialize` request that includes **clientInfo**:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "sampling": {},
      "roots": {},
      // ... other capabilities
    },
    "clientInfo": {
      "name": "ExampleClient",           // ← Client name (e.g., "Cursor", "Claude Code")
      "title": "Example Client Display Name",
      "version": "1.0.0",                // ← Client version
      "description": "An example MCP client application",
      "icons": [...],
      "websiteUrl": "https://example.com"
    }
  }
}
```

## Detection Strategy for RiotPlan

**RiotPlan can detect MCP mode by:**

1. **Check if `clientInfo` is present** in the initialization
   - If present → MCP mode
   - If absent → Standalone CLI mode

2. **Check client capabilities** for `sampling` support
   - If `capabilities.sampling` exists → Can use sampling
   - If not → Must use direct AI provider or error

3. **Identify specific client** via `clientInfo.name`
   - "Cursor" → Cursor IDE
   - "Claude Code" → Claude Code
   - "GitHub Copilot" → GitHub Copilot
   - etc.

## Example Detection Code Pattern

```typescript
// During MCP server initialization
function onInitialize(request: InitializeRequest) {
  const clientInfo = request.params.clientInfo;
  const capabilities = request.params.capabilities;
  
  if (clientInfo) {
    // We're in MCP mode
    console.log(`Connected via MCP: ${clientInfo.name} v${clientInfo.version}`);
    
    if (capabilities.sampling) {
      // Client supports sampling - use it!
      return { mode: 'mcp-sampling', client: clientInfo.name };
    } else {
      // Client doesn't support sampling
      return { mode: 'mcp-no-sampling', client: clientInfo.name };
    }
  } else {
    // Standalone CLI mode
    return { mode: 'standalone' };
  }
}
```

## Key Insights

1. **Client identification is built into MCP** - no need to guess or use heuristics
2. **Capability negotiation tells us if sampling is available** - explicit, not implicit
3. **Detection happens during initialization** - before any tool calls are made
4. **Both STDIO and HTTP transports** include clientInfo in initialization

## For execution-sampling Package

The execution-sampling package should:
- Accept the `clientInfo` and `capabilities` from initialization
- Auto-detect if sampling is available
- Provide clear error if sampling not supported by client
- Allow manual override for testing/development
