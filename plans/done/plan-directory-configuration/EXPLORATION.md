# Exploration Reference

This plan is based on extensive exploration documented in the `workspace-aware-path-resolution` idea. This document provides links to all the evidence and context that informed this implementation plan.

## Source Idea

**Location**: `/Users/tobrien/gitw/kjerneverk/plans/workspace-aware-path-resolution/`

**Key Files**:
- `IDEA.md` - Complete idea documentation with all notes and decisions
- `SUMMARY.md` - Executive summary of the approach
- `.history/timeline.jsonl` - Full timeline of exploration
- `.history/prompts/` - All user feedback and narrative context

## Key User Feedback

### Configuration Hierarchy
From narrative 007:
> "RIOTPLAN_PLAN_DIRECTORY environment variable. Yeah. So that's like number one. If that's there, use that. And that's something we could set in the IDE or in the MCP server or something. And then the second thing is CardiganTime configuration. Right, that's where we search for it. If it doesn't exist, then we walk up, we look for a plan directory, and then we fall back to current directory ./plans."

### Walk-Up Algorithm
From narrative 008:
> "At each level, check to see if there is a plans subdirectory. And if there is a plans subdirectory, use that one."

**Critical**: No special handling for .git, package.json, or .code-workspace files. Just look for plans/ at each level.

### Zero-Config Philosophy
From narrative 001:
> "If I'm running this from the command line, it's very likely that I'm going to be running it within a project that has a plans directory somewhere up the chain. So, for example, let's assume I'm in the terminal and I'm in this directory /Users/tobrien/gitw/kjerneverk/riotplan/src/analysis - well, I know that this is part of the kjerneverk project and if I walk up the chain of directories, I'm going to notice that I have a ./plans directory here /Users/tobrien/gitw/kjerneverk/plans"

### CardiganTime Integration
From narrative 004:
> "I want to make sure we're not dictating this too much. I was under the impression that CardiganTime had redefined this in the last week. Maybe my guidance here is that we need to make sure that we've updated to the latest version of CardiganTime and that we're just searching for configuration for CardiganTime not a particular filename. If I'm right, I think CardiganTime is now able to read configuration in a number of different formats like YAML, JSON, and even Javascript or Typescript. Let's be flexible and just go with whatever configuration is located."

### Full Integration Directive
From final decision:
> "Full CardiganTime Integration - it's already integrated, but dial it up. I want to use it to its fullest extent."

## Evidence Created During Exploration

### Proof of Concept
- `workspace-detector-poc.ts` - Working implementation of three-tier resolution
- Demonstrates the walk-up algorithm
- Shows CardiganTime integration approach

### Configuration Examples
- `riotplan.config.json` - Example project-level config
- `cursor-mcp-config-example.json` - Example MCP server config with env var
- `config.schema.json` - JSON Schema for IDE support

### External Resources
- [CardiganTime Repository](https://github.com/utilarium/cardigantime) - Full documentation
- CardiganTime features: Multi-format support, hierarchical discovery, MCP integration, Zod validation

## Key Decisions Made

### Decision 1: Use CardiganTime for Tiers 1-2
**Rationale**: CardiganTime already handles:
- Environment variable support (RIOTPLAN_PLAN_DIRECTORY)
- Config file discovery (multiple formats and naming conventions)
- Hierarchical discovery (walks up directory tree)
- Validation (Zod schema)
- MCP integration

**Impact**: We only need to implement tier 3 (walk-up) and tier 4 (fallback) ourselves.

### Decision 2: Simple Walk-Up Algorithm
**Rationale**: User explicitly corrected to remove special workspace file handling.

**Algorithm**:
```
Walk up from process.cwd()
At each level:
  Check if plans/ subdirectory exists
  If yes: use it
  If no: continue up
Stop at filesystem root
```

### Decision 3: Configuration Should Be Rare
**Rationale**: Most users should get zero-config experience through walk-up detection.

**Impact**: 
- Walk-up (tier 3) is critical, not optional
- Config files are for advanced users or special cases
- Documentation should emphasize zero-config usage

### Decision 4: Full CardiganTime Integration
**Rationale**: User wants to "use it to its fullest extent" and establish pattern for future config needs.

**Impact**:
- Comprehensive Zod schema (not just planDirectory)
- Leverage all CardiganTime features
- Set up for future config options (defaultProvider, defaultModel, etc.)
- Use CardiganTime's MCP integration
- Add --init-config and --check-config commands

## Constraints from Exploration

1. **Must support CLI with no configuration** - Zero-config experience is critical
2. **Must not break existing explicit paths** - Backward compatibility required
3. **No boundaries on directory traversal** - Walk all the way to filesystem root if needed
4. **Don't use .git or package.json as markers** - User has hybrid workspaces
5. **Performance must be acceptable** - Caching required to avoid repeated filesystem operations
6. **Config files should be optional** - Most users won't need them

## Questions Answered During Exploration

### Q: What version of CardiganTime?
**A**: @theunwalked/cardigantime@^0.0.23 (latest, with env var support)

### Q: How does CardiganTime config discovery work?
**A**: Hierarchical discovery with multiple naming conventions:
- riotplan.config.{yaml,json,js,ts}
- riotplan.conf.{yaml,json,js,ts}
- .riotplan/config.{yaml,json,js,ts}
- .riotplanrc.{yaml,json,js,ts}
- .riotplanrc

### Q: Should we use .code-workspace as a hint?
**A**: No. User corrected: "At each level, check to see if there is a plans subdirectory. And if there is a plans subdirectory, use that one." No special workspace file handling.

### Q: What if there are nested plans/ directories?
**A**: Use the first one found when walking up (closest to starting point).

### Q: Should config support other settings?
**A**: Yes. Create comprehensive schema including defaultProvider, defaultModel, templateDirectory, etc.

## Testing Requirements from Exploration

### MCP Server Scenarios
1. With RIOTPLAN_PLAN_DIRECTORY env var
2. With config file
3. With walk-up detection
4. With fallback
5. Precedence testing (all tiers set)

### CLI Scenarios
1. No configuration (zero-config)
2. Existing plans/ directory (walk-up)
3. Config file
4. Environment variable
5. Explicit path (backward compatibility)
6. --init-config and --check-config commands

### Edge Cases
- Nested directories
- Symlinks
- Permission issues
- Invalid config files
- Inaccessible directories

## Success Metrics

- [ ] MCP server works without manual path parameters
- [ ] CLI works with zero configuration
- [ ] All four tiers work with correct precedence
- [ ] Backward compatibility maintained
- [ ] >90% code coverage
- [ ] No performance regression
- [ ] Documentation is complete

## Related Work

- **CardiganTime Enhancement**: User added environment variable support to CardiganTime (completed before this plan)
- **Future Config Needs**: This establishes the pattern for defaultProvider, defaultModel, templateDirectory, and other settings

---

*This document provides traceability from exploration to implementation.*
*All decisions are based on user feedback and evidence gathered during the idea phase.*
