# Step 05: Isolate Git Operations

## Goal

Refactor git operations to use the isolated `PackageExecutionContext` instead of shared state or `process.cwd()`.

## Prerequisites

- Step 04 completed (context classes exist)
- Understanding of current git operations

## Tasks

### Task 1: Update Parallel Executor

Modify `src/commands-tree/executor.ts` to create and use contexts:

```typescript
async function executePackagesParallel(packages: Package[], command: string) {
  // Create isolated context for each package
  const contexts = PackageContextFactory.createContexts(packages);
  
  // Execute with contexts in parallel
  const results = await Promise.all(
    packages.map(pkg => {
      const context = contexts.get(pkg.name)!;
      return executePackageWithContext(pkg, context, command);
    })
  );
  
  return results;
}
```

### Task 2: Pass Context Through Execution Chain

Update `executePackageWithContext` to pass context to publish command:

```typescript
async function executePackageWithContext(
  pkg: Package,
  context: PackageExecutionContext,
  command: string
) {
  // Validate context before use
  context.validate();
  
  logger.info(`Executing ${command} for ${context}`);
  
  // Pass context to command execution
  await executeCommand(command, {
    cwd: context.packagePath,
    context, // NEW: Pass context
  });
}
```

### Task 3: Update Publish Command

Modify `src/commands-publish/index.ts` to accept and use context:

```typescript
export async function execute(options: PublishOptions & { context?: PackageExecutionContext }) {
  const { context } = options;
  
  if (context) {
    // Use context for repository information
    logger.info(`Publishing ${context.packageName} to ${context.repositoryUrl}`);
    
    // Pass context to GitHub operations
    await createPullRequest({ ...options, context });
    await createRelease({ ...options, context });
  } else {
    // Fallback to old behavior for sequential mode
    // (Will be removed in later phase)
  }
}
```

### Task 4: Update Git Utility Functions

Ensure git operations use context's package path:

```typescript
function getGitRemote(context?: PackageExecutionContext): string {
  if (context) {
    // Use context's repository information
    return context.gitRemote;
  }
  
  // Fallback for sequential mode
  return execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
}
```

## Acceptance Criteria

- [ ] Parallel executor creates contexts
- [ ] Context passed through execution chain
- [ ] Publish command accepts context
- [ ] Git operations use context when available
- [ ] Tests pass
- [ ] No regression in sequential mode

## Verification

```bash
npm test
npm run precommit
```

## Deliverables

1. Updated `src/commands-tree/executor.ts`
2. Updated `src/commands-publish/index.ts`
3. Updated git utility functions

## Notes

- Maintain backward compatibility
- Sequential mode should still work
- Add validation at each step
