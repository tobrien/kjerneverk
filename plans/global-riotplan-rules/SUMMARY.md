# global-riotplan-rules

## Overview

Implement project-specific plan rules system that allows users to define rules for plan creation and validation. Rules are stored in configuration files and automatically applied during plan generation and validation.

## Goals

1. Extend config schema to support `planRules` and `validationRules` (arrays of freeform markdown strings)
2. Inject creation rules into plan generator as guidance
3. Run validation rules after plan creation and during feedback iterations
4. Maintain backward compatibility (rules are optional)

## Scope

### In Scope

- Config schema extension
- Plan generator integration
- Validation rules execution
- Integration with existing plan creation flow
- Integration with feedback flow

### Out of Scope

- Conditional rules (keep it simple for now)
- Rule directory approach (config file only)
- Structured rule format (freeform markdown only)

## Success Criteria

- [ ] Config schema includes optional `planRules` and `validationRules` properties
- [ ] Plan generator receives and applies creation rules when present
- [ ] Validation rules run after plan creation
- [ ] Validation rules run during feedback iterations
- [ ] Existing functionality unchanged when no rules are defined
- [ ] Documentation updated

---

*Plan created: 2026-01-31*
