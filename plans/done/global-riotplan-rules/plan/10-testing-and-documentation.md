# Step 10: Testing and documentation

## Phase
Phase 2: Riotplan Integration (Completion)

## Objective
Comprehensive testing of the full catalyst pipeline and documentation for users and catalyst authors.

## Tasks

### 10.1 End-to-end integration test
Create a full integration test that:
1. Creates a sample catalyst directory with all facets
2. Configures riotplan to use the catalyst
3. Creates a plan with the catalyst active
4. Verifies catalyst content influenced the generated plan
5. Verifies traceability in plan output files
6. Verifies plan.yaml records the catalyst association

### 10.2 Create a sample catalyst
Build a real, working sample catalyst that demonstrates all facets:
- Could be a "Kjerneverk project" catalyst with the constraints discussed (testing, documentation, GitHub infrastructure)
- Serves as both a test fixture and a template for users

### 10.3 Update riotplan README
- Document the catalyst concept
- Document how to create a catalyst (directory structure, catalyst.yml)
- Document how to configure catalysts in riotplan.config.ts
- Document MCP tools for catalyst operations

### 10.4 Create catalyst authoring guide
- What each facet is for and how to write effective content
- How catalysts layer and merge
- Examples of different catalyst types (technology, organization, project)

### 10.5 Update AI guide
- Add catalyst information to the AI guide so AI assistants understand the catalyst system
- Document MCP tool usage patterns for catalysts

### 10.6 Update riotplan-catalyst package README
- API documentation for the riotplan-catalyst package
- Schema reference for catalyst.yml and plan.yaml

## Definition of Done
- [ ] End-to-end test passes
- [ ] Sample catalyst exists and works
- [ ] riotplan README updated with catalyst documentation
- [ ] Catalyst authoring guide created
- [ ] AI guide updated
- [ ] riotplan-catalyst package README complete

## Future Work (Not in This Plan)
- **Phase 3: NPM Distribution** -- resolve catalysts from node_modules, publish sample catalysts as npm packages
- **Catalyst incompatibility detection** -- warn when conflicting catalysts are combined
- **Catalyst taxonomy/typing** -- technology vs domain vs organization classification
- **Catalyst configuration** -- per-plan catalyst config overrides
- **Output directory** -- plans having an output/ directory for generated artifacts
- **Catalyst influence on idea exploration and shaping** -- inject catalyst questions into explore_idea and shape_approach prompts
