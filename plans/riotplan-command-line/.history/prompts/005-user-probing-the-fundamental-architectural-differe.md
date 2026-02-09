# Narrative: User probing the fundamental architectural difference between MCP model and CLI model

**Date**: 2026-02-09T14:37:37.513Z
**Source**: typing
**Speaker**: user

---

User asking a critical architectural question about how the CLI agent differs from the MCP/Cursor model. In Cursor, the calling model (e.g., Opus 4.6) does the thinking — RiotPlan just provides tools (accounting/organization) and prompts (telling the model what to do). The model in Cursor calls RiotPlan tools but also has access to Cursor's own tools (file read, grep, shell, etc.). When running from the command line, is the CLI agent doing the same thing — is it the same architecture where one model does the thinking and RiotPlan provides tools?
