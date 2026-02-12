# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Agent-Powered Build with Index Injection

**Description**: Replace the one-shot generatePlan() call with a two-phase approach: (1) Before generation, auto-build the project index and inject a CODEBASE CONTEXT section into the prompt with package list, key files, and exported interfaces. (2) Replace the single LLM call with an AgentLoop session that has read-only file tools (read_file, list_files, grep, query_index) plus a special write_plan tool. The agent explores the codebase, reads relevant files, and builds the plan iteratively. The write_plan tool accepts the GeneratedPlan JSON structure and signals completion. The existing buildPlan() in build.ts orchestrates this: loads artifacts, indexes project, creates agent loop, runs it, collects plan from write_plan result, then writes all output files (SUMMARY.md, etc.) exactly as before.

**Tradeoffs**:
- Pro: Plans will reference actual files, interfaces, and code patterns
- Pro: Reuses existing AgentLoop and tool infrastructure
- Pro: Index injection is cheap (~500ms) and provides immediate context
- Pro: write_plan tool avoids JSON parsing issues from text stream
- Pro: Backward compatible - same output files, same MCP interface
- Con: Agent-powered generation takes longer (3-5 min vs 30 sec for one-shot)
- Con: More token consumption per plan generation
- Con: Need to handle agent iteration limits and potential failures gracefully
- Con: Two code paths - agent mode when tools available, fallback to one-shot when not

**Assumptions**:
- AgentLoop can be used programmatically without a terminal/interactive session
- Read-only file tools are sufficient - the agent doesn't need to write during exploration
- The project indexer cache persists across the explore → build transition within a CLI session
- A write_plan tool can cleanly collect structured JSON output from the agent


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Agent-Powered Build with Index Injection

**Reasoning**: This is the only approach that addresses both user requirements (agent-powered build + index integration) while reusing existing infrastructure. The tradeoffs of longer generation time and more tokens are acceptable because plan quality is the primary goal.

**Selected At**: 2026-02-12T16:56:09.326Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-12T16:55:49.420Z
**Next**: Select an approach and transition to 'built'
