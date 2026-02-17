# Execution Plan: riotplan-http-mcp

## Strategy

Implement the Standalone HTTP Server approach by: (1) extending riotplan-format with UUID support, (2) building Hono-based HTTP MCP server with session management, (3) creating simplified MCP tools that use StorageProvider API, (4) developing VSCode extension with HTTP client, (5) building migration tooling for existing plans. Server manages centralized plans directory with lifecycle organization, preserving local stdio MCP for backward compatibility.

## Prerequisites

- [ ] Understanding of requirements from IDEA.md
- [ ] Review selected approach from SHAPING.md

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Add UUID Support to riotplan-format | Extend PlanMetadata schema with UUID field and update storage providers to support UUID-based identification |
| 02 | Build HTTP MCP Server with Hono | Create standalone HTTP MCP server using Hono framework that serves plan data via HTTP instead of stdio |
| 03 | Create Simplified HTTP MCP Tools | Design and implement curated set of MCP tools that work with StorageProvider API instead of filesystem operations |
| 04 | Build VSCode Extension for HTTP MCP | Create VSCode extension that connects to HTTP MCP server instead of stdio MCP, providing plan management UI |
| 05 | Build Migration Tools and Plan Organization | Create migration utilities to convert existing directory-based plans to UUID format and implement done/hold directory organization |

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

*Last updated: 2026-02-17*
