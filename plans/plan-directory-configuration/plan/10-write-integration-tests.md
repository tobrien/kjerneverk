# Step 10: Write Integration Tests

## Goal

Create integration tests that verify the entire system works end-to-end.

## Tasks

- [ ] Create `tests/integration/mcp-server.test.ts`
  - Test MCP server with env var set
  - Test MCP server with config file
  - Test MCP server with walk-up
  - Test MCP server with fallback
- [ ] Create `tests/integration/cli.test.ts`
  - Test CLI commands with various configs
  - Test --init-config
  - Test --check-config
- [ ] Create `tests/integration/tools.test.ts`
  - Test idea_create with different configs
  - Test other tools respect plan directory
  - Test explicit path parameters still work

## Test Scenarios

### MCP Server Integration
1. Start MCP server with RIOTPLAN_PLAN_DIRECTORY set
   - Verify tools use that directory
2. Start MCP server with config file
   - Verify tools use config directory
3. Start MCP server in directory with plans/
   - Verify walk-up finds it
4. Start MCP server in empty directory
   - Verify fallback to ./plans

### CLI Integration
1. Run `riotplan --init-config`
   - Verify config file created
2. Run `riotplan --check-config`
   - Verify shows correct resolution
3. Run `riotplan idea create` with various configs
   - Verify plans created in correct location

## Acceptance Criteria

- [ ] All integration tests pass
- [ ] Tests cover real-world scenarios
- [ ] Tests verify end-to-end behavior
- [ ] Tests are reliable and repeatable

## Notes

Integration tests may be slower. Use test fixtures and cleanup properly.
