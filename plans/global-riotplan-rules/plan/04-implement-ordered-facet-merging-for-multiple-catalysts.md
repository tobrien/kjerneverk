# Step 04: Implement ordered facet merging for multiple catalysts

## Phase
Phase 1: Catalyst Engine (Local Directory Support)

## Objective
Build the merging logic that combines multiple catalysts in a declared order, producing a single merged set of facets that can be consumed by the plan generator and other lifecycle phases.

## Tasks

### 4.1 Design the merge strategy
- Catalysts are applied in order (first = base, subsequent = layers)
- For most facets (questions, constraints, domain-knowledge, process-guidance, validation-rules): **concatenate** -- all content from all catalysts is included, ordered by catalyst priority
- For output-templates: **concatenate** -- all templates from all catalysts are available
- Each piece of merged content retains its source catalyst ID for traceability
- v1: no conflict detection or resolution (deferred)

### 4.2 Implement the merger
- Input: ordered array of `Catalyst` objects
- Output: `MergedCatalyst` object containing:
  - Combined facets with source attribution
  - List of catalyst IDs that were merged (in order)
  - Metadata about what each catalyst contributed
- Expose: `mergeCatalysts(catalysts: Catalyst[]): MergedCatalyst`

### 4.3 Implement content rendering
- Render merged facets into prompt-ready strings
- Each facet type gets a renderer that formats the content appropriately for injection into AI prompts
- Include source attribution in rendered output (e.g., "From @kjerneverk/catalyst-nodejs:")
- Expose: `renderFacet(merged: MergedCatalyst, facet: FacetType): string`

### 4.4 Write tests
- Test merging two catalysts with non-overlapping facets
- Test merging two catalysts with overlapping facets (same facet type)
- Test ordering is preserved (later catalysts appear after earlier ones)
- Test source attribution is correct
- Test merging a single catalyst (passthrough)
- Test merging an empty array (no catalysts = no content)

## Definition of Done
- [ ] `mergeCatalysts()` combines N catalysts in order
- [ ] Content from all catalysts is preserved with source attribution
- [ ] `renderFacet()` produces prompt-ready strings
- [ ] Merging is pure concatenation (no conflict resolution in v1)
- [ ] Tests cover merging 0, 1, and multiple catalysts
