# Step 08: Add MCP tools for catalyst operations

## Phase
Phase 2: Riotplan Integration

## Objective
Add MCP tools that let users list available catalysts and associate catalysts with plans interactively through the MCP interface.

## Tasks

### 8.1 Create catalyst MCP tool file
Create `riotplan/src/mcp/tools/catalyst.ts` following existing patterns (Zod schema → implementation → executor → McpTool definition).

### 8.2 Implement riotplan_catalyst_list
- List all catalysts available to the current project
- Sources: config-declared catalysts, catalystDirectory contents
- Returns: catalyst ID, name, description, which facets are provided
- Schema: `{ path?: string }` (optional plan directory override)

### 8.3 Implement riotplan_catalyst_associate
- Associate one or more catalysts with a specific plan
- Writes/updates the plan's `plan.yaml` manifest to include the catalyst IDs
- Schema: `{ path?: string, catalysts: string[] }` (catalyst IDs to associate)
- Validates that the catalysts exist and can be loaded before associating

### 8.4 Implement riotplan_catalyst_show
- Show details of a specific catalyst (manifest + facet summary)
- Returns: full manifest, list of facet files, content preview
- Schema: `{ catalyst: string }` (catalyst ID or path)

### 8.5 Register tools in server.ts
- Add tool definitions to tool registry
- Register via `registerTool()` following existing patterns
- Add to `executeTool()` switch in `tools/index.ts`

### 8.6 Update plan creation tools
- Modify `riotplan_create` and `riotplan_build` to accept optional `catalysts` parameter
- When catalysts are specified at creation time, include them in plan.yaml and use them during generation

### 8.7 Write tests
- Test listing catalysts from config
- Test associating catalysts with a plan
- Test showing catalyst details
- Test plan creation with catalyst parameter

## Definition of Done
- [ ] `riotplan_catalyst_list` returns available catalysts
- [ ] `riotplan_catalyst_associate` updates plan.yaml with catalyst IDs
- [ ] `riotplan_catalyst_show` displays catalyst details
- [ ] Plan creation tools accept catalyst parameters
- [ ] All tools follow existing MCP tool patterns
- [ ] Tests cover each tool
