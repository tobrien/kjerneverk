# Step 3: Integrate SessionManager with MCP Server

## Objective

Wire up SessionManager in RiotPlan's MCP server to track sessions during initialization and tool calls.

## Context

**Why this step**: Connects session tracking to actual MCP protocol flow. Sessions must be created during initialization and referenced during tool execution.

**From evidence/session-based-architecture.md**:
> "In MCP server initialization, create session when initialize request received. Store session ID for connection. In tool handlers, retrieve session context and update activity."

**Why now**: Requires SessionManager from Step 2. Completes Phase 1 foundation.

## Tasks

- [ ] Add SessionManager instance to MCP server
- [ ] Update `initialize` request handler:
  - Generate session ID
  - Create session via SessionManager
  - Store session ID on connection object
  - Log session creation with client info
- [ ] Update tool request handlers (e.g., `riotplan_generate`):
  - Retrieve session from SessionManager
  - Update activity timestamp
  - Pass session context to provider loading (Step 7)
- [ ] Add session cleanup on connection close (STDIO)
- [ ] Add periodic cleanup task (HTTP mode)
- [ ] Update server tests to include session tracking

## Acceptance Criteria

- [ ] Session created during MCP initialization
- [ ] Session ID stored and retrievable for connection
- [ ] Tool handlers can access session context
- [ ] Activity timestamp updated on each request
- [ ] Sessions cleaned up when connections close
- [ ] HTTP mode has periodic cleanup (configurable interval)
- [ ] Logging shows session lifecycle clearly
- [ ] Tests verify session tracking works

## Constraints

**From IDEA.md**:
- Must be transparent to user
- No configuration required

**Technical**:
- Must not break existing MCP functionality
- Backward compatible with current behavior

## Dependencies

**Requires**: 
- Step 1 (SessionContext types)
- Step 2 (SessionManager implementation)

**Blocks**: 
- Step 7 (Provider loading needs session context)

## Evidence

**Integration Pattern** (evidence/session-based-architecture.md):
```typescript
// In MCP server initialization
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  const sessionId = generateSessionId();
  const context = sessionManager.createSession(sessionId, transport, request);
  connection.sessionId = sessionId;
  
  return {
    protocolVersion: '2025-11-25',
    capabilities: { /* ... */ },
    serverInfo: { /* ... */ },
  };
});

// In tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const context = sessionManager.getSession(connection.sessionId);
  if (!context) throw new Error('Session not found');
  
  sessionManager.updateActivity(connection.sessionId);
  // ... use context for provider loading
});
```

## Estimated Effort

**4 hours**

- 2h: Integration with initialize handler
- 1h: Integration with tool handlers
- 1h: Testing and validation

## Notes

- Store session ID in connection metadata (not global)
- Consider adding session info to server logs
- HTTP mode: Start cleanup timer on server start
- STDIO mode: Clean up on process exit
- Add debug endpoint to list active sessions (optional)

## Related Files

- `src/mcp/server.ts` - Main integration point
- `src/mcp/session/SessionManager.ts` - Session management
- `src/mcp/tools/generate.ts` - Example tool handler to update
