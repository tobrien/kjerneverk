# Step 01: Reproduce & Document Bug

## Goal

Create a minimal, reliable reproduction case for the parallel execution repository context bug, and document the exact failure scenario with evidence.

## Prerequisites

- Access to kodrdriv codebase at `/Users/tobrien/gitw/grunnverk/kodrdriv`
- Test monorepo with multiple packages (can use kjerneverk as example)
- Understanding of the bug from real-world evidence

## Tasks

### Task 1: Create Reproduction Test

Create a test that demonstrates the bug:

```typescript
// tests/commands-tree/parallel-execution-bug.test.ts

describe('Parallel Execution Repository Context Bug', () => {
  it('should use correct repository for each package in parallel mode', async () => {
    // Setup: Create test monorepo with 3 packages
    const testRepo = await createTestMonorepo({
      packages: [
        { name: '@test/package-a', repo: 'test-org/package-a' },
        { name: '@test/package-b', repo: 'test-org/package-b' },
        { name: '@test/package-c', repo: 'test-org/package-c' },
      ]
    });
    
    // Execute: Run tree publish in parallel
    const result = await executeTreePublish({
      directory: testRepo.path,
      parallel: true,
      dryRun: true, // Don't actually publish
    });
    
    // Assert: Each package should reference its own repository
    expect(result.packages['@test/package-a'].repository).toBe('test-org/package-a');
    expect(result.packages['@test/package-b'].repository).toBe('test-org/package-b');
    expect(result.packages['@test/package-c'].repository).toBe('test-org/package-c');
    
    // This test will FAIL before the fix, demonstrating the bug
  });
});
```

### Task 2: Document Real-World Evidence

Create a document capturing the actual bug occurrence:

```markdown
# Bug Evidence - Parallel Execution Repository Mixing

## Incident Date
2026-01-26

## Command Executed
```bash
cd /Users/tobrien/gitw/kjerneverk
npx kodrdriv tree publish --parallel
```

## Expected Behavior
Each package should operate on its own repository:
- @riotprompt/execution → kjerneverk/execution
- @riotprompt/agentic → kjerneverk/agentic
- @riotprompt/execution-openai → kjerneverk/execution-openai

## Actual Behavior
All packages attempted to use kjerneverk/execution-openai:

```
[2/8] @riotprompt/execution: ♻️  Reusing existing PR #13: https://github.com/kjerneverk/execution-openai/pull/13
[1/8] @riotprompt/agentic: Waiting for PR #13 checks to complete...
POST /repos/kjerneverk/execution-openai/releases - 422
```

## Repository Configuration
All packages have correct git remotes:
- execution: git@github.com:kjerneverk/execution.git
- agentic: git@github.com:kjerneverk/agentic.git
- execution-openai: git@github.com:kjerneverk/execution-openai.git

## Conclusion
Bug is in kodrdriv's parallel execution, not repository setup.
```

### Task 3: Identify Failure Points

Map out where the repository context gets mixed:

1. **Repository Detection**: Where does kodrdriv detect the git repository?
2. **GitHub Client Creation**: Where is the GitHub API client initialized?
3. **PR Operations**: Where are PR URLs constructed?
4. **Release Operations**: Where are release API calls made?

Create a flow diagram showing the data flow.

### Task 4: Create Debug Logging

Add temporary debug logging to track repository context:

```typescript
// Add to parallel executor
console.log(`[DEBUG] Package: ${pkg.name}, Working Dir: ${process.cwd()}`);
console.log(`[DEBUG] Detected Repository: ${detectedRepo}`);
console.log(`[DEBUG] GitHub Client Repository: ${githubClient.repo}`);
```

Run with debug logging and capture output.

## Acceptance Criteria

- [ ] Reproduction test created and fails (demonstrating the bug)
- [ ] Real-world evidence documented with logs and examples
- [ ] Failure points identified and mapped
- [ ] Debug logging added and output captured
- [ ] Flow diagram created showing where context mixing occurs

## Verification

```bash
# Run the reproduction test (should fail before fix)
cd /Users/tobrien/gitw/grunnverk/kodrdriv
npm test -- parallel-execution-bug

# Verify test fails with repository mismatch error
# This confirms we have a reliable reproduction case
```

## Deliverables

1. `tests/commands-tree/parallel-execution-bug.test.ts` - Reproduction test
2. `docs/bugs/parallel-execution-repository-mixing.md` - Evidence document
3. `docs/bugs/failure-points-diagram.md` - Flow diagram
4. Debug logs showing repository context mixing

## Notes

- Keep the reproduction test simple and focused
- Use dry-run mode to avoid actual GitHub operations
- The test should fail reliably before the fix
- Document exact error messages and stack traces
