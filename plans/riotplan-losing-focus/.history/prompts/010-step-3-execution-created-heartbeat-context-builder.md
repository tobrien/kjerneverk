# Narrative: Step 3 execution - created heartbeat context builder function

**Date**: 2026-02-07T22:38:23.042Z
**Source**: typing
**Speaker**: assistant

---

Step 3 execution complete. Created src/mcp/heartbeat.ts with generateHeartbeat() function.

IMPLEMENTATION:
- New file: src/mcp/heartbeat.ts (200 lines)
- Reads plan state from LIFECYCLE.md, IDEA.md, and .history/timeline.jsonl
- Extracts: stage, plan code/name, last action
- Generates contextual heartbeat footer with 3-5 lines
- Handles missing/corrupt files gracefully (returns generic reminder)
- Returns null if not in a plan directory (no plan files detected)

OUTPUT FORMAT:
---
📋 RiotPlan Active | Plan: riotplan-losing-focus | Stage: idea | Dir: /path/to/plan
Last: Added note | Next: Continue exploring, add notes/constraints/questions, or move to shaping
⚠️ Stay in plan mode. Capture insights with RiotPlan tools. Do not implement.
---

STAGE-SPECIFIC GUIDANCE:
- idea: Continue exploring, add notes/constraints/questions, or move to shaping
- shaping: Add approaches, compare tradeoffs, or select an approach
- built: Review steps, validate plan, or begin execution
- executing: Complete current step, mark progress, or report blockers

VERIFICATION:
- TypeScript build succeeded
- No compilation errors
- Function exported and ready for integration in Step 4
