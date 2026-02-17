# Step 02: Build HTTP MCP Server with Hono

## Objective

Create standalone HTTP MCP server using Hono framework that serves plan data via HTTP instead of stdio

## Background

Following the selected Standalone HTTP Server approach and using Protokoll's Hono+MCP architecture as reference. Server needs session management, StreamableHTTPTransport, and standard MCP protocol routes.

## Tasks

### 1. 02.1

Add HTTP server dependencies to riotplan/package.json:

```json
{
  "dependencies": {
    "hono": "^4.11.9",
    "@hono/node-server": "^1.19.9",
    "@hono/mcp": "^0.2.3",
    "@kjerneverk/riotplan-format": "^1.0.1"
  }
}
```

### 2. 02.2

Create HTTP MCP server entry point at riotplan/src/mcp/server-hono.ts:

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { streamSSE } from 'hono/streaming';
import { StreamableHTTPTransport } from '@hono/mcp';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { DefaultStorageProviderFactory } from '@kjerneverk/riotplan-format';

interface ServerConfig {
  port: number;
  plansDir: string;
  cors?: boolean;
}

interface SessionContext {
  id: string;
  server: Server;
  transport: StreamableHTTPTransport;
  storageFactory: DefaultStorageProviderFactory;
  createdAt: Date;
  lastActivity: Date;
}
```

This follows the Protokoll pattern with session-per-connection model.

### 3. 02.3

Implement session management and MCP protocol routes:

```typescript
const sessions = new Map<string, SessionContext>();

app.use('/mcp', cors());

// POST /mcp - JSON-RPC requests (all MCP protocol methods)
app.post('/mcp', async (c) => {
  const sessionId = c.req.header('Mcp-Session-Id') || generateSessionId();
  const session = await getOrCreateSession(sessionId, config.plansDir);
  
  const result = await session.transport.handleRequest(c);
  
  if (!c.req.header('Mcp-Session-Id')) {
    c.header('Mcp-Session-Id', sessionId);
  }
  
  return result;
});

// GET /mcp - SSE stream for notifications
app.get('/mcp', (c) => {
  return streamSSE(c, async (stream) => {
    // SSE implementation for notifications
  });
});
```

### 4. 02.4

Add CLI entry point and binary configuration in riotplan/package.json:

```json
{
  "bin": {
    "riotplan": "./dist/bin.js",
    "riotplan-mcp": "./dist/mcp-server.js",
    "riotplan-mcp-http": "./dist/mcp-server-http.js"
  }
}
```

Create riotplan/src/mcp/bin-http.ts for HTTP server CLI.

## Acceptance Criteria

- [ ] HTTP server starts on specified port with plans directory configuration
- [ ] MCP protocol routes (POST/GET/DELETE /mcp) handle requests correctly
- [ ] Session management maintains per-connection state
- [ ] Server integrates with riotplan-format StorageProvider
- [ ] Health check endpoint responds

## Testing

Start HTTP server, verify MCP protocol handshake works, test session creation and cleanup, confirm StorageProvider integration

## Files Changed

- `riotplan/package.json`
- `riotplan/src/mcp/server-hono.ts`
- `riotplan/src/mcp/bin-http.ts`

## Notes

Uses proven Hono+MCP architecture from Protokoll reference. Server serves as new primary interface while preserving existing stdio MCP.
