# Step 11: Implement End-to-End Tests

## Objective

Create comprehensive end-to-end tests that verify complete plan generation flow via MCP sampling.

## Context

**Why this step**: Validates entire system works together - from MCP initialization through sampling to plan file creation.

**From evidence/fastmcp-test-plan.md**:
> "Tests sampling detection, request format, end-to-end generation, includes CI/CD integration."

**Why now**: Test infrastructure from Step 10 is ready. Now add comprehensive test scenarios.

## Tasks

- [ ] Implement test_sampling_plan_generation():
  - Call riotplan_generate via FastMCP
  - Verify plan files created
  - Verify SUMMARY.md content
  - Verify steps created correctly
- [ ] Implement test_sampling_request_format():
  - Capture sampling requests
  - Validate request structure
  - Verify MCP spec compliance
- [ ] Implement test_no_direct_api_keys_needed():
  - Remove API keys from environment
  - Verify sampling still works
  - Proves no server-side keys needed
- [ ] Implement test_sampling_with_tools() (optional):
  - Test tool use in sampling if supported
- [ ] Add test for error scenarios:
  - User rejection
  - Timeout
  - Invalid params
- [ ] Document expected test output

## Acceptance Criteria

- [ ] test_sampling_plan_generation passes with both handlers
- [ ] Plan files created correctly
- [ ] Request format validated
- [ ] No server API keys needed (proven)
- [ ] Error scenarios handled gracefully
- [ ] Tests are reliable and repeatable
- [ ] Test output is clear and informative

## Constraints

**From evidence/fastmcp-test-plan.md**:
- Must test complete plan generation
- Must verify no server keys needed
- Must validate MCP spec compliance

## Dependencies

**Requires**: 
- Step 10 (Test infrastructure)

**Blocks**: 
- Step 12 (CI/CD integration)

## Evidence

**Test Example** (evidence/fastmcp-test-plan.md):
```python
@pytest.mark.asyncio
async def test_sampling_plan_generation(sampling_client, temp_plan_dir):
    client, handler_type = sampling_client
    plan_path = Path(temp_plan_dir) / "test-web-app"
    
    result = await client.call_tool(
        "riotplan_generate",
        {
            "path": str(plan_path),
            "description": "Create a simple web application",
            "steps": 3
        }
    )
    
    assert result["success"] is True
    assert (plan_path / "SUMMARY.md").exists()
    assert (plan_path / "STATUS.md").exists()
    
    steps_dir = plan_path / "steps"
    step_files = list(steps_dir.glob("*.md"))
    assert len(step_files) == 3
```

## Estimated Effort

**6 hours**

- 3h: Implement test scenarios
- 2h: Error scenario testing
- 1h: Documentation and validation

## Notes

- Use descriptive test names
- Add comments explaining what each test proves
- Capture and log sampling requests for debugging
- Consider adding performance benchmarks
- Test with various plan descriptions

## Related Files

- `tests/sampling/test_sampling.py` - Test implementation
- `tests/sampling/conftest.py` - Fixtures
