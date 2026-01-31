# Step 09: Write Unit Tests for Config Module

## Goal

Create comprehensive unit tests for all configuration logic.

## Tasks

- [ ] Create `tests/config/schema.test.ts`
  - Test Zod schema validation
  - Test default values
  - Test invalid configurations
- [ ] Create `tests/config/walk-up.test.ts`
  - Test finding plans/ at various levels
  - Test stopping at filesystem root
  - Test caching behavior
  - Test with nested directories
- [ ] Create `tests/config/resolver.test.ts`
  - Test all four tiers
  - Test precedence (tier 1 > tier 2 > tier 3 > tier 4)
  - Test caching
  - Test with various directory structures
- [ ] Create test fixtures and mock directories
- [ ] Aim for >90% code coverage

## Test Scenarios

### Schema Tests
- Valid config with all fields
- Valid config with only planDirectory
- Invalid config (wrong types)
- Default values applied correctly

### Walk-Up Tests
- Plans/ in current directory
- Plans/ two levels up
- Plans/ at filesystem root
- No plans/ found (returns null)
- Nested plans/ directories (uses closest)

### Resolver Tests
- Tier 1: RIOTPLAN_PLAN_DIRECTORY env var set
- Tier 2: Config file exists
- Tier 3: Walk-up finds plans/
- Tier 4: Fallback to ./plans
- Precedence: env var overrides config
- Precedence: config overrides walk-up

## Acceptance Criteria

- [ ] All tests pass
- [ ] Code coverage >90%
- [ ] Tests are well-organized
- [ ] Tests use proper mocking
- [ ] Tests clean up after themselves

## Notes

Use vitest for testing. Create reusable test fixtures for directory structures.
