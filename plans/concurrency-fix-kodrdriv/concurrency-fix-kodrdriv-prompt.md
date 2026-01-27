# Fix Parallel Execution Repository Context Bug in Kodrdriv

## Overview

Fix a critical concurrency bug in kodrdriv's tree publish command where packages executing in parallel incorrectly share repository context, causing them to attempt operations on the wrong GitHub repositories.

## The Problem

During parallel execution of `kodrdriv tree publish --parallel`, multiple packages share repository context state, leading to:

- Package A trying to create releases in Package B's repository
- All packages referencing the same GitHub repository URL (e.g., `kjerneverk/execution-openai`)
- PR creation and GitHub API calls targeting incorrect repositories
- Race conditions in git repository detection and GitHub client initialization

### Evidence

From the tree publish execution on 2026-01-26:

```
[2/8] @riotprompt/execution: ♻️  Reusing existing PR #13: https://github.com/kjerneverk/execution-openai/pull/13
[1/8] @riotprompt/agentic: Waiting for PR #13 checks to complete...
```

Package `@riotprompt/execution` (which should use `kjerneverk/execution`) was trying to use PR #13 from `kjerneverk/execution-openai`.

### Root Cause

Shared state in parallel execution:
- Git repository detection logic is not isolated per package
- GitHub API client instances are shared across parallel executions
- Working directory context is not properly scoped to each package
- Repository URL detection happens once and is reused

## Goals

1. **Isolate execution contexts** - Each package in parallel execution must have completely isolated state
2. **Fix repository detection** - Ensure each package correctly identifies its own git repository
3. **Prevent state leakage** - No shared state between parallel package executions
4. **Maintain performance** - Keep parallel execution benefits while fixing the bug
5. **Add safeguards** - Implement validation to catch similar issues in the future

## What This Plan Does NOT Do

- Does not change the tree publish workflow or user-facing API
- Does not modify the sequential execution path (which works correctly)
- Does not add new features beyond the bug fix
- Does not change how individual package publish works

## Success Criteria

1. **Parallel execution works correctly** - Each package operates on its own repository
2. **No cross-package contamination** - Package A never references Package B's repository
3. **Tests pass** - All existing tests continue to pass
4. **New tests added** - Tests specifically for parallel execution isolation
5. **Sequential mode unchanged** - Non-parallel execution continues to work identically
6. **Documentation updated** - Architecture notes explain the isolation strategy

## Context

- **Codebase**: `/Users/tobrien/gitw/grunnverk/kodrdriv`
- **Affected module**: `@grunnverk/commands-tree`
- **Related modules**: `@grunnverk/github-tools`, `@grunnverk/commands-publish`
- **Test evidence**: Tree publish logs from 2026-01-26 showing repository context mixing
