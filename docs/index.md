# RiotPlan Documentation

**Framework for long-lived, stateful AI workflows**

RiotPlan is a comprehensive framework for managing multi-step AI-assisted tasks that span multiple sessions, have persistent state, and can be interrupted and resumed.

## Quick Start

```bash
# Install the core package
npm install @riotprompt/riotplan

# Create a new plan
npx riotplan plan init my-feature

# List templates
npx riotplan plan template list
```

## Core Concepts

### Plans

A plan is a structured directory containing:

```
my-plan/
├── SUMMARY.md           # Overview of the approach
├── EXECUTION_PLAN.md    # Step-by-step strategy
├── STATUS.md            # Current state (auto-updated)
├── plan/                # Step files
│   ├── 01-first-step.md
│   ├── 02-second-step.md
│   └── ...
├── feedback/            # Feedback records
└── evidence/            # Evidence artifacts
```

### Steps

Steps are numbered markdown files that describe individual tasks within a plan. Each step has:

- A number (01, 02, etc.)
- A title
- A status (pending, in_progress, completed, blocked, skipped)
- Optional dependencies on other steps

### Status Tracking

The `STATUS.md` file is automatically updated as the plan progresses, tracking:

- Overall plan status
- Progress percentage
- Current step
- Blockers and issues

## Packages

| Package | Description |
|---------|-------------|
| [@riotprompt/riotplan](./packages/riotplan.md) | Core plan management |
| [@riotprompt/riotplan-cli](./packages/riotplan-cli.md) | Command-line interface |
| [@riotprompt/riotplan-templates](./packages/templates.md) | Starter templates |
| [@riotprompt/riotplan-renderer](./packages/renderer.md) | Export to Markdown/JSON/HTML |
| [@riotprompt/riotplan-dashboard](./packages/dashboard.md) | Web dashboard |
| [@riotprompt/riotplan-history](./packages/history.md) | Version history |

## Guides

- [Getting Started](./guides/getting-started.md)
- [Creating Plans](./guides/creating-plans.md)
- [Using Templates](./guides/templates.md)
- [Dependency Management](./guides/dependencies.md)
- [Cross-Plan Relationships](./guides/relationships.md)
- [Retrospectives](./guides/retrospectives.md)

## API Reference

- [Core API](./api/core.md)
- [Status API](./api/status.md)
- [Steps API](./api/steps.md)
- [Dependencies API](./api/dependencies.md)
- [Registry API](./api/registry.md)

## License

MIT

