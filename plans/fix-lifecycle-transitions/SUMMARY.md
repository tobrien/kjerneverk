# fix-lifecycle-transitions

## Overview

Fix RiotPlan lifecycle transition workflow to prevent creating duplicate plan directories. Currently, when transitioning from shaping to plan stage, `riotplan_create` creates a new directory instead of creating plan files in the existing idea/shaping directory. This breaks the workflow continuity.

## Goals

1. Add `riotplan_transition` tool for moving between lifecycle stages (forward and backward)
2. Make `riotplan_create` smarter to detect if current directory is an idea/shaping directory
3. Add `riotplan_build` tool to transition to "built" stage and create plan files in existing directory

## Scope

### In Scope

- Transition tool implementation (forward and backward stage transitions)
- Smart detection in create tool (check for IDEA.md, SHAPING.md, LIFECYCLE.md)
- Build tool implementation (transition to built + create plan files)
- Update LIFECYCLE.md during transitions
- Preserve existing history/timeline during transitions

### Out of Scope

- Changing existing stage names or lifecycle model
- Modifying how stages are represented in files

## Success Criteria

- [ ] `riotplan_transition` tool exists and can move between any stages
- [ ] `riotplan_create` detects existing idea/shaping directories and warns/prevents duplicate creation
- [ ] `riotplan_build` tool exists and creates plan files in existing directory
- [ ] Transitions update LIFECYCLE.md correctly
- [ ] History/timeline preserved during transitions
- [ ] Backward transitions work (built → shaping → idea)
- [ ] All tools respect current working directory context

---

*Plan created: 2026-01-31*
