# Building with MCP Sampling: A Technical Guide

**Date**: February 2026  
**Author**: RiotPlan Team  
**Tags**: MCP, Sampling, Tutorial, Architecture

## Introduction

This guide shows you how to implement MCP sampling in your tool, using RiotPlan's implementation as a reference. By the end, you'll understand:

- How to detect sampling support
- How to structure your provider architecture
- How to send sampling requests
- How to handle errors gracefully
- How to test with FastMCP

## Architecture Overview

### The Session-Based Pattern

The key insight: **sampling availability is a property of the session, not the server.**

```typescript
interface SessionContext {
  sessionId: string;
  transport: 'stdio' | 'http';
  clientInfo: ClientInfo | null;
  capabilities: Capabilities;
  samplingAvailable: boolean;      // Derived from capabilities
  providerMode: 'sampling' | 'direct' | 'none';  // Determined automatically
  connectedAt: Date;
  lastActivity: Date;
}
```

Why session-based?
- **STDIO transport**: One client, one session
- **HTTP transport**: Multiple clients, multiple sessions
- **Each client** may have different capabilities

### Provider Mode Priority

```
┌─────────────────────────────────────────┐
│ 1. Client supports sampling?            │
│    → Use sampling (no server API keys)  │
└──────────────┬──────────────────────────┘
               │ No
               ▼
┌─────────────────────────────────────────┐
│ 2. Server has API keys configured?      │
│    → Use direct API provider            │
└──────────────┬──────────────────────────┘
               │ No
               ▼
┌─────────────────────────────────────────┐
│ 3. No AI available                      │
│    → Clear error message with guidance  │
└─────────────────────────────────────────┘
```

## Step-by-Step Implementation

### Step 1: Define Session Types

```typescript
// src/session/types.ts

export type ProviderMode = 'sampling' | 'direct' | 'none';

export interface Capabilities {
  sampling?: {
    tools?: Record<string, unknown>;
  };
  // ... other capabilities
}

export interface SessionContext {
  sessionId: string;
  transport: 'stdio' | 'http';
  clientInfo: {
    name: string;
    version: string;
  } | null;
  capabilities: Capabilities;
  samplingAvailable: boolean;
  providerMode: ProviderMode;
  connectedAt: Date;
  lastActivity: Date;
}
```

### Step 2: Create SessionManager

```typescript
// src/session/SessionManager.ts

export class SessionManager {
  private sessions: Map<string, SessionContext> = new Map();
  
  createSession(
    sessionId: string,
    transport: 'stdio' | 'http',
    initRequest: InitializeRequest
  ): SessionContext {
    const capabilities = initRequest.params.capabilities ?? {};
    const clientInfo = initRequest.params.clientInfo ?? null;
    
    const context: SessionContext = {
      sessionId,
      transport,
      clientInfo,
      capabilities,
      samplingAvailable: !!capabilities.sampling,
      providerMode: this.determineProviderMode(capabilities),
      connectedAt: new Date(),
      lastActivity: new Date(),
    };
    
    this.sessions.set(sessionId, context);
    return context;
  }
  
  private determineProviderMode(capabilities: Capabilities): ProviderMode {
    // Priority 1: Sampling
    if (capabilities.sampling) {
      return 'sampling';
    }
    
    // Priority 2: Direct API keys
    const hasApiKeys = 
      !!process.env.ANTHROPIC_API_KEY ||
      !!process.env.OPENAI_API_KEY ||
      !!process.env.GOOGLE_API_KEY;
    
    if (hasApiKeys) {
      return 'direct';
    }
    
    // Priority 3: None
    return 'none';
  }
  
  getSession(sessionId: string): SessionContext | undefined {
    return this.sessions.get(sessionId);
  }
  
  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }
}
```

### Step 3: Integrate with MCP Server

```typescript
// src/mcp/server.ts

const sessionManager = createSessionManager({ debug: true });
const sessionId = generateSessionId();

// Create session on startup (for STDIO)
let currentSession = sessionManager.createSession(
  sessionId,
  'stdio',
  {
    params: {
      protocolVersion: '2025-11-25',
      capabilities: {},  // Will be populated during actual init
    }
  }
);

// In tool handlers
server.tool('my_tool', 'Description', schema, async (args, context) => {
  // Update activity
  sessionManager.updateActivity(sessionId);
  
  // Pass session to provider loading
  const provider = await loadProvider({
    name: 'anthropic',
    session: currentSession,
  });
  
  // Use provider
  const result = await provider.execute({...});
});
```

### Step 4: Create Sampling Provider

```typescript
// execution-sampling/src/SamplingProvider.ts

export class SamplingProvider implements Provider {
  readonly name = 'sampling';
  private samplingClient: any;
  
  constructor(private config: SamplingProviderConfig) {}
  
  setSamplingClient(client: any): void {
    this.samplingClient = client;
  }
  
  async execute(
    request: Request,
    options?: ExecutionOptions
  ): Promise<ProviderResponse> {
    // Convert to MCP sampling request
    const samplingRequest = {
      messages: request.messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: {
          type: 'text',
          text: m.content
        }
      })),
      systemPrompt: this.extractSystemPrompt(request),
      maxTokens: options?.maxTokens,
      temperature: options?.temperature,
    };
    
    // Send via MCP
    const response = await this.samplingClient.sendRequest(
      'sampling/createMessage',
      samplingRequest
    );
    
    // Convert response
    return {
      content: response.content.text,
      model: response.model,
      usage: undefined,  // MCP doesn't provide usage
    };
  }
}
```

### Step 5: Update Provider Loader

```typescript
// src/ai/provider-loader.ts

export async function loadProvider(config: {
  name?: string;
  apiKey?: string;
  session?: SessionContext;
}): Promise<Provider> {
  const { name, apiKey, session } = config;
  
  // Priority 1: Sampling
  if (session?.providerMode === 'sampling') {
    return await loadSamplingProvider(session);
  }
  
  // Priority 2: Direct provider
  if (name) {
    return await loadDirectProvider(name, apiKey);
  }
  
  // Priority 3: Default from environment
  const defaultProvider = getDefaultProvider();
  if (defaultProvider) {
    return await loadDirectProvider(defaultProvider);
  }
  
  // Priority 4: Error with guidance
  throw new Error(
    '❌ No AI provider available.\n\n' +
    'Options:\n' +
    '1. Use MCP client with sampling support\n' +
    '2. Set API keys (ANTHROPIC_API_KEY, etc.)\n' +
    '3. Create content manually'
  );
}
```

## Testing with FastMCP

### Setup Python Environment

```bash
cd tests/sampling
python3 -m venv venv
source venv/bin/activate
pip install fastmcp[openai] fastmcp[anthropic] pytest pytest-asyncio
```

### Create Test Fixtures

```python
# conftest.py

import pytest
from fastmcp.client import Client
from fastmcp.sampling import OpenAISamplingHandler, AnthropicSamplingHandler

@pytest.fixture(params=["openai", "anthropic"])
def sampling_client(request, server_path):
    handler_type = request.param
    
    if handler_type == "openai":
        handler = OpenAISamplingHandler(default_model="gpt-4o")
    else:
        handler = AnthropicSamplingHandler(default_model="claude-sonnet-4-5")
    
    client = Client(server_path, sampling_handler=handler)
    yield client, handler_type
    client.close()
```

### Write Tests

```python
# test_sampling.py

@pytest.mark.asyncio
async def test_sampling_works(sampling_client, temp_dir):
    client, handler_type = sampling_client
    
    # Call your tool
    result = await client.call_tool(
        "my_generation_tool",
        {"prompt": "Generate something", "output": str(temp_dir)}
    )
    
    # Verify result
    assert result is not None
    assert (temp_dir / "output.txt").exists()
    
    print(f"✅ Sampling works with {handler_type}")
```

### Critical Test: No Server Keys Needed

```python
@pytest.mark.asyncio
async def test_no_server_api_keys_needed(sampling_client, temp_dir, monkeypatch):
    """Prove that server doesn't need API keys when using sampling"""
    client, handler_type = sampling_client
    
    # Remove all server-side API keys
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    
    # Should still work via sampling
    result = await client.call_tool(
        "my_generation_tool",
        {"prompt": "Test", "output": str(temp_dir)}
    )
    
    assert result is not None
    print(f"✅ No server keys needed with {handler_type}!")
```

## Error Handling

### User-Friendly Error Messages

```typescript
// Bad
throw new Error('No provider');

// Good
throw new Error([
  '❌ No AI provider available for MyTool.',
  '',
  `Your client (${clientName}) does not support MCP sampling,`,
  'and no API keys are configured.',
  '',
  'To use AI features, either:',
  '1. Use a client that supports MCP sampling',
  '   - GitHub Copilot',
  '   - FastMCP (for testing)',
  '',
  '2. Set up an API key:',
  '   export ANTHROPIC_API_KEY="sk-ant-..."',
  '',
  '3. Create content manually',
  '',
  'More info: https://docs.mytool.dev/ai-setup'
].join('\n'));
```

### Sampling-Specific Errors

```typescript
try {
  const response = await samplingClient.sendRequest('sampling/createMessage', request);
} catch (error: any) {
  if (error.code === -1) {
    throw new Error('User rejected the AI generation request');
  } else if (error.code === -32602) {
    throw new Error(`Invalid sampling parameters: ${error.message}`);
  } else {
    throw new Error(`MCP error ${error.code}: ${error.message}`);
  }
}
```

## Best Practices

### 1. Log Provider Mode Detection

```typescript
console.log('[SessionManager] Provider mode detection:');
console.log(`  Client: ${clientInfo?.name ?? 'unknown'}`);
console.log(`  Sampling available: ${samplingAvailable}`);
console.log(`  Provider mode: ${providerMode}`);
```

### 2. Update Activity on Each Request

```typescript
server.tool('my_tool', schema, async (args, context) => {
  sessionManager.updateActivity(sessionId);
  // ... rest of handler
});
```

### 3. Clean Up Inactive Sessions (HTTP mode)

```typescript
// Run periodically
setInterval(() => {
  sessionManager.cleanupInactive(3600000);  // 1 hour
}, 600000);  // Every 10 minutes
```

### 4. Provide Setup Scripts

```bash
# scripts/check-python-env.sh
if ! python3 -c "import fastmcp" 2>/dev/null; then
  echo "FastMCP not installed"
  echo "Run: pip install fastmcp[openai] fastmcp[anthropic]"
  exit 1
fi
```

## Common Pitfalls

### ❌ Don't: Store sampling client globally

```typescript
// Bad - doesn't work with multiple sessions
let globalSamplingClient;
```

### ✅ Do: Store per session

```typescript
// Good - each session has its own client
interface SessionContext {
  samplingClient?: any;
  // ...
}
```

### ❌ Don't: Require API keys when sampling available

```typescript
// Bad
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('API key required');
}
```

### ✅ Do: Check provider mode first

```typescript
// Good
if (session.providerMode === 'none') {
  throw new Error('No AI provider available');
}
```

### ❌ Don't: Fail silently

```typescript
// Bad
if (!samplingAvailable) {
  return null;  // User has no idea why it failed
}
```

### ✅ Do: Provide clear error messages

```typescript
// Good
if (!samplingAvailable && !hasApiKeys) {
  throw new Error('❌ No AI provider available. Options: ...');
}
```

## Integration Checklist

- [ ] Session types defined
- [ ] SessionManager implemented
- [ ] MCP server integration complete
- [ ] Sampling provider created
- [ ] Provider loader updated
- [ ] Error messages enhanced
- [ ] FastMCP tests written
- [ ] CI/CD integration added
- [ ] Documentation updated
- [ ] Examples created

## Resources

- **RiotPlan Source**: https://github.com/kjerneverk/riotplan
- **execution-sampling Package**: https://github.com/kjerneverk/execution-sampling
- **MCP Specification**: https://modelcontextprotocol.io
- **FastMCP**: https://github.com/jlowin/fastmcp

## Conclusion

Implementing MCP sampling requires:
1. Session-based architecture
2. Automatic capability detection
3. Graceful fallback to direct providers
4. Clear error messages
5. Comprehensive testing

The result: **Zero-configuration AI tool usage** for your users.

Build it. Test it. Ship it. Lead the way.
