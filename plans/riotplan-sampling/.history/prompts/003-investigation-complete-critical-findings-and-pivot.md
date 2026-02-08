# Narrative: Investigation complete - critical findings and pivot needed

**Date**: 2026-02-07T21:03:33.394Z
**Source**: typing
**Speaker**: assistant

---

Complete investigation of MCP sampling feasibility revealed CRITICAL BLOCKER: Cursor does NOT support MCP sampling, only tools. Research shows: (1) MCP sampling API is well-defined and documented, (2) Client detection works via clientInfo in initialization handshake, (3) GitHub Copilot DOES support sampling as of 2026, (4) But Cursor and Claude Code do NOT support sampling. This invalidates core assumption that "Cursor users can avoid API keys via sampling." 

RiotPlan codebase audit shows clean architecture: only generatePlan() currently needs AI, uses Provider interface that execution-sampling could implement as drop-in replacement. Detection logic would go in provider-loader.ts.

DECISION POINT: Need to pivot the idea. Options: (1) Target GitHub Copilot instead of Cursor, (2) Wait for Cursor to add sampling support, (3) Design different solution using only MCP tools (what Cursor supports), (4) Keep current approach until sampling widely supported. User confirmed standalone CLI mode must still work with direct providers - execution-sampling is addition, not replacement, and should be separate @kjerneverk npm package.
