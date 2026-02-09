# Step 03: Implement catalyst loading from local directories

## Phase
Phase 1: Catalyst Engine (Local Directory Support)

## Objective
Build the loader that reads a catalyst directory from disk, validates the manifest, and loads all facet content into a structured `Catalyst` object.

## Tasks

### 3.1 Implement manifest loading
- Read `catalyst.yml` from directory
- Parse YAML and validate against `CatalystManifestSchema`
- Return clear errors if manifest is missing or invalid

### 3.2 Implement facet loading
- For each facet type (questions, constraints, output-templates, domain-knowledge, process-guidance, validation-rules):
  - Check if the corresponding directory exists
  - Read all `.md` files from the directory
  - Return array of `FacetContent` objects (filename, content)
- Facets are optional -- missing directories are not errors
- Cross-reference with `facets` declared in manifest (warn if declared but missing, or present but not declared)

### 3.3 Assemble the Catalyst object
- Combine manifest + loaded facets into a `Catalyst` object
- Expose a clean public API: `loadCatalyst(directoryPath: string): Promise<Catalyst>`

### 3.4 Implement catalyst resolution
- Given a list of catalyst identifiers (paths or IDs), resolve each to a directory
- Phase 1: support local directory paths only (absolute or relative)
- Phase 2 (future): add node_modules resolution
- Expose: `resolveCatalysts(identifiers: string[], basePath: string): Promise<Catalyst[]>`

### 3.5 Write tests
- Test loading a valid catalyst with all facets
- Test loading a catalyst with partial facets
- Test error handling for missing manifest
- Test error handling for invalid YAML
- Test facet content is correctly read and structured

## Definition of Done
- [ ] `loadCatalyst()` reads a directory and returns a valid `Catalyst` object
- [ ] All six facet types are loaded when present
- [ ] Missing facets handled gracefully (not errors)
- [ ] Invalid manifests produce clear error messages
- [ ] Tests cover happy path and error cases
