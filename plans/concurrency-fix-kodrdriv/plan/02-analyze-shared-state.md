# Step 02: Analyze Shared State

## Goal

Identify all shared mutable state in the parallel execution path and document how it leads to repository context mixing.

## Prerequisites

- Step 01 completed (reproduction test exists)
- Understanding of kodrdriv's tree command architecture
- Access to source code

## Tasks

### Task 1: Map Execution Flow

Trace the execution path from tree command to package execution:

```
User Command: kodrdriv tree publish --parallel
    ↓
commands-tree/index.ts: execute()
    ↓
commands-tree/executor.ts: executeParallel()
    ↓
For each package in parallel:
    ↓
commands-publish/index.ts: execute()
    ↓
github-tools/github.ts: createPR(), createRelease()
```

Document each function and what state it accesses.

### Task 2: Identify Shared State

Find all shared mutable state:

#### Global Variables
```typescript
// Look for patterns like:
let currentRepository: string;
let githubClient: GitHubClient;
let workingDirectory: string;
```

#### Module-Level Singletons
```typescript
// Look for patterns like:
export const gitHubClient = new GitHubClient();
export const repositoryCache = new Map();
```

#### Shared Configuration Objects
```typescript
// Look for patterns like:
const config = {
  repository: detectRepository(),
  // ... shared across executions
};
```

#### Process-Level State
```typescript
// Look for:
process.cwd() // Working directory
process.env // Environment variables
```

### Task 3: Analyze Repository Detection

Examine how repositories are detected:

```typescript
// Find the repository detection code
// Likely in commands-tree or github-tools

// Questions to answer:
// 1. When is repository detection called?
// 2. Is the result cached?
// 3. Is it called once or per-package?
// 4. Does it depend on process.cwd()?
```

Create a table:

| Function | When Called | Caching | Scope | Problem |
|----------|-------------|---------|-------|---------|
| `detectRepository()` | Once at start | Yes | Global | Shared across all packages |
| `getGitRemote()` | Per package | No | Local | Should work but may use wrong cwd |

### Task 4: Analyze GitHub Client Creation

Examine GitHub client initialization:

```typescript
// Find GitHub client creation
// Likely in github-tools/github.ts

// Questions:
// 1. When is the client created?
// 2. Is it a singleton?
// 3. How does it get repository information?
// 4. Is it shared across parallel executions?
```

### Task 5: Document Data Flow

Create a detailed data flow diagram showing:

```
Package A Execution (Parallel)
    ↓
Calls detectRepository()
    ↓
Returns cached "execution-openai" (WRONG!)
    ↓
Creates GitHub client with "execution-openai"
    ↓
All operations use wrong repository

Package B Execution (Parallel, same time)
    ↓
Calls detectRepository()
    ↓
Returns cached "execution-openai" (WRONG!)
    ↓
Uses same GitHub client
    ↓
All operations use wrong repository
```

### Task 6: Identify Root Causes

Document the specific root causes:

1. **Shared Repository Cache**: Repository detection result is cached globally
2. **Singleton GitHub Client**: One client instance shared across all packages
3. **Working Directory Confusion**: `process.cwd()` changes affect all parallel executions
4. **No Execution Context**: No per-package context to isolate state

## Acceptance Criteria

- [ ] Complete execution flow documented
- [ ] All shared state identified and cataloged
- [ ] Repository detection mechanism analyzed
- [ ] GitHub client creation analyzed
- [ ] Data flow diagram created
- [ ] Root causes identified and documented

## Verification

```bash
# Review the analysis with another developer
# Ensure all shared state is identified
# Verify the root causes are accurate
```

## Deliverables

1. `docs/analysis/execution-flow.md` - Complete execution flow
2. `docs/analysis/shared-state-inventory.md` - Catalog of shared state
3. `docs/analysis/repository-detection.md` - Repository detection analysis
4. `docs/analysis/github-client-analysis.md` - GitHub client analysis
5. `docs/analysis/data-flow-diagram.md` - Visual data flow
6. `docs/analysis/root-causes.md` - Root cause analysis

## Notes

- Be thorough - missing shared state will cause bugs
- Use code search tools to find all instances
- Check both obvious and subtle shared state
- Consider thread-local storage, closures, and module scope
