# Step 03: Design Isolation Strategy

## Goal

Design a comprehensive isolation strategy that eliminates shared state and ensures each package execution has its own isolated context.

## Prerequisites

- Step 02 completed (shared state analyzed)
- Understanding of root causes
- Knowledge of Node.js concurrency patterns

## Tasks

### Task 1: Design PackageExecutionContext

Create a context class that encapsulates all per-package state:

```typescript
/**
 * Isolated execution context for a single package in tree operations.
 * Each package gets its own context to prevent state leakage.
 */
export class PackageExecutionContext {
  // Package identity
  readonly packageName: string;
  readonly packagePath: string;
  
  // Git repository information
  readonly repositoryUrl: string;
  readonly repositoryOwner: string;
  readonly repositoryName: string;
  readonly gitRemote: string;
  
  // GitHub client (isolated per package)
  private _githubClient?: GitHubClient;
  
  // Working directory (for validation)
  readonly workingDirectory: string;
  
  constructor(options: PackageContextOptions) {
    this.packageName = options.packageName;
    this.packagePath = options.packagePath;
    this.workingDirectory = options.workingDirectory;
    
    // Detect repository information in isolation
    const repoInfo = this.detectRepositoryInfo();
    this.repositoryUrl = repoInfo.url;
    this.repositoryOwner = repoInfo.owner;
    this.repositoryName = repoInfo.name;
    this.gitRemote = repoInfo.remote;
  }
  
  /**
   * Get GitHub client for this package.
   * Creates a new client instance isolated to this package.
   */
  getGitHubClient(): GitHubClient {
    if (!this._githubClient) {
      this._githubClient = new GitHubClient({
        owner: this.repositoryOwner,
        repo: this.repositoryName,
        token: process.env.GITHUB_TOKEN,
      });
    }
    return this._githubClient;
  }
  
  /**
   * Detect repository information from this package's directory.
   * Must be called with correct working directory.
   */
  private detectRepositoryInfo(): RepositoryInfo {
    // Implementation will be in step 05
    // Must use this.packagePath, not process.cwd()
  }
  
  /**
   * Validate that this context is being used correctly.
   * Throws if context is contaminated or misused.
   */
  validate(): void {
    // Ensure we're in the right directory
    if (process.cwd() !== this.workingDirectory) {
      throw new Error(
        `Context validation failed: Expected cwd ${this.workingDirectory}, got ${process.cwd()}`
      );
    }
    
    // Ensure repository info is valid
    if (!this.repositoryUrl || !this.repositoryOwner || !this.repositoryName) {
      throw new Error('Context validation failed: Invalid repository information');
    }
  }
}
```

### Task 2: Design Context Factory

Create a factory for creating isolated contexts:

```typescript
export class PackageContextFactory {
  /**
   * Create an isolated execution context for a package.
   * 
   * @param packageInfo - Package information from workspace analysis
   * @returns Isolated context for this package
   */
  static createContext(packageInfo: PackageInfo): PackageExecutionContext {
    // Save current working directory
    const originalCwd = process.cwd();
    
    try {
      // Change to package directory
      process.chdir(packageInfo.path);
      
      // Create context with repository detection in correct directory
      const context = new PackageExecutionContext({
        packageName: packageInfo.name,
        packagePath: packageInfo.path,
        workingDirectory: packageInfo.path,
      });
      
      // Validate context before returning
      context.validate();
      
      return context;
    } finally {
      // Always restore original working directory
      process.chdir(originalCwd);
    }
  }
}
```

### Task 3: Design Parallel Executor Refactoring

Refactor the parallel executor to use contexts:

```typescript
// Before (buggy):
async function executePackagesParallel(packages: Package[]) {
  await Promise.all(
    packages.map(pkg => executePackage(pkg))
  );
}

// After (fixed):
async function executePackagesParallel(packages: Package[]) {
  // Create isolated context for each package
  const contexts = packages.map(pkg => 
    PackageContextFactory.createContext(pkg)
  );
  
  // Execute with contexts
  await Promise.all(
    contexts.map(ctx => executePackageWithContext(ctx))
  );
}
```

### Task 4: Design Context Passing Strategy

Define how contexts are passed through the execution chain:

```
Tree Command
    ↓
Create Contexts (one per package)
    ↓
Parallel Executor
    ↓
For each context in parallel:
    ↓
    executePackageWithContext(context)
        ↓
        context.validate() // Ensure correct context
        ↓
        publishCommand.execute({ context })
            ↓
            context.getGitHubClient() // Use isolated client
            ↓
            GitHub operations with correct repository
```

### Task 5: Design Validation Strategy

Add validation at key points:

```typescript
// At entry to critical functions:
function createPullRequest(context: PackageExecutionContext, ...args) {
  // Validate context
  context.validate();
  
  // Log for debugging
  logger.debug(`Creating PR for ${context.packageName} in ${context.repositoryUrl}`);
  
  // Use context's GitHub client
  const client = context.getGitHubClient();
  
  // Proceed with operation
}
```

### Task 6: Design Migration Path

Plan the refactoring approach:

1. **Phase 1**: Add context parameter (optional) to all functions
2. **Phase 2**: Update parallel executor to create and pass contexts
3. **Phase 3**: Update functions to use context when provided
4. **Phase 4**: Make context parameter required
5. **Phase 5**: Remove old code paths

## Acceptance Criteria

- [ ] `PackageExecutionContext` class designed
- [ ] `PackageContextFactory` designed
- [ ] Parallel executor refactoring planned
- [ ] Context passing strategy defined
- [ ] Validation strategy designed
- [ ] Migration path documented

## Verification

```bash
# Review design with team
# Ensure all shared state is addressed
# Verify design is implementable
```

## Deliverables

1. `docs/design/package-execution-context.md` - Context class design
2. `docs/design/context-factory.md` - Factory design
3. `docs/design/parallel-executor-refactoring.md` - Executor changes
4. `docs/design/context-passing-strategy.md` - How contexts flow
5. `docs/design/validation-strategy.md` - Validation approach
6. `docs/design/migration-path.md` - Implementation plan

## Notes

- Keep the design simple and focused
- Ensure backward compatibility during migration
- Add validation at every critical point
- Make it impossible to use the wrong context
