# Feedback: Project Structure, Multiple Packages, and Tooling

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.7.5 → v0.7.6

## Feedback Given

> "I want you to also think about how this should probably be multiple projects from the start. You could just throw this into one 'riotplan' and 'riotplan-cli' project, but I think I'm already getting the sense that the list of riotplan commands from this section are going to be large. It might make sense to group related commands together and think through what the project structure would look like."

> "I also think it's a good idea to split out the CLI code from the core code, and let's just get ahead of things and create a project that will capture the VSCode Extension for this."

> "I also think that you'll probably want some sort of dashboard project that you can start locally that might make use of React. Let's get the plan to get complex and let's move this forward."

## Resolution

Added **Part 7: Project Structure** with:

### Proposed Monorepo Structure
```
riotplan/
├── packages/
│   ├── core/           # @riotplan/core - types, plan operations
│   ├── cli/            # @riotplan/cli - command-line interface
│   ├── vscode/         # @riotplan/vscode - VS Code extension
│   ├── dashboard/      # @riotplan/dashboard - React dashboard
│   ├── server/         # @riotplan/server - API, sync, attention
│   └── renderer/       # @riotplan/renderer - PDF/HTML/DOCX
└── apps/
    └── web/            # Hosted dashboard (optional)
```

### CLI Subcommand Structure
Instead of 60+ flat commands, grouped as:
```bash
riotplan plan init/validate/archive
riotplan step add/remove/block
riotplan exec run/resume/skip
riotplan feedback create/list/show
riotplan revision save/list/restore
riotplan artifact pack/unpack/share
riotplan render pdf/html/docx
```

### VS Code Extension Features
- Plan Explorer (tree view)
- Status Decorations
- Inline Feedback capture
- Attention Tracking
- Webview Panels

### Dashboard Features
- Multi-Plan Overview
- Attention Timeline
- Feedback Browser
- Status Board (Kanban-style)
- Ecosystem Map

### Implementation Phases
| Phase | Packages | Focus |
|-------|----------|-------|
| 1 | core, cli | Basic plan operations |
| 2 | core, cli | Feedback, revision tracking |
| 3 | renderer, cli | Document rendering |
| 4 | vscode | VS Code extension (basic) |
| 5 | server, dashboard | Local dashboard |
| 6 | vscode | Enhanced integration |
| 7 | All | Ecosystem awareness |

## Key Insight

The scope has grown significantly. Design for modularity from the start:
- **Separation of concerns**: Core logic reusable across CLI, VS Code, dashboard
- **Independent deployment**: Can use CLI without VS Code
- **Incremental delivery**: Ship CLI first, add VS Code later

