# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Simple Config-Based Rules

**Description**: Extend config schema with optional planRules and validationRules arrays. Load rules when config is loaded. Inject creation rules into generator prompt. Run validation rules after plan creation and during feedback iterations.

**Tradeoffs**:
- Simple to implement - just extend existing config system
- Backward compatible - rules are optional
- Freeform markdown allows flexibility but no structured validation


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Simple Config-Based Rules

**Reasoning**: Simple, backward-compatible approach that extends existing config system without overcomplicating

**Selected At**: 2026-01-31T07:27:51.755Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-01-31T07:26:57.317Z
**Next**: Select an approach and transition to 'built'
