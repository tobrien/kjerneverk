# Narrative: User explaining the problem and desired solution after comparing plan quality

**Date**: 2026-02-12T16:54:09.631Z
**Source**: typing
**Speaker**: user

---

The user has been building out the riotplan explore CLI command and discovered a significant quality gap between plans generated through Cursor (which have full codebase access) and plans generated through rp_build (which makes a single one-shot LLM call with only plan artifacts as context).

Specific comparison: The riotplan-command-line plan (Cursor-generated) names specific files like execution/src/index.ts, references actual classes like ConversationManager and AgentLoop, has concrete tasks like "Add tools parameter to the Request interface", and includes Key Files and Dependencies sections. The riotplan-format plan (rp_build-generated) has placeholder "Files Changed" sections, abstract conceptual tasks, no Key Files or Dependencies sections, and reads like a consultant who never saw the code.

Root cause: rp_build in generator.ts makes a single provider.execute() call (now streaming via executeStream) with only IDEA.md, SHAPING.md, constraints, questions, and evidence summaries in the prompt. It has NO tools, NO iteration, and NO codebase context.

The user wants two things:
1. Make rp_build agent-powered - use the AgentLoop with file-reading tools so the LLM can explore the codebase while drafting the plan
2. Leverage the project indexer (which takes ~500ms) to inject real code context into plan generation

Additionally, the project already has a working index_project tool that scans files, packages, and exports, and a query_index tool for fast lookups. These were built specifically to reduce LLM round-trips by providing local, queryable project structure data.
