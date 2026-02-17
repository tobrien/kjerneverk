# Step 03: Create Simplified HTTP MCP Tools

## Objective

Design and implement curated set of MCP tools that work with StorageProvider API instead of filesystem operations

## Background

Following the selected approach to design simplified MCP tools from scratch that call StorageProvider API directly. Need to replace complex file-based tools with clean API-driven equivalents.

## Tasks

### 1. 03.1

Create HTTP-specific tool base in riotplan/src/mcp/tools-http/shared.ts:

```typescript
import type { StorageProvider } from '@kjerneverk/riotplan-format';

interface HttpToolContext {
  storageProvider: StorageProvider;
  planId?: string;  // UUID or path resolution
  sessionId: string;
  config: ServerConfig;
}

export async function resolvePlanProvider(
  context: HttpToolContext, 
  planIdentifier?: string
): Promise<StorageProvider> {
  // Resolve by UUID, abbreviation, or slug
  if (planIdentifier?.match(/^[0-9a-f]{8,}/)) {
    return context.storageFactory.createProvider(findPlanByUuid(planIdentifier));
  }
  return context.storageProvider;
}
```

### 2. 03.2

Implement core plan management tools in riotplan/src/mcp/tools-http/:

- **plans-list.ts**: List all plans with metadata
- **plan-status.ts**: Get plan status and progress
- **plan-create.ts**: Create new plan with UUID generation
- **step-list.ts**: List steps for a plan
- **step-update.ts**: Update step status and content

Example plan-status.ts:
```typescript
export const planStatusTool: HttpMcpTool = {
  name: 'riotplan_status',
  description: 'Get plan status and progress information',
  schema: {
    planId: z.string().optional().describe('Plan UUID or identifier')
  },
  execute: async (args, context: HttpToolContext) => {
    const provider = await resolvePlanProvider(context, args.planId);
    const metadata = await provider.getMetadata();
    const steps = await provider.getSteps();
    
    return {
      success: true,
      data: {
        plan: metadata.data,
        progress: calculateProgress(steps.data),
        status: deriveOverallStatus(steps.data)
      }
    };
  }
};
```

### 3. 03.3

Create plan lifecycle management tools:

- **plan-transition.ts**: Move plans between lifecycle stages
- **plan-archive.ts**: Move completed plans to done/ directory
- **plan-hold.ts**: Move plans to hold/ directory

These tools handle the done/hold directory organization required by constraint 5.

### 4. 03.4

Update HTTP server to register simplified tools in riotplan/src/mcp/server-hono.ts:

```typescript
import { httpTools } from './tools-http/index.js';

// Register HTTP-specific tools instead of filesystem-based ones
for (const tool of httpTools) {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === tool.name) {
      const context = {
        storageProvider: session.storageProvider,
        sessionId: session.id,
        config: serverConfig
      };
      return await tool.execute(request.params.arguments, context);
    }
  });
}
```

## Acceptance Criteria

- [ ] HTTP MCP tools operate entirely through StorageProvider API
- [ ] No direct filesystem access in tool implementations
- [ ] Tools support UUID-based plan identification
- [ ] Plan lifecycle tools handle done/hold directory management
- [ ] All tools return structured JSON responses

## Testing

Test each tool via HTTP MCP server, verify StorageProvider integration, confirm no filesystem dependencies, test UUID resolution

## Files Changed

- `riotplan/src/mcp/tools-http/shared.ts`
- `riotplan/src/mcp/tools-http/plans-list.ts`
- `riotplan/src/mcp/tools-http/plan-status.ts`
- `riotplan/src/mcp/tools-http/plan-create.ts`
- `riotplan/src/mcp/tools-http/step-list.ts`
- `riotplan/src/mcp/tools-http/step-update.ts`
- `riotplan/src/mcp/tools-http/plan-transition.ts`
- `riotplan/src/mcp/tools-http/index.ts`

## Notes

Simplified tool set focuses on essential plan operations without the complexity of the existing filesystem-based tools.
