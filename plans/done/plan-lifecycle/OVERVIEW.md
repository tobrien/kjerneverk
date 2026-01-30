# Plan Lifecycle System - Implementation Overview

## What We're Building

A comprehensive 8-stage lifecycle system that transforms riotplan from a simple execution tool into a complete thinking system.

## The 8 Stages

```
Idea → Shaping → Built → Analyzed → Approved → Executing → Done → Archived
         ↖────────── Revise ──────────↗
               ↖──── Discoveries ────↗
```

### 1. **Idea** (Exploration)
- Cheap thinking without commitment
- Capture notes, constraints, alternatives
- Can kill or fork ideas
- Exit: "This is worth shaping"

### 2. **Shaping** (Conceptual Development)
- Compare multiple approaches
- Document tradeoffs and assumptions
- No hard commitments yet
- Exit: "Primary approach selected"

### 3. **Built** (Formalized Plan)
- Concrete plan with steps and dependencies
- Still unvalidated
- Can revise structure freely
- Exit: "Ready for evaluation"

### 4. **Analyzed** (Validation)
- Risk analysis and stress testing
- Can send backward to Shaping or Built
- Peer/AI critique
- Exit: "We believe this should be executed"

### 5. **Approved** (Commitment Point)
- Explicit decision to execute
- Scope locked (with revision rules)
- Resources allocated
- Exit: "Execution begins"

### 6. **Executing** (Active Work)
- Tasks being performed
- Progress tracked
- In-progress revisions allowed
- Thinking continues
- Exit: "Objectives completed"

### 7. **Done** (Completed)
- Work finished (success/partial/failure)
- Outcomes recorded
- Lessons learned captured
- Exit: "Knowledge extracted"

### 8. **Archived** (Cold Storage)
- Read-only reference
- Searchable and forkable
- Template for future plans
- Terminal state

## Core Principles

1. **Creating ≠ Committing**: Plans can exist without obligation to execute
2. **Backward = Intelligence**: Revision is learning, not failure
3. **Approval is State**: Commitment is explicit, not implicit
4. **Execution ≠ Frozen**: Thinking continues during work

## Implementation Plan (12 Steps)

### Phase 1: Foundation (Steps 1-3, ~18 hours)
1. **Define Lifecycle Types** - TypeScript enums, interfaces, validation types
2. **Update Plan Schema** - LIFECYCLE.md file, Zod schemas, migration utilities
3. **Implement State Machine** - Transition logic, validation, event system

### Phase 2: CLI Integration (Steps 4-5, ~14 hours)
4. **Add CLI Commands** - transition, approve, complete, archive, fork
5. **Stage-Specific Validation** - Enforce rules per stage, auto-fix

### Phase 3: Advanced Features (Steps 6-9, ~28 hours)
6. **Build Revision System** - Versioning, snapshots, re-approval workflow
7. **Add MCP Tools** - Lifecycle tools, resources, prompts
8. **Create Migration** - Auto-detect and migrate old plans
9. **Implement Early Stages** - Idea and Shaping stage support

### Phase 4: Polish (Steps 10-12, ~28 hours)
10. **Comprehensive Testing** - Unit, integration, E2E tests
11. **Documentation** - Guides, examples, decision trees, API docs
12. **Real-World Validation** - Dogfooding, feedback, polish, release

**Total**: 88 hours (~2-3 weeks)

## Key Features

### State Transitions
- Forward and backward transitions
- Validation before transition
- Justification tracking
- State history with timestamps

### Revision System
- Major revisions (require re-approval)
- Minor revisions (continue execution)
- Version numbering (1.0, 1.1, 2.0)
- Snapshot storage
- Change tracking

### Validation
- Stage-specific rules
- Pre-transition checks
- Auto-fix for common issues
- Clear error messages

### Migration
- Auto-detect old plans
- Infer lifecycle stage
- Preserve all data
- Backup originals
- Migration reports

### CLI Commands
```bash
riotplan lifecycle              # Show current stage
riotplan transition <stage>     # Move to new stage
riotplan approve               # Approve for execution
riotplan revise --type major   # Create revision
riotplan complete --outcome    # Mark as done
riotplan archive               # Move to cold storage
riotplan idea create           # Create new idea
riotplan shape add-approach    # Add approach to shaping
```

### MCP Integration
- `riotplan_transition` tool
- `riotplan_revise` tool
- `riotplan_approve` tool
- `riotplan_complete` tool
- `riotplan://lifecycle/{path}` resource
- `riotplan://revisions/{path}` resource
- Lifecycle-aware prompts

## File Structure

```
plan-name/
  LIFECYCLE.md          # NEW: Lifecycle state and history
  SUMMARY.md            # Existing
  EXECUTION_PLAN.md     # Existing (updated to reference lifecycle)
  STATUS.md             # Existing (updated to reference lifecycle)
  IDEA.md              # NEW: For idea stage
  SHAPING.md           # NEW: For shaping stage
  plan/                # Existing step files
    01-step.md
    ...
  .revisions/          # NEW: Revision snapshots
    1.0/
    2.0/
```

## Success Criteria

- ✅ All 8 stages implemented
- ✅ State transitions validated
- ✅ Revision system tracks changes
- ✅ Migration preserves data
- ✅ CLI intuitive and complete
- ✅ MCP integration seamless
- ✅ Documentation comprehensive
- ✅ Tests cover >90% of code
- ✅ Real-world usage validates design

## Benefits

### For Users
- **Explore without commitment** - Ideas don't require execution
- **Validate before committing** - Catch issues early
- **Explicit decisions** - Know when you've committed
- **Learn through revision** - Adapt during execution
- **Preserve knowledge** - Archive with lessons learned

### For AI Assistants
- **Structured thinking** - Clear stages for different types of work
- **State awareness** - Know what's allowed in each stage
- **Progress tracking** - Maintain context across sessions
- **Revision support** - Handle changing requirements
- **Knowledge retention** - Learn from completed plans

## Next Steps

1. Review this plan
2. Start with Step 01: Define Lifecycle Types
3. Work through phases sequentially
4. Test thoroughly at each step
5. Dogfood the system during development
6. Gather feedback and iterate
7. Release when validated

---

**Created**: 2026-01-29
**Status**: Ready to begin execution
**Location**: `/Users/tobrien/gitw/kjerneverk/plans/plan-lifecycle/`
