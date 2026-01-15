# RiotPlan Dashboard

A web-based dashboard for visualizing and managing RiotPlan plans.

## Features

- 📊 Overview statistics for all plans
- 🔍 Search and filter plans
- 📈 Progress visualization
- 🔄 Real-time refresh
- 🎨 Modern, responsive UI

## Installation

```bash
npm install @riotprompt/riotplan-dashboard
```

## Usage

### As CLI

```bash
# Start dashboard scanning current directory
npx riotplan-dashboard

# Scan specific directories
npx riotplan-dashboard ./plans ../other-plans

# Custom port
npx riotplan-dashboard -p 3000 ./plans
```

### As Library

```typescript
import { createServer } from "@riotprompt/riotplan-dashboard";

const server = await createServer({
    port: 8090,
    searchPaths: ["./plans"],
});

await server.start();
console.log(`Dashboard running at ${server.getUrl()}`);
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/plans` | GET | List all plans |
| `/api/plans/:path` | GET | Get plan details |
| `/api/stats` | GET | Get registry statistics |
| `/api/search` | GET | Search plans with filters |
| `/api/refresh` | POST | Refresh all plans |
| `/api/refresh/:path` | POST | Refresh a specific plan |
| `/api/scan` | POST | Scan for new plans |

### Search Parameters

- `status` - Filter by status (can be comma-separated)
- `codePattern` - Filter by code pattern (regex)
- `namePattern` - Filter by name pattern (regex)
- `tags` - Filter by tags (comma-separated)
- `minProgress` - Minimum progress percentage
- `maxProgress` - Maximum progress percentage
- `sortBy` - Sort field (name, code, progress, status)
- `sortDir` - Sort direction (asc, desc)
- `limit` - Limit results
- `offset` - Offset for pagination

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Start dev mode
npm run start
```

## License

Apache-2.0

