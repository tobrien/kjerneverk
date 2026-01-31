# Concurrency Fix for Kodrdriv - Plan Overview

## Quick Start

To execute this plan:

```bash
# Read the execution plan
cat EXECUTION_PLAN.md

# Check current status
cat STATUS.md

# Start with step 01
cat plan/01-reproduce-bug.md
```

## Plan Structure

```
concurrency-fix-kodrdriv/
├── concurrency-fix-kodrdriv-prompt.md  # Original problem statement
├── SUMMARY.md                           # Executive summary
├── EXECUTION_PLAN.md                    # Step-by-step execution guide
├── STATUS.md                            # Progress tracker
└── plan/                                # Detailed step files
    ├── 01-reproduce-bug.md
    ├── 02-analyze-shared-state.md
    ├── 03-design-isolation.md
    ├── 04-create-context.md
    ├── 05-isolate-git.md
    ├── 06-isolate-github.md
    ├── 07-unit-tests.md
    ├── 08-integration-tests.md
    ├── 09-validate-fix.md
    └── 10-documentation.md
```

## The Bug

During parallel execution of `kodrdriv tree publish --parallel`, packages share repository context, causing:
- Package A trying to create releases in Package B's repository
- All packages referencing the same GitHub repository URL
- Cross-package contamination in PR and release operations

## The Solution

Implement `PackageExecutionContext` to provide isolated execution contexts for each package:
- Separate git repository detection per package
- Isolated GitHub API clients
- No shared mutable state
- Validation at critical points

## Estimated Timeline

- **Phase 1 (Analysis)**: 6-9 hours
- **Phase 2 (Implementation)**: 6-11 hours
- **Phase 3 (Testing)**: 5-7 hours
- **Phase 4 (Documentation)**: 1-2 hours

**Total**: 12-18 hours of focused development

## Success Criteria

1. Parallel execution uses correct repository for each package (100% accuracy)
2. Zero cross-package contamination in testing
3. Performance remains similar to current implementation
4. All tests pass
5. Documentation complete

## Target Codebase

- **Location**: `/Users/tobrien/gitw/grunnverk/kodrdriv`
- **Module**: `@grunnverk/commands-tree`
- **Related**: `@grunnverk/github-tools`, `@grunnverk/commands-publish`

## Evidence

From real tree publish execution on 2026-01-26:
```
[2/8] @riotprompt/execution: ♻️  Reusing existing PR #13: https://github.com/kjerneverk/execution-openai/pull/13
[1/8] @riotprompt/agentic: Waiting for PR #13 checks to complete...
```

Package `@riotprompt/execution` incorrectly used `kjerneverk/execution-openai` repository.

## Workaround

Sequential execution works correctly:
```bash
npx kodrdriv tree publish --start-from package-name
```

Use this until the fix is complete.
