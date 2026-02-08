# Narrative: Architecture pivot - session-based sampling with FastMCP for testing

**Date**: 2026-02-07T21:09:37.382Z
**Source**: typing
**Speaker**: assistant

---

User correctly identified that sampling availability must be per-session, not global, because RiotPlan supports both STDIO (local, single client) and HTTP (remote, multiple clients) transports. Each session tracks clientInfo, capabilities, and determines providerMode (sampling|direct|none) during initialization.

Research found FastMCP (Python) has production-ready sampling with built-in OpenAI/Anthropic handlers - perfect for testing. mcp-go also works. Cursor/Claude Desktop/Claude Code don't support sampling yet, but user wants to build it anyway to: (1) be ready when they add it, (2) test with FastMCP today, (3) put pressure on vendors, (4) position RiotPlan as MCP sampling leader.

Architecture design complete: SessionManager tracks per-session context, determineProviderMode() checks capabilities.sampling then falls back to direct providers, loadProviderForSession() returns appropriate provider. Clean separation means execution-sampling is drop-in replacement for execution-anthropic/openai/gemini with same Provider interface. No breaking changes for existing users.
