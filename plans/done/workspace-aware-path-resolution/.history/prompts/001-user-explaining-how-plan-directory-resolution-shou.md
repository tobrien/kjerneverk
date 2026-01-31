# Narrative: User explaining how plan directory resolution should work in different contexts (IDE vs CLI)

**Date**: 2026-01-30T15:31:08.939Z
**Source**: typing
**Speaker**: user

---

User explaining default behavior context: "It depends on the context. If I'm running RiotPlan in an IDE like Claude Code in VSCode, Cursor, or just straight up VSCode, I likely would want you to look at the workspace that this project is in and find the root directory. For the project I work on, I have multiple folders in a workspace, but my workspace root is usually the same directory that my workspace file is in. That is the directory which usually has a plans/ directory in it, and I usually want you to use that directory.

If I'm running this from the command line, it's very likely that I'm going to be running it within a project that has a plans directory somewhere up the chain. So, for example, let's assume I'm in the terminal and I'm in this directory /Users/tobrien/gitw/kjerneverk/riotplan/src/analysis - well, I know that this is part of the kjerneverk project and if I walk up the chain of directories, I'm going to notice that I have a ./plans directory here /Users/tobrien/gitw/kjerneverk/plans

Now I understand that this is a lot of work, but in this case it would be valid to walk up the path and find the first directory that has a plans subdirectory and assume that this is where I want to put the plan."
