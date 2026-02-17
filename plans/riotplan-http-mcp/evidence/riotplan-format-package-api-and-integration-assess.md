# Evidence: riotplan-format package API and integration assessment

**Source**: codebase analysis
**Original Query**: Where is riotplan-format and what does its API look like?
**Added**: 2026-02-17T17:43:14.014Z
**Gathering Method**: model-assisted

---

@kjerneverk/riotplan-format exists at /Users/tobrien/gitw/kjerneverk/riotplan-format/ (not in Cursor workspace but on disk).

**Package API:**
- StorageProvider interface: full CRUD for metadata, steps, files, timeline, evidence, feedback, checkpoints, search
- SqliteStorageProvider: fully implemented using better-sqlite3
- DirectoryStorageProvider: skeleton (throws "not implemented" — meant to be extended by main riotplan package)
- DefaultStorageProviderFactory: creates appropriate provider based on path
- PlanMigrator + MigrationValidator: bidirectional migration between formats
- renderPlanToMarkdown(): rendering support
- FormatConfig, SqliteConfig, DirectoryConfig: configuration types
- File extension: .plan for SQLite files

**Integration path (from plan reflections):**
1. Add @kjerneverk/riotplan-format as dependency to riotplan
2. Extend DirectoryStorageProvider with existing file loading logic
3. Update loadPlan() to use DefaultStorageProviderFactory
4. Add --format flag to CLI commands
5. Test both formats with existing MCP tools

**Key detail:** 127 tests passing, 80% coverage. Package version 1.0.1-dev.0. Uses better-sqlite3 (synchronous, native bindings).