# @riotprompt/riotplan

Core package for RiotPlan - a framework for managing long-lived, stateful AI workflows.

## Installation

```bash
npm install @riotprompt/riotplan
```

## Features

- **Plan Management**: Create, load, and validate plans
- **Status Tracking**: Automatic progress tracking via STATUS.md
- **Step Operations**: Insert, remove, move, and update step status
- **Dependency Tracking**: Internal step dependencies and cross-plan relationships
- **Feedback Capture**: Store and manage feedback records
- **Plan Registry**: Discover and track plans across directories
- **Retrospectives**: Generate RETROSPECTIVE.md for completed plans
- **Execution**: Framework for automated step execution
- **MCP Server**: Model Context Protocol integration for AI assistants (see [MCP Integration](#mcp-integration))

## Quick Start

```typescript
import {
    createPlan,
    loadPlan,
    validatePlan,
    startStep,
    completeStep,
} from "@riotprompt/riotplan";

// Create a new plan
const result = await createPlan({
    code: "my-feature",
    name: "My Feature",
    basePath: "./plans",
    steps: [
        { title: "Setup" },
        { title: "Implement" },
        { title: "Test" },
    ],
});

// Load an existing plan
const plan = await loadPlan("./plans/my-feature");

// Validate the plan
const validation = await validatePlan(plan);

// Update step status
await startStep(plan, 1);
await completeStep(plan, 1);
```

## Main Exports

### Plan Operations

- `createPlan(config)` - Create a new plan
- `loadPlan(path)` - Load an existing plan
- `validatePlan(plan)` - Validate plan structure

### Status Operations

- `parseStatus(content)` - Parse STATUS.md content
- `generateStatus(plan)` - Generate STATUS.md
- `updateStatus(plan)` - Update STATUS.md file

### Step Operations

- `insertStep(plan, after, step)` - Insert a new step
- `removeStep(plan, number)` - Remove a step
- `moveStep(plan, from, to)` - Move a step
- `startStep(plan, number)` - Mark step as in progress
- `completeStep(plan, number)` - Mark step as complete
- `blockStep(plan, number, reason)` - Block a step
- `skipStep(plan, number)` - Skip a step

### Dependency Operations

- `parseDependenciesFromContent(content)` - Parse step dependencies
- `buildDependencyGraph(steps)` - Build dependency graph
- `validateDependencies(graph)` - Validate dependencies
- `computeExecutionOrder(graph)` - Get execution order

### Registry Operations

- `loadRegistry(path)` - Load plan registry
- `registerPlan(registry, path)` - Register a plan
- `searchPlans(registry, query)` - Search plans

### Retrospective Operations

- `generateRetrospective(plan)` - Generate retrospective data
- `createRetrospective(plan)` - Create RETROSPECTIVE.md

## MCP Integration

RiotPlan is available as an MCP (Model Context Protocol) server, allowing AI assistants like Cursor to manage plans directly.

### Installation for MCP

```bash
npm install -g @riotprompt/riotplan
```

### Cursor Configuration

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "riotplan": {
      "command": "npx",
      "args": ["-y", "@riotprompt/riotplan", "riotplan-mcp"]
    }
  }
}
```

### Available Tools

- `riotplan_create` - Create new plans with AI
- `riotplan_status` - Show plan status and progress
- `riotplan_step_list` - List all steps
- `riotplan_step_start` - Mark step as started
- `riotplan_step_complete` - Mark step as completed
- `riotplan_step_add` - Add new steps
- `riotplan_validate` - Validate plan structure
- `riotplan_generate` - Generate with AI

### Resources

- `riotplan://plan/{path}` - Plan metadata
- `riotplan://status/{path}` - Current status
- `riotplan://steps/{path}` - All steps
- `riotplan://step/{path}?number=N` - Specific step

### Prompts

- `create_plan` - Plan creation workflow
- `execute_step` - Step execution workflow
- `track_progress` - Progress tracking workflow

See the [MCP Guide](../../riotplan/guide/mcp.md) or [README](../../riotplan/README.md#mcp-integration) for detailed documentation.

## Types

See the [API Reference](../api/core.md) for complete type definitions.

## License

Apache-2.0

