# Idea: plan-directory-configuration

## Core Concept

Implement flexible plan directory configuration for riotplan so users can specify where plans are stored through environment variables, config files, or automatic detection. This solves the MCP server issue where process.cwd() points to cache directories instead of the user's project.

## Why This Matters

When running as an MCP server (via npx), riotplan's process.cwd() points to cache directories (~/.cache/uv/) instead of the user's project directory. Users currently must pass explicit paths to every command. This idea provides three simple ways to configure the plan directory, making riotplan work seamlessly whether used via MCP or CLI.

## Initial Thoughts

### The Problem
- Current behavior: MCP server's process.cwd() points to cache directories (~/.cache/uv/), not the user's project
- Affects all tools that create/access plans: idea_create, shaping_start, status, etc.
- Users must manually pass path parameters to every command
- Current architecture: server.ts line 91 sets `context.workingDirectory` to process.cwd()

### Three-Tier Configuration Solution

**Tier 1: Environment Variable (Explicit Override)**
- `RIOTPLAN_PLAN_DIRECTORY` - Set in .cursor/mcp.json or shell
- Highest priority, for personal overrides or CI/CD
- Example: `/Users/me/projects/myapp/plans`

**Tier 2: Config File (Project-Level)**
- `riotplan.config.json` with `planDirectory` setting (defaults to `"./plans"`)
- Discovered by walking up from process.cwd() (like eslint.config.js, tsconfig.json)
- Relative paths resolved from config file location
- Can be checked into git for team consistency

**Tier 3: Auto-Detection (Convenience)**
- Look for existing `plans/` directory by walking up from process.cwd()
- Look for project markers (.git, package.json) and check for plans/ subdirectory
- Only used when no explicit configuration exists

**Final Fallback**
- `./plans` relative to process.cwd()
- Ensures CLI usage works without any configuration

### Key Benefits
- CLI users: Works out of the box with default `./plans`
- MCP users: Config file or env var provides explicit control
- Teams: Config file in git means everyone gets same setup
- Explicit over implicit: Clear configuration hierarchy
- Future-proof: Config file can grow to include other settings
- Key insight: The resolution strategy should be "walk up until you find a plans/ directory" - this works for both IDE and CLI usage. Example: running from /Users/tobrien/gitw/kjerneverk/riotplan/src/analysis should find /Users/tobrien/gitw/kjerneverk/plans
- Important: Config files (riotplan.config.json or .riotplan/) should take PRECEDENCE over auto-detection. Config is explicit intent, auto-detection is convenience.
- User wants flexibility: Support BOTH riotplan.config.json (file) AND .riotplan/ (directory) as configuration approaches. Users should be able to choose their preferred style.
- No boundaries on directory traversal - keep walking up until filesystem root if needed. Don't stop at home directory or other artificial boundaries.
- Don't use .git or package.json as project markers - user has hybrid workspaces that aren't traditional projects. Only look for plans/ directory or explicit config.
- Config files should be RARE - most projects won't need them. Auto-detection by finding plans/ directory should handle the common case.
- CRITICAL: Use CardiganTime's configuration system instead of hard-coding specific file formats. CardiganTime supports multiple formats (YAML, JSON, JS, TS) and multiple strategies (single config file or directory-based). We should search for CardiganTime config, not specific filenames.
- CardiganTime may eventually handle environment variable override logic, so our RIOTPLAN_PLAN_DIRECTORY env var support might become redundant. Keep this simple and delegate to CardiganTime where possible.
- Use .code-workspace file as a hint when walking up directories. If we find one, check for plans/ at that level first before continuing up the tree.
- Discovery: riotplan has @theunwalked/cardigantime@^0.0.23 as a dependency but it's not currently being imported/used anywhere in the codebase. This feature would be the first to integrate CardiganTime's configuration system.
- CORRECTED walk-up algorithm: Simply walk up from process.cwd(), at each level check if there's a plans/ subdirectory. If yes, use it. If no, continue up. No special handling for .code-workspace files - just look for plans/ at each level.
- CardiganTime config schema: Define a Zod schema in CardiganTime that includes planDirectory field. The config value is just a simple { planDirectory: './plans' } structure.
- This feature will be the first real integration of CardiganTime in riotplan - an opportunity to upgrade how we use it and establish the pattern for future config needs.
- CardiganTime features discovered: 1) Multi-format support (YAML, JSON, JS, TS), 2) Hierarchical config discovery (walks up directory tree), 3) Multiple naming conventions (app.config.ext, .app/config.ext, .apprc, etc.), 4) MCP integration built-in, 5) Zod schema validation, 6) Config precedence handling (CLI args > config file > defaults)
- CardiganTime already handles hierarchical discovery! We can use its 'enabled' mode (default) to walk up the directory tree looking for config. This means we don't have to implement our own config discovery - CardiganTime does it for us.
- CardiganTime naming conventions: riotplan.config.{yaml,json,js,ts}, riotplan.conf.{ext}, .riotplan/config.{ext}, .riotplanrc.{ext}, .riotplanrc. This gives users maximum flexibility in how they configure riotplan.
- DECISION: Use Option A - CardiganTime for tiers 1-2 (env var + config), custom walk-up for tier 3 (finding existing plans/). This ensures normal users can download and use RiotPlan without any configuration setup.
- Environment variable support will be added to CardiganTime itself (not just in RiotPlan). This is needed for container implementations and will benefit all CardiganTime users.
- Key insight: Configuration should be optional. The walk-up (tier 3) is critical for zero-config experience - users can just start using RiotPlan and it finds their plans/ directory automatically.
- Implementation plan: 1) Add env var support to CardiganTime (separate task), 2) Integrate CardiganTime in RiotPlan with Zod schema for planDirectory, 3) Implement custom walk-up function to find existing plans/ directory, 4) Wire up the four-tier resolution in server.ts and resolveDirectory()
- Final four-tier hierarchy: 1) RIOTPLAN_PLAN_DIRECTORY env var (via CardiganTime), 2) CardiganTime config file (riotplan.config.*, .riotplan/config.*, etc.), 3) Walk up looking for existing plans/ subdirectory, 4) Fallback to ./plans in current directory
- COMPLETED: CardiganTime now has environment variable support built-in. This means tier 1 (RIOTPLAN_PLAN_DIRECTORY env var) will be handled automatically by CardiganTime's config system.

## Constraints

- Must support CLI usage with no configuration (default to `./plans`)
- Must not break existing behavior for users who explicitly pass the directory parameter
- Performance: Directory tree walking should be efficient and cached to avoid repeated filesystem operations
- Security: Must not traverse outside reasonable bounds (stop at user home directory or filesystem root)
- Backward compatibility: Existing explicit path parameters must continue to work
- Config file should be optional - riotplan works without it

## Questions

- What happens if a user has nested plans/ directories? Should we use the closest one or document this as unsupported?
- Should we add logging/debugging output to help users understand which plan directory was resolved? Helpful for troubleshooting.
- Should riotplan.config.json support other settings beyond planDirectory? Could include: defaultProvider, defaultModel, templateDirectory, etc.
- Should we provide a CLI command to initialize the config file? Something like `riotplan init` that creates riotplan.config.json with sensible defaults?
- What project markers should we look for in tier 3 auto-detection? (.git, package.json, .code-workspace, etc.)
- What version of CardiganTime are we currently using in riotplan? Do we need to upgrade to get the latest flexible configuration support?
- What does CardiganTime's config discovery API look like? How do we search for config without knowing the specific filename?

## Evidence

- [Proof of concept for three-tier plan directory resolution](workspace-detector-poc.ts)
- [Example .cursor/mcp.json showing RIOTPLAN_PLAN_DIRECTORY environment variable](cursor-mcp-config-example.json)
- [Example riotplan.config.json with planDirectory setting (defaults to "./plans")](riotplan.config.json)
- [JSON Schema for riotplan.config.json providing IDE autocomplete and validation](config.schema.json)
- [Executive summary of the approach and implementation overview](SUMMARY.md)
- [CardiganTime GitHub repository - comprehensive configuration management library with multi-format support (YAML, JSON, JS, TS), hierarchical discovery, and MCP integration](https://github.com/utilarium/cardigantime)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-30T15:14:53.507Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
