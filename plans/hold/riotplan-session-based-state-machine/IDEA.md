# Idea: riotplan-session-based-state-machine

## Core Concept

Add explicit session-based state machine to RiotPlan to enforce mode discipline and support autonomous execution. Second phase of the losing-focus fix after Phase 1 (Embedded Behavioral Layer) is tested.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- PHASE 2 RATIONALE: Would be considered ONLY if Phase 1 (Embedded Behavioral Layer) proves insufficient. The trigger would be: models still drifting from plan mode despite behavioral preambles in tool descriptions and heartbeat footers in responses.
- PHASE 2 CONCEPT: Add explicit session-based state machine to enforce mode discipline at the server level. Instead of relying on behavioral instructions in text, the MCP server tracks what mode you're in (idea/shaping/execute) and enforces it through tool responses and behavior.
- CORE COMPONENTS (if built): riotplan_session_start tool to establish session context (plan path + mode + interactivity level), server-side session state tracking, mode-aware tool responses that warn on off-mode behavior, explicit stage transitions with user consent, autonomous execution mode support (mode=execute, interactive=false).
- KEY BENEFIT: Moves enforcement from "text suggestions" to "server-enforced state machine". The MCP server knows your mode and can actively prevent off-mode behavior. Session state persists across tool calls within a conversation, giving stronger guarantees than stateless behavioral instructions.
- TRADEOFF: More complexity (new tools, server state management, session lifecycle) vs. simpler Phase 1. Phase 1 is lower-friction and may be sufficient. Phase 2 should only be built if Phase 1 proves inadequate in practice.

## Constraints

- _Add constraints..._
- Only build Phase 2 if Phase 1 is deployed and tested and proves insufficient. Phase 1 ships first as lower-friction solution.
- Session state is ephemeral - resets between Cursor conversations. This is acceptable because the model's context resets anyway. Persistence is a non-goal for Phase 2.

## Questions

- _Add questions..._
- Does Phase 1 (behavioral preambles + heartbeat footers) sufficiently solve the losing-focus problem, or do models continue to drift even with those mechanisms in place?
- If Phase 2 is needed, what is the primary failure mode? (Forgetting to update plan? Switching to execution mode? Ignoring RiotPlan tools?)

## Evidence

_Attach relevant documents, images, or files_

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-02-08T04:03:12.195Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
