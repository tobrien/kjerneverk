# Step 03: Extend response schema with analysis section and per-step provenance

## Objective

Add a mandatory `analysis` section to the response schema where the model demonstrates its understanding of artifacts before generating steps, and add per-step `provenance` fields that cite which constraints and evidence each step addresses.

## Background

This is the "Reasoning Gate" - the core of the selected approach. Currently the response schema (generator.ts lines 68-109) only asks for summary, approach, successCriteria, and steps. There's no mechanism for the model to show that it understood the constraints, evidence, or selected approach. By adding an analysis section to the schema, we force the model to reason about the artifacts before generating steps, and the provenance citations make the connection auditable.

## Tasks

### 1. Add analysis section to response schema

Extend the JSON schema with a top-level `analysis` object that the model must fill:

```typescript
analysis: {
    type: 'object',
    properties: {
        constraintAnalysis: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    constraint: { type: 'string' },
                    understanding: { type: 'string' },
                    plannedApproach: { type: 'string' },
                },
                required: ['constraint', 'understanding', 'plannedApproach'],
            },
        },
        evidenceAnalysis: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    evidenceFile: { type: 'string' },
                    keyFindings: { type: 'string' },
                    impactOnPlan: { type: 'string' },
                },
                required: ['evidenceFile', 'keyFindings', 'impactOnPlan'],
            },
        },
        approachAnalysis: {
            type: 'object',
            properties: {
                selectedApproach: { type: 'string' },
                commitments: { type: 'string' },
                implementationStrategy: { type: 'string' },
            },
        },
        risks: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['constraintAnalysis'],
}
```

### 2. Add provenance to step schema

Extend each step's schema with provenance fields:

```typescript
provenance: {
    type: 'object',
    properties: {
        constraintsAddressed: {
            type: 'array',
            items: { type: 'string' },
            description: 'Which constraints from IDEA.md this step addresses',
        },
        evidenceUsed: {
            type: 'array',
            items: { type: 'string' },
            description: 'Which evidence files informed this step',
        },
        rationale: {
            type: 'string',
            description: 'Why this step exists and how it connects to the idea',
        },
    },
}
```

### 3. Update GeneratedPlan and GeneratedStep interfaces

Add TypeScript types matching the new schema fields so the parsed response is properly typed.

### 4. Update parsePlanResponse

Handle the new analysis and provenance fields in the response parsing. Make analysis fields optional for backward compatibility (older responses without analysis should still parse).

### 5. Update the user prompt to reference the analysis requirement

Add instructions telling the model to fill the analysis section FIRST, demonstrating understanding, THEN generate steps with provenance citations.

## Acceptance Criteria

- [ ] Response schema includes `analysis` section with constraintAnalysis, evidenceAnalysis, approachAnalysis, risks
- [ ] Each step in the schema has a `provenance` field with constraintsAddressed, evidenceUsed, rationale
- [ ] TypeScript interfaces match the extended schema
- [ ] Response parser handles new fields
- [ ] Backward compatible - responses without analysis still parse correctly
- [ ] User prompt instructs the model to fill analysis before generating steps

## Files Changed

- `src/ai/generator.ts` - Extend schema, interfaces, parser, and prompt

## Testing

- Verify schema is valid JSON Schema
- Test parser with a response that includes analysis + provenance
- Test parser with a response that omits analysis (backward compat)
- Generate a plan and verify analysis section is populated

## Notes

- The analysis section is what makes this the "Rich Prompt with Reasoning Gate" - without it, we're just approach 1
- evidenceAnalysis should only be required if evidence was provided in the prompt
- The analysis section serves double duty: it improves generation quality AND provides data for PROVENANCE.md (step 5)
