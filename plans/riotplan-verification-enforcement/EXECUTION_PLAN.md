# Execution Plan: riotplan-verification-enforcement

## Strategy

Extend the existing configuration system with verification options, enhance the step completion flow with configurable verification checks, and implement enforcement mechanisms with appropriate escape hatches. The system will validate acceptance criteria, verify artifacts, and generate retrospectives automatically while maintaining compatibility with existing workflows.

## Prerequisites

- [ ] Understanding of requirements from IDEA.md
- [ ] Review selected approach from SHAPING.md

## Steps

| Step | Name | Description |
|------|------|-------------|
| 01 | Extend Configuration Schema for Verification Settings | Add verification configuration options to support three strictness levels and related settings |
| 02 | Create Verification Engine with Enforcement Logic | Build the core verification engine that can check acceptance criteria and enforce completion rules based on configuration |
| 03 | Enhance Step Completion with Verification Hooks | Integrate verification engine into the step completion flow with proper error handling and user interaction |
| 04 | Enhance CLI Step Command with Interactive Verification | Add interactive verification prompts and force flags to the CLI step completion command |
| 05 | Implement Artifact Verification and Evidence Requirements | Add artifact verification for file existence, Git commits, and evidence requirement checking |
| 06 | Add Documentation and Migration Guide | Create comprehensive documentation for the verification system and migration guide for existing users |

## Quality Gates

After each step:
- [ ] Code compiles/runs
- [ ] Tests pass
- [ ] Documentation updated

## Notes

- Follow the step-by-step approach
- Update STATUS.md as you progress
- Use riotplan_step_start and riotplan_step_complete for tracking

---

*Last updated: 2026-02-18*
