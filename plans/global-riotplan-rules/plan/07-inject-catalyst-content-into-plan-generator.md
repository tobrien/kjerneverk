# Step 07: Inject catalyst content into plan generator

## Phase
Phase 2: Riotplan Integration

## Objective
Wire merged catalyst content into the plan generator so that catalyst constraints, domain knowledge, output templates, and process guidance influence the plans that get created.

## Tasks

### 7.1 Extend GenerationContext
In `riotplan/src/ai/generator.ts`, add catalyst fields to GenerationContext:
```typescript
interface GenerationContext {
  // ... existing fields ...
  catalystContent?: {
    constraints: string;
    domainKnowledge: string;
    outputTemplates: string;
    processGuidance: string;
    questions: string;
    validationRules: string;
    appliedCatalysts: string[];  // IDs for traceability
  };
}
```

### 7.2 Inject catalyst sections into buildArtifactAwarePrompt()
Add new labeled sections to the prompt when catalyst content is present:
- `== CATALYST CONSTRAINTS ==` -- after the existing CONSTRAINTS section
- `== CATALYST DOMAIN KNOWLEDGE ==` -- contextual information about the domain
- `== CATALYST OUTPUT TEMPLATES ==` -- expected deliverables the plan should produce
- `== CATALYST PROCESS GUIDANCE ==` -- how to approach the planning process
- `== APPLIED CATALYSTS ==` -- list of catalyst IDs for traceability
- Only include sections that have content (skip empty facets)

### 7.3 Extend artifact loading
In `riotplan/src/ai/artifacts.ts`:
- Add `loadCatalystContent()` that reads catalyst data from merged catalyst
- Include catalyst content in `ArtifactBundle`
- Pass through to `GenerationContext` in `build.ts`

### 7.4 Respect token budget
- Catalyst content participates in the existing token budget/tiering system
- If catalyst content is large, tier it (full → summarized → list-only)
- Catalyst constraints should be high priority (always included in full)

### 7.5 Write tests
- Test prompt generation with catalyst content present
- Test prompt generation without catalyst content (unchanged behavior)
- Test each facet type appears in the correct prompt section
- Test token budget handles catalyst content

## Definition of Done
- [ ] Catalyst content flows from config → loader → merger → generator → prompt
- [ ] Each catalyst facet appears in the appropriate prompt section
- [ ] Plans generated with catalysts reflect the catalyst's influence
- [ ] No catalyst = no change to existing prompt (backward compatible)
- [ ] Tests verify prompt construction with and without catalysts
