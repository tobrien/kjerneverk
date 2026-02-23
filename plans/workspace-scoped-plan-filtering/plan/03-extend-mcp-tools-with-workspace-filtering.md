# Step 03: Extend MCP Tools with Workspace Filtering

## Objective

Add workspaceId parameter to plans-list and switch-plan MCP tools for workspace-scoped plan queries

## Background

The plans-list.ts tool currently filters by status (active/done/hold). Need to add workspace-based filtering while maintaining backward compatibility.

## Tasks

### 1. 03.1

Update plansListSchema in riotplan/src/mcp/tools-http/plans-list.ts to include workspaceId:

```typescript
export const plansListSchema = z.object({
    filter: z
        .enum(['all', 'active', 'done', 'hold'])
        .optional()
        .describe('Filter plans by status'),
    workspaceId: z
        .string()
        .optional()
        .describe('Filter plans by workspace identifier'),
});
```

### 2. 03.2

Modify executeListPlans() to filter by workspaceId when provided:

```typescript
for (const planFile of planFiles) {
    try {
        const provider = createSqliteProvider(planFile);
        // ... existing code ...
        const metadata = metadataResult.data;
        
        // Apply workspace filter if provided
        if (args.workspaceId) {
            if (metadata.workspaceId !== args.workspaceId) {
                await provider.close();
                continue;
            }
        }
        
        // Apply status filter (existing logic)
        if (args.filter && args.filter !== 'all') {
            if (args.filter !== category) {
                await provider.close();
                continue;
            }
        }
        // ... rest of existing code ...
    }
}
```

### 3. 03.3

Update ListPlansSchema in riotplan/src/mcp/tools/switch.ts to support workspace filtering:

```typescript
export const ListPlansSchema = z.object({
    directory: z.string().optional().describe('Optional legacy search scope'),
    projectId: z
        .string()
        .optional()
        .describe('Optional project filter (matches project.id, owner/repo, or provider:owner/repo)'),
    workspaceId: z
        .string()
        .optional()
        .describe('Filter plans by workspace identifier'),
});
```

### 4. 03.4

Apply workspace filtering in executeListPlans() within switch.ts:

```typescript
const filteredPlans = validated.projectId
    ? [...dedupedById.values()].filter((plan) => {
        const matchKeys = getProjectMatchKeys(plan.project);
        return matchKeys.includes(validated.projectId!.toLowerCase());
    })
    : [...dedupedById.values()];

// Apply workspace filter
const workspaceFilteredPlans = validated.workspaceId
    ? filteredPlans.filter((plan) => {
        // Assuming we add workspaceId to plan metadata in list response
        return plan.workspaceId === validated.workspaceId;
    })
    : filteredPlans;
```

## Acceptance Criteria

- [ ] MCP tools accept workspaceId parameter
- [ ] Plans are filtered by workspace when workspaceId provided
- [ ] Backward compatibility maintained when no workspace filter specified

## Testing

Test plan listing with and without workspaceId filter, verify only matching workspace plans returned

## Files Changed

- `riotplan/src/mcp/tools-http/plans-list.ts`
- `riotplan/src/mcp/tools/switch.ts`

## Notes

Keep workspace filtering optional to maintain compatibility with existing API clients
