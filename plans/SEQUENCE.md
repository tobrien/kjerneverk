# Plan Execution Sequence

**Created**: 2026-01-31  
**Purpose**: Track active plans and execution order

## Plans Overview

### 1. fix-lifecycle-transitions
**Status**: ✅ COMPLETED (2026-01-31)  
**Priority**: HIGH (blocks workflow)  
**Location**: `/plans/fix-lifecycle-transitions/`

**What it does**: Fixes the workflow bug where creating a plan from a shaping directory creates a duplicate directory instead of creating plan files in the existing directory.

**Key changes**:
- Add `riotplan_transition` tool (forward/backward stage transitions)
- Make `riotplan_create` smarter (detect existing idea/shaping directories)
- Add `riotplan_build` tool (transition to built + create plan files in existing directory)

**Completed**: All 5 steps completed (100%)
1. ✅ Add Transition Tool
2. ✅ Make Create Tool Smart
3. ✅ Add Build Tool
4. ✅ Update Tool Integration
5. ✅ Testing & Documentation

**Implementation**: Committed to riotplan@e0e970e

---

### 2. riotplan-sampling
**Status**: ⬜ IDEA  
**Priority**: CRITICAL (adoption blocker)  
**Location**: `/plans/riotplan-sampling/`

**What it does**: Enable RiotPlan to use MCP sampling so it doesn't need its own AI provider when called via MCP - let the calling model do the generation work.

**Core problem**: Users already have Cursor with Claude access. Asking them to set up another API key creates friction and is a "complete blockage of usage."

**Key changes**:
- Auto-detect when RiotPlan is called via MCP
- Use MCP sampling for AI generation instead of direct API calls
- Create reusable `execution-sampling` abstraction
- No API keys needed when using via MCP

**Why second**: This is the biggest usability win. Removes adoption barrier for Cursor users. Should be prioritized after workflow fix.

**Next**: Move to shaping to explore implementation approaches

---

### 3. riotplan-connect-to-idea
**Status**: ⬜ IDEA  
**Priority**: HIGH (core functionality)  
**Location**: `/plans/riotplan-connect-to-idea/`

**What it does**: Make plan generation rooted in agentic exploration of all idea content (IDEA.md, history, prompts, timeline, evidence) - not just model memory.

**Core problem**: Plan generation currently relies on model memory of the conversation, not on agentic exploration of the idea artifacts. This misses "the entire point of RiotPlan."

**Key changes**:
- Plan generation must read IDEA.md, timeline.jsonl, prompts/, evidence/
- Synthesize all structured knowledge into implementation plan
- Memory-based generation becomes fallback, not primary mode
- Plans become reproducible from artifacts alone

**Why third**: This is fundamental to RiotPlan's value proposition. Works best after sampling (#2) is available.

**Next**: Move to shaping to explore implementation approaches

---

### 4. riotplan-gathering-evidence
**Status**: ⬜ IDEA  
**Location**: `/plans/riotplan-gathering-evidence/`

**What it does**: Make RiotPlan more proactive about gathering and recording evidence during idea exploration - code snippets, documents, standards, findings should be captured automatically.

**Core problem**: When user asks "go look up this" or "how does this work?", findings aren't automatically captured as evidence. User has to ask "where is that thing you found?"

**Key changes**:
- Proactively capture evidence when user requests research
- Evidence files include metadata (date, URL, query, source)
- Rename `.evidence/` → `evidence/` and `.history/` → `history/` (make visible)
- Must work across platforms (Cursor, Cloud Code, CLI)

**Why fourth**: Works best after #3 (connect-to-idea) since that plan will read the evidence.

**Next**: Move to shaping to explore implementation approaches

---

### 5. riotplan-losing-focus
**Status**: ⬜ IDEA  
**Location**: `/plans/riotplan-losing-focus/`

**What it does**: Solve the problem of RiotPlan conversations losing focus - models help think through problems but don't consistently update the plan with insights.

**Core problem**: During Q&A sessions, great conversations happen with insights and solutions, but plan doesn't get updated until user points it out. Everything should flow into the plan in real-time.

**Potential solutions**:
- Cursor Rule: "When working with RiotPlan, continuously update the plan"
- Session Context: `riotplan_session_start` tool to set context
- Explicit Workflow: "Let's work on plan X using Q&A" triggers specific mode

**Why fifth**: This is about workflow discipline. Lower priority than core functionality issues.

**Next**: Move to shaping to explore implementation approaches

---

### 6. global-riotplan-rules
**Status**: ⬜ PLANNING (has execution plan)  
**Priority**: MEDIUM (feature implementation)  
**Location**: `/plans/global-riotplan-rules/`

**What it does**: Implements project-specific plan rules system. Allows users to define rules for plan creation and validation that are automatically applied.

**Key changes**:
- Extend config schema with `planRules` and `validationRules` (arrays of strings)
- Inject creation rules into plan generator
- Run validation rules after plan creation and during feedback iterations

**Why sixth**: This is a feature implementation. Lower priority than core workflow and usability issues.

**Steps**: 6 steps
1. Extend Config Schema
2. Update Plan Generator
3. Create Validation Runner
4. Integrate into Plan Creation
5. Integrate into Feedback Flow
6. Testing & Documentation

---

### 7. project-voice-tone
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

**Why seventh**: This is a substantial feature that builds on stable workflow. Currently in IDEA stage with exploration complete. Set aside for now.

**Research completed**:
- Voice vs Tone vs Style definitions (with citations)
- Industry standards (Nielsen Norman Group four dimensions)
- Reading level measurement (Flesch-Kincaid)
- Hierarchical config pattern (RiotPlan walk-up)

**Steps**: TBD (needs shaping)

---

## Recommended Execution Order

### ✅ Completed

1. **fix-lifecycle-transitions** ✅ DONE (2026-01-31)
   - Fixed workflow bug
   - Added lifecycle transition tools
   - All 5 steps completed

### 🎯 Critical Path (Do Next)

2. **riotplan-sampling** (IDEA → needs shaping)
   - **CRITICAL**: Removes adoption barrier for Cursor users
   - No API keys needed when using via MCP
   - Biggest usability win possible
   - Creates reusable execution-sampling abstraction

3. **riotplan-connect-to-idea** (IDEA → needs shaping)
   - **HIGH PRIORITY**: Core to RiotPlan's value proposition
   - Makes plan generation read artifacts, not just memory
   - Plans become reproducible from artifacts
   - "The entire point of RiotPlan"

4. **riotplan-gathering-evidence** (IDEA → needs shaping)
   - Proactive evidence capture during exploration
   - Works best after #3 (connect-to-idea)
   - Includes renaming .evidence/ → evidence/

5. **riotplan-losing-focus** (IDEA → needs shaping)
   - Keeps conversations connected to plans
   - Workflow discipline issue
   - Lower priority than core functionality

### 📋 Feature Implementations (Later)

6. **global-riotplan-rules** (PLANNING → ready to execute)
   - Project-specific plan rules system
   - 6 steps, execution plan ready
   - Can be done anytime

7. **project-voice-tone** (IDEA → set aside)
   - Voice/tone/style configuration
   - Exploration complete, ready for shaping when time permits
   - Substantial feature, will need detailed planning

## Key Insights

**The "Connect-to-Idea" Problem**: Plan #3 is particularly important because it addresses what you called "the entire point of RiotPlan" - the current behavior (memory-based generation) should be the fallback, not the primary mode.

**Sampling as Enabler**: Plan #2 (sampling) is critical because it unblocks usage for Cursor users and creates reusable infrastructure (execution-sampling) that benefits the entire ecosystem.

**Evidence Flow**: Plans #3 and #4 work together - #4 captures evidence proactively, #3 ensures that evidence is actually read and used during plan generation.

## Notes

- **fix-lifecycle-transitions**: ✅ Completed 2026-01-31, all changes committed
- **Plans 2-5**: All in IDEA stage, need shaping before execution
- **global-riotplan-rules**: Has execution plan, ready to execute
- **project-voice-tone**: Set aside, exploration complete
- Use RiotPlan tracking tools (`riotplan_step_start`, `riotplan_step_complete`) when executing
- The critical path is: sampling → connect-to-idea → gathering-evidence → losing-focus

---

*Last updated: 2026-01-31 (after completing fix-lifecycle-transitions)*
