# Evidence: Protokoll Hono+MCP architecture - reference implementation for RiotPlan HTTP server

**Source**: codebase analysis
**Source URL**: /Users/tobrien/gitw/redaksjon/protokoll
**Original Query**: How does Protokoll implement its HTTP MCP server using Hono?
**Added**: 2026-02-17T17:52:02.546Z
**Gathering Method**: model-assisted

---

**Stack**: Hono + @hono/mcp (StreamableHTTPTransport) + @modelcontextprotocol/sdk

**Key Dependencies**:
- hono ^4.11.9
- @hono/node-server ^1.19.9
- @hono/mcp ^0.2.3
- @modelcontextprotocol/sdk ^1.25.2

**Route Structure**:
- POST /mcp - JSON-RPC requests (all MCP protocol methods)
- GET /mcp - SSE stream for notifications
- DELETE /mcp - Session termination
- GET /health - Health check
- Custom REST endpoints alongside MCP (/audio/upload, /audio/:uuid)

**Session Model**:
- Session-per-connection with UUID session IDs
- Each session gets its own MCP Server + StreamableHTTPTransport
- Sessions stored in Map, cleaned up after 1 hour inactivity
- Session ID returned in Mcp-Session-Id response header

**Pattern**:
1. Hono app with CORS middleware on /mcp
2. POST /mcp creates session on 'initialize' request, routes subsequent requests through transport.handleRequest(c)
3. GET /mcp uses streamSSE() for SSE with ping keepalive
4. MCP Server created via factory function, tools registered with setRequestHandler()
5. Configuration loaded via CardiganTime

**Server modes**: 'remote' (HTTP, pre-configured) vs 'local' (stdio, dynamic)
**Entry point**: src/mcp/server-hono.ts with bin: protokoll-mcp-http