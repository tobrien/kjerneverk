# Step 04: Update Tool Integration

## Objective

Register all new tools in the MCP server and ensure they work together correctly. Update any prompts or documentation that reference the workflow.

## Background

After implementing the three tools, we need to:
- Register them in the MCP server
- Update tool routing
- Ensure they work together
- Update any workflow prompts that mention transitions

## Tasks

### 1. Register Tools in MCP Server

In `src/mcp/tools/index.ts`:
- Import transition tool
- Import build tool
- Add to `tools` array
- Add to `executeTool` switch statement

### 2. Update Tool Routing

Ensure all three tools:
- Use `resolveDirectory` helper for path resolution
- Respect current working directory context
- Have consistent error handling

### 3. Update Workflow Prompts

Check `src/mcp/prompts/`:
- `shape_approach.md` - Update to mention `riotplan_build` instead of just transition
- Any other prompts that mention creating plans from shaping
- Ensure prompts guide users to use `build` tool

### 4. Update Tool Descriptions

Ensure tool descriptions are clear:
- `riotplan_transition`: "Move between lifecycle stages (forward or backward)"
- `riotplan_build`: "Build plan files in existing idea/shaping directory, transitioning to built stage"
- `riotplan_create`: "Create new plan directory (will detect and prevent if already in idea/shaping directory)"

## Acceptance Criteria

- [ ] All tools registered in MCP server
- [ ] Tools work together correctly
- [ ] Workflow prompts updated
- [ ] Tool descriptions are clear
- [ ] No conflicts between tools

## Testing

- Verify all tools appear in MCP tool list
- Test tool routing works correctly
- Verify prompts mention correct tools
- Test workflow: idea → shaping → build (should work smoothly)

## Files Changed

- `src/mcp/tools/index.ts`
- `src/mcp/prompts/shape_approach.md` (if exists)
- Any other prompt files mentioning transitions

## Notes

- Ensure backward compatibility
- Tools should complement each other, not conflict
- Clear separation of concerns: transition = stage change, build = create files, create = new directory
