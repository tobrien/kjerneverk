# Execution Plan: RiotPlan Catalysts

## Strategy
Foundation-First: build the catalyst engine as a standalone package (`@kjerneverk/riotplan-catalyst`), then integrate into riotplan. This allows iterating on the catalyst schema and structure before committing to published packages.

## Prerequisites
- Familiarity with the kjerneverk package ecosystem (execution, riotprompt, agentic patterns)
- Access to riotplan source code (config, generator, MCP tools, artifacts)

## Phases and Steps

### Phase 1: Catalyst Engine (Steps 1-5)
Build `@kjerneverk/riotplan-catalyst` with local directory catalyst support.

| Step | Title | Status | Dependencies | Recommended Model |
|------|-------|--------|-------------|-------------------|
| 1 | Scaffold @kjerneverk/riotplan-catalyst package | pending | none | Haiku 4.5 -- boilerplate scaffolding, follows established patterns from sibling packages |
| 2 | Define catalyst schema and directory structure | pending | Step 1 | Opus 4.5 -- core data model for the entire system, schema design requires careful thought about extensibility and future-proofing |
| 3 | Implement catalyst loading from local directories | pending | Step 2 | Sonnet 4.5 -- file I/O and YAML parsing with schema validation, needs to handle error cases well |
| 4 | Implement ordered facet merging for multiple catalysts | pending | Step 3 | Haiku 4.5 -- clear merge strategy (concatenation), logic is well-defined from exploration |
| 5 | Define plan manifest (plan.yaml) schema and read/write | pending | Step 2 | Haiku 4.5 -- simple schema, similar pattern to catalyst.yml from Step 2 |

### Phase 2: Riotplan Integration (Steps 6-10)
Wire the catalyst engine into riotplan's config, generator, MCP, and output.

| Step | Title | Status | Dependencies | Recommended Model |
|------|-------|--------|-------------|-------------------|
| 6 | Integrate catalyst into riotplan config system | pending | Steps 4, 5 | Sonnet 4.5 -- needs to understand riotplan's config resolution, CardiganTime, and Zod schema patterns |
| 7 | Inject catalyst content into plan generator | pending | Step 6 | Opus 4.5 -- most complex step, must understand prompt construction, token budgets, artifact loading, and make design decisions about catalyst-prompt interaction |
| 8 | Add MCP tools for catalyst operations | pending | Steps 6, 5 | Sonnet 4.5 -- needs to follow riotplan's MCP tool patterns precisely and integrate with existing tool registry |
| 9 | Add catalyst traceability to plan output | pending | Step 7 | Haiku 4.5 -- template-driven, adding sections to existing markdown generation |
| 10 | Testing and documentation | pending | Steps 7, 8, 9 | Sonnet 4.5 -- end-to-end testing requires understanding the full pipeline, documentation requires clear explanation of concepts |

## Quality Gates
- Each step has unit tests covering happy path and error cases
- Phase 1 can be validated independently (riotplan-catalyst package works standalone)
- Phase 2 integration tests verify end-to-end catalyst flow
- Backward compatibility verified: existing plans and workflows unaffected

## Future Phases (Not in This Plan)
- **Phase 3: NPM Distribution** -- resolve catalysts from node_modules, publish to NPMJS
- **Phase 4: Lifecycle Integration** -- catalyst questions influence explore_idea and shape_approach
- **Phase 5: Advanced Features** -- incompatibility detection, catalyst config overrides, output directories
