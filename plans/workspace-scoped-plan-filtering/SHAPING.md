# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Workspace-First Identifier

**Description**: Use workspaceId as canonical plan metadata field and query filter. Persist selected workspaceId in VS Code workspaceState. Keep optional display alias 'Organization' in UI copy where helpful.

**Tradeoffs**:
- Pros: Aligns with VS Code terminology and workspace-scoped settings APIs
- Pros: Clear mapping from open workspace to plan filter context
- Cons: Some users may conceptually think in organizations, not workspaces

**Assumptions**:
- Most users have one dominant organization per workspace
- Workspace folder context is stable enough for persisted bindings


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Workspace-First Identifier

**Reasoning**: This best matches VS Code workspace semantics and Protokoll’s existing workspaceState-based filtering UX while still allowing organization terminology as a user-facing alias.

**Selected At**: 2026-02-23T04:01:23.475Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-23T04:01:11.500Z
**Next**: Select an approach and transition to 'built'
