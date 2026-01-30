---
plan: plan-lifecycle
created: 2026-01-28
---

Implement a comprehensive 8-stage plan lifecycle system for riotplan that transforms it from a simple execution tool into a full thinking system.

## The 8 Stages

### 1. Idea (Exploration)
Capture intent without commitment. Cheap thinking phase.
- Support: brainstorming, notes, constraints, forking, killing plans
- Disallow: execution, resource commitment, scheduling
- Exit: "This is worth shaping"

### 2. Shaping (Conceptual Development)
Turn loose ideas into coherent candidate plans.
- Support: scope definition, assumption identification, milestone sketching, alternative comparison, tradeoff analysis
- Disallow: hard commitments, external promises
- Exit: "A single primary approach emerges"

### 3. Built (Formalized Plan)
Convert intent into concrete artifact.
- Support: full plan structure, steps, dependencies, estimates, provisional owners, versioning
- Disallow: execution, declaring success
- Exit: "This plan can be evaluated"

### 4. Analyzed (Validation)
Decide whether the plan is actually good.
- Support: risk analysis, scenario testing, cost/benefit review, peer/AI critique, structural revision
- **Can send plan backward to Shaping or Built**
- Exit: "We believe this should be executed"

### 5. Approved (Commitment Point)
Explicit decision to execute.
- Support: scope locking, resource allocation, scheduling, stakeholder notification
- Disallow: structural redesign without revision
- Exit: "Execution begins"

### 6. Executing (Active Work)
Turn plan into reality.
- Support: task execution, progress tracking, discovery logging, timeline adjustment, in-progress revision
- **Execution does not freeze thinking**
- In-Progress Revision: changes tracked, justified, versioned, may require re-approval
- Exit: "All objectives completed or plan terminated"

### 7. Done (Completed)
Mark plan as no longer active.
- Support: outcome recording, lessons learned, expected vs actual comparison, postmortems
- Disallow: further execution
- Exit: "Knowledge extracted"

### 8. Archived (Cold Storage)
Preserve institutional memory.
- Support: reference, cloning as template, pattern mining
- Disallow: modification in place
- Read-only, searchable, forkable

## Core Principles

1. **Creating a plan ≠ committing to it**
2. **Backward transitions are intelligence, not failure**
3. **Approval is a state, not a side effect**
4. **Execution does not freeze thinking**

## Implementation Requirements

### State Machine
- Define all 8 states with clear semantics
- Implement allowed/disallowed actions per state
- Support explicit state transitions
- Enable backward transitions with justification
- Track state history with timestamps

### Revision Semantics
- Version tracking for plans
- Major vs minor revision distinction
- Re-approval triggers for significant changes
- Complete revision history
- Justification requirements

### Schema Changes
- Add `lifecycle_stage` field to plan metadata
- Add `state_history` array with transitions
- Add `revision_number` and `revision_history`
- Add `outcomes` and `lessons_learned` for Done stage
- Add `approval` metadata (who, when, conditions)
- Add `alternatives` for Shaping stage
- Add `analysis_results` for Analyzed stage

### CLI Commands
- `riotplan transition <stage> [--reason]` - Move to new stage
- `riotplan revise [--major|--minor]` - Create revision during execution
- `riotplan analyze` - Enter analysis with validation tools
- `riotplan approve [--conditions]` - Commit to execution
- `riotplan complete --outcome <success|partial|failure>` - Mark done
- `riotplan archive` - Move to cold storage
- `riotplan fork <source>` - Clone idea or archived plan
- `riotplan lifecycle` - Show current stage and allowed transitions

### MCP Integration
- Update existing tools to respect lifecycle stage
- Add `riotplan_transition` tool
- Add `riotplan_revise` tool
- Add `riotplan_lifecycle` resource
- Add `riotplan_state_history` resource
- Update prompts for lifecycle-aware workflows

### Validation
- Enforce allowed actions per stage
- Require justification for backward transitions
- Validate transition prerequisites
- Prevent execution in pre-approval stages
- Warn on risky transitions

### Migration
- Detect old-format plans
- Auto-migrate to new schema
- Default existing plans to "Executing" or "Built" stage
- Preserve all existing data

### Documentation
- Lifecycle guide explaining each stage
- Transition decision trees
- When to use each stage (examples)
- Revision workflow guide
- Migration guide for existing plans

## Current State Analysis

Riotplan currently:
- Has basic plan creation (maps to Built)
- Supports step execution (maps to Executing)
- Has limited status tracking
- No concept of pre-execution stages (Idea, Shaping, Analyzed, Approved)
- No revision semantics
- No backward transitions
- No archive capability
- No state validation

## Success Criteria

- All 8 lifecycle stages implemented
- State transitions work forward and backward
- Revision system tracks changes with versioning
- CLI commands for all lifecycle operations
- MCP tools fully support lifecycle
- Existing plans migrate automatically
- Comprehensive documentation
- Test coverage for all transitions
- Examples for each stage

## Non-Goals

- Complex multi-user approval workflows
- External scheduling system integration
- Complex resource allocation beyond metadata
- Real-time collaboration features

## Technical Approach

Start with:
1. Define TypeScript types for lifecycle stages and transitions
2. Update plan schema with lifecycle fields
3. Implement state machine logic with validation
4. Add CLI commands one stage at a time
5. Update existing commands to respect lifecycle
6. Add MCP integration
7. Write migration logic
8. Create comprehensive tests
9. Document with examples

This transforms riotplan from an execution tool into a complete thinking system.
