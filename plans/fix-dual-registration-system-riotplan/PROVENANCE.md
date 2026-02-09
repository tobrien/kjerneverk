# Plan Provenance

This document traces how the generated plan connects to the idea artifacts.

## How This Plan Was Generated

- **Generated**: 2026-02-09 (manual execution, bypassed riotplan_build)
- **Constraints**: 1
- **Evidence files**: 2
- **Selected approach**: Full Tool Descriptor with Zod as Source of Truth
- **History events**: 19

**Note**: This plan was executed without going through the standard `riotplan_build` workflow. The step files were created manually and the plan was executed directly from the shaping stage. This PROVENANCE.md file was backfilled after completion.

## Artifact Analysis

### Constraints

1 constraint was provided:

| # | Constraint | Addressed By | Notes |
|---|-----------|-------------|-------|
| 1 | Standardize on Zod schemas throughout. Eliminate JSON Schema from tool definitions entirely. | Steps 1-2 | All tool files migrated to Zod schemas, JSON Schema eliminated |

### Evidence Used

2 evidence files were gathered during idea exploration:

| File | Key Findings | Referenced In |
|------|-------------|--------------|
| codebase-analysis-of-riotplan-mcp-dual-registratio.md | Resources and prompts use single-loop registration; only tools have dual registration due to schema format mismatch (JSON Schema vs Zod) | Steps 1-4 |
| exact-list-of-4-tools-missing-from-mcp-server-regi.md | Identified 4 tools missing from server.ts registration: riotplan_transition, riotplan_catalyst_list, riotplan_catalyst_show, riotplan_catalyst_associate | Step 5 |

### Selected Approach

- **Approach**: Full Tool Descriptor with Zod as Source of Truth
- **Commitments**: Redefine McpTool type to use Zod as the schema format, eliminate JSON Schema inputSchema, remove the 35-case switch statement in tools/index.ts
- **Implementation Strategy**: 
  1. Redefine the McpTool type
  2. Migrate all tool files to new format
  3. Replace switch statement with Map-based lookup
  4. Replace manual registerTool calls with auto-registration loop
  5. Verify all tools registered and fix missing ones

### Risks Identified

1. Larger refactor touching McpTool type, every tool file, index.ts, and server.ts
2. Need to verify nothing external depends on JSON Schema inputSchema format
3. Risk of introducing bugs during migration

## Coverage Validation

✅ All constraints addressed, all evidence referenced, selected approach implemented.

## Step Provenance

How each step connects to the idea artifacts:

### Step 1: Redefine McpTool type to include Zod schema and executor

**Rationale**: Foundation for eliminating dual registration by making Zod the single source of truth

**Addresses constraints**: Standardize on Zod schemas throughout

**Uses evidence**: codebase-analysis-of-riotplan-mcp-dual-registratio.md

### Step 2: Migrate all tool files to full descriptor format with Zod schemas

**Rationale**: Convert all 35 tools from JSON Schema to Zod format, eliminating the schema format mismatch

**Addresses constraints**: Eliminate JSON Schema from tool definitions entirely

**Uses evidence**: codebase-analysis-of-riotplan-mcp-dual-registratio.md

### Step 3: Replace switch statement in tools/index.ts with Map-based lookup

**Rationale**: Eliminate the 35-case switch statement (another form of dual registration)

**Addresses constraints**: Standardize on Zod schemas throughout

**Uses evidence**: codebase-analysis-of-riotplan-mcp-dual-registratio.md

### Step 4: Replace manual registerTool calls in server.ts with auto-registration loop

**Rationale**: Eliminate manual registration, adopt the same loop-based pattern that resources and prompts use

**Addresses constraints**: Standardize on Zod schemas throughout

**Uses evidence**: codebase-analysis-of-riotplan-mcp-dual-registratio.md

### Step 5: Verify all 35 tools registered, fix missing 4, run tests

**Rationale**: Ensure the 4 previously missing tools are now registered and all tests pass

**Addresses constraints**: Standardize on Zod schemas throughout

**Uses evidence**: exact-list-of-4-tools-missing-from-mcp-server-regi.md

## Execution Notes

This plan was executed successfully with all 5 steps completed. Key achievements:

1. Standardized all tools on Zod schemas (eliminated JSON Schema)
2. Made each tool a self-contained descriptor with embedded execute function
3. Replaced 35-case switch statement with efficient Map-based lookup
4. Reduced server.ts from 791 lines to 454 lines (337 line reduction)
5. Eliminated manual tool registration - now auto-registers from tools array
6. Fixed the 4 missing tools (riotplan_transition, riotplan_catalyst_list, riotplan_catalyst_show, riotplan_catalyst_associate)

All tests passed (760 passed, 0 failed), linting clean, build successful.
