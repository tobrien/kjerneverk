# Interactive Plan Creation - Summary

## Executive Summary

This plan implements an interactive plan creation workflow for RiotPlan. Users run `riotplan create`, provide their initial requirements, and the system guides them through either an analysis-first approach (for complex plans) or direct plan generation (for straightforward tasks).

## Philosophy

### Two Modes of Thinking

Plan creation involves two distinct cognitive modes:

1. **Elaboration** (Analysis Phase)
   - Conceptual, philosophical input
   - "What should this do?"
   - "What's the documentation approach?"
   - "What are the principles?"
   - Feedback refines understanding

2. **Amendment** (Plan Phase)
   - Technical, structural input
   - "I don't like how these projects are organized"
   - "This step should come before that one"
   - Feedback refines execution strategy

### Recoverable Process

Planning is often interrupted. Every input should be saved:
- Initial prompt preserved
- Analysis feedback captured
- Plan amendments recorded
- Enables resume after interruption

### Guided but Not Mandatory

Interactive mode helps new users and complex plans. Power users can bypass with flags:
```bash
riotplan create my-feature --direct  # Skip analysis, generate plan
riotplan create my-feature --analyze # Force analysis phase
```

## Target Directory Structure

```
my-feature/
├── my-feature-prompt.md         # Initial prompt (preserved)
├── SUMMARY.md                   # Generated overview
├── EXECUTION_PLAN.md            # Generated execution strategy
├── STATUS.md                    # State tracking
├── analysis/                    # Analysis phase (if used)
│   ├── REQUIREMENTS.md          # Elaborated requirements
│   ├── prompts/                 # Saved elaboration prompts
│   │   ├── 001-initial.md
│   │   └── 002-feedback.md
│   └── PHILOSOPHY.md            # Approach decisions (optional)
├── plan/                        # Step files
│   ├── 01-step.md
│   └── ...
└── amendments/                  # Plan feedback (if used)
    ├── 001-feedback.md
    └── ...
```

## New Commands

| Command | Description |
|---------|-------------|
| `riotplan create <name>` | Interactive guided creation |
| `riotplan elaborate [path]` | Add analysis feedback |
| `riotplan amend [path]` | Add plan feedback |
| `riotplan create --direct` | Skip analysis, generate plan |
| `riotplan create --analyze` | Force analysis phase |

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    riotplan create my-feature               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  "Describe what you want to accomplish:"                    │
│  > User types initial prompt...                             │
│                                                             │
│  [Saved to my-feature/my-feature-prompt.md]                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  "Would you like to:"                                       │
│  [1] Create an analysis first (recommended for complex)     │
│  [2] Generate the plan directly                             │
└──────────┬─────────────────────────────┬────────────────────┘
           │                             │
           ▼                             ▼
┌──────────────────────┐      ┌──────────────────────┐
│   Analysis Phase     │      │   Direct Plan Gen    │
│                      │      │                      │
│ - Generate REQS.md   │      │ - Generate SUMMARY   │
│ - Ask for feedback   │      │ - Generate EXEC_PLAN │
│ - riotplan elaborate │      │ - Generate steps     │
│ - Iterate...         │      │ - Ask for feedback   │
│                      │      │ - riotplan amend     │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           ▼                             │
┌──────────────────────┐                 │
│  "Ready to generate  │                 │
│   plan from analysis"│                 │
│   [Yes/No]           │                 │
└──────────┬───────────┘                 │
           │                             │
           └──────────────┬──────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Plan Ready for Execution                 │
│                                                             │
│  "Run 'riotplan status' to see your plan"                   │
│  "Run 'riotplan step start 01' to begin"                    │
└─────────────────────────────────────────────────────────────┘
```

## Integration Points

- Uses existing `riotplan init` internally
- Works with existing STATUS.md format
- Compatible with `riotplan status`, `riotplan step`
- Builds on existing plan loader/validator

## Success Metrics

1. **Usability**: First-time users can create plans without reading docs
2. **Recoverability**: No input is ever lost
3. **Flexibility**: Power users can bypass interactive mode
4. **Compatibility**: Existing plans continue to work
