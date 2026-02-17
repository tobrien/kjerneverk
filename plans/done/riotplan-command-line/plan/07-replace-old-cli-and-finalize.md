# Step 7: Replace Old CLI Commands and Finalize

## Objective

Remove deprecated CLI commands, update the command structure, ensure utility commands work, and finalize the `riotplan --help` output.

## Background

The old CLI was built around an "analysis → generate" workflow that predates the lifecycle model. Commands like amend, amendments, analysis, elaborate, feedback, and verify are being replaced by the new LLM-powered commands (explore, build, execute, chat). Some utility commands (status, step, plan, render, check-config) remain as non-LLM quick operations.

No backwards compatibility is required — the old commands can be removed entirely.

## Tasks

### Remove Deprecated Commands
- [ ] Remove `amend` command and related code
- [ ] Remove `amendments` command and related code
- [ ] Remove `analysis` command (show, ready) and related code
- [ ] Remove `elaborate` command and related code
- [ ] Remove `feedback` command and related code
- [ ] Remove `generate` command (replaced by `build`)
- [ ] Remove `verify` command
- [ ] Clean up any dead code, unused imports, orphaned files from removed commands

### Retain and Update Utility Commands
- [ ] `riotplan status [path]` — Keep, ensure it works with lifecycle-based plans
- [ ] `riotplan step list|start|complete|add [path]` — Keep for quick non-LLM step management
- [ ] `riotplan plan init|validate|archive` — Keep for plan management
- [ ] `riotplan render [path]` — Keep for output generation
- [ ] `riotplan check-config` — Keep for configuration inspection
- [ ] `riotplan --init-config` — Keep for initial setup

### Update Help and Documentation
- [ ] Update `riotplan --help` to show the new command structure
- [ ] Group commands: LLM-powered (explore, build, execute, chat) vs Utility (status, step, plan, render, check-config)
- [ ] Update `--version` to reflect the new version
- [ ] Add `--provider` and `--model` as global options for LLM commands
- [ ] Write brief README section about CLI usage

### Final Validation
- [ ] Run `riotplan --help` and verify output is clean and correct
- [ ] Verify all utility commands still work
- [ ] Verify `riotplan explore` → `build` → `execute` full workflow from CLI
- [ ] Verify `riotplan mcp` still works (MCP server mode unchanged)
- [ ] Test clean install: `npm install -g @kjerneverk/riotplan` and verify commands work

## Acceptance Criteria

- Old commands are removed, no dead code remains
- `riotplan --help` shows a clean, organized command structure
- Utility commands work as before
- LLM-powered commands are the primary interface
- MCP server mode is unaffected
- Clean install and first-run experience works

## Key Files

- `riotplan/src/cli/` — CLI command definitions
- `riotplan/src/cli/commands/` — Individual command files
- `riotplan/package.json` — Version, bin entry
- `riotplan/README.md` — Usage documentation

## Dependencies

- Step 6 (all commands built)
