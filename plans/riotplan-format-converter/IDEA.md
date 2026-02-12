# Idea: riotplan-format-converter

## Core Concept

Build a standalone riotplan-format project that provides command-line tools to convert between directory-based RiotPlan formats and new SQLite-based .rp files. Includes bidirectional conversion utilities and integration path for the main riotplan project.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Project Structure: This will be a standalone TypeScript/Node.js project (riotplan-format) with CLI tools that can convert between directory-based RiotPlan structures and SQLite .rp files. The project should be independent but designed for eventual integration into the main riotplan codebase.
- Command-line Interface: Two main commands needed: 1) `rp-convert dir-to-file /path/to/plan-directory output.rp` - converts existing directory-based plan to .rp file, 2) `rp-convert file-to-dir input.rp /path/to/output-directory` - extracts .rp file back to directory structure for compatibility/debugging.
- File Extension Decision: Using .rp extension instead of .plan for the SQLite files. This is shorter, more distinctive, and avoids potential conflicts with other planning tools that might use .plan extensions.
- Implementation Approach: Start with a minimal schema that mirrors the current directory structure exactly - plans table (metadata), plan_files table (markdown content), plan_steps table (numbered steps), timeline_events table (conversation history). Focus on perfect round-trip conversion first, optimization later.
- Project Layout: riotplan-format/ with src/cli/ for command tools, src/schema/ for SQLite DDL and migrations, src/converter/ for bidirectional conversion logic, tests/ with fixture plans for validation, and package.json with CLI bin scripts.
- Testing Strategy: Create test fixtures from existing riotplan examples, build automated round-trip tests (dir -> .rp -> dir), validate file content matches exactly, and test edge cases like large files, binary attachments, complex markdown with frontmatter.

## Constraints

- _Add constraints..._
- Must preserve all data during conversion - no information loss between directory and .rp file formats
- Must use better-sqlite3 library for Node.js implementation (synchronous, performant)
- Command-line tools must work independently without requiring full riotplan installation
- Must handle large plans with conversation history (40MB+) and binary attachments efficiently
- Integration path must be designed to eventually replace directory-based storage in main riotplan project

## Questions

- _Add questions..._
- What specific SQLite schema should we use? How do we map current directory structure (SUMMARY.md, STATUS.md, plan/ subdirectory, .history/, evidence/, feedback/) into database tables?
- Should we preserve the exact markdown format when converting back to directories, or is it acceptable to have slight formatting differences as long as content is identical?
- How do we handle binary evidence files and attachments? Store as BLOBs in SQLite or keep separate file references?
- What's the integration strategy? Should the main riotplan project eventually depend on riotplan-format, or should the format logic be merged back in?
- How do we validate conversion fidelity? Should we build automated tests that convert directory -> .rp -> directory and verify identical output?

## Evidence

_Attach relevant documents, images, or files_
- [Previous comprehensive exploration of SQLite-based format for RiotPlan, including detailed analysis of current architecture, schema design considerations, migration challenges, and 20 key questions about implementation approach.](/Users/tobrien/gitw/kjerneverk/plans/riotplan-format) (previous plan exploration)
- [Current RiotPlan codebase showing directory-based structure, TypeScript interfaces, MCP tools, and file operations. This is the source implementation that needs to be supported by the converter tools.](/Users/tobrien/gitw/kjerneverk/riotplan) (codebase analysis)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-02-12T16:23:29.178Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
