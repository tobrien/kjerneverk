# Step 6: Add Error Handling and Unit Tests

## Objective

Implement comprehensive error handling for sampling failures and create unit test suite for execution-sampling package.

## Context

**Why this step**: Sampling can fail in multiple ways (user rejection, timeout, invalid params). Must handle gracefully with clear messages.

**From IDEA.md**:
> "Error messages must be clear when sampling unavailable - tell user exactly what to do."

**Why now**: SamplingProvider from Step 5 needs robust error handling before integration.

## Tasks

- [ ] Create error classes:
  - `SamplingRejectedError` (user rejected, code -1)
  - `SamplingInvalidParamsError` (invalid params, code -32602)
  - `SamplingTimeoutError` (request timeout)
  - `SamplingUnavailableError` (client doesn't support sampling)
- [ ] Implement error handling in SamplingProvider:
  - Catch MCP error responses
  - Map error codes to error classes
  - Add helpful error messages
  - Include recovery suggestions
- [ ] Create unit test suite:
  - Test successful sampling request/response
  - Test user rejection error
  - Test invalid params error
  - Test timeout handling
  - Test request/response conversion
  - Test with mock MCP client
- [ ] Add integration tests with mock server
- [ ] Document error scenarios in README

## Acceptance Criteria

- [ ] All error codes from MCP spec handled
- [ ] Error messages are clear and actionable
- [ ] Unit tests achieve >90% code coverage
- [ ] Tests use mock MCP client (no real network)
- [ ] Error classes exported from package
- [ ] README documents error handling

## Constraints

**From evidence/mcp-sampling-spec.md**:
- Error code -1: User rejected sampling request
- Error code -32602: Invalid params
- Must handle gracefully

**From IDEA.md**:
- Error messages must tell user exactly what to do

## Dependencies

**Requires**: 
- Step 5 (SamplingProvider implementation)

**Blocks**: 
- Step 7 (RiotPlan integration needs error handling)

## Evidence

**Error Codes** (evidence/mcp-sampling-spec.md):
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -1,
    "message": "User rejected sampling request"
  }
}
```

**Error Message Strategy** (from IDEA.md):
> "If sampling is unavailable, stop and tell user clearly: 'Unable to use sampling. To use this feature, configure with environment variable [X] or set up API key.' Don't fail silently - explain what's needed."

## Estimated Effort

**8 hours**

- 3h: Error class implementation
- 4h: Unit test suite
- 1h: Documentation

## Notes

- Use Jest or similar test framework
- Mock MCP client for testing
- Test both success and failure paths
- Include examples of error messages in tests
- Consider adding retry logic for transient failures

## Testing Strategy

**Error scenarios to test**:
1. User rejects sampling request → SamplingRejectedError with helpful message
2. Invalid parameters → SamplingInvalidParamsError with details
3. Request timeout → SamplingTimeoutError with retry suggestion
4. Client doesn't support sampling → SamplingUnavailableError with setup instructions
5. Network error → Generic error with troubleshooting steps

**Success scenarios to test**:
1. Simple text generation
2. With system prompt
3. With model preferences
4. With maxTokens limit

## Related Files

- `src/errors.ts` - Error classes
- `src/SamplingProvider.ts` - Error handling logic
- `tests/` - Test suite
