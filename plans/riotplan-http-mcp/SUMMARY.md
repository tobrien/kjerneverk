# riotplan-http-mcp

## Overview

Transform RiotPlan from scattered project directory storage to centralized HTTP service architecture. Add UUID identifiers to plan format, build standalone HTTP MCP server using riotplan-format StorageProvider, create curated MCP tool API, and develop VSCode extension for HTTP connectivity. Implement lifecycle-based plan organization with done/hold directories and UUID-slug file naming.

## Goals

RiotPlan needs a remote HTTP MCP server (like Protokoll) instead of running as a local MCP. Plans should be stored centrally as a service, not scattered across project directories. This would eliminate the need to specify plan directories and allow working across workspaces with a single plan database.

## Scope

### In Scope

- Implementation of planned features
- Testing and validation
- Documentation updates

### Out of Scope

- (To be determined during execution)

## Success Criteria

- [ ] Step 1: Add UUID Support to riotplan-format
- [ ] Step 2: Build HTTP MCP Server with Hono
- [ ] Step 3: Create Simplified HTTP MCP Tools
- [ ] Step 4: Build VSCode Extension for HTTP MCP
- [ ] Step 5: Build Migration Tools and Plan Organization

---

*Plan created: 2026-02-17*
