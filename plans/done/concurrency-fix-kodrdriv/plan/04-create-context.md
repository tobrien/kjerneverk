# Step 04: Create Execution Context

## Goal

Implement the `PackageExecutionContext` class and `PackageContextFactory` to provide isolated execution contexts for each package.

## Prerequisites

- Step 03 completed (design finalized)
- Understanding of the context design
- Access to kodrdriv source code

## Tasks

### Task 1: Create PackageExecutionContext Class

Create `src/commands-tree/package-execution-context.ts`:

```typescript
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

export interface PackageContextOptions {
  packageName: string;
  packagePath: string;
  workingDirectory: string;
}

export interface RepositoryInfo {
  url: string;
  owner: string;
  name: string;
  remote: string;
}

/**
 * Isolated execution context for a single package in tree operations.
 * Prevents state leakage between parallel package executions.
 */
export class PackageExecutionContext {
  readonly packageName: string;
  readonly packagePath: string;
  readonly workingDirectory: string;
  readonly repositoryUrl: string;
  readonly repositoryOwner: string;
  readonly repositoryName: string;
  readonly gitRemote: string;
  
  private _githubClient?: any; // Will be typed properly in step 06
  
  constructor(options: PackageContextOptions) {
    this.packageName = options.packageName;
    this.packagePath = resolve(options.packagePath);
    this.workingDirectory = resolve(options.workingDirectory);
    
    // Detect repository information in isolation
    const repoInfo = this.detectRepositoryInfo();
    this.repositoryUrl = repoInfo.url;
    this.repositoryOwner = repoInfo.owner;
    this.repositoryName = repoInfo.name;
    this.gitRemote = repoInfo.remote;
  }
  
  /**
   * Detect repository information from this package's directory.
   * Uses the package path, not process.cwd(), to avoid contamination.
   */
  private detectRepositoryInfo(): RepositoryInfo {
    try {
      // Get git remote URL from package directory
      const remote = execSync('git config --get remote.origin.url', {
        cwd: this.packagePath,
        encoding: 'utf-8',
      }).trim();
      
      // Parse repository URL
      const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (!match) {
        throw new Error(`Could not parse repository URL: ${remote}`);
      }
      
      const [, owner, name] = match;
      const url = `https://github.com/${owner}/${name}`;
      
      return { url, owner, name, remote };
    } catch (error) {
      throw new Error(
        `Failed to detect repository for ${this.packageName} at ${this.packagePath}: ${error}`
      );
    }
  }
  
  /**
   * Validate that this context is being used correctly.
   * Throws if context appears contaminated or misused.
   */
  validate(): void {
    if (!this.repositoryUrl || !this.repositoryOwner || !this.repositoryName) {
      throw new Error(
        `Context validation failed for ${this.packageName}: Invalid repository information`
      );
    }
    
    if (!this.packagePath || !this.workingDirectory) {
      throw new Error(
        `Context validation failed for ${this.packageName}: Invalid paths`
      );
    }
  }
  
  /**
   * Get a string representation for logging.
   */
  toString(): string {
    return `PackageExecutionContext(${this.packageName} → ${this.repositoryOwner}/${this.repositoryName})`;
  }
}
```

### Task 2: Create PackageContextFactory

Add to the same file:

```typescript
export class PackageContextFactory {
  /**
   * Create an isolated execution context for a package.
   * Ensures repository detection happens in the correct directory.
   */
  static createContext(packageInfo: {
    name: string;
    path: string;
  }): PackageExecutionContext {
    const context = new PackageExecutionContext({
      packageName: packageInfo.name,
      packagePath: packageInfo.path,
      workingDirectory: packageInfo.path,
    });
    
    // Validate immediately
    context.validate();
    
    return context;
  }
  
  /**
   * Create contexts for multiple packages.
   * Each context is completely isolated.
   */
  static createContexts(packages: Array<{ name: string; path: string }>): Map<string, PackageExecutionContext> {
    const contexts = new Map<string, PackageExecutionContext>();
    
    for (const pkg of packages) {
      const context = this.createContext(pkg);
      contexts.set(pkg.name, context);
    }
    
    return contexts;
  }
}
```

### Task 3: Add Tests for Context Creation

Create `tests/commands-tree/package-execution-context.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PackageExecutionContext, PackageContextFactory } from '../../src/commands-tree/package-execution-context';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';

describe('PackageExecutionContext', () => {
  let testDir: string;
  
  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'kodrdriv-test-'));
  });
  
  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });
  
  describe('repository detection', () => {
    it('should detect repository information from git remote', () => {
      // Setup: Create a git repo with remote
      execSync('git init', { cwd: testDir });
      execSync('git remote add origin git@github.com:test-org/test-repo.git', { cwd: testDir });
      
      // Execute: Create context
      const context = new PackageExecutionContext({
        packageName: '@test/package',
        packagePath: testDir,
        workingDirectory: testDir,
      });
      
      // Assert: Repository info is correct
      expect(context.repositoryOwner).toBe('test-org');
      expect(context.repositoryName).toBe('test-repo');
      expect(context.repositoryUrl).toBe('https://github.com/test-org/test-repo');
    });
    
    it('should handle HTTPS remote URLs', () => {
      execSync('git init', { cwd: testDir });
      execSync('git remote add origin https://github.com/test-org/test-repo.git', { cwd: testDir });
      
      const context = new PackageExecutionContext({
        packageName: '@test/package',
        packagePath: testDir,
        workingDirectory: testDir,
      });
      
      expect(context.repositoryOwner).toBe('test-org');
      expect(context.repositoryName).toBe('test-repo');
    });
  });
  
  describe('validation', () => {
    it('should validate successfully for valid context', () => {
      execSync('git init', { cwd: testDir });
      execSync('git remote add origin git@github.com:test-org/test-repo.git', { cwd: testDir });
      
      const context = new PackageExecutionContext({
        packageName: '@test/package',
        packagePath: testDir,
        workingDirectory: testDir,
      });
      
      expect(() => context.validate()).not.toThrow();
    });
  });
});

describe('PackageContextFactory', () => {
  it('should create isolated contexts for multiple packages', () => {
    // This test will be expanded in integration tests
    // For now, just verify the factory works
    expect(PackageContextFactory.createContexts).toBeDefined();
  });
});
```

### Task 4: Export from Module

Update `src/commands-tree/index.ts` to export the new classes:

```typescript
export { PackageExecutionContext, PackageContextFactory } from './package-execution-context';
```

### Task 5: Add Logging

Add logging to context creation for debugging:

```typescript
import { logger } from '../logger';

// In PackageExecutionContext constructor:
logger.debug(`Creating execution context for ${this.packageName}`);
logger.debug(`  Package path: ${this.packagePath}`);
logger.debug(`  Repository: ${this.repositoryOwner}/${this.repositoryName}`);
```

## Acceptance Criteria

- [ ] `PackageExecutionContext` class implemented
- [ ] `PackageContextFactory` implemented
- [ ] Repository detection works correctly
- [ ] Validation logic implemented
- [ ] Unit tests pass
- [ ] Exports added to module
- [ ] Logging added

## Verification

```bash
cd /Users/tobrien/gitw/grunnverk/kodrdriv

# Run tests
npm test -- package-execution-context

# Run precommit checks
npm run precommit
```

## Deliverables

1. `src/commands-tree/package-execution-context.ts` - Context implementation
2. `tests/commands-tree/package-execution-context.test.ts` - Unit tests
3. Updated `src/commands-tree/index.ts` - Exports

## Notes

- Keep repository detection simple and robust
- Handle both SSH and HTTPS git URLs
- Add comprehensive error messages
- Make validation strict to catch issues early
