# Step 1: Redefine McpTool type to include Zod schema and executor

## Objective

Update the `McpTool` type in `src/mcp/types.ts` so each tool is a self-contained descriptor carrying its Zod schema and execute function.

## Tasks

1. Open `src/mcp/types.ts` and find the `McpTool` interface
2. Add a `schema` field of type `z.ZodRawShape` (the Zod schema for the tool's input)
3. Add an `execute` field: `(args: Record<string, any>, context: ToolExecutionContext) => Promise<ToolResult>`
4. Keep the `description` field (used for MCP registration and the `[RiotPlan]` prefix)
5. Remove or deprecate the `inputSchema` field (JSON Schema format) — it is no longer needed
6. Import `z` from `zod` in the types file

## Target Type

```typescript
export interface McpTool {
    name: string;
    description: string;
    schema: z.ZodRawShape;
    execute: (args: Record<string, any>, context: ToolExecutionContext) => Promise<ToolResult>;
}
```

## Acceptance Criteria

- [ ] `McpTool` type has `schema` (Zod) and `execute` fields
- [ ] `inputSchema` (JSON Schema) field is removed
- [ ] TypeScript compiles (will have errors in tool files — that's expected, fixed in step 2)
