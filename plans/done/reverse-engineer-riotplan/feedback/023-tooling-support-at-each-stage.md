# Feedback 023: Tooling Support at Each Lifecycle Stage

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.19 → v0.20
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review noted an opportunity:

> "It also opens opportunities for tooling support at each step (for example, a command like `riotplan review` could initiate a feedback capture session, or `riotplan execute` could run the steps and update statuses)."

## Feedback Given

**Tim's response:**

"This is interesting, using the tool to manage feedback capture and revision cycles."

## Discussion

### The Insight: Lifecycle-Aware Commands

The CLI shouldn't just be a collection of utilities—it should understand *where you are in the plan lifecycle* and offer appropriate support.

```
┌─────────────────────────────────────────────────────────────────┐
│                    LIFECYCLE-AWARE TOOLING                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 0: INCEPTION                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ $ riotplan inception start                               │    │
│  │   → Creates evidence/ directory                          │    │
│  │   → Prompts for initial ideas                            │    │
│  │   → "What problem are you trying to solve?"              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  PHASE 1: CREATION                                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ $ riotplan plan init my-feature                          │    │
│  │   → Creates plan structure                               │    │
│  │   → Uses evidence/ to inform creation                    │    │
│  │   → "Based on your evidence, here's a suggested outline" │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  PHASE 2: REVIEW                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ $ riotplan review                                        │    │
│  │   → INITIATES A FEEDBACK CAPTURE SESSION                 │    │
│  │   → Opens interactive review mode                        │    │
│  │   → "What's your feedback on this plan?"                 │    │
│  │   → Auto-creates feedback/00X-*.md                       │    │
│  │   → Tracks what was discussed                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  PHASE 3: EXECUTION                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ $ riotplan execute                                       │    │
│  │   → Runs steps in order                                  │    │
│  │   → AUTO-UPDATES STATUS.md after each step               │    │
│  │   → Runs quality gates                                   │    │
│  │   → Captures execution notes                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  PHASE 4: VERIFICATION                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ $ riotplan verify                                        │    │
│  │   → Runs integration checks                              │    │
│  │   → "Is the work actually integrated?"                   │    │
│  │   → Dead code detection                                  │    │
│  │   → End-to-end verification                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### New Commands: Phase-Aware

| Command | Phase | What It Does |
|---------|-------|--------------|
| `riotplan inception` | 0 | Start evidence gathering, explore the problem |
| `riotplan plan init` | 1 | Create plan structure |
| `riotplan review` | 2 | **Initiate feedback capture session** |
| `riotplan revise` | 2 | Apply feedback, create new version |
| `riotplan execute` | 3 | Run steps, **auto-update STATUS.md** |
| `riotplan verify` | 4 | Check integration, run quality gates |
| `riotplan complete` | 5 | Mark done, generate summary |
| `riotplan archive` | 6 | Move to historical reference |

### The `riotplan review` Command

This is the key insight—**review initiates feedback capture**:

```bash
$ riotplan review

┌─────────────────────────────────────────────────────────────────┐
│  REVIEW SESSION: my-feature                                      │
│  Plan version: v0.3                                              │
│  Last reviewed: 2026-01-13                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  What would you like to review?                                  │
│                                                                  │
│  [1] Full plan overview                                          │
│  [2] Specific step                                               │
│  [3] Dependencies and blockers                                   │
│  [4] Recent changes since last review                            │
│                                                                  │
│  Or type feedback to start capturing...                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

> The scope of Step 3 seems too broad

Creating feedback record: feedback/004-step3-scope.md

What's the concern? (Ctrl+D to finish)
> Step 3 covers both API design and implementation. These should be 
> separate steps so we can get API feedback before building.

Feedback captured. Would you like to:
[1] Continue reviewing
[2] Apply this feedback now (create revision)
[3] Save and exit

> 2

Applying feedback...
- Split Step 3 into Step 3a (API design) and Step 3b (implementation)
- Updated EXECUTION_PLAN.md
- Incremented version to v0.4
- Committed: "plan(my-feature): split step 3 per review feedback"

Review session complete. 1 feedback record created, 1 revision applied.
```

### The `riotplan execute` Command

Execution should **auto-update status**:

```bash
$ riotplan execute 3

Executing Step 3: API Design
────────────────────────────

Pre-conditions:
  ✅ Step 1 complete
  ✅ Step 2 complete
  ✅ No blockers

Running quality gates...
  ✅ Lint passed
  ✅ Tests passed
  ✅ Type check passed

Step 3 execution complete.

Updating STATUS.md...
  Step 3: ⬜ pending → ✅ completed

Commit changes? [Y/n] y
Committed: "feat(my-feature): complete step 3 - API design"

Next step: Step 4 (Implementation)
Continue? [Y/n]
```

### Why This Matters

Currently, users:
1. Work on a step
2. Manually update STATUS.md
3. Manually commit
4. Manually remember to capture feedback

With lifecycle-aware tooling:
1. `riotplan execute` handles status + commit
2. `riotplan review` handles feedback capture
3. The tool manages the workflow, user focuses on the work

### Integration with External Review (R24)

The review command could also support external review:

```bash
$ riotplan review --external

Rendering plan for external review...
  → Created: my-feature-v0.3-review.pdf

Send this to an external reviewer (another AI, colleague, etc.)
When you receive feedback, import it:

  $ riotplan review import feedback.docx --source "ChatGPT Deep Research"

Or continue with interactive review:
  $ riotplan review
```

## Resolution

1. Add lifecycle-aware command descriptions to CLI section
2. Document `riotplan review` as feedback capture initiator
3. Document `riotplan execute` as auto-updating status
4. Add `riotplan inception` and `riotplan verify` commands
5. Show how commands map to lifecycle phases

## Changes Made

1. Add "Lifecycle-Aware Commands" section to CLI documentation
2. Expand `riotplan review` command specification
3. Expand `riotplan execute` to show auto-status-update
4. Add new commands: `inception`, `revise`, `verify`, `complete`

## The Insight

> **The CLI should know where you are in the lifecycle and offer appropriate support at each stage.**

This transforms RiotPlan from "a bunch of commands" to "a workflow guide."

