# RiotPlan Implementation Plan

## Overview

This plan implements RiotPlan—a framework for managing **long-lived, stateful AI workflows** (plans). Based on comprehensive analysis captured in `RIOTPLAN_ANALYSIS.md`, RiotPlan addresses a core problem: managing complex, multi-step, cross-session work is cognitively demanding. Plans evolve through multiple revisions, spawn new projects, and require persistent tracking across sessions and repositories.

## Philosophy

> **RiotPlan preserves deliberation, not just decisions.**

A plan is not a static document—it's the crystallized result of a process. That process (inception, feedback, revision, debate, execution, reflection) is itself valuable. RiotPlan captures:

- What was proposed
- What feedback was given
- What was changed as a result
- Why the change was made
- Who was involved

## Core Value Proposition

| Pain Point | Current State | With RiotPlan |
|------------|---------------|---------------|
| **Context recovery** | 2+ hours/day reconstructing "where was I?" | 10 seconds via `riotplan dashboard` |
| **Lost conversations** | Decisions vanish when tools close | Preserved in `feedback/` records |
| **Plan relationships** | Held in human memory | Tracked in dependency graph |
| **Status tracking** | Manual STATUS.md updates | Auto-updated on step completion |
| **Cross-repo coordination** | Mental gymnastics | Single dashboard across all repos |

## Technology Stack

Following kjerneverk patterns:

- **Node.js**: >=24.0.0
- **TypeScript**: 5.8.x with ES2024 target
- **Build**: Vite 7.x
- **Testing**: Vitest
- **Linting**: ESLint
- **Package Scope**: `@riotprompt/*`
- **License**: Apache-2.0
- **Module System**: ESM only (`"type": "module"`)

## Success Criteria

1. **Zero-Config Start**: `riotplan init my-feature` creates a valid plan immediately
2. **Context Recovery**: `riotplan status` tells you exactly where you are
3. **Blocker Visibility**: Blocked work is immediately obvious
4. **Cross-Plan Awareness**: Dependencies across projects are tracked
5. **Human-Readable**: Plans work without riotplan installed
6. **Feedback Capture**: Deliberation is preserved as natural byproduct

## Scope

### In Scope (v1.0)

- Core plan management (create, load, validate)
- Status tracking (parse/generate STATUS.md)
- Step operations (add, remove, block, complete)
- Feedback capture (create feedback records)
- Dependency management (within-plan, cross-plan)
- Multi-plan dashboard
- CLI for all operations
- Starter templates (feature, bugfix, content, etc.)
- Document rendering (PDF, HTML, DOCX)

### Out of Scope (v1.0)

- Real-time collaborative editing (Git provides collaboration)
- Cloud sync (all local)
- AI plan generation (RiotPlan manages plans, doesn't create them)
- Mobile app
- Hosted sharing with URLs
- Semantic search / RAG (Phase 4-5)

## Existing Foundation

The following exist with stub implementations:

- `@riotprompt/riotplan` - Core library with types defined
- `@riotprompt/riotplan-cli` - CLI with stub commands

## Evidence Base

This plan is based on:

- `RIOTPLAN_ANALYSIS.md` - Comprehensive analysis document (3,400+ lines)
- 10 evidence files (`what-happened-*.md`) from real plan executions
- 31 feedback records documenting the analysis evolution
- External critical review from ChatGPT 5.2 Pro Deep Research

## Related Plans

- `reverse-engineer-riotplan` - The analysis that produced this implementation plan
- `big-splitup` - Example of plan spawning multiple projects
- `secure-riotprompt` - Example of cross-project dependencies

---

*Plan created: 2026-01-14*
*Based on: RIOTPLAN_ANALYSIS.md v0.28*

