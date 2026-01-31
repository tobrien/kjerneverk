# Narrative: Identifying critical usability obstacle

**Date**: 2026-01-31T17:33:17.665Z
**Source**: typing
**Speaker**: user

---

User hit a critical usability obstacle: riotplan_generate failed because it needs Anthropic provider package and API keys. But user is already using RiotPlan via MCP in Cursor - they're already talking to Claude. This revealed a fundamental design issue: RiotPlan has two modes (standalone CLI vs MCP), but currently requires AI provider setup for both. User identified this as THE major adoption barrier: 'If I'm already using cursor and I want to use riot plan, I don't want to have to set up another account to get an API key.' Solution: Use MCP sampling to let the calling model do generation work. RiotPlan sends prompts back to the model via sampling, receives results, incorporates them. No duplicate API keys needed. This would make RiotPlan seamless for Cursor users while keeping standalone mode functional.
