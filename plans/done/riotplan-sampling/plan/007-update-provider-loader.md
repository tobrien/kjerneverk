# Step 7: Update Provider Loader with Session Awareness

## Objective

Modify RiotPlan's provider-loader.ts to use session context for determining which provider to load.

## Context

**Why this step**: Connects session tracking (Phase 1) with sampling provider (Phase 2). Enables automatic provider selection based on client capabilities.

**From evidence/session-based-architecture.md**:
> "loadProviderForSession() checks session's providerMode and returns appropriate provider: sampling, direct, or error."

**Why now**: Requires SessionManager (Steps 1-3) and SamplingProvider (Steps 4-6). Begins Phase 3 integration.

## Tasks

- [ ] Add `loadProviderForSession(context: SessionContext)` function
- [ ] Implement provider selection logic:
  - If mode === 'sampling': load execution-sampling
  - If mode === 'direct': load existing provider (anthropic/openai/gemini)
  - If mode === 'none': throw error with clear message
- [ ] Update existing `loadProvider()` to use session context
- [ ] Add execution-sampling to package dependencies
- [ ] Update error messages to be session-aware
- [ ] Add logging for provider selection
- [ ] Update tests to include session-based loading

## Acceptance Criteria

- [ ] `loadProviderForSession()` correctly selects provider based on mode
- [ ] Sampling mode loads execution-sampling provider
- [ ] Direct mode loads existing providers (backward compatible)
- [ ] None mode throws clear error with next steps
- [ ] Error messages reference session's client name
- [ ] Tests cover all three provider modes
- [ ] Backward compatibility maintained for non-session usage

## Constraints

**From IDEA.md**:
- Must be transparent to user
- Standalone CLI mode must still work
- No breaking changes

**Technical**:
- Must maintain backward compatibility
- Existing API key usage must continue working

## Dependencies

**Requires**: 
- Steps 1-3 (Session architecture)
- Steps 4-6 (execution-sampling package)

**Blocks**: 
- Step 8 (Automatic mode detection)
- Step 9 (Error messages and fallback)

## Evidence

**Provider Loading Pattern** (evidence/session-based-architecture.md):
```typescript
async function loadProviderForSession(context: SessionContext): Promise<Provider> {
  switch (context.providerMode) {
    case 'sampling':
      return await loadSamplingProvider(context);
    case 'direct':
      return await loadDirectProvider();
    case 'none':
      throw new Error(
        `No AI provider available for client ${context.clientInfo?.name}. ` +
        'Either use a client that supports MCP sampling, ' +
        'or set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_API_KEY.'
      );
  }
}
```

## Estimated Effort

**6 hours**

- 3h: Implement loadProviderForSession()
- 2h: Update existing code paths
- 1h: Testing and validation

## Notes

- Keep existing loadProvider() for backward compatibility
- Add deprecation warning for non-session usage (optional)
- Log which provider mode is selected
- Include client name in error messages for debugging
- Consider adding provider mode to metrics/telemetry

## Related Files

- `src/ai/provider-loader.ts` - Main file to update
- `src/mcp/session/SessionManager.ts` - Session context source
- `src/mcp/tools/generate.ts` - Will call loadProviderForSession()
