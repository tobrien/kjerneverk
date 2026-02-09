# Step 02: Define catalyst schema and directory structure

## Phase
Phase 1: Catalyst Engine (Local Directory Support)

## Objective
Define what a catalyst looks like on disk and create the Zod schemas that validate it. This is the foundational data model for the entire catalyst system.

## Tasks

### 2.1 Define the catalyst directory structure
A catalyst is a directory containing:
```
my-catalyst/
  catalyst.yml        # Manifest: id, name, description, version, facets declared
  questions/           # Markdown files with guiding questions
    exploration.md     # Questions for idea exploration phase
    shaping.md         # Questions for approach evaluation
  constraints/         # Markdown files with constraints/rules
    general.md         # Universal constraints
    testing.md         # Testing requirements
    documentation.md   # Documentation requirements
  output-templates/    # Templates for expected deliverables
    press-release.md   # Template for a press release output
    six-pager.md       # Template for a narrative document
  domain-knowledge/    # Context about the domain
    overview.md        # General domain context
  process-guidance/    # How to run the planning process
    lifecycle.md       # Phase-specific guidance
  validation-rules/    # Post-creation checks
    checklist.md       # Validation checklist
```

### 2.2 Define the catalyst.yml manifest schema (Zod)
```typescript
const CatalystManifestSchema = z.object({
  id: z.string(),           // NPM package name, e.g. "@kjerneverk/catalyst-nodejs"
  name: z.string(),         // Human-readable name
  description: z.string(),  // What this catalyst provides
  version: z.string(),      // Semver version
  facets: z.object({
    questions: z.boolean().optional(),
    constraints: z.boolean().optional(),
    outputTemplates: z.boolean().optional(),
    domainKnowledge: z.boolean().optional(),
    processGuidance: z.boolean().optional(),
    validationRules: z.boolean().optional(),
  }).optional(),
});
```

### 2.3 Define TypeScript interfaces
- `Catalyst` -- loaded catalyst with all resolved facet content
- `CatalystManifest` -- parsed catalyst.yml
- `CatalystFacets` -- container for all six facet types
- `FacetContent` -- individual facet content (name, source file, content string)

### 2.4 Create test fixtures
- Create a minimal test catalyst directory with all facets
- Create a catalyst with only some facets (to test optional facets)
- Create an invalid catalyst (missing manifest) for error testing

## Definition of Done
- [ ] Zod schemas validate catalyst.yml correctly
- [ ] TypeScript interfaces exported from package
- [ ] Test fixtures exist for valid and invalid catalysts
- [ ] Schema rejects invalid manifests with clear error messages
