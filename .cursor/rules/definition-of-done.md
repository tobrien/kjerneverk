# Definition of Done for kjerneverk Workspace

## Rule

When fixing bugs, lint errors, or making any code changes in this monorepo workspace, the job is **not complete** until `kodrdriv tree precommit` passes successfully at the workspace root level (`/Users/tobrien/gitw/kjerneverk`).

## Verification

After making changes, always run:

```bash
cd /Users/tobrien/gitw/kjerneverk && kodrdriv tree precommit
```

This command runs precommit checks (lint + tests) across all 9 packages in dependency order. All packages must pass for the task to be considered complete.

## What This Means

- Don't just fix the immediate file - verify the entire workspace builds cleanly
- A task is only "done" when all packages pass their precommit checks
- If `kodrdriv tree precommit` fails on any package, continue fixing until it passes

