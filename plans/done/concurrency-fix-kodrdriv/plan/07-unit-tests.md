# Step 07: Add Unit Tests

## Goal

Add comprehensive unit tests for execution context isolation and repository detection.

## Prerequisites

- Steps 04-06 completed (implementation done)

## Tasks

### Task 1: Test Context Isolation

```typescript
describe('Context Isolation', () => {
  it('should create independent contexts for different packages', () => {
    const contexts = PackageContextFactory.createContexts([
      { name: '@test/pkg-a', path: '/path/to/pkg-a' },
      { name: '@test/pkg-b', path: '/path/to/pkg-b' },
    ]);
    
    const ctxA = contexts.get('@test/pkg-a')!;
    const ctxB = contexts.get('@test/pkg-b')!;
    
    expect(ctxA.packageName).not.toBe(ctxB.packageName);
    expect(ctxA.repositoryUrl).not.toBe(ctxB.repositoryUrl);
  });
});
```

### Task 2: Test GitHub Client Isolation

```typescript
describe('GitHub Client Isolation', () => {
  it('should create separate clients for each context', () => {
    const ctx1 = createTestContext({ name: '@test/pkg-1' });
    const ctx2 = createTestContext({ name: '@test/pkg-2' });
    
    const client1 = ctx1.getGitHubClient();
    const client2 = ctx2.getGitHubClient();
    
    expect(client1).not.toBe(client2);
  });
});
```

### Task 3: Test Repository Detection

```typescript
describe('Repository Detection', () => {
  it('should detect correct repository from git remote', () => {
    // Test with various repository URL formats
  });
  
  it('should throw error for invalid repository', () => {
    // Test error handling
  });
});
```

### Task 4: Test Validation

```typescript
describe('Context Validation', () => {
  it('should validate correct context', () => {
    const ctx = createValidContext();
    expect(() => ctx.validate()).not.toThrow();
  });
  
  it('should reject invalid context', () => {
    const ctx = createInvalidContext();
    expect(() => ctx.validate()).toThrow();
  });
});
```

## Acceptance Criteria

- [ ] Context isolation tests pass
- [ ] GitHub client isolation tests pass
- [ ] Repository detection tests pass
- [ ] Validation tests pass
- [ ] Code coverage > 80%

## Verification

```bash
npm test -- --coverage
```

## Deliverables

1. Unit tests for all new functionality
2. Test utilities for creating test contexts

## Notes

- Use mocks for GitHub API
- Test edge cases
- Ensure tests are deterministic
