# Step 06: Integrate catalyst into riotplan config system

## Phase
Phase 2: Riotplan Integration

## Objective
Extend riotplan's configuration system to support catalyst declaration. Users should be able to specify default catalysts in their `riotplan.config.ts` that apply to all plans in the project.

## Tasks

### 6.1 Extend RiotPlanConfigSchema
In `riotplan/src/config/schema.ts`, add:
```typescript
catalysts: z.array(z.string()).optional(),  // Ordered list of catalyst paths or IDs
catalystDirectory: z.string().optional(),   // Directory containing local catalysts
```

### 6.2 Add catalyst resolution to config loading
In `riotplan/src/config/loader.ts`:
- When config is loaded, resolve catalyst identifiers to directories
- Phase 1: resolve local paths (relative to config file location, similar to planDirectory)
- Phase 2 (future): resolve from node_modules
- Add environment variable support: `RIOTPLAN_CATALYSTS`, `RIOTPLAN_CATALYST_DIRECTORY`

### 6.3 Add riotplan-catalyst as a dependency
- Add `@kjerneverk/riotplan-catalyst` as a dependency of `@kjerneverk/riotplan`
- Import catalyst loading and merging functions
- Wire config-declared catalysts through the loader and merger

### 6.4 Create a catalyst loading pipeline
- Config declares catalysts → resolve paths → load each → merge in order → make available to generator and MCP tools
- Cache loaded/merged catalysts to avoid re-reading on every operation
- Pipeline function: `loadConfiguredCatalysts(config: RiotPlanConfig): Promise<MergedCatalyst | null>`

### 6.5 Write integration tests
- Test config with catalysts declared
- Test config without catalysts (backward compatible, no change)
- Test invalid catalyst path produces clear error
- Test catalyst loading pipeline end-to-end

## Definition of Done
- [ ] riotplan.config.ts accepts `catalysts` and `catalystDirectory` fields
- [ ] Catalysts from config are resolved, loaded, and merged
- [ ] No catalysts configured = no behavior change (backward compatible)
- [ ] Environment variable overrides work
- [ ] Integration tests pass
