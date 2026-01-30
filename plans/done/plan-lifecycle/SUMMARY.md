# Plan Lifecycle System - Summary

## Executive Summary

Transform riotplan from a simple execution tool into a comprehensive thinking system with an 8-stage lifecycle that explicitly separates exploration, validation, commitment, and execution.

## Current Problem

Riotplan currently collapses "create → execute → done" into a single flow, which:
- Forces premature commitment (creating a plan = committing to it)
- Provides no space for exploration or validation
- Treats backward movement as failure rather than intelligence
- Lacks revision semantics during execution
- Has no concept of plan approval as a distinct state

## Proposed Solution

Implement an 8-stage lifecycle:

1. **Idea** - Cheap exploration without commitment
2. **Shaping** - Conceptual development and alternative comparison
3. **Built** - Formalized plan structure
4. **Analyzed** - Validation and stress testing
5. **Approved** - Explicit commitment point
6. **Executing** - Active work with controlled revision
7. **Done** - Completion with outcomes and lessons
8. **Archived** - Read-only reference and template source

## Core Principles

- **Creating ≠ Committing**: Plans can exist without obligation
- **Backward = Intelligence**: Revision is learning, not failure
- **Approval is State**: Commitment is explicit, not implicit
- **Execution ≠ Frozen**: Thinking continues during work

## Approach

### Phase 1: Foundation (Steps 1-3)
- Define TypeScript types for lifecycle stages
- Update plan schema with new fields
- Implement core state machine logic

### Phase 2: CLI Integration (Steps 4-6)
- Add lifecycle transition commands
- Update existing commands to respect stages
- Implement validation rules

### Phase 3: Advanced Features (Steps 7-9)
- Build revision system with versioning
- Add MCP tools and resources
- Create migration path for existing plans

### Phase 4: Polish (Steps 10-12)
- Comprehensive testing
- Documentation with examples
- Real-world validation

## Success Criteria

- All 8 stages implemented with clear semantics
- State transitions validated (forward and backward)
- Revision tracking with justification
- CLI commands intuitive and complete
- MCP integration seamless
- Existing plans migrate without data loss
- Documentation clear with decision trees
- Test coverage >90%

## Impact

This transforms riotplan into a tool that:
- Supports how people actually think (explore → validate → commit → execute)
- Makes planning decisions explicit and reviewable
- Enables learning through revision
- Preserves institutional memory
- Scales from quick tasks to complex multi-phase projects

## Timeline

12 steps, estimated 2-3 weeks of focused development.
