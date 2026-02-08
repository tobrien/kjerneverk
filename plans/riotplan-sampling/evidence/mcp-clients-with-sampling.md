# MCP Clients That Support Sampling

Retrieved: 2026-02-07

## ✅ Confirmed Working Implementations

### 1. **FastMCP (Python)**

**Status**: ✅ PRODUCTION READY with built-in handlers

**Source**: https://gofastmcp.com/clients/sampling

**Features**:
- Built-in OpenAI handler (supports gpt-4o, OpenAI-compatible APIs)
- Built-in Anthropic handler (supports Claude models)
- Custom handler support
- Full tool use support in sampling
- Auto-advertises sampling capabilities

**Installation**:
```bash
pip install fastmcp[openai]  # For OpenAI handler
pip install fastmcp[anthropic]  # For Anthropic handler
```

**Example**:
```python
from fastmcp import Client
from fastmcp.client.sampling.handlers.openai import OpenAISamplingHandler

client = Client(
    "my_mcp_server.py",
    sampling_handler=OpenAISamplingHandler(
        default_model="gpt-4o"
    ),
)
```

**This is PERFECT for testing RiotPlan sampling!**

### 2. **mcp-go (Go)**

**Status**: ✅ Working with example implementations

**Source**: https://mcp-go.dev/clients/advanced-sampling/

**Features**:
- `SamplingHandler` interface
- Example client at `github.com/zhaoyihaha/mcp-go/examples/sampling_client`
- Mock LLM implementation for testing
- Requires custom LLM integration

**Example**:
```go
handler := &MySamplingHandler{}
client := client.New(
    client.WithSamplingHandler(handler),
)
```

## ❌ Clients That Do NOT Support Sampling

### Claude Desktop
**Status**: ❌ NOT SUPPORTED

**Source**: https://modelcontextprotocol.io/legacy/concepts/sampling

**Quote**: "This feature of MCP is not yet supported in the Claude Desktop client."

### Cursor
**Status**: ❌ NOT SUPPORTED (only tools)

**Source**: https://claudecode.app/documentation/clients

**Supports**: Tools only, no prompts, resources, sampling, or roots

### Claude Code
**Status**: ❌ NOT SUPPORTED

**Source**: https://claudecode.app/documentation/clients

**Supports**: Prompts, Tools, Roots - but NOT sampling or resources

### GitHub Copilot
**Status**: ⚠️ CONFLICTING INFORMATION

**Sources**:
- Some docs claim full sampling support as of 2026
- ChatGPT says not true
- User hasn't seen it working
- Need to verify directly

## Testing Strategy for RiotPlan

### Recommended: Use FastMCP for Testing

**Why FastMCP**:
1. Production-ready Python implementation
2. Built-in OpenAI/Anthropic handlers
3. Can test locally without IDE integration
4. Full sampling + tool use support
5. Well-documented

**Testing Flow**:
```
1. Create simple FastMCP client script
2. Connect to RiotPlan MCP server (STDIO)
3. Client has sampling_handler configured
4. Call riotplan_generate tool
5. RiotPlan requests sampling
6. FastMCP client handles it with OpenAI/Anthropic
7. Verify plan generation works
```

### Alternative: mcp-go

If you prefer Go, mcp-go has working examples but requires more setup.

## Session-Based Architecture Implications

Since RiotPlan can be used via:
- **STDIO transport** (local, per-session)
- **HTTP transport** (remote, multi-session)

Each session needs to track:
- `clientInfo.name` - which client connected
- `capabilities.sampling` - does this client support sampling?
- Session-specific provider mode: `sampling` | `direct` | `none`

**Session tracking needed**:
```typescript
interface SessionContext {
  sessionId: string;
  clientInfo: ClientInfo;
  capabilities: Capabilities;
  providerMode: 'sampling' | 'direct' | 'none';
  samplingAvailable: boolean;
}
```

## Recommendation

**Build sampling support NOW** even though major IDEs don't support it yet:

1. **Testing**: Use FastMCP for development/testing
2. **Future-proof**: When Cursor/Claude Desktop add sampling, RiotPlan will be ready
3. **Pressure**: Show what's possible, encourage adoption
4. **GitHub Copilot**: May already work (needs verification)
5. **HTTP deployments**: Remote MCP servers can have their own sampling clients

This positions RiotPlan as a leader in MCP sampling adoption.
