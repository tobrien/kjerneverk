# Step 04: Implement Walk-Up Detection for Tier 3

## Goal

Implement custom walk-up logic to find existing `plans/` directories when no explicit configuration exists (tier 3).

## Tasks

- [ ] Create `src/config/walk-up.ts`
- [ ] Implement `findPlansDirectory(startPath: string): string | null`
  - Walk up from startPath
  - At each level, check if `plans/` subdirectory exists
  - Return first match found
  - Stop at filesystem root
  - No special handling for .code-workspace or .git files (per user feedback)
- [ ] Add caching to avoid repeated filesystem operations
- [ ] Export `clearWalkUpCache()` for testing
- [ ] Add comprehensive JSDoc documentation

## Algorithm

```
function findPlansDirectory(startPath):
  currentPath = resolve(startPath)
  
  while currentPath is not filesystem root:
    plansPath = join(currentPath, 'plans')
    if plansPath exists and is directory:
      return currentPath
    
    parentPath = dirname(currentPath)
    if parentPath == currentPath:
      break  // reached root
    currentPath = parentPath
  
  return null
```

## Acceptance Criteria

- [ ] Walk-up function works correctly
- [ ] Finds plans/ directory at any level
- [ ] Stops at filesystem root
- [ ] Results are cached
- [ ] No special workspace file handling
- [ ] Well documented

## Notes

Per user feedback: "At each level, check to see if there is a plans subdirectory. And if there is a plans subdirectory, use that one."

Example: Running from `/Users/tobrien/gitw/kjerneverk/riotplan/src/analysis` should find `/Users/tobrien/gitw/kjerneverk/plans`
