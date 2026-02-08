# Step 2: Implement SessionManager Class

## Objective

Create a SessionManager class to manage the lifecycle of MCP sessions and track client capabilities.

## Context

**Why this step**: Centralizes session management logic. Handles session creation, lookup, activity tracking, and cleanup.

**From evidence/session-based-architecture.md**:
> "SessionManager manages lifecycle of sessions, creates sessions during initialization, tracks activity, and handles cleanup for inactive sessions (HTTP mode)."

**Why now**: Requires SessionContext types from Step 1. Needed before MCP server integration (Step 3).

## Tasks

- [ ] Create `src/mcp/session/SessionManager.ts` file
- [ ] Implement `SessionManager` class with:
  - `private sessions: Map<string, SessionContext>`
  - `createSession(sessionId, transport, initRequest): SessionContext`
  - `getSession(sessionId): SessionContext | undefined`
  - `updateActivity(sessionId): void`
  - `removeSession(sessionId): void`
  - `cleanupInactive(maxAge): void` (for HTTP mode)
- [ ] Implement `determineProviderMode()` helper:
  - Check `capabilities.sampling` → return 'sampling'
  - Else check for API keys → return 'direct'
  - Else → return 'none'
- [ ] Add logging for session lifecycle events
- [ ] Add session ID generation utility
- [ ] Write unit tests for SessionManager

## Acceptance Criteria

- [ ] `createSession()` correctly extracts clientInfo and capabilities
- [ ] `determineProviderMode()` follows priority: sampling → direct → none
- [ ] `getSession()` returns correct session or undefined
- [ ] `updateActivity()` updates lastActivity timestamp
- [ ] `removeSession()` cleans up session
- [ ] `cleanupInactive()` removes old sessions (HTTP mode)
- [ ] All methods have unit tests
- [ ] Logging provides useful debugging information
- [ ] Thread-safe for concurrent access (HTTP mode)

## Constraints

**From IDEA.md**:
- Detection must be automatic
- No user configuration required

**Technical**:
- Must handle both STDIO and HTTP transports
- HTTP mode needs cleanup for inactive sessions
- STDIO mode has single session per process

## Dependencies

**Requires**: 
- Step 1 (SessionContext types)

**Blocks**: 
- Step 3 (MCP server integration)
- Step 7 (Provider loading)

## Evidence

**Session-Based Architecture** (evidence/session-based-architecture.md):
```typescript
class SessionManager {
  private sessions: Map<string, SessionContext> = new Map();
  
  createSession(sessionId, transport, initRequest) {
    const context = {
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
    return context;
  }
}
```

**Provider Mode Logic**:
```typescript
function determineProviderMode(context: SessionContext): ProviderMode {
  if (context.capabilities.sampling) return 'sampling';
  
  const hasApiKeys = 
    process.env.ANTHROPIC_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GOOGLE_API_KEY;
  
  if (hasApiKeys) return 'direct';
  return 'none';
}
```

## Estimated Effort

**6 hours**

- 2h: Implement SessionManager class
- 2h: Implement determineProviderMode logic
- 2h: Write unit tests

## Notes

- Use `crypto.randomUUID()` for session ID generation
- Consider using WeakMap for automatic cleanup (if appropriate)
- Log session creation with client name for debugging
- HTTP cleanup should be configurable (default 1 hour)
- Consider adding `listSessions()` for debugging/monitoring

## Testing Strategy

**Unit tests should cover**:
- Session creation with various clientInfo configurations
- Provider mode determination for all scenarios:
  - Sampling available → 'sampling'
  - No sampling, has API key → 'direct'
  - No sampling, no API key → 'none'
- Activity tracking updates timestamp
- Session removal
- Inactive session cleanup (HTTP mode)
- Concurrent access (if applicable)

## Related Files

- `src/mcp/session/types.ts` - SessionContext types
- `src/mcp/server.ts` - Will use SessionManager
- `src/ai/provider-loader.ts` - Will query session for provider mode
