# Narrative: User confirming architecture and noting the control advantage of CLI over MCP

**Date**: 2026-02-09T14:41:17.219Z
**Source**: typing
**Speaker**: user

---

User confirms the architecture matches their vision. Adds an important observation: because we're spinning up the LLM ourselves and defining the tool set, we have MORE control than in Cursor. We can prevent the model from editing plan files directly — it can only modify plans through RiotPlan's structured tools. This is a strict, enforceable boundary that's actually harder to achieve in Cursor where the model has access to all of Cursor's native tools.
