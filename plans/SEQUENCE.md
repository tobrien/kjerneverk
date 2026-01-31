# Plan Execution Sequence

**Created**: 2026-01-31  
**Purpose**: Track active plans and execution order

## Plans Overview

### 1. fix-lifecycle-transitions
**Status**: ⬜ PLANNING  
**Priority**: HIGH (blocks workflow)  
**Location**: `/plans/fix-lifecycle-transitions/`

**What it does**: Fixes the workflow bug where creating a plan from a shaping directory creates a duplicate directory instead of creating plan files in the existing directory.

**Key changes**:
- Add `riotplan_transition` tool (forward/backward stage transitions)
- Make `riotplan_create` smarter (detect existing idea/shaping directories)
- Add `riotplan_build` tool (transition to built + create plan files in existing directory)

**Why first**: This fixes a critical workflow bug that affects how plans are created. Should be done before working on other plans to ensure smooth workflow.

**Steps**: 5 steps
1. Add Transition Tool
2. Make Create Tool Smart
3. Add Build Tool
4. Update Tool Integration
5. Testing & Documentation

---

### 2. global-riotplan-rules
**Status**: ⬜ PLANNING  
**Priority**: MEDIUM (feature implementation)  
**Location**: `/plans/global-riotplan-rules/`

**What it does**: Implements project-specific plan rules system. Allows users to define rules for plan creation and validation that are automatically applied.

**Key changes**:
- Extend config schema with `planRules` and `validationRules` (arrays of strings)
- Inject creation rules into plan generator
- Run validation rules after plan creation and during feedback iterations

**Why second**: This is a feature implementation. Can be done after the workflow fix, or in parallel if needed.

**Steps**: 6 steps
1. Extend Config Schema
2. Update Plan Generator
3. Create Validation Runner
4. Integrate into Plan Creation
5. Integrate into Feedback Flow
6. Testing & Documentation

---

### 3. project-voice-tone
**Status**: ⬜ IDEA (exploration complete, set aside)  
**Priority**: MEDIUM (feature implementation)  
**Location**: `/plans/project-voice-tone/`

**What it does**: Implements project-level voice, tone, and style configuration system. Supports hierarchical configuration (home → project), multiple voices/tones per user, auto-generation from existing work, and integration with document creation.

**Key features**:
- Hierarchical configuration (walk-up pattern like RiotPlan)
- Multiple voices/tones with identifiers (personal vs corporate)
- Style component (quirks, rules, profanity level, reading level)
- Auto-generation from existing documents (analyze 100 blog posts to derive style)
- Industry-standard dimensions (Nielsen Norman Group four dimensions)
- Reading level targeting (Flesch-Kincaid)

**Why third**: This is a substantial feature that builds on stable workflow. Currently in IDEA stage with exploration complete. Set aside for now.

**Research completed**:
- Voice vs Tone vs Style definitions (with citations)
- Industry standards (Nielsen Norman Group four dimensions)
- Reading level measurement (Flesch-Kincaid)
- Hierarchical config pattern (RiotPlan walk-up)

**Steps**: TBD (needs shaping)

---

## Recommended Execution Order

1. **fix-lifecycle-transitions** (do this first)
   - Fixes workflow bug
   - Enables proper plan creation from idea/shaping directories
   - Should be quick (5 steps)

2. **global-riotplan-rules** (do this second)
   - Feature implementation
   - Builds on stable workflow
   - 6 steps, more complex

3. **project-voice-tone** (set aside for now)
   - Currently in IDEA stage
   - Exploration complete, ready for shaping when time permits
   - Substantial feature, will need detailed planning

## Notes

- fix-lifecycle-transitions and global-riotplan-rules are currently in PLANNING status
- project-voice-tone is in IDEA stage, set aside
- Use RiotPlan tracking tools (`riotplan_step_start`, `riotplan_step_complete`) when executing
- Plans can be executed independently, but fix-lifecycle-transitions should come first for better workflow

---

*Last updated: 2026-01-31*
