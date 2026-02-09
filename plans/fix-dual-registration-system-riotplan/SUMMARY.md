# Fix Dual Registration System in RiotPlan

## Overview

This plan eliminates the dual registration system for MCP tools in RiotPlan, which required updating two separate files (src/mcp/tools/index.ts and src/mcp/server.ts) when adding new tools. This error-prone pattern had already caused bugs where tools were implemented but missing from the MCP server.

## Problem

- Adding a new MCP tool required registration in two places
- Forgetting either registration caused silent failures
- 4 tools were missing from server.ts registration (riotplan_transition, riotplan_catalyst_list, riotplan_catalyst_show, riotplan_catalyst_associate)
- Schema format mismatch: tool files used JSON Schema, server.ts expected Zod
- 35-case switch statement in tools/index.ts was another form of dual registration

## Solution

Standardized on Zod schemas throughout and made each tool a self-contained descriptor:

1. **Redefined McpTool type** to include Zod schema and embedded execute function
2. **Migrated all 35 tool files** from JSON Schema to Zod format
3. **Replaced switch statement** with efficient Map-based lookup
4. **Eliminated manual registration** with auto-registration loop (following the pattern resources and prompts already use)
5. **Fixed missing tools** and verified all 35 tools registered correctly

## Approach

**Selected**: Full Tool Descriptor with Zod as Source of Truth

This approach was chosen because:
- Eliminates both dual registration AND the giant switch statement
- Adding a new tool now requires only one file change
- No possibility of name/schema/executor getting out of sync
- Cleaner end state with each tool as a self-contained unit

## Key Constraints

- Standardize on Zod schemas throughout
- Eliminate JSON Schema from tool definitions entirely

## Evidence Used

- Codebase analysis showing resources and prompts use single-loop registration
- Line-by-line comparison identifying the 4 missing tools

## Results

- ✅ All 35 tools now use Zod schemas
- ✅ server.ts reduced from 791 to 454 lines (337 line reduction)
- ✅ 4 missing tools now registered
- ✅ All tests passing (760 passed, 0 failed)
- ✅ Linting clean, build successful
- ✅ No more dual registration bugs possible

## Impact

- **Maintainability**: Adding new tools is now a single-file change
- **Reliability**: Eliminated silent failure mode where tools exist but aren't registered
- **Consistency**: All tools follow the same pattern with Zod validation
- **Code quality**: Reduced complexity and error surface
