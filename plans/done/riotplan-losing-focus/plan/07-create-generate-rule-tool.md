# Step 7: Create riotplan_generate_rule Tool

**Recommended Model**: Sonnet 4.5
**Rationale**: Creating a new MCP tool following established patterns. The tool implementation is straightforward (write a file), but needs to follow RiotPlan's existing tool architecture (McpTool interface, registerTool pattern, shared utilities). Moderate complexity, well-scoped.

**Depends on**: Step 6 (need the rule content to embed in the tool)

## Objective

Create a new MCP tool `riotplan_generate_rule` that generates a `.cursor/rules/riotplan.md` file in the user's project. This tool makes it easy for users to install the Cursor rule that keeps models focused on RiotPlan.

## Background

The user wants RiotPlan to proactively tell users: "For best results, install this Cursor rule." The tool should generate the rule file with the content designed in Step 6.

## Tasks

- [ ] Create `src/mcp/tools/generate-rule.ts` following existing tool patterns
- [ ] Implement `executeGenerateRule` function
- [ ] Accept optional `projectPath` parameter (defaults to cwd or workspace root)
- [ ] Write the rule content to `{projectPath}/.cursor/rules/riotplan.md`
- [ ] Create `.cursor/rules/` directory if it doesn't exist
- [ ] Check if rule file already exists - warn but allow overwrite with `force` parameter
- [ ] Register the tool in `src/mcp/server.ts`
- [ ] Add appropriate tool description (with behavioral preamble from Step 2)
- [ ] Return success message with path to created file

## Tool Registration

```typescript
registerTool(
    'riotplan_generate_rule',
    '[BEHAVIORAL PREAMBLE]. Generate a Cursor rule file that configures the IDE to defer to RiotPlan for planning. Creates .cursor/rules/riotplan.md in the target project.',
    {
        projectPath: z.string().optional(),
        force: z.boolean().optional(),
    }
);
```

## Files Changed

- `src/mcp/tools/generate-rule.ts` (new)
- `src/mcp/tools/index.ts` (add to tool registry)
- `src/mcp/server.ts` (register new tool)

## Acceptance Criteria

- Tool creates `.cursor/rules/riotplan.md` with correct content
- Tool creates parent directories if needed
- Tool warns if file already exists (unless force=true)
- Tool is registered and callable via MCP
- TypeScript compiles cleanly
- Tool response includes heartbeat footer (via Step 4 integration)
