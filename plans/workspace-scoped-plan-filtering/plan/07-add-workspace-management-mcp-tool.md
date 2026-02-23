# Step 07: Add Workspace Management MCP Tool

## Objective

Create MCP tool for setting and managing plan workspace assignments

## Background

Need server-side tool to allow clients (including CLI and VS Code) to assign workspace IDs to existing plans and create new plans with workspace assignments.

## Tasks

### 1. 07.1

Create set-plan-workspace MCP tool in riotplan/src/mcp/tools-http/set-plan-workspace.ts:

```typescript
/**
 * Set Plan Workspace Tool - Assign workspace ID to a plan
 */

import { z } from 'zod';
import { createSqliteProvider } from '@kjerneverk/riotplan-format';
import type { HttpToolContext, ToolResult } from './shared.js';
import { findPlanByUuid } from './shared.js';

export const setPlanWorkspaceSchema = z.object({
    planId: z.string().describe('Plan ID or UUID to update'),
    workspaceId: z.string().nullable().describe('Workspace identifier (null to clear)'),
});

export async function executeSetPlanWorkspace(
    args: z.infer<typeof setPlanWorkspaceSchema>,
    context: HttpToolContext
): Promise<ToolResult> {
    try {
        // Find the plan file
        const planFile = findPlanByUuid(args.planId, context.plansDir);
        if (!planFile) {
            return {
                success: false,
                error: `Plan not found: ${args.planId}`,
            };
        }
        
        // Update the plan's workspace ID
        const provider = createSqliteProvider(planFile);
        
        if (!await provider.exists()) {
            await provider.close();
            return {
                success: false,
                error: `Plan file exists but cannot be opened: ${planFile}`,
            };
        }
        
        const result = await provider.updateWorkspaceId(args.workspaceId);
        await provider.close();
        
        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to update workspace ID',
            };
        }
        
        return {
            success: true,
            data: {
                message: args.workspaceId 
                    ? `Plan ${args.planId} assigned to workspace: ${args.workspaceId}`
                    : `Workspace assignment cleared for plan ${args.planId}`,
                planId: args.planId,
                workspaceId: args.workspaceId,
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to set plan workspace',
        };
    }
}
```

### 2. 07.2

Register the new tool in riotplan/src/mcp/tools-http/index.ts:

```typescript
import { executeSetPlanWorkspace, setPlanWorkspaceSchema } from './set-plan-workspace.js';

// Add to tools array
export const httpTools = [
    // ... existing tools ...
    {
        name: 'set_plan_workspace',
        description: 'Assign a workspace identifier to a plan for scoping and filtering',
        inputSchema: setPlanWorkspaceSchema,
        execute: executeSetPlanWorkspace,
    },
];
```

### 3. 07.3

Create workspace discovery tool in riotplan/src/mcp/tools-http/list-workspaces.ts:

```typescript
/**
 * List Workspaces Tool - Get all unique workspace IDs from plans
 */

import { z } from 'zod';
import { createSqliteProvider } from '@kjerneverk/riotplan-format';
import type { HttpToolContext, ToolResult } from './shared.js';
import { findAllPlanFiles } from './shared.js';

export const listWorkspacesSchema = z.object({});

export async function executeListWorkspaces(
    args: z.infer<typeof listWorkspacesSchema>,
    context: HttpToolContext
): Promise<ToolResult> {
    try {
        const planFiles = findAllPlanFiles(context.plansDir);
        const workspaces = new Set<string>();
        
        for (const planFile of planFiles) {
            try {
                const provider = createSqliteProvider(planFile);
                const exists = await provider.exists();
                
                if (exists) {
                    const metadataResult = await provider.getMetadata();
                    if (metadataResult.success && metadataResult.data?.workspaceId) {
                        workspaces.add(metadataResult.data.workspaceId);
                    }
                }
                
                await provider.close();
            } catch {
                // Skip unreadable plans
            }
        }
        
        const workspaceList = Array.from(workspaces).sort();
        
        return {
            success: true,
            data: {
                workspaces: workspaceList,
                count: workspaceList.length,
                message: workspaceList.length > 0
                    ? `Found ${workspaceList.length} workspace(s): ${workspaceList.join(', ')}`
                    : 'No workspaces found',
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list workspaces',
        };
    }
}
```

## Acceptance Criteria

- [ ] set_plan_workspace tool can assign workspace to existing plans
- [ ] list_workspaces tool returns all unique workspace identifiers
- [ ] Tools properly handle error cases and invalid plan IDs

## Testing

Test workspace assignment to plan, verify workspace appears in list, test clearing workspace assignment

## Files Changed

- `riotplan/src/mcp/tools-http/set-plan-workspace.ts`
- `riotplan/src/mcp/tools-http/list-workspaces.ts`
- `riotplan/src/mcp/tools-http/index.ts`

## Notes

Enable workspace management through both CLI and VS Code clients
