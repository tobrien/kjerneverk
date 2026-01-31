# Step 11: Update Documentation

## Goal

Update all documentation to explain the new configuration system.

## Tasks

- [ ] Update main README.md
  - Add "Configuration" section
  - Explain four-tier system
  - Show examples for each tier
  - Document all config options
- [ ] Update MCP documentation
  - Show how to set RIOTPLAN_PLAN_DIRECTORY in .cursor/mcp.json
  - Explain zero-config experience
- [ ] Create configuration guide
  - When to use each tier
  - Config file examples (YAML, JSON, JS, TS)
  - Troubleshooting common issues
- [ ] Update API documentation
  - Document config module exports
  - Add JSDoc to all public functions
- [ ] Add migration guide
  - For users currently passing explicit paths
  - How to transition to config files

## Documentation Sections

### Configuration Overview
```markdown
## Configuration

RiotPlan uses a flexible four-tier configuration system:

1. **Environment Variable** (highest priority)
   - Set `RIOTPLAN_PLAN_DIRECTORY` in your shell or IDE
   
2. **Config File** (project-level)
   - Create `riotplan.config.yaml` (or .json, .js, .ts)
   - Supports multiple naming conventions
   
3. **Auto-Detection** (convenience)
   - Automatically finds `plans/` directory
   
4. **Fallback** (default)
   - Uses `./plans` in current directory
```

### Config File Examples
- YAML example
- JSON example
- JavaScript example
- TypeScript example

### Troubleshooting
- Config not being found
- Wrong directory being used
- How to debug with --check-config

## Acceptance Criteria

- [ ] All documentation is updated
- [ ] Examples are clear and tested
- [ ] Migration guide is complete
- [ ] API docs are comprehensive

## Notes

Good documentation is critical for adoption. Make it easy to understand and use.
