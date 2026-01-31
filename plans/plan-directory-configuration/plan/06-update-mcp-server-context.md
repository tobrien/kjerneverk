# Step 06: Update MCP Server Context Initialization

## Goal

Modify MCP server to use the new plan directory resolver instead of process.cwd().

## Tasks

- [ ] Open `src/mcp/server.ts`
- [ ] Import `resolvePlanDirectory` from config module
- [ ] Replace line 91: `workingDirectory: process.cwd()` with `workingDirectory: resolvePlanDirectory()`
- [ ] Test that MCP server initializes correctly
- [ ] Verify context is passed to all tools

## Current Code (Line 91)

```typescript
const context = {
    workingDirectory: process.cwd(),  // ← Replace this
    config: undefined,
    logger: undefined,
    // ...
};
```

## New Code

```typescript
import { resolvePlanDirectory } from '../config/index.js';

const context = {
    workingDirectory: resolvePlanDirectory(),  // ← Uses four-tier resolution
    config: undefined,
    logger: undefined,
    // ...
};
```

## Acceptance Criteria

- [ ] MCP server uses new resolver
- [ ] All tools receive correct working directory
- [ ] No breaking changes to tool interfaces
- [ ] MCP server starts successfully

## Notes

This is the key integration point. Once this is done, all MCP tools will automatically use the correct plan directory.
