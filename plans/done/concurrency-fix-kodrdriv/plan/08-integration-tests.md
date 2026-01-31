# Step 08: Add Integration Tests

## Goal

Add end-to-end integration tests that verify parallel execution with multiple packages works correctly.

## Prerequisites

- Step 07 completed (unit tests pass)

## Tasks

### Task 1: Create Test Monorepo

```typescript
async function createTestMonorepo() {
  const tmpDir = await mkdtemp(join(tmpdir(), 'test-monorepo-'));
  
  // Create 3 packages with different repositories
  await createTestPackage(tmpDir, '@test/pkg-a', 'test-org/repo-a');
  await createTestPackage(tmpDir, '@test/pkg-b', 'test-org/repo-b');
  await createTestPackage(tmpDir, '@test/pkg-c', 'test-org/repo-c');
  
  return tmpDir;
}
```

### Task 2: Test Parallel Execution

```typescript
describe('Parallel Execution Integration', () => {
  it('should use correct repository for each package', async () => {
    const monorepo = await createTestMonorepo();
    
    const result = await executeTreePublish({
      directory: monorepo,
      parallel: true,
      dryRun: true,
    });
    
    // Verify each package used its own repository
    expect(result.packages['@test/pkg-a'].repository).toBe('test-org/repo-a');
    expect(result.packages['@test/pkg-b'].repository).toBe('test-org/repo-b');
    expect(result.packages['@test/pkg-c'].repository).toBe('test-org/repo-c');
  });
  
  it('should not contaminate contexts between packages', async () => {
    // Test that package A never references package B's repository
  });
});
```

### Task 3: Test Against Real Monorepo

```typescript
describe('Real Monorepo Test', () => {
  it('should work with kjerneverk monorepo', async () => {
    // Test against actual kjerneverk monorepo
    // Use dry-run mode to avoid actual operations
  });
});
```

## Acceptance Criteria

- [ ] Integration tests pass
- [ ] No cross-package contamination
- [ ] Works with real monorepo
- [ ] Parallel and sequential modes both work

## Verification

```bash
npm test -- integration
```

## Deliverables

1. Integration test suite
2. Test monorepo utilities
3. Real monorepo validation

## Notes

- Use dry-run mode for safety
- Test with 3+ packages
- Verify logs show correct repositories
