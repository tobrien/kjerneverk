# riotplan-http-mcp

## Overview

Transform RiotPlan from scattered project directory storage to centralized HTTP service architecture. Add UUID identifiers to plan format, build standalone HTTP MCP server using riotplan-format StorageProvider, create curated MCP tool API, and develop VSCode extension for HTTP connectivity. Implement lifecycle-based plan organization with done/hold directories and UUID-slug file naming.

## Goals

RiotPlan needs a remote HTTP MCP server (like Protokoll) instead of running as a local MCP. Plans should be stored centrally as a service, not scattered across project directories. This would eliminate the need to specify plan directories and allow working across workspaces with a single plan database.

## Scope

### In Scope

- Implementation of planned features
- Testing and validation
- Documentation updates

### Out of Scope

- (To be determined during execution)

## Success Criteria

- [x] Step 1: Add UUID Support to riotplan-format ✅ **WORKING**
- [x] Step 2: Build HTTP MCP Server with Hono ✅ **WORKING** (fixed 2026-02-18)
- [x] Step 3: Create Simplified HTTP MCP Tools ✅ **WORKING** (all 3 tools tested)
- [x] Step 4: Build VSCode Extension for HTTP MCP ✅ **WORKING** (fixed 2026-02-18)
- [x] Step 5: Build Migration Tools and Plan Organization ✅ **WORKING**

## Actual Outcome

**This plan was incorrectly marked as completed.** Only 2 out of 5 steps actually work when tested:

### What Works
- ✅ **Step 1**: UUID support in riotplan-format - fully functional, tested
- ✅ **Step 5**: Migration tools - fully functional, tested end-to-end

### What Was Fixed (2026-02-18)

Steps 2 and 4 had bugs introduced during original development that were never caught because the code was never tested end-to-end. Fixed as follows:

**`src/mcp/server-hono.ts`** (three bugs):
1. `handleRequest(c.req.raw)` → `handleRequest(c)` — transport needs the Hono Context, not the raw Request
2. `HTTPException` was caught and discarded — fixed to call `error.getResponse()` so the proper MCP error response is returned
3. `new StreamableHTTPTransport()` → `new StreamableHTTPTransport({ enableJsonResponse: true })` — makes responses plain JSON instead of SSE streams

**`riotplan-vscode/src/mcp-client.ts`** (two bugs):
4. Missing `Accept: application/json, text/event-stream` header — required by MCP Streamable HTTP spec
5. No `initialize` handshake — added automatic init before first non-init request

### Lessons Learned

1. **Compilation ≠ Working Software** — Steps 2-4 were marked complete based on compilation only
2. **Reflections can be aspirational** — They claimed functionality that wasn't tested
3. **Always test end-to-end** — Build → Compile → Run → Call → Verify
4. **The right way** — Step 5 was done right: code written, built, and actually tested against real data

See [ISSUES.md](./ISSUES.md) for detailed post-mortem.

---

*Plan created: 2026-02-17*  
*Incorrectly marked complete: 2026-02-17*  
*Actual status discovered: 2026-02-18*
