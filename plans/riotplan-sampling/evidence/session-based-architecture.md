# Session-Based Sampling Architecture for RiotPlan

Design Date: 2026-02-07

## Problem Statement

RiotPlan can be used in multiple ways:
1. **STDIO transport**: Local MCP server, one client per process
2. **HTTP transport**: Remote MCP server, multiple concurrent clients

Each client may have different capabilities:
- Some support MCP sampling (FastMCP, mcp-go)
- Some don't (Cursor, Claude Desktop, Claude Code)

**Therefore**: Sampling availability must be tracked per-session, not globally.

## Architecture Design

### Session Context

Each MCP connection maintains a session context:

```typescript
interface SessionContext {
  // Session identification
  sessionId: string;
  transport: 'stdio' | 'http';
  
  // Client information (from initialize request)
  clientInfo: {
    name: string;
    version: string;
    title?: string;
    description?: string;
  } | null;
  
  // Client capabilities (from initialize request)
  capabilities: {
    sampling?: {
      tools?: {};  // Supports tool use in sampling
    };
    roots?: {};
    elicitation?: {};
    // ... other capabilities
  };
  
  // Derived state
  samplingAvailable: boolean;  // capabilities.sampling exists
  providerMode: 'sampling' | 'direct' | 'none';
  
  // Timestamps
  connectedAt: Date;
  lastActivity: Date;
}
```

### Provider Mode Determination

On initialization, determine provider mode:

```typescript
function determineProviderMode(context: SessionContext): ProviderMode {
  // 1. Check if client supports sampling
  if (context.capabilities.sampling) {
    return 'sampling';
  }
  
  // 2. Check if direct provider available (API keys)
  const hasApiKeys = 
    process.env.ANTHROPIC_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  
  if (hasApiKeys) {
    return 'direct';
  }
  
  // 3. No AI generation available
  return 'none';
}
```

### Session Manager

```typescript
class SessionManager {
  private sessions: Map<string, SessionContext> = new Map();
  
  createSession(
    sessionId: string,
    transport: Transport,
    initRequest: InitializeRequest
  ): SessionContext {
    const context: SessionContext = {
      sessionId,
      transport,
      clientInfo: initRequest.params.clientInfo || null,
      capabilities: initRequest.params.capabilities || {},
      samplingAvailable: !!initRequest.params.capabilities?.sampling,
      providerMode: 'none',  // Will be set below
      connectedAt: new Date(),
      lastActivity: new Date(),
    };
    
    context.providerMode = determineProviderMode(context);
    
    this.sessions.set(sessionId, context);
    
    console.log(`Session ${sessionId} created:`, {
      client: context.clientInfo?.name || 'unknown',
      sampling: context.samplingAvailable,
      mode: context.providerMode,
    });
    
    return context;
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
  
  removeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    console.log(`Session ${sessionId} removed`);
  }
  
  // Cleanup inactive sessions (for HTTP transport)
  cleanupInactive(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.lastActivity.getTime() > maxAge) {
        this.removeSession(id);
      }
    }
  }
}
```

### Provider Loading with Session Context

```typescript
async function loadProviderForSession(
  context: SessionContext
): Promise<Provider> {
  switch (context.providerMode) {
    case 'sampling':
      // Use execution-sampling (sends sampling requests to client)
      return await loadSamplingProvider(context);
    
    case 'direct':
      // Use direct API provider (Anthropic/OpenAI/Gemini)
      return await loadDirectProvider();
    
    case 'none':
      throw new Error(
        'No AI provider available. ' +
        'Either use a client that supports MCP sampling, ' +
        'or set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_API_KEY.'
      );
  }
}

async function loadSamplingProvider(
  context: SessionContext
): Promise<Provider> {
  const { createSamplingProvider } = await import('@kjerneverk/execution-sampling');
  
  return createSamplingProvider({
    sessionId: context.sessionId,
    clientName: context.clientInfo?.name || 'unknown',
    supportsTools: !!context.capabilities.sampling?.tools,
  });
}
```

### MCP Server Integration

```typescript
// In MCP server initialization
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  const sessionId = generateSessionId();
  const context = sessionManager.createSession(
    sessionId,
    transport,
    request
  );
  
  // Store session ID for this connection
  connection.sessionId = sessionId;
  
  return {
    protocolVersion: '2025-11-25',
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      // ... RiotPlan capabilities
    },
    serverInfo: {
      name: 'riotplan',
      version: '1.0.0',
    },
  };
});

// In tool handlers (e.g., riotplan_generate)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const context = sessionManager.getSession(connection.sessionId);
  if (!context) {
    throw new Error('Session not found');
  }
  
  sessionManager.updateActivity(connection.sessionId);
  
  if (request.params.name === 'riotplan_generate') {
    const provider = await loadProviderForSession(context);
    const plan = await generatePlan(/* ... */, provider);
    // ...
  }
});
```

## Transport-Specific Considerations

### STDIO Transport
- One session per process
- Session ends when process exits
- Simple: sessionId can be constant
- No cleanup needed

### HTTP Transport
- Multiple concurrent sessions
- Sessions persist across requests
- Need session ID in HTTP headers or cookies
- Need periodic cleanup of inactive sessions
- Consider session authentication

## Testing Strategy

### Test with Different Clients

```typescript
describe('Session-based sampling', () => {
  it('uses sampling when client supports it', async () => {
    const context = createSession({
      capabilities: { sampling: {} }
    });
    expect(context.providerMode).toBe('sampling');
  });
  
  it('uses direct provider when sampling unavailable', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    const context = createSession({
      capabilities: {}  // No sampling
    });
    expect(context.providerMode).toBe('direct');
  });
  
  it('errors when no provider available', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const context = createSession({
      capabilities: {}
    });
    expect(context.providerMode).toBe('none');
    await expect(loadProviderForSession(context)).rejects.toThrow();
  });
});
```

### Test with FastMCP

```python
# test_riotplan_sampling.py
from fastmcp import Client
from fastmcp.client.sampling.handlers.openai import OpenAISamplingHandler

# Create client with sampling support
client = Client(
    "riotplan/dist/index.js",  # Path to RiotPlan MCP server
    sampling_handler=OpenAISamplingHandler(
        default_model="gpt-4o"
    ),
)

# Call riotplan_generate - should use sampling
result = await client.call_tool(
    "riotplan_generate",
    {
        "path": "/tmp/test-plan",
        "description": "Create a simple web app",
        "steps": 3
    }
)

print("Plan generated via sampling:", result)
```

## Benefits

1. **Flexible**: Works with any client, sampling or not
2. **Future-proof**: Ready when IDEs add sampling
3. **Testable**: Can test with FastMCP today
4. **Scalable**: HTTP transport supports multiple clients
5. **Clear errors**: Users know exactly what's missing
6. **No breaking changes**: Existing direct provider usage still works

## Implementation Order

1. ✅ Design session architecture (this document)
2. Create `SessionContext` and `SessionManager` classes
3. Integrate with MCP server initialization
4. Update `provider-loader.ts` to use session context
5. Create `execution-sampling` package
6. Test with FastMCP client
7. Document for users
