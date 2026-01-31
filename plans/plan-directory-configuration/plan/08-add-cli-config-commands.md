# Step 08: Add CLI Configuration Commands

## Goal

Add `--init-config` and `--check-config` commands to help users manage configuration.

## Tasks

- [ ] Add `--init-config` flag to CLI
  - Creates `riotplan.config.yaml` with sensible defaults
  - Prompts user for planDirectory location
  - Includes comments explaining options
- [ ] Add `--check-config` command
  - Shows current configuration resolution
  - Displays which tier is being used
  - Shows config file location if found
  - Validates configuration
- [ ] Update CLI help text
- [ ] Add examples to documentation

## --init-config Output Example

```yaml
# RiotPlan Configuration
# See https://github.com/kjerneverk/riotplan for documentation

# Directory where plans are stored (relative or absolute)
planDirectory: ./plans

# Optional: Default AI provider
# defaultProvider: anthropic

# Optional: Default model
# defaultModel: claude-3-5-sonnet-20241022

# Optional: Custom template directory
# templateDirectory: ./.riotplan/templates
```

## --check-config Output Example

```
RiotPlan Configuration Check
============================

✓ Configuration loaded successfully

Source: Config file (tier 2)
Location: /Users/me/project/riotplan.config.yaml
Plan Directory: /Users/me/project/plans (exists: yes)

Settings:
  planDirectory: ./plans
  defaultProvider: anthropic
  defaultModel: claude-3-5-sonnet-20241022
```

## Acceptance Criteria

- [ ] --init-config creates valid config file
- [ ] --check-config shows current resolution
- [ ] Both commands have helpful output
- [ ] Documentation is updated

## Notes

These commands leverage CardiganTime's built-in features. Check CardiganTime docs for examples.
