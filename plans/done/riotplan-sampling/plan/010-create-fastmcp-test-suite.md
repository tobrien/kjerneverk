# Step 10: Create FastMCP Test Suite

## Objective

Implement Python test suite using FastMCP to verify RiotPlan sampling works end-to-end with a real MCP sampling client.

## Context

**Why this step**: Validates that Phases 1-3 work together with a real sampling client. FastMCP provides production-ready sampling support for testing.

**From evidence/fastmcp-test-plan.md**:
> "Complete FastMCP unit test plan - Python pytest suite with OpenAI/Anthropic handlers, tests sampling detection, request format, end-to-end generation."

**Why now**: Implementation complete (Phases 1-3). Ready to validate with real client.

## Tasks

- [ ] Create `tests/sampling/` directory in RiotPlan
- [ ] Set up Python environment:
  - requirements.txt with fastmcp[openai], fastmcp[anthropic], pytest
  - conftest.py for test configuration
  - .env.example for API keys
- [ ] Implement test_sampling.py:
  - Test with OpenAI handler
  - Test with Anthropic handler
  - Parametrized tests for both handlers
- [ ] Create test fixtures:
  - temp_plan_dir fixture
  - riotplan_server_path fixture
  - sampling_client fixture
- [ ] Add README.md with setup instructions
- [ ] Test locally with both handlers

## Acceptance Criteria

- [ ] Python environment sets up correctly
- [ ] Tests run with both OpenAI and Anthropic handlers
- [ ] Fixtures work correctly
- [ ] README has clear setup instructions
- [ ] Tests can run independently
- [ ] All dependencies documented

## Constraints

**From evidence/fastmcp-test-plan.md**:
- Must test with both OpenAI and Anthropic
- Must verify sampling detection
- Must test end-to-end plan generation

## Dependencies

**Requires**: 
- Steps 1-9 (Complete implementation)

**Blocks**: 
- Step 11 (End-to-end tests)

## Evidence

**Test Structure** (evidence/fastmcp-test-plan.md):
```python
@pytest.fixture(params=["openai", "anthropic"])
def sampling_client(request, riotplan_server_path):
    handler_type = request.param
    
    if handler_type == "openai":
        handler = OpenAISamplingHandler(default_model="gpt-4o")
    else:
        handler = AnthropicSamplingHandler(default_model="claude-sonnet-4-5")
    
    client = Client(riotplan_server_path, sampling_handler=handler)
    yield client, handler_type
    client.close()
```

## Estimated Effort

**8 hours**

- 3h: Python environment setup
- 3h: Implement test fixtures
- 2h: Documentation and validation

## Notes

- Use pytest-asyncio for async tests
- Skip tests if API keys not set
- Add clear error messages for setup issues
- Consider adding mock mode for CI without API keys
- Document Python version requirements (3.11+)

## Related Files

- `tests/sampling/` - New test directory
- `tests/sampling/requirements.txt` - Python dependencies
- `tests/sampling/README.md` - Setup guide
