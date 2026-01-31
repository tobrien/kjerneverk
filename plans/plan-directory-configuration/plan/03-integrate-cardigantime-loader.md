# Step 03: Integrate CardiganTime Config Loader

## Goal

Set up CardiganTime to handle configuration discovery, loading, and validation for tiers 1-2 (env var + config files).

## Tasks

- [ ] Create `src/config/loader.ts`
- [ ] Import CardiganTime's `create` function
- [ ] Configure CardiganTime with riotplan settings:
  - App name: 'riotplan'
  - Config schema: RiotPlanConfigSchema
  - Hierarchical mode: 'enabled' (walks up directory tree)
  - Environment variable: RIOTPLAN_PLAN_DIRECTORY
- [ ] Export `loadConfig()` function that returns validated config
- [ ] Add error handling for config loading failures
- [ ] Add caching to avoid repeated filesystem operations

## Implementation Notes

CardiganTime will automatically:
- Check RIOTPLAN_PLAN_DIRECTORY env var (tier 1)
- Search for config files (tier 2):
  - riotplan.config.{yaml,json,js,ts}
  - riotplan.conf.{yaml,json,js,ts}
  - .riotplan/config.{yaml,json,js,ts}
  - .riotplanrc.{yaml,json,js,ts}
  - .riotplanrc
- Walk up directory tree (hierarchical discovery)
- Validate against Zod schema
- Handle precedence (env var > config file > defaults)

## Acceptance Criteria

- [ ] CardiganTime is properly initialized
- [ ] Config loading works with all supported formats
- [ ] Environment variable override works
- [ ] Hierarchical discovery works
- [ ] Errors are handled gracefully
- [ ] Results are cached

## Notes

Reference CardiganTime documentation: https://github.com/utilarium/cardigantime
