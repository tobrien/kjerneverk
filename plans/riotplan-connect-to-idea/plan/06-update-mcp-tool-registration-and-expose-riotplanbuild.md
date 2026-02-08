# Step 06: Update MCP tool registration and expose riotplan_build

## Objective

Ensure `riotplan_build` is properly registered and exposed through the MCP server so AI assistants can trigger artifact-aware plan generation directly.

## Background

During this plan's creation, `riotplan_build` was not available as an MCP tool - it exists in the codebase (`src/mcp/tools/build.ts`) but isn't registered in the MCP server's tool list. This means the generation pipeline we're improving can only be triggered programmatically, not through MCP tool calls. For the full workflow (explore idea → shape → build plan), the build step needs to be available through MCP.

## Tasks

### 1. Verify current MCP tool registration

Check `src/mcp/server.ts` (or equivalent registration file) for which tools are registered. Identify if `riotplan_build` is registered, commented out, or missing entirely.

### 2. Register riotplan_build in MCP server

Add the build tool to the MCP server's tool list with proper schema:

- Tool name: `riotplan_build`
- Description: Updated to reflect artifact-aware generation
- Input schema: path, description (optional override), steps (optional count), provider, model
- Handler: wired to `executeBuild`

### 3. Update tool description

Update the `buildTool` description in `build.ts` to reflect the new artifact-aware behavior:

```
'Build a detailed plan from idea/shaping artifacts using AI generation. ' +
'Reads ALL plan artifacts (IDEA.md, SHAPING.md, evidence, history, constraints) ' +
'and generates steps grounded in the artifacts. Produces PROVENANCE.md showing ' +
'how artifacts shaped the plan. Uses smart tiering for large artifact sets.'
```

### 4. Ensure sampling compatibility

Verify that the build tool works when using MCP sampling (the calling model triggers generation) as well as direct API mode (RiotPlan uses its own API key). The provider loading in build.ts already has session-aware logic - verify it still works with the refactored generation pipeline.

## Acceptance Criteria

- [ ] `riotplan_build` appears in the MCP server's tool list
- [ ] Tool can be called through MCP and successfully generates a plan
- [ ] Tool description accurately reflects artifact-aware generation
- [ ] Works in both direct API mode and sampling mode
- [ ] Tool schema includes all relevant input parameters

## Files Changed

- `src/mcp/server.ts` (or equivalent registration file) - Register build tool
- `src/mcp/tools/build.ts` - Update tool description

## Testing

- Call `riotplan_build` through MCP and verify it generates a plan
- Verify tool appears in `tools/list` MCP response
- Test with both provider modes if possible

## Notes

- This is a registration/wiring step, not a logic change - all the logic changes are in steps 1-5
- Check if there are other unregistered tools that should also be exposed
- The develop_plan.md prompt references `riotplan_build` - verify it matches the actual tool interface
