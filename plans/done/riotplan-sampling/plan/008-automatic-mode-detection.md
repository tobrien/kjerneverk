# Step 8: Implement Automatic Mode Detection

## Objective

Ensure provider mode is automatically determined during MCP initialization without user configuration.

## Context

**Why this step**: Fulfills core constraint of automatic detection. Users shouldn't need to configure anything - RiotPlan detects capabilities and chooses appropriate mode.

**From IDEA.md**:
> "Detection must be automatic - no user configuration required to enable sampling mode."

**Why now**: Provider loading (Step 7) is ready. This completes the automatic selection flow.

## Tasks

- [ ] Verify determineProviderMode() logic in SessionManager
- [ ] Add capability detection tests:
  - Client with sampling capability → 'sampling' mode
  - Client without sampling, API keys present → 'direct' mode
  - Client without sampling, no API keys → 'none' mode
- [ ] Add logging for mode detection:
  - Log detected capabilities
  - Log selected provider mode
  - Log reasoning for selection
- [ ] Test with various client configurations
- [ ] Document detection logic in code comments
- [ ] Add detection flow diagram to documentation

## Acceptance Criteria

- [ ] Mode detection is 100% automatic
- [ ] No user configuration required
- [ ] All capability combinations handled correctly
- [ ] Logging clearly shows detection reasoning
- [ ] Tests cover all detection scenarios
- [ ] Documentation explains detection flow

## Constraints

**From IDEA.md**:
- Must be transparent to user
- No configuration required
- Must work identically across clients

## Dependencies

**Requires**: 
- Step 7 (Provider loading)

**Blocks**: 
- Step 9 (Error messages depend on detection)

## Evidence

**Detection Logic** (evidence/session-based-architecture.md):
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

## Estimated Effort

**4 hours**

- 2h: Verify and enhance detection logic
- 1h: Add comprehensive logging
- 1h: Testing and documentation

## Notes

- Priority order is critical: sampling → direct → none
- Log at INFO level for transparency
- Consider adding detection summary to server startup
- Test with real MCP clients (FastMCP, etc.)

## Related Files

- `src/mcp/session/SessionManager.ts` - Detection logic
- `src/ai/provider-loader.ts` - Uses detected mode
- `src/mcp/server.ts` - Initialization flow
