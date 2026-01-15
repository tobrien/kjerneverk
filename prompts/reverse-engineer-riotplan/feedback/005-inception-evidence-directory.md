# Feedback: Inception Evidence Directory

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.5 → v0.6
- **Related Files**: 
  - RIOTPLAN_ANALYSIS.md (Plan Structure section)
  - All `what-happened-*.md` files in this directory

## What Was Proposed

The existing plan structure included:
```
{plan-name}/
├── {plan-name}-prompt.md
├── SUMMARY.md
├── EXECUTION_PLAN.md
├── STATUS.md
├── plan/
├── feedback/
└── CHANGELOG.md
```

No directory existed for the **pre-planning evidence** that informs plan creation.

## Feedback Given

> "You see what I did in this inception and elaboration phase, I captured data and supplied a set of files that helped demonstrate what I was after."

The user pointed to 10 `what-happened-*.md` files that documented real experiences with plans:

- `what-happened-in-cardigantime.md`
- `what-happened-in-fjell-logging.md`
- `what-happened-in-kodrdriv-versions.md`
- `what-happened-in-protokoll.md`
- `what-happened-in-riotplan.md`
- `what-happened-in-riotprompt-security.md`
- `what-happened-in-xenocline.md`
- `what-happened-with-offrecord.md`
- `what-happened-with-pressurelid.md`
- `what-happened-with-spotclean.md`

These files served as **evidence** that informed the RiotPlan design. They're not feedback on a plan—they're **input to the inception phase**.

> "I'm wondering if we can add another directory to this plan standards. Maybe 'data' or 'evidence'—come up with a good name for what I did here which was to generate a lot of content that could be fed to the process."

## Discussion

### What Are These Files?

| Characteristic | Description |
|---------------|-------------|
| **Timing** | Created BEFORE or DURING inception, not during revision |
| **Purpose** | Inform understanding, provide examples, document patterns |
| **Nature** | Empirical—based on actual experience |
| **Use** | Fed into the process as raw material |
| **Outcome** | Shapes what the plan will become |

### Name Candidates

| Name | Pros | Cons |
|------|------|------|
| `evidence/` | Clear, simple, captures "proof" nature | Slightly legal-sounding |
| `case-studies/` | Academic, descriptive | Long, formal |
| `groundwork/` | Captures foundational nature | Vague about content |
| `input/` | Functional, clear direction | Too generic |
| `observations/` | Captures empirical nature | Passive-sounding |
| `research/` | Familiar concept | Implies formal methodology |
| `context/` | Describes purpose well | Might conflict with execution context |
| `source-material/` | Descriptive | Long |
| `corpus/` | Academic term for body of material | Obscure |

### Recommendation: `evidence/`

**Why `evidence/`:**
1. **Concise** - Single word, easy to type
2. **Meaningful** - These files ARE evidence that supports the analysis
3. **Distinct** - Different from `feedback/` (which is conversation during revision)
4. **Action-oriented** - You "gather evidence" before making a case
5. **Neutral** - Works for code plans, documents, research, any domain

**Alternative: `groundwork/`**
- More evocative of the preparatory nature
- Implies "work done before the real work"
- Less formal than `evidence`

## Resolution

Add `evidence/` (or `groundwork/`) directory to the standard plan structure for Phase 0 (Inception & Elaboration) materials:

```
{plan-name}/
├── {plan-name}-prompt.md     # Meta-prompt (original requirements)
├── SUMMARY.md                # High-level overview
├── EXECUTION_PLAN.md         # Phase/step organization
├── STATUS.md                 # Current state tracking
├── plan/                     # Individual step files
├── feedback/                 # Deliberation during revision
├── evidence/                 # NEW: Inception phase materials
│   ├── case-001-*.md         # Case studies
│   ├── research-*.md         # Research findings
│   ├── example-*.md          # Examples that informed design
│   └── analysis-*.md         # Analysis documents
└── CHANGELOG.md              # Revision history
```

### Evidence vs Feedback

| Aspect | `evidence/` | `feedback/` |
|--------|-------------|-------------|
| **When** | Before/during inception (Phase 0) | During revision (Phase 2) |
| **What** | Case studies, research, examples | Conversations, debates, decisions |
| **Purpose** | Inform what to build | Refine how it's built |
| **Source** | Observation, research, experience | Human-AI dialogue |
| **Timing relative to plan** | Pre-plan or early plan | During plan iteration |

## Changes Made

1. Updated `RIOTPLAN_ANALYSIS.md`:
   - Added `evidence/` to Standard Directory Layout
   - Added explanation of evidence directory purpose
   - Distinguished evidence from feedback
   - Added to file purposes table

2. Updated Requirements:
   - Added evidence directory support

## Open Questions

1. Should evidence files have a naming convention (like `what-happened-*.md` or `case-*.md`)?
2. Can evidence be added after plan creation, or only during inception?
3. Should evidence be linkable from specific plan steps ("this step is based on evidence/case-003.md")?

## Meta-Observation

This feedback record itself demonstrates the difference between `evidence/` and `feedback/`:
- The `what-happened-*.md` files are **evidence** (pre-existing observations)
- This document (`005-inception-evidence-directory.md`) is **feedback** (conversation about the plan)

The user's act of pointing to those files and asking "what should we call this?" is itself a feedback moment that should be captured—which is what we're doing now.

