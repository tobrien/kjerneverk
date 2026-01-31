# Narrative: Complete solution vision

**Date**: 2026-01-31T17:38:56.881Z
**Source**: typing
**Speaker**: user

---

User provided complete vision for solution: RiotPlan auto-detects MCP context and automatically uses sampling for all AI operations. Create 'execution-sampling' project - sampling as the uber/omni provider that works across MCP environments. Key insight: telling Cursor users 'you need an OpenAI key' is COMPLETE BLOCKAGE of usage. Solution must be: run it, it senses MCP, uses sampling, just works. If sampling unavailable, clear error message explaining what's needed. This pattern is reusable across many projects. Critical first step: verify MCP sampling actually works and is consistent across Cursor, Claude Code, GitHub Copilot. Need to understand the sampling API before building on it.
