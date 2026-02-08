# Narrative: Step 2 execution - designing behavioral instruction text

**Date**: 2026-02-07T21:39:49.290Z
**Source**: typing
**Speaker**: assistant

---

Designed the behavioral preamble text for MCP tool descriptions.

FINAL DELIVERABLE (universal preamble, 24 words):
"[RiotPlan] You are in plan development mode. Capture insights using RiotPlan tools—do not implement code changes. Ask before transitioning stages."

DESIGN DECISIONS:
1. Used bracketed [RiotPlan] prefix for visual salience - models notice bracketed markers
2. Chose "plan development mode" to establish explicit mode distinct from execution
3. Direct instruction "Capture insights using RiotPlan tools" addresses failure mode #1 (forgetting to update)
4. Clear prohibition "do not implement code changes" addresses failure mode #2 (switching to execution)
5. "Ask before transitioning stages" addresses autonomous stage jumps
6. Kept under 25 words to avoid being skipped/deprioritized by models

REJECTED ALTERNATIVES:
- Stage-specific variants (idea/shaping/execution) - added complexity, universal preamble covers all cases
- Longer explanatory text - risk of models ignoring verbose descriptions
- Softer language ("please consider") - not assertive enough for behavior change

STAGE-SPECIFIC VARIANTS (saved for future if needed):
- Idea: "[RiotPlan] You are exploring an idea—capture all thinking, do not implement. Ask before moving to shaping."
- Shaping: "[RiotPlan] You are shaping approaches—compare tradeoffs, do not implement. Ask before selecting."
- Execution: "[RiotPlan] You are executing a plan. Follow the steps, mark progress, report blockers."
