# Execution Plan: fix-lifecycle-transitions

## Strategy

Implement three complementary fixes:
1. **Transition tool** - Core lifecycle management (forward/backward)
2. **Smart create** - Prevent accidental duplicate directories
3. **Build tool** - Explicit "build plan" workflow

All three work together to ensure smooth workflow continuity.

## Prerequisites

- [ ] Understanding of lifecycle stages (idea, shaping, built, etc.)
- [ ] Understanding of LIFECYCLE.md format
- [ ] Understanding of how plan files are created

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Add Transition Tool | Implement riotplan_transition for stage transitions (allow any transitions) |
| 02 | Make Create Tool Smart | Detect existing idea/shaping directories (warn but allow) |
| 03 | Add Build Tool | Implement riotplan_build with AI generation via riotplan_generate |
| 04 | Update Tool Integration | Register new tools in MCP server |
| 05 | Testing & Documentation | Test all scenarios and update docs |

## Quality Gates

After each step:
- [ ] Code compiles
- [ ] Tools work correctly
- [ ] LIFECYCLE.md updated properly
- [ ] History preserved

## Notes

- Transition should work both forward and backward (no validation - allow any transitions)
- Create tool should detect IDEA.md, SHAPING.md, or LIFECYCLE.md and **warn but allow**
- Build tool should use **AI generation** via `riotplan_generate` to create plan files
- Build tool creates SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, plan/ directory
- All tools should use current working directory resolution

---

*Last updated: 2026-01-31*
