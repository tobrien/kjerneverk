# Step 06: Testing & Documentation

## Objective

Comprehensive testing of the plan rules system and update documentation to explain how to use rules.

## Background

After implementation, we need to:
1. Test all scenarios (with rules, without rules, edge cases)
2. Update documentation (README, guide files)
3. Add examples of rule configuration
4. Verify backward compatibility

## Tasks

### 1. Test Config Schema

- Test config with planRules only
- Test config with validationRules only
- Test config with both
- Test config without rules (backward compatibility)
- Test invalid config (should fail validation)

### 2. Test Plan Generation

- Generate plan with creation rules - verify rules in prompt
- Generate plan without rules - verify normal behavior
- Generate plan with empty rules array
- Test with multiple rules

### 3. Test Validation Rules

- Run validation with rules
- Run validation without rules
- Test validation failure handling
- Test validation during feedback

### 4. Update Documentation

Update relevant docs:
- `README.md` - mention rules feature
- `guide/configuration.md` - add rules configuration section
- Add example config files showing rules
- Document rule format (freeform markdown)

### 5. Add Examples

Create example configurations:
- Example with creation rules
- Example with validation rules
- Example with both
- Example rules (testing, documentation requirements, etc.)

## Acceptance Criteria

- [ ] All test scenarios pass
- [ ] Documentation updated with rules section
- [ ] Examples provided
- [ ] Backward compatibility verified
- [ ] No regressions in existing functionality

## Testing

- Run full test suite
- Manual testing of all scenarios
- Test with real project config
- Verify examples work

## Files Changed

- `README.md`
- `guide/configuration.md`
- Example config files (if created)
- Test files (if adding unit tests)

## Notes

- Focus on user-facing documentation
- Examples are important for understanding
- Verify backward compatibility thoroughly
