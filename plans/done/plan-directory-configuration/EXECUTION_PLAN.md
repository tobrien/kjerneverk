# Execution Plan: Full CardiganTime Integration for Plan Directory Configuration

## Strategy

Implement comprehensive CardiganTime integration to solve the MCP server process.cwd() issue while establishing a robust, extensible configuration system for all future riotplan needs. The implementation follows a four-tier resolution strategy:

1. **Environment Variable** (RIOTPLAN_PLAN_DIRECTORY) - Handled by CardiganTime
2. **Config Files** (multi-format: YAML, JSON, JS, TS) - CardiganTime hierarchical discovery
3. **Walk-Up Detection** - Custom logic to find existing plans/ directories
4. **Fallback** - Default to ./plans for zero-config experience

This approach provides maximum flexibility while maintaining a simple, zero-config experience for CLI users.

## Prerequisites

- [ ] CardiganTime @0.0.23 or later (with environment variable support)
- [ ] Understanding of CardiganTime's hierarchical discovery
- [ ] Familiarity with Zod schema validation
- [ ] Access to test MCP server environment (Cursor/VSCode)

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Create Config Module Structure | Set up src/config/ with index, types, and schema files |
| 02 | Define Zod Schema | Create comprehensive schema for all riotplan config options |
| 03 | Integrate CardiganTime Loader | Set up CardiganTime for tiers 1-2 (env var + config files) |
| 04 | Implement Walk-Up Detection | Custom logic for tier 3 (finding existing plans/ directories) |
| 05 | Implement Four-Tier Resolver | Orchestrate all tiers with proper precedence |
| 06 | Update MCP Server Context | Modify server.ts to use new resolver |
| 07 | Update Shared resolveDirectory | Ensure backward compatibility with explicit paths |
| 08 | Add CLI Config Commands | Implement --init-config and --check-config |
| 09 | Write Unit Tests | Comprehensive tests for config module |
| 10 | Write Integration Tests | End-to-end tests for MCP and CLI scenarios |
| 11 | Update Documentation | Complete docs for configuration system |
| 12 | Create JSON Schema | IDE support for config files |
| 13 | Test MCP Scenarios | Manual testing in real MCP environment |
| 14 | Test CLI Scenarios | Manual testing of CLI usage |
| 15 | Performance and Polish | Optimize, fix issues, final review |

## Quality Gates

After each step:
- [ ] Code compiles without errors
- [ ] Tests pass (unit and integration)
- [ ] Linter passes with no warnings
- [ ] Documentation updated
- [ ] Changes reviewed

## Implementation Notes

### Key Design Decisions

1. **Full CardiganTime Integration**: Use CardiganTime to its fullest extent, establishing the pattern for all future config needs
2. **Zero-Config Experience**: Walk-up detection (tier 3) ensures users can start using riotplan without any configuration
3. **Backward Compatibility**: Explicit path parameters continue to work, ensuring no breaking changes
4. **Extensibility**: Config schema includes future options (defaultProvider, defaultModel, etc.)

### Critical Requirements from User Feedback

- Walk up directory tree looking ONLY for plans/ subdirectory (no .git or package.json markers)
- No boundaries on traversal - walk all the way to filesystem root if needed
- Config files should be RARE - most users won't need them
- Support both file and directory config approaches (riotplan.config.* and .riotplan/)
- CardiganTime handles environment variable (RIOTPLAN_PLAN_DIRECTORY) automatically

### Testing Strategy

- Unit tests for each module (schema, walk-up, resolver)
- Integration tests for MCP server and CLI
- Manual testing in real environments
- Performance testing to ensure no regressions
- Target >90% code coverage

---

*Last updated: 2026-01-31*
