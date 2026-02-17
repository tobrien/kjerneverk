# Narrative: User making key architectural decisions about scope, migration, and API design

**Date**: 2026-02-17T17:40:13.551Z
**Source**: typing
**Speaker**: user

---

The HTTP server doesn't expose all the same tools — use this as a chance to reshape the API and simplify. Leave the local MCP server around for the time being, it might need to live on. Existing file-based plans should be migrated to the SQLite store, no compatibility period. Start by migrating everything in /Users/tobrien/gitw/kjerneverk/plans. riotplan-format is completed but needs to be integrated into RiotPlan. MCP clients connect via a URL that points to the RiotPlan HTTP MCP server.
