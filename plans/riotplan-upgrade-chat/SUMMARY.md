# RiotPlan Upgrade Chat — Plan Summary

## Overview

The end goal is **IDE independence**: a user should be able to run `riotplan explore` from a bare terminal, go through the full idea → shape → build lifecycle, and produce a plan at the same quality as using RiotPlan through Cursor with Opus.

The main quality gap is in `rp_build`, which currently makes a one-shot LLM call with no codebase access. This plan upgrades it to an agent-powered generation process: the agent gets read-only codebase tools (read_file, list_files, grep, query_index) and iteratively explores the project before generating a plan. A project indexer (~500ms) provides immediate structural context. Plans generated this way will reference actual files, interfaces, and code patterns instead of abstract placeholders.

Additionally, the plan adds configurable model selection so the build step can use a more capable model (e.g., opus) even if the conversational explore phase uses a faster model (sonnet).

## Selected Approach: Agent-Powered Build with Index Injection

Two-phase approach:
1. **Index injection**: Auto-build project index and inject a `== CODEBASE CONTEXT ==` section into the prompt with package list, key files, and exported interfaces
2. **Agent-powered generation**: Replace one-shot LLM call with `AgentLoop` session that has read-only tools + a `write_plan` tool for structured output

## Key Architectural Decisions

1. **Reuse AgentLoop** — The same `AgentLoop` from `@kjerneverk/agentic` that powers CLI commands. No new agent infrastructure.
2. **write_plan tool** — Agent outputs the plan via a tool call (not text parsing). Cleaner, avoids JSON parsing issues.
3. **Graceful fallback** — Agent mode when tools available (CLI), enhanced one-shot when not (MCP). Both get codebase context.
4. **Same output format** — Identical output files (SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, plan/*.md, PROVENANCE.md). Backward compatible.
5. **Cached index** — Project index built by `riotplan explore` is reused by `rp_build` in the same session. Zero extra cost.

## Packages Affected

- **@kjerneverk/riotplan** — `src/ai/generator.ts` (new `generatePlanWithAgent()`), `src/mcp/tools/build.ts` (orchestration), `src/ai/project-context.ts` (NEW), `src/ai/tools/write-plan.ts` (NEW), `src/ai/prompts/build-agent.md` (NEW), `src/cli/terminal.ts` (progress display)

## Success Criteria

- [ ] Step 1: Create write_plan Tool and Agent Generation Prompt
- [ ] Step 2: Create generatePlanWithAgent() in generator.ts
- [ ] Step 3: Inject Project Index Context into Build
- [ ] Step 4: Update build.ts to Use Agent-Powered Generation
- [ ] Step 5: Add Progress Feedback and Validate End-to-End
- [ ] Step 6: Model Selection and Full CLI Flow Validation

---

*Plan created: 2026-02-12*
