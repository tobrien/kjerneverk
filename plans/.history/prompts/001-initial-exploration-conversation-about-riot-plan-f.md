# Narrative: Initial exploration conversation about Riot Plan file format redesign

**Date**: 2026-02-12T05:27:40.561Z
**Source**: voice
**Speaker**: user

---

Extensive conversation exploring moving Riot Plan from directory-based structure to SQLite binary format. Key insights:

- Current problem: Cursor bypasses Riot Plan MCP tools and edits plan files directly, breaking the conversation history and structured workflow
- Proposed solution: Use SQLite as single binary .plan file format to force all interactions through MCP tools
- SQLite benefits: Public domain, universal language support, handles large files (40MB+), single file portability
- Architecture: Plans become opaque binary files that can only be accessed via MCP server, preserving conversation flow
- Schema considerations: Tables for execution plans, status, plan steps, .history, attachments/evidence as BLOBs
- Threading concerns: SQLite is single-threaded but adequate for local MCP use case
- Migration path: Start simple with SQLite, could move to RocksDB later if concurrency becomes an issue
- Tooling: better-sqlite3 for Node.js, consider custom header for metadata indexing across many plans
- Export capability: Maintain ability to export as Markdown while keeping internal format opaque
