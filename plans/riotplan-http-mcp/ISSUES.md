# Issues with riotplan-http-mcp Plan (Post-Mortem)

> **STATUS AS OF 2026-02-18**: All issues have been fixed. Server is now fully functional.
> This document is preserved as a record of what went wrong and why.

---

## Summary

This plan was marked as "completed" but **Step 2-4 were never properly finished**. The HTTP MCP server has critical bugs that prevent it from working.

## What Actually Works

- ✅ **Step 1**: UUID support added to riotplan-format (fully functional)
- ✅ **Step 5**: Migration tools (fully functional after fixes)

## What Doesn't Work

- ❌ **Step 2**: HTTP MCP Server - Server starts but cannot handle MCP requests
- ❌ **Step 3**: HTTP MCP Tools - Tools are implemented but cannot be called due to server issues  
- ❌ **Step 4**: VSCode Extension - Extension exists but cannot work because server is broken

## The Core Problem

The HTTP MCP server implementation in `src/mcp/server-hono.ts` uses `@hono/mcp`'s `StreamableHTTPTransport` incorrectly. The transport throws `HTTPException` with status 406 (Not Acceptable) when handling POST requests to `/mcp`.

### Technical Details

1. **Error**: `HTTPException` with status 406 from `StreamableHTTPTransport.handlePostRequest`
2. **Location**: `node_modules/@hono/mcp/dist/index.js:200:106`
3. **Symptom**: Server returns `{"error": {"code": -32603, "message": "Internal error"}}`
4. **Root Cause**: Unclear - possibly:
   - Missing required headers
   - Incorrect request format
   - Version mismatch with @hono/mcp@0.2.3
   - Misunderstanding of the StreamableHTTPTransport API

### What Was Attempted

Multiple fixes were tried:
1. Passing `c.req.raw` to `handleRequest()` - failed with "Cannot read properties of undefined (reading 'method')"
2. Creating new Request object with parsed body - failed with same error
3. Passing Hono context `c` with parsed body - fails with HTTPException 406

### Why This Happened

The reflections for Steps 2-4 claimed work was complete when it wasn't actually tested end-to-end. The server was built and compiled successfully, but **no one actually tried to call an MCP tool** until now.

## Impact

- Migration tool works perfectly
- HTTP server is completely non-functional
- VSCode extension cannot be used
- Plan should not have been marked as "completed"

## Next Steps

To actually complete this plan:

1. **Research @hono/mcp usage** - Find working examples or documentation
2. **Consider alternatives**:
   - Implement MCP protocol directly without @hono/mcp
   - Use a different MCP transport library
   - Switch to stdio MCP with HTTP proxy
3. **Test thoroughly** - Don't mark steps complete without end-to-end testing

## Lessons Learned

- ❌ Don't trust reflections that claim work is done without evidence
- ❌ Don't mark plans complete without integration testing
- ❌ Building and compiling ≠ working software
- ✅ Step 5 (migration) was properly completed because it was actually tested

---

**Date**: 2026-02-18  
**Status**: Plan incorrectly marked as completed. Steps 2-4 need to be redone or abandoned.
