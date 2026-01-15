# RiotPlan Dashboard Guide

The RiotPlan Dashboard provides a web-based interface for visualizing and managing your plans.

## Quick Start

```bash
# Start the dashboard
npx riotplan-dashboard ./plans

# Open in browser
open http://localhost:8090
```

## Features

### Dashboard Overview

The main dashboard shows:
- Total plan count
- Average progress across all plans
- Status breakdown (completed, in progress, pending, blocked)
- Searchable, filterable plan list

### Plan Details

Click on any plan to see:
- Current status and progress
- Step completion
- Description and tags
- Full path
- Refresh capability

### Real-time Updates

Use the refresh button to:
- Rescan search paths for new plans
- Update plan statuses
- Recalculate statistics

## Configuration

### Port Configuration

```bash
# Default port is 8090
npx riotplan-dashboard -p 3000 ./plans
```

### Multiple Search Paths

```bash
# Scan multiple directories
npx riotplan-dashboard ./project-a/plans ./project-b/plans
```

## API Usage

The dashboard exposes a REST API for programmatic access:

```typescript
// List all plans
const response = await fetch("http://localhost:8090/api/plans");
const { plans, total } = await response.json();

// Search plans
const response = await fetch("http://localhost:8090/api/search?status=in_progress");
const { plans } = await response.json();

// Get statistics
const response = await fetch("http://localhost:8090/api/stats");
const stats = await response.json();
```

## Integration

### With riotplan-cli

The dashboard can be started via the CLI:

```bash
riotplan dashboard start ./plans
```

### Programmatic Usage

```typescript
import { createServer } from "@riotprompt/riotplan-dashboard";

const server = await createServer({
    port: 8090,
    searchPaths: ["./plans"],
});

await server.start();

// Later...
await server.refresh(); // Refresh plan data
await server.stop();    // Stop the server
```

