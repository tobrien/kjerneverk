# Execution Plan: workspace-scoped-plan-filtering

## Strategy

Extend plan metadata with workspaceId field, modify MCP APIs to support workspace filtering, and add VS Code UI with workspaceState persistence for automatic workspace-scoped plan filtering.

## Prerequisites

- [ ] Understanding of requirements from IDEA.md
- [ ] Review selected approach from SHAPING.md

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Extend SQLite Schema with Workspace Identifier | Add workspaceId field to plans table and create migration to support workspace-scoped filtering |
| 02 | Update Storage Provider to Handle Workspace ID | Modify SqliteStorageProvider to read, write, and query plans by workspaceId |
| 03 | Extend MCP Tools with Workspace Filtering | Add workspaceId parameter to plans-list and switch-plan MCP tools for workspace-scoped plan queries |
| 04 | Add Workspace Selection UI to VS Code Extension | Create workspace/organization selection UI in VS Code extension with visual feedback |
| 05 | Implement Workspace State Persistence | Use VS Code workspaceState API to persist and restore selected workspace identifier per workspace |
| 06 | Update MCP Client to Support Workspace Filtering | Modify HttpMcpClient to pass workspace parameters to plan listing APIs |
| 07 | Add Workspace Management MCP Tool | Create MCP tool for setting and managing plan workspace assignments |
| 08 | Enhance VS Code Workspace Selection with Discovery | Improve workspace selection UI with auto-discovery of existing workspaces and better UX |

## Quality Gates

After each step:
- [ ] Code compiles/runs
- [ ] Tests pass
- [ ] Documentation updated

## Notes

- Follow the step-by-step approach
- Update STATUS.md as you progress
- Use riotplan_step_start and riotplan_step_complete for tracking

---

*Last updated: 2026-02-23*
