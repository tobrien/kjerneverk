# Step 06: Isolate GitHub Client

## Goal

Ensure each package uses its own isolated GitHub API client with correct repository information.

## Prerequisites

- Step 05 completed (git operations isolated)
- Context passed through execution chain

## Tasks

### Task 1: Add GitHub Client to Context

Update `PackageExecutionContext` to create isolated GitHub clients:

```typescript
import { GitHubClient } from '../github-tools/github';

export class PackageExecutionContext {
  private _githubClient?: GitHubClient;
  
  getGitHubClient(): GitHubClient {
    if (!this._githubClient) {
      this._githubClient = new GitHubClient({
        owner: this.repositoryOwner,
        repo: this.repositoryName,
        token: process.env.GITHUB_TOKEN,
      });
      
      logger.debug(`Created GitHub client for ${this.repositoryUrl}`);
    }
    return this._githubClient;
  }
}
```

### Task 2: Update GitHub Operations

Modify `src/github-tools/github.ts` to use context:

```typescript
export async function createPullRequest(
  options: PROptions & { context?: PackageExecutionContext }
) {
  const { context } = options;
  
  if (context) {
    // Use context's isolated client
    const client = context.getGitHubClient();
    
    logger.info(`Creating PR in ${context.repositoryUrl}`);
    return await client.createPR(options);
  }
  
  // Fallback for sequential mode
}
```

### Task 3: Add Repository Validation

Add validation before GitHub operations:

```typescript
function validateRepository(context: PackageExecutionContext, operation: string) {
  context.validate();
  
  logger.debug(`${operation} for ${context.packageName} → ${context.repositoryUrl}`);
  
  // Ensure we're not using wrong repository
  if (!context.repositoryUrl.includes(context.repositoryName)) {
    throw new Error(`Repository validation failed: ${context.repositoryUrl} doesn't match ${context.repositoryName}`);
  }
}
```

### Task 4: Update All GitHub API Calls

Update these functions to use context:
- `createPullRequest`
- `mergePullRequest`
- `createRelease`
- `waitForWorkflows`

## Acceptance Criteria

- [ ] GitHub client isolated per package
- [ ] All GitHub operations use context
- [ ] Repository validation added
- [ ] Tests pass
- [ ] No cross-package contamination

## Verification

```bash
npm test
npm run precommit
```

## Deliverables

1. Updated `PackageExecutionContext` with GitHub client
2. Updated `src/github-tools/github.ts`
3. Repository validation functions

## Notes

- Each package must have its own client
- Validate repository before every operation
- Log repository URL for debugging
