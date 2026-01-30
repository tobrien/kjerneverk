# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Template-First with Copy-Paste Infrastructure

**Description**: Start by implementing the template system with lifecycle-aware questions as the foundation. Copy history/checkpoint/narrative code from RiotPlan into RiotDoc (accept duplication for now). Build all features together rather than incrementally. No shared library yet - that can come later when patterns stabilize.

**Tradeoffs**:
- Pro: Fast implementation - no need to create new packages or abstractions
- Pro: Templates drive the design - everything else fits around them
- Pro: Copy-paste is proven code that works in RiotPlan
- Pro: Can build and test everything together
- Con: Code duplication between RiotPlan and RiotDoc
- Con: If bugs found in shared code, need to fix in both places
- Con: Future refactoring needed when creating shared library
- Pro: Defers complexity - shared library when patterns are stable

**Assumptions**:
- Template system is the most important feature to get right
- Code duplication is acceptable short-term tradeoff for speed
- RiotPlan's history/checkpoint/narrative code works well enough to copy
- Shared library will be created eventually but not now


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Template-First with Copy-Paste Infrastructure

**Reasoning**: Speed is important. Templates drive the user experience and should be built first. Copy-paste history/checkpoint/narrative code from RiotPlan (accept duplication for now). Build all features together. No shared library yet - defer until patterns stabilize. This approach balances speed with quality and lets us iterate quickly.

**Selected At**: 2026-01-30T00:12:54.283Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-01-30T00:01:21.727Z
**Next**: Select an approach and transition to 'built'
