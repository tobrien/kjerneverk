# Step 06: Update MCP Client to Support Workspace Filtering

## Objective

Modify HttpMcpClient to pass workspace parameters to plan listing APIs

## Background

The HttpMcpClient in riotplan-vscode/src/mcp-client.ts needs to support workspace filtering parameters to enable filtered plan queries from VS Code.

## Tasks

### 1. 06.1

Update HttpMcpClient.listPlans() method signature in riotplan-vscode/src/mcp-client.ts:

```typescript
export class HttpMcpClient {
    // ... existing code ...
    
    async listPlans(
        filter: 'all' | 'active' | 'done' | 'hold' = 'all',
        workspaceId?: string
    ): Promise<any> {
        const requestBody = {
            method: 'tools/call',
            params: {
                name: 'list_plans',
                arguments: {
                    filter,
                    ...(workspaceId && { workspaceId }), // Include workspaceId if provided
                },
            },
        };
        
        const response = await fetch(`${this.baseUrl}/mcp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
}
```

### 2. 06.2

Add workspace management methods to HttpMcpClient:

```typescript
/**
 * Set workspace ID for a plan
 */
async setPlanWorkspace(planId: string, workspaceId: string | null): Promise<any> {
    const requestBody = {
        method: 'tools/call',
        params: {
            name: 'set_plan_workspace',
            arguments: {
                planId,
                workspaceId,
            },
        },
    };
    
    const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Get available workspace IDs from existing plans
 */
async getWorkspaces(): Promise<string[]> {
    const response = await this.listPlans('all'); // Get all plans
    const workspaces = new Set<string>();
    
    if (response?.content?.[0]?.text) {
        const data = JSON.parse(response.content[0].text);
        for (const plan of data.plans || []) {
            if (plan.workspaceId) {
                workspaces.add(plan.workspaceId);
            }
        }
    }
    
    return Array.from(workspaces).sort();
}
```

## Acceptance Criteria

- [ ] HttpMcpClient.listPlans() accepts optional workspaceId parameter
- [ ] Workspace parameter correctly passed to MCP API calls
- [ ] Client can retrieve and set plan workspace assignments

## Testing

Test listPlans() with and without workspaceId filter, verify API requests include workspace parameter

## Files Changed

- `riotplan-vscode/src/mcp-client.ts`

## Notes

Keep workspace parameter optional for backward compatibility
