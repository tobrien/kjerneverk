# Step 13: Test MCP Server Scenarios

## Goal

Manually test all MCP server scenarios to ensure real-world usage works correctly.

## Test Scenarios

### Scenario 1: MCP with Environment Variable
- [ ] Set RIOTPLAN_PLAN_DIRECTORY in .cursor/mcp.json
- [ ] Start Cursor/IDE with MCP server
- [ ] Run `riotplan idea create` via MCP
- [ ] Verify plan created in specified directory
- [ ] Check --check-config shows env var as source

### Scenario 2: MCP with Config File
- [ ] Create riotplan.config.yaml in project root
- [ ] Set planDirectory to custom location
- [ ] Start MCP server
- [ ] Run `riotplan idea create` via MCP
- [ ] Verify plan created in config directory
- [ ] Check --check-config shows config file as source

### Scenario 3: MCP with Walk-Up
- [ ] Remove env var and config file
- [ ] Ensure plans/ directory exists in project root
- [ ] Start MCP server from subdirectory
- [ ] Run `riotplan idea create` via MCP
- [ ] Verify walk-up found plans/ directory
- [ ] Check --check-config shows walk-up as source

### Scenario 4: MCP with Fallback
- [ ] Remove env var, config file, and plans/ directory
- [ ] Start MCP server
- [ ] Run `riotplan idea create` via MCP
- [ ] Verify plan created in ./plans (fallback)
- [ ] Check --check-config shows fallback as source

### Scenario 5: Precedence Testing
- [ ] Set all tiers (env var, config, existing plans/)
- [ ] Verify env var takes precedence
- [ ] Remove env var, verify config takes precedence
- [ ] Remove config, verify walk-up takes precedence

## Acceptance Criteria

- [ ] All scenarios work as expected
- [ ] Precedence is correct
- [ ] Error messages are helpful
- [ ] Performance is acceptable
- [ ] No unexpected behavior

## Notes

Test in real Cursor/VSCode environment with actual MCP server. Document any issues found.
