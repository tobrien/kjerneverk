# Meta-Prompt: Implement RiotPlan

## Context

You are implementing RiotPlan—a framework for managing long-lived, stateful AI workflows (plans). This plan was generated from comprehensive analysis documented in `RIOTPLAN_ANALYSIS.md`.

## The Problem

Managing complex, multi-step, cross-session work is cognitively demanding. Plans evolve through multiple revisions, spawn new projects, and require persistent tracking across sessions and repositories. Most critically: the deliberation, feedback, and reasoning that shapes plans is lost when conversations end.

## The Solution

RiotPlan captures:
- What was proposed
- What feedback was given
- What was changed as a result
- Why the change was made
- Who was involved

## Technical Requirements

- **Node.js**: >=24.0.0
- **TypeScript**: 5.8.x with ES2024 target
- **Build**: Vite 7.x
- **Testing**: Vitest with >80% coverage
- **Linting**: ESLint
- **Module System**: ESM only (`"type": "module"`)
- **Package Scope**: `@riotprompt/*`

## Existing Foundation

Two packages already exist with stub implementations:
- `@riotprompt/riotplan` - Core library with types
- `@riotprompt/riotplan-cli` - CLI with stub commands

## Key Principles

1. **Feedback capture is day-one**: Not a future feature
2. **Progressive enhancement**: Works with existing plans
3. **Human-readable**: Plans work without riotplan installed
4. **File-based state**: No database, just markdown
5. **Git is the collaboration layer**: No built-in real-time sync

## Phase Structure

| Phase | Steps | Focus |
|-------|-------|-------|
| Phase 1 | 01-04 | Foundation: Types, loading, creation, feedback |
| Phase 2 | 05-08 | Status & Steps: Parsing, generation, operations, validation |
| Phase 3 | 09-12 | CLI Foundation: Architecture, plan/status/feedback commands |
| Phase 4 | 13-16 | Dependencies & Dashboard: Internal, external, registry, dashboard |
| Phase 5 | 17-20 | Templates & Rendering: Templates, commands, renderer, render commands |
| Phase 6 | 21-24 | Advanced: History, retrospectives, providers, documentation |

## Quality Gates

After each step:
1. `npm run lint` passes
2. `npm run test` with >80% coverage
3. `npm run build` produces valid output
4. Works with existing plans in kjerneverk

## Evidence

This plan is based on:
- `../reverse-engineer-riotplan/RIOTPLAN_ANALYSIS.md` - Comprehensive analysis (3,400+ lines)
- 10 evidence files documenting real plan execution
- 31 feedback records documenting the analysis evolution

## Success Criteria

1. **Zero-Config Start**: `riotplan init my-feature` creates a valid plan
2. **Context Recovery**: `riotplan status` shows exactly where you are
3. **Blocker Visibility**: Blocked work is immediately obvious
4. **Feedback Capture**: Deliberation is preserved automatically
5. **Human-Readable**: Plans work without riotplan installed

---

*For detailed requirements, see RIOTPLAN_ANALYSIS.md*
*For step-by-step instructions, see EXECUTION_PLAN.md*
*For current progress, see STATUS.md*

