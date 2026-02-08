# Narrative: User clarifications on evidence gathering

**Date**: 2026-01-31T17:21:20.633Z
**Source**: typing
**Speaker**: user

---

User provided critical clarifications: Evidence capture should happen when user explicitly asks for research ('go look up', 'how does this work', 'find a standard'). Don't auto-capture everything - only core things user asks for. Evidence needs metadata (retrieval date, URL, original query) to be useful beyond plan lifetime. Must be implemented as RiotPlan tool/prompt/resource, not Cursor rule, since RiotPlan needs to work in Cursor, Cloud Code, and CLI. Evidence should be exposed as MCP resource. File naming should use best judgment, possibly numbered like prompts. Directory visibility: evidence/ and history/ should not be hidden - they're features, not support files. Example: voice-tone plan where user asked for standards but URLs and sources weren't recorded.
