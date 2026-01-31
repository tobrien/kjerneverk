# Step 05: Implement Four-Tier Plan Directory Resolver

## Goal

Create the main resolver that orchestrates all four tiers of plan directory resolution.

## Tasks

- [ ] Create `src/config/resolver.ts`
- [ ] Implement `resolvePlanDirectory(): string` function with four tiers:
  1. Check CardiganTime config (handles env var + config files)
  2. If no config, use walk-up to find existing plans/ directory
  3. If not found, fallback to './plans' relative to process.cwd()
- [ ] Add `clearResolverCache()` for testing
- [ ] Handle relative vs absolute paths correctly
- [ ] Add logging/debugging support (optional, based on env var or config)
- [ ] Export clean public API

## Four-Tier Logic

```typescript
export function resolvePlanDirectory(): string {
  // Tier 1 & 2: CardiganTime (env var + config files)
  const config = loadConfig();
  if (config?.planDirectory) {
    return resolve(config.planDirectory);
  }
  
  // Tier 3: Walk up looking for existing plans/ directory
  const foundPlans = findPlansDirectory(process.cwd());
  if (foundPlans) {
    return join(foundPlans, 'plans');
  }
  
  // Tier 4: Fallback to ./plans in current directory
  return join(process.cwd(), 'plans');
}
```

## Acceptance Criteria

- [ ] All four tiers work correctly
- [ ] Precedence is respected
- [ ] Paths are properly resolved (absolute)
- [ ] Caching works across tiers
- [ ] Debugging output available when needed
- [ ] Clean, well-documented API

## Notes

This is the main entry point that other parts of riotplan will use. Keep it simple and reliable.
