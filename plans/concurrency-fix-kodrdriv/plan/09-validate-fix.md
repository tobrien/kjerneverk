# Step 09: Validate Fix

## Goal

Validate the fix works correctly with the real kjerneverk monorepo and measure performance.

## Prerequisites

- Step 08 completed (integration tests pass)

## Tasks

### Task 1: Test with Kjerneverk Monorepo

```bash
cd /Users/tobrien/gitw/kjerneverk

# Test with dry-run first
npx kodrdriv tree publish --parallel --dry-run

# Verify logs show correct repositories for each package
grep "repository" output.log
```

### Task 2: Verify Repository Isolation

Check logs to ensure:
- `@riotprompt/execution` uses `kjerneverk/execution`
- `@riotprompt/agentic` uses `kjerneverk/agentic`
- `@riotprompt/execution-openai` uses `kjerneverk/execution-openai`
- No package references another's repository

### Task 3: Performance Benchmark

Compare execution time:

```bash
# Before fix (sequential workaround)
time npx kodrdriv tree publish --start-from package-a

# After fix (parallel)
time npx kodrdriv tree publish --parallel
```

### Task 4: Run Full Publish (if safe)

If dry-run looks good, run actual publish:

```bash
npx kodrdriv tree publish --parallel
```

Monitor for any issues.

## Acceptance Criteria

- [ ] Dry-run succeeds with correct repositories
- [ ] No cross-package contamination in logs
- [ ] Performance is acceptable
- [ ] Full publish succeeds (if attempted)
- [ ] All packages reach correct repositories

## Verification

```bash
# Check logs for repository URLs
grep -i "repository\|github.com" kodrdriv.log

# Verify no errors
grep -i "error\|fail" kodrdriv.log
```

## Deliverables

1. Validation report
2. Performance metrics
3. Log analysis

## Notes

- Start with dry-run
- Carefully review logs
- Compare with sequential execution
- Document any issues found
