# Plan Directory Configuration - Summary

## Problem Statement

RiotPlan MCP tools currently use `process.cwd()` which points to the MCP server's working directory (often a cache directory like `~/.cache/uv/`) rather than the user's project directory. This forces users to manually pass path parameters for every operation.

## Solution: Three-Tier Configuration

A clean, explicit three-tier configuration approach:

### Tier 1: Environment Variable (Highest Priority)
- **`RIOTPLAN_PLAN_DIRECTORY`** - Explicit override for personal or CI/CD scenarios
- Set in `.cursor/mcp.json` or shell environment
- Example: `/Users/username/projects/myapp/plans`

### Tier 2: Configuration File (Project-Level)
- **`riotplan.config.json`** with `planDirectory` setting
- Defaults to `"./plans"` if not specified
- Discovered by walking up from `process.cwd()` (like `eslint.config.js`, `tsconfig.json`)
- Relative paths resolved from config file location
- Can be checked into version control for team consistency

```json
{
  "planDirectory": "./plans"
}
```

### Tier 3: Auto-Detection (Convenience Fallback)
- Look for existing `plans/` directory by walking up from `process.cwd()`
- Look for project markers (`.git`, `package.json`) and check for `plans/` subdirectory
- Only used when no explicit configuration exists

### Final Fallback
- `./plans` relative to `process.cwd()`
- Ensures CLI usage works without any configuration

## Key Benefits

1. **CLI Friendly** - Works out of the box with default `./plans` directory
2. **Explicit over Implicit** - Users know exactly where configuration comes from
3. **Project Portable** - Config file can be checked into git, works for whole team
4. **Flexible** - Supports personal overrides, project defaults, and automatic detection
5. **Future-Proof** - Config file can grow to include other settings (defaultProvider, defaultModel, etc.)
6. **Backward Compatible** - Explicit path parameters still work

## Implementation Overview

### Files to Create
- `src/config/loader.ts` - Config file discovery and parsing
- `src/config/types.ts` - TypeScript interfaces for config
- `src/config/plan-directory.ts` - Three-tier resolution logic
- `schemas/config.schema.json` - JSON Schema for IDE support

### Files to Modify
- `src/mcp/server.ts` - Line 91: Use `getPlanDirectory()` instead of `process.cwd()`
- `src/mcp/tools/shared.ts` - Update `resolveDirectory()` to use new config system

### Testing Scenarios
1. MCP server with `RIOTPLAN_PLAN_DIRECTORY` env var
2. MCP server with `riotplan.config.json` present
3. MCP server in workspace with auto-detection
4. CLI usage (should still work)
5. Explicit path parameters (backward compatibility)
6. Nested directories and symlinks

## Evolution of the Idea

**Original Approach**: Focus on workspace root detection with `RIOTPLAN_WORKSPACE_ROOT`

**Revised Approach**: Focus on plan directory with three explicit tiers

**Why the Change**: 
- Decouples workspace detection from plan directory location
- Makes configuration more explicit and discoverable
- Provides better project portability through config file
- Simpler mental model for users

## Next Steps

1. **Shaping Stage**: Explore implementation approaches and edge cases
2. **Prototype**: Build working implementation in riotplan
3. **Documentation**: Update all docs to explain three-tier system
4. **CLI Enhancement**: Consider `riotplan init` command to bootstrap config

## Estimated Complexity

**Medium** - Touches core path resolution but changes are well-scoped and localized. Main work is in config loading and updating the context initialization.
