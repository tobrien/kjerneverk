# Execution Plan: global-riotplan-rules

## Strategy

Implement plan rules system incrementally:
1. Extend config schema (foundation)
2. Update generator to accept rules (creation rules)
3. Create validation runner (validation rules)
4. Integrate into existing flows (plan creation, feedback)
5. Test and document

Keep it simple - rules are optional freeform markdown strings. No complex parsing or conditionals.

## Prerequisites

- [ ] Understanding of existing config system (CardiganTime integration)
- [ ] Understanding of plan generator flow
- [ ] Understanding of validation system
- [ ] Understanding of feedback system

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Extend Config Schema | Add planRules and validationRules to config schema |
| 02 | Update Plan Generator | Modify generator to accept and inject creation rules |
| 03 | Create Validation Runner | Implement function to run validation rules |
| 04 | Integrate into Plan Creation | Run validation rules after plan creation |
| 05 | Integrate into Feedback Flow | Run validation rules during feedback iterations |
| 06 | Testing & Documentation | Test all scenarios and update documentation |

## Quality Gates

After each step:
- [ ] Code compiles
- [ ] Tests pass (if applicable)
- [ ] Lint passes
- [ ] Backward compatibility maintained

## Notes

- Rules are project-specific (found via config resolution)
- Rules are optional - if not present, behavior unchanged
- Freeform markdown strings only - no structured parsing
- Creation rules: guidance for plan generator
- Validation rules: checks run after creation and during feedback

---

*Last updated: 2026-01-31*
