# Evidence: protokoll-vscode extension architecture - reference for RiotPlan VSCode extension

**Source**: codebase analysis
**Source URL**: /Users/tobrien/gitw/redaksjon/protokoll-vscode
**Original Query**: How does the protokoll-vscode extension connect to the HTTP MCP server and render content?
**Added**: 2026-02-17T17:57:20.945Z
**Gathering Method**: model-assisted

---

**Architecture**: VSCode extension connecting to remote HTTP MCP server.

**MCP Client**: Custom HTTP client using native Node.js http/https (no external MCP library). JSON-RPC 2.0 over HTTP POST to /mcp. SSE for notifications. Session management with Mcp-Session-Id header and auto-recovery.

**UI Pattern**:
- Activity bar icon → sidebar with tree views
- 7 tree views: Transcripts, People, Terms, Projects, Companies, Chats, ConnectionStatus
- TreeDataProvider with EventEmitter, lazy loading on visibility
- Hierarchical grouping in trees (day → items)
- Filtering, sorting, workspace state persistence

**Detail Rendering**:
- WebviewPanel (not custom editor)
- Inline HTML/CSS using VS Code theme variables (var(--vscode-font-family), etc.)
- Markdown → HTML rendering
- Webview message passing for interactivity (edit, status changes, task management)
- Resource subscriptions for live updates

**Navigation Flow**: Click tree item → command handler → fetch full content via mcpClient.readResource(uri) → render HTML in webview panel

**Configuration**: protokoll.serverUrl setting (default http://127.0.0.1:3001), health check on activate, auto-reconnect on config changes.

**Dependencies**: Minimal - native Node.js HTTP, no external MCP client library. Only openai for optional chat features.

**Activation**: onStartupFinished, graceful degradation if server unavailable.