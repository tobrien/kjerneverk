# Narrative: Step 6 execution - designing Cursor rule content

**Date**: 2026-02-07T22:21:51.273Z
**Source**: typing
**Speaker**: assistant

---

Designed the complete Cursor rule content for .cursor/rules/riotplan.md.

KEY DESIGN DECISIONS:
1. SCOPING: Used globs ["**/plans/**", "**/IDEA.md", "**/SHAPING.md", "**/STATUS.md"] to activate in plan directories and when plan files are visible
2. STRUCTURE: Followed existing rule format in workspace (use-kodrdriv-link.md, definition-of-done.md style)
3. FOUR REQUIRED BEHAVIORS:
   - Do not create Cursor plans (suppress competing planning)
   - Stay in plan development mode (no implementing during exploration)
   - Capture insights in the plan (use RiotPlan tools, don't just discuss)
   - Ask before transitioning stages (explicit consent for stage changes)
4. EXPLICIT DO/DON'T LISTS: Clear actionable guidance
5. EXAMPLE SCENARIOS: Concrete wrong/right examples following workspace convention
6. TONE: Assertive but not hostile, matches existing rules

GLOB PATTERN RATIONALE:
- "**/plans/**" catches any plans directory structure
- Individual file globs catch when user has plan files open even outside plans/ directory
- This ensures rule activates whenever RiotPlan context is visible
