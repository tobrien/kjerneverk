# Narrative: User's initial description of the problem and vision for CLI-based RiotPlan

**Date**: 2026-02-09T14:03:38.516Z
**Source**: typing
**Speaker**: user

---

The main entry point into RiotPlan right now is via MCP in Cursor, which works well, but RiotPlan was also envisioned as something usable outside of an IDE, from the command line. The current CLI commands don't resemble the MCP tools/prompts/resources at all. 

What's needed: commands that match the most frequently used entry points into the RiotPlan experience - explore_idea (to start or develop an existing idea), building a plan once shaped, gathering evidence, printing plan info, and executing a plan.

The core complication: idea exploration in Cursor relies on a powerful LLM on the other end of a conversation. For CLI, we need to instantiate an interactive chat session using OPENAI_API_KEY or ANTHROPIC_API_KEY. Additionally, in Cursor the LLM isn't just conversational - it can read files, lookup information, and run commands. The CLI needs to build out a similar set of tools for the LLM to use during the interactive experience.

Overall vision: use riotplan outside of MCP such that the CLI manages a dedicated LLM experience with tool access.
