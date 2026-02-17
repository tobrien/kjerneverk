# Plan Provenance

This document traces how the generated plan connects to the idea artifacts.

## How This Plan Was Generated

- **Generated**: 2026-02-17T18:29:37.095Z
- **Constraints**: 6
- **Evidence files**: 3
- **Selected approach**: Standalone HTTP Server
- **History events**: 53

## Artifact Analysis

### Constraints

The model analyzed 6 constraint(s):

| # | Constraint | Addressed By | Model's Understanding |
|---|-----------|-------------|----------------------|

| 1 | Local workspace should not know where plans are stored - onl... | Step 2, Step 4 | Local riotplan tools and MCP clients must use HTTP API calls instead of direct f... |

| 2 | Agents executing plan steps should not have filesystem acces... | Step 2, Step 3, Step 4 | MCP tools must operate entirely through HTTP requests - no direct file system op... |

| 3 | Identity/multi-tenancy/security is out of scope for initial ... | *(none)* | No authentication, authorization, or multi-user support needed - simple localhos... |

| 4 | All major entities (Plans, etc.) must have UUID identifiers.... | Step 1, Step 3, Step 5 | PlanMetadata interface in riotplan-format needs uuid field added for unique iden... |

| 5 | Server takes a PLANS directory as configuration on startup. ... | Step 2, Step 3, Step 5 | HTTP server manages a centralized plans directory with lifecycle-based organizat... |

| 6 | Plan file naming convention: {uuid-abbrev}-{slug}.plan in a ... | Step 5 | Plan files use predictable naming with abbreviated UUID + human-readable slug fo... |


### Evidence Used

The model analyzed 3 evidence file(s):

| File | Key Findings | Referenced In |
|------|-------------|--------------|

| protokoll-honomcp-architecture-reference-implement.md | Protokoll uses Hono + @hono/mcp for HTTP MCP server with session-per-connection model, StreamableHTT... | Step 2 |

| protokoll-vscode-extension-architecture-reference.md | VSCode extension uses custom HTTP client with native Node.js http, JSON-RPC 2.0 over HTTP POST, SSE ... | Step 4 |

| riotplan-format-package-api-and-integration-assess.md | riotplan-format provides StorageProvider interface with full CRUD operations, DefaultStorageProvider... | Step 1, Step 3, Step 5 |


### Selected Approach

- **Approach**: Standalone HTTP Server
- **Commitments**: Build HTTP server as fresh entry point using riotplan-format StorageProvider directly, design curated MCP tools from scratch, create VSCode extension against clean API, preserve local stdio MCP unchanged
- **Implementation Strategy**: Create src/mcp/server-hono.ts in riotplan package, add HTTP-specific MCP tools, build VSCode extension, create migration script for existing plans


### Risks Identified

1. UUID addition to riotplan-format may require schema migration for existing SQLite plans
2. Breaking changes to MCP tool interfaces may impact existing clients
3. File naming convention requires slug extraction logic that may not work for all existing plans
4. HTTP server dependency management needs careful coordination with existing package versions

## Coverage Warnings

The following gaps were detected during validation:

- Constraint not addressed: "Identity/multi-tenancy/security is out of scope for initial implementation. Assu..."

## Token Budget

- **Estimated tokens**: 4339
- **Budget exceeded**: No

- **Evidence (full)**: protokoll-honomcp-architecture-reference-implement.md, protokoll-vscode-extension-architecture-reference.md, riotplan-format-package-api-and-integration-assess.md

## Step Provenance

How each step connects to the idea artifacts:


### Step 1: Add UUID Support to riotplan-format


**Rationale**: UUID support in storage layer is prerequisite for centralized plan management and HTTP API identification


**Addresses constraints**: All major entities (Plans, etc.) must have UUID identifiers. UUID needs to be added to riotplan-format PlanMetadata schema.


**Uses evidence**: riotplan-format-package-api-and-integration-assess.md



### Step 2: Build HTTP MCP Server with Hono


**Rationale**: HTTP server provides centralized plan service that clients can access without knowing storage location


**Addresses constraints**: Local workspace should not know where plans are stored - only that there's a remote service to call, Agents executing plan steps should not have filesystem access to plan files - they connect to a service, Server takes a PLANS directory as configuration on startup


**Uses evidence**: protokoll-honomcp-architecture-reference-implement.md



### Step 3: Create Simplified HTTP MCP Tools


**Rationale**: Clean API-driven tools provide controlled access to plan data without exposing filesystem details


**Addresses constraints**: Agents executing plan steps should not have filesystem access to plan files - they connect to a service, All major entities (Plans, etc.) must have UUID identifiers, Plans directory has 'done/' and 'hold/' subdirectories


**Uses evidence**: riotplan-format-package-api-and-integration-assess.md



### Step 4: Build VSCode Extension for HTTP MCP


**Rationale**: VSCode extension provides user interface for HTTP-based plan management without filesystem dependencies


**Addresses constraints**: Local workspace should not know where plans are stored - only that there's a remote service to call, Agents executing plan steps should not have filesystem access to plan files


**Uses evidence**: protokoll-vscode-extension-architecture-reference.md



### Step 5: Build Migration Tools and Plan Organization


**Rationale**: Migration tooling enables adoption of new architecture while preserving existing plan investments


**Addresses constraints**: Plan file naming convention: {uuid-abbrev}-{slug}.plan in a flat directory, Server takes a PLANS directory as configuration on startup. Plans directory has 'done/' and 'hold/' subdirectories, All major entities (Plans, etc.) must have UUID identifiers


**Uses evidence**: riotplan-format-package-api-and-integration-assess.md

