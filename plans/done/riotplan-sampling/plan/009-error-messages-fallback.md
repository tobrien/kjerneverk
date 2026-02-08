# Step 9: Add Clear Error Messages and Fallback Logic

## Objective

Implement clear, actionable error messages when AI generation isn't available and ensure graceful fallback between provider modes.

## Context

**Why this step**: Users need to understand why something isn't working and what to do about it. Clear errors reduce support burden.

**From IDEA.md**:
> "Error messages must be clear when sampling unavailable - tell user exactly what to do."

**Why now**: Completes Phase 3. All provider logic is in place, now make it user-friendly.

## Tasks

- [ ] Create error message templates:
  - No provider available (mode === 'none')
  - Sampling rejected by user
  - Sampling timeout
  - Invalid sampling request
- [ ] Implement fallback logic:
  - If sampling fails, try direct provider (if available)
  - If direct fails, show clear error
  - Log fallback attempts
- [ ] Add context to error messages:
  - Client name
  - Available options
  - Setup instructions
  - Links to documentation
- [ ] Test error scenarios:
  - No sampling, no API keys
  - Sampling rejected
  - Sampling timeout
  - API key invalid
- [ ] Update documentation with troubleshooting guide

## Acceptance Criteria

- [ ] Error messages tell user exactly what to do
- [ ] Messages include client context
- [ ] Fallback logic tries alternatives before failing
- [ ] All error scenarios tested
- [ ] Troubleshooting guide in documentation
- [ ] Error messages are consistent and professional

## Constraints

**From IDEA.md**:
- Don't fail silently - explain what's needed
- Messages must be actionable

## Dependencies

**Requires**: 
- Step 8 (Mode detection)

**Blocks**: 
- Step 10 (Testing needs error scenarios)

## Evidence

**Error Message Strategy** (from IDEA.md):
> "If sampling is unavailable, stop and tell user clearly: 'Unable to use sampling. To use this feature, configure with environment variable [X] or set up API key.' Don't fail silently - explain what's needed."

**Example Error Messages**:
```
No AI provider available for RiotPlan.

Your client (Cursor) does not support MCP sampling, and no API keys are configured.

To use RiotPlan's AI features, either:
1. Use a client that supports MCP sampling (GitHub Copilot, FastMCP)
2. Set up an API key:
   - ANTHROPIC_API_KEY for Claude models
   - OPENAI_API_KEY for GPT models
   - GOOGLE_API_KEY for Gemini models

For more information, see: https://docs.riotplan.dev/ai-providers
```

## Estimated Effort

**4 hours**

- 2h: Implement error messages
- 1h: Fallback logic
- 1h: Testing and documentation

## Notes

- Use chalk or similar for colored terminal output
- Include links to setup guides
- Consider adding --help flag for AI setup
- Test messages with real users for clarity
- Keep messages concise but complete

## Related Files

- `src/ai/provider-loader.ts` - Error generation
- `src/errors.ts` - Error classes
- `docs/` - Troubleshooting guide
