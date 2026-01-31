# Step 14: Test CLI Scenarios

## Goal

Manually test all CLI scenarios to ensure command-line usage works correctly.

## Test Scenarios

### Scenario 1: CLI with No Configuration
- [ ] Run from empty directory
- [ ] Execute `riotplan idea create test-idea "Test"`
- [ ] Verify ./plans directory created
- [ ] Verify plan created in ./plans/test-idea

### Scenario 2: CLI with Existing plans/ Directory
- [ ] Create plans/ directory in project root
- [ ] Run from subdirectory (e.g., src/analysis)
- [ ] Execute `riotplan idea create test-idea "Test"`
- [ ] Verify walk-up found plans/ in project root
- [ ] Verify plan created there

### Scenario 3: CLI with Config File
- [ ] Create riotplan.config.yaml with custom planDirectory
- [ ] Run from any directory in project
- [ ] Execute `riotplan idea create test-idea "Test"`
- [ ] Verify config file was used
- [ ] Verify plan created in config directory

### Scenario 4: CLI with Environment Variable
- [ ] Set RIOTPLAN_PLAN_DIRECTORY in shell
- [ ] Run from any directory
- [ ] Execute `riotplan idea create test-idea "Test"`
- [ ] Verify env var was used
- [ ] Verify plan created in env var directory

### Scenario 5: CLI with Explicit Path
- [ ] Run with explicit --path parameter
- [ ] Execute `riotplan idea create test-idea "Test" --path /custom/path`
- [ ] Verify explicit path takes precedence
- [ ] Verify backward compatibility maintained

### Scenario 6: CLI Configuration Commands
- [ ] Run `riotplan --init-config`
- [ ] Verify config file created with defaults
- [ ] Run `riotplan --check-config`
- [ ] Verify shows correct configuration source

## Acceptance Criteria

- [ ] All scenarios work as expected
- [ ] Zero-config experience works (scenario 1)
- [ ] Walk-up works from subdirectories (scenario 2)
- [ ] Config file works (scenario 3)
- [ ] Env var works (scenario 4)
- [ ] Backward compatibility maintained (scenario 5)
- [ ] Config commands work (scenario 6)

## Notes

Test on actual command line in various directory structures. Verify user experience is smooth.
