# Step 3: Replace switch statement in tools/index.ts with Map-based lookup

## Objective

Eliminate the 35-case switch statement in `executeTool()`. Replace it with a Map built from the tools array. Each tool already carries its own executor.

## Tasks

1. Build a `toolMap: Map<string, McpTool>` from the `tools` array
2. Replace the `executeTool()` switch with a simple map lookup:

```typescript
export async function executeTool(
    toolName: string,
    args: Record<string, any>,
    context: ToolExecutionContext
): Promise<ToolResult> {
    const tool = toolMap.get(toolName);
    if (!tool) {
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
    try {
        return await tool.execute(args, context);
    } catch (error: any) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            context: { errorType: error?.constructor?.name || 'Error' },
        };
    }
}
```

3. Remove all individual executor imports (executeCreate, executeStatus, etc.) — they're no longer needed at the index level
4. Keep the tool definition imports (createTool, statusTool, etc.) for the `tools` array

## Acceptance Criteria

- [ ] Switch statement is gone from tools/index.ts
- [ ] `executeTool()` uses Map-based lookup
- [ ] Individual `execute*` functions are no longer imported in index.ts
- [ ] All tool routing still works correctly
