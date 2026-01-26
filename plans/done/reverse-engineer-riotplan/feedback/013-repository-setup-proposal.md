# Feedback: Repository Setup Proposal

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.7.6 → v0.7.7

## Feedback Given

> "For the plan that you are going to create, what I want you to do is propose a directory structure first and then I'll do the work of creating all those GitHub repos and reviewing what we need as well, work that into the analysis somewhere."

## Resolution

Added "Proposed Repository Setup (For Review)" section with:

### Two Options Presented

**Option A: Monorepo (Recommended)**
```
riotplan/                     # Single GitHub repo
├── packages/
│   ├── core/
│   ├── cli/
│   ├── vscode/
│   ├── dashboard/
│   ├── server/
│   └── renderer/
├── apps/web/
├── docs/
└── examples/
```

**Option B: Multi-Repo**
```
GitHub Organization: riotplan/
├── riotplan-core/
├── riotplan-cli/
├── riotplan-vscode/
├── riotplan-dashboard/
├── riotplan-server/
└── riotplan-renderer/
```

### Recommendation
Start with **Monorepo** because:
- Early development benefits from atomic changes
- Easier to refactor interfaces between packages
- Can split later if needed (monorepo → multi-repo is easier than reverse)

### Directory Creation Script
Included bash script to bootstrap the structure.

### Package Dependency Graph
```
@riotplan/core          # No dependencies (leaf)
       ↑
       ├── @riotplan/cli
       ├── @riotplan/vscode
       ├── @riotplan/dashboard
       ├── @riotplan/server
       └── @riotplan/renderer
```

### Clear Next Steps
1. **User**: Create the GitHub repo and directory structure
2. **User**: Review and adjust as needed
3. **Then**: Create implementation plan for Phase 1
4. **Then**: Execute

## Key Insight

The first real test of RiotPlan will be building RiotPlan itself—the implementation plan will use the very patterns we've defined (evidence/, feedback/, etc.).

