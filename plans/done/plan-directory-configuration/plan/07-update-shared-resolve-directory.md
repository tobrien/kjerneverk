# Step 07: Update Shared resolveDirectory Helper

## Goal

Update the shared `resolveDirectory()` helper in tools/shared.ts to work with the new config system while maintaining backward compatibility.

## Tasks

- [ ] Open `src/mcp/tools/shared.ts`
- [ ] Review current `resolveDirectory()` implementation
- [ ] Ensure it respects explicit path parameters (backward compatibility)
- [ ] Update fallback logic if needed
- [ ] Add tests for resolveDirectory

## Current Implementation

```typescript
export function resolveDirectory(args: any, context: ToolExecutionContext): string {
    if (args.path) {
        return resolve(args.path);  // Explicit path takes precedence
    }
    if (context.workingDirectory) {
        return context.workingDirectory;  // From context (now uses resolver)
    }
    return process.cwd();  // Final fallback
}
```

## Acceptance Criteria

- [ ] Explicit path parameters still work (backward compatibility)
- [ ] Context working directory is used when no explicit path
- [ ] All existing tools continue to work
- [ ] No breaking changes

## Notes

The main change is that `context.workingDirectory` now comes from our four-tier resolver (changed in step 06). This function mostly stays the same but we should verify it works correctly.
