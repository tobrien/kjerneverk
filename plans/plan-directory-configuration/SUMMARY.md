# Full CardiganTime Integration for Plan Directory Configuration

## Overview

Implement comprehensive CardiganTime integration to provide flexible plan directory configuration through environment variables, config files (multi-format), and automatic detection. Solves the MCP server process.cwd() issue where riotplan's working directory points to cache directories (~/.cache/uv/) instead of the user's project. Establishes the pattern for all future riotplan configuration needs while maintaining a zero-config experience for CLI users.

## Problem Statement

When running as an MCP server (via npx), riotplan's process.cwd() points to cache directories rather than the user's project directory. This forces users to manually pass path parameters to every command, creating a poor user experience. Additionally, riotplan lacks a unified configuration system for settings like default AI providers and models.

## Goals

1. **Solve MCP Server Path Issue**: Automatically resolve the correct plan directory regardless of where the MCP server's process.cwd() points
2. **Zero-Config Experience**: Enable users to download riotplan and start using it immediately without any configuration
3. **Full CardiganTime Integration**: Leverage all of CardiganTime's capabilities (multi-format support, hierarchical discovery, validation, MCP integration)
4. **Establish Configuration Pattern**: Create the foundation for all future riotplan configuration needs
5. **Maintain Backward Compatibility**: Ensure existing users with explicit path parameters continue to work

## Four-Tier Resolution Strategy

1. **Tier 1: Environment Variable** (Highest Priority)
   - `RIOTPLAN_PLAN_DIRECTORY` - Explicit override
   - Handled automatically by CardiganTime
   - For personal overrides, CI/CD, containers

2. **Tier 2: Configuration Files** (Project-Level)
   - Multi-format: YAML, JSON, JavaScript, TypeScript
   - Multiple naming conventions: riotplan.config.*, .riotplan/config.*, .riotplanrc
   - Hierarchical discovery (walks up directory tree)
   - Can be checked into git for team consistency

3. **Tier 3: Auto-Detection** (Convenience)
   - Walk up directory tree looking for existing plans/ subdirectory
   - No special markers (.git, package.json) - just look for plans/
   - Critical for zero-config experience

4. **Tier 4: Fallback** (Default)
   - Use ./plans relative to current directory
   - Create if needed on first use
   - Ensures CLI always works

## Scope

### In Scope

- Create src/config/ module with CardiganTime integration
- Define comprehensive Zod schema for riotplan configuration
- Implement custom walk-up logic for tier 3
- Update MCP server to use new resolver
- Add --init-config and --check-config CLI commands
- Comprehensive unit and integration tests
- Complete documentation update
- JSON Schema for IDE support
- Manual testing in MCP and CLI environments
- Performance optimization

### Out of Scope

- Migrating existing configuration from other sources
- Automatic migration of user setups
- Configuration UI/GUI
- Configuration versioning or history
- Remote configuration sources

## Success Criteria

### Functional Requirements
- [ ] All four tiers work correctly with proper precedence
- [ ] MCP server automatically finds correct plan directory
- [ ] CLI works with zero configuration
- [ ] Config files support all formats (YAML, JSON, JS, TS)
- [ ] Walk-up detection finds plans/ at any level
- [ ] Explicit path parameters still work (backward compatibility)
- [ ] --init-config creates valid config file
- [ ] --check-config shows current resolution

### Quality Requirements
- [ ] >90% code coverage
- [ ] All tests pass (unit + integration)
- [ ] No linter errors or warnings
- [ ] No performance regression
- [ ] Documentation is complete and accurate
- [ ] JSON Schema provides IDE autocomplete

### User Experience
- [ ] Zero-config works for CLI users
- [ ] MCP users can easily configure via env var or config file
- [ ] Error messages are helpful and actionable
- [ ] Configuration is discoverable and well-documented

## Key Design Decisions

### Use CardiganTime to Its Fullest Extent
Per user feedback: "Full CardiganTime Integration - it's already integrated, but dial it up. I want to use it to its fullest extent."

This means:
- Leverage all CardiganTime features (not just basic config loading)
- Use hierarchical discovery
- Support all file formats
- Integrate MCP features
- Establish pattern for future config needs

### Walk-Up Algorithm
Per user feedback: "At each level, check to see if there is a plans subdirectory. And if there is a plans subdirectory, use that one."

- Simple algorithm: just look for plans/ at each level
- No special handling for .git, package.json, or .code-workspace
- Walk all the way to filesystem root if needed (no artificial boundaries)
- Example: From `/Users/tobrien/gitw/kjerneverk/riotplan/src/analysis` should find `/Users/tobrien/gitw/kjerneverk/plans`

### Configuration Should Be Rare
Per user feedback: "Config files should be RARE - most projects won't need them. Auto-detection by finding plans/ directory should handle the common case."

- Tier 3 (walk-up) is critical for zero-config experience
- Config files are for advanced users or special cases
- Most users will never create a config file

## Implementation Phases

### Phase 1: Foundation (Steps 1-5)
- Create module structure
- Define schema
- Integrate CardiganTime
- Implement walk-up
- Create resolver

### Phase 2: Integration (Steps 6-8)
- Update MCP server
- Update shared utilities
- Add CLI commands

### Phase 3: Testing (Steps 9-10)
- Unit tests
- Integration tests

### Phase 4: Documentation (Steps 11-12)
- Update all docs
- Create JSON Schema

### Phase 5: Validation (Steps 13-15)
- Manual MCP testing
- Manual CLI testing
- Performance and polish

## Dependencies

- CardiganTime @0.0.23+ (with environment variable support) ✅ Already available
- Zod (already in dependencies)
- Node.js filesystem APIs
- MCP SDK (already in dependencies)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing users | High | Maintain backward compatibility with explicit paths |
| Performance regression | Medium | Profile and optimize, add caching |
| Complex edge cases | Medium | Comprehensive testing, clear error messages |
| CardiganTime learning curve | Low | Good documentation, examples |

## Timeline Estimate

- Phase 1 (Foundation): 2-3 days
- Phase 2 (Integration): 1-2 days
- Phase 3 (Testing): 2-3 days
- Phase 4 (Documentation): 1-2 days
- Phase 5 (Validation): 1-2 days

**Total: 7-12 days** (depending on issues found during testing)

---

*Plan created: 2026-01-31*
*Based on extensive exploration and user feedback*
