# Execution Plan: Fix Dual Registration System in RiotPlan

## Strategy

This plan eliminates the dual registration system by standardizing on Zod schemas and making each tool a self-contained descriptor. The approach follows the same single-loop registration pattern that resources and prompts already use successfully.

## Steps

### Step 1: Redefine McpTool type to include Zod schema and executor

**Goal**: Create the foundation for eliminating dual registration by making Zod the single source of truth.

**Approach**: Modify the McpTool type definition to include a Zod schema field and embed the execute function directly in the tool descriptor.

**Key Tasks**:
- Update McpTool type in src/mcp/types.ts
- Add schema field (z.ZodRawShape)
- Add execute field to type definition
- Ensure backward compatibility during migration

### Step 2: Migrate all tool files to full descriptor format with Zod schemas

**Goal**: Convert all 35 tools from JSON Schema to Zod format, eliminating the schema format mismatch.

**Approach**: Update each tool file to export a single descriptor object with Zod schema and embedded execute function.

**Key Tasks**:
- Convert JSON Schema inputSchema to Zod for each tool
- Embed execute function in tool descriptor
- Remove old McpTool format
- Test each tool after migration

### Step 3: Replace switch statement in tools/index.ts with Map-based lookup

**Goal**: Eliminate the 35-case switch statement (another form of dual registration).

**Approach**: Create a Map from tool name to descriptor at initialization, use for O(1) lookup.

**Key Tasks**:
- Build Map from tools array
- Replace executeTool switch statement with Map.get()
- Handle unknown tool names gracefully
- Verify performance is maintained or improved

### Step 4: Replace manual registerTool calls in server.ts with auto-registration loop

**Goal**: Eliminate manual registration, adopt the same loop-based pattern that resources and prompts use.

**Approach**: Replace 31 manual registerTool() calls with a single loop over the tools array.

**Key Tasks**:
- Remove all manual registerTool() calls
- Add loop: `for (const tool of tools) { registerTool(...) }`
- Ensure registerTool() helper handles new descriptor format
- Verify all tools register correctly

### Step 5: Verify all 35 tools registered, fix missing 4, run tests

**Goal**: Ensure the 4 previously missing tools are now registered and all tests pass.

**Approach**: Run comprehensive verification including tool count check, test suite, linting, and build.

**Key Tasks**:
- Verify all 35 tools in tools array
- Confirm 4 missing tools now registered
- Run full test suite
- Run linter
- Build and verify MCP server loads

## Dependencies

- Step 2 depends on Step 1 (type definition must exist)
- Step 3 depends on Step 2 (tools must be in new format)
- Step 4 depends on Steps 2-3 (tools must have execute function and be in Map)
- Step 5 depends on all previous steps (verification of complete system)

## Success Criteria

- All 35 tools use Zod schemas (no JSON Schema remaining)
- Each tool is a self-contained descriptor with embedded execute function
- Switch statement replaced with Map-based lookup
- Manual registration eliminated (auto-registration loop in place)
- All 4 missing tools now registered
- All tests passing
- Linting clean
- Build successful
- MCP server loads and functions correctly

## Risks & Mitigations

**Risk**: Breaking existing tool functionality during migration
**Mitigation**: Migrate tools incrementally, test after each change

**Risk**: External code depending on JSON Schema format
**Mitigation**: Search codebase for inputSchema references before removing

**Risk**: Performance regression from Map lookup
**Mitigation**: Benchmark tool execution before and after

## Timeline

This plan was executed in a single session on 2026-02-09, with all 5 steps completed successfully.
