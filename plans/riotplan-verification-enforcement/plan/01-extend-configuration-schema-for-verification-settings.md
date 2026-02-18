# Step 01: Extend Configuration Schema for Verification Settings

## Objective

Add verification configuration options to support three strictness levels and related settings

## Background

The existing configuration system uses Zod schemas and supports environment variables. We need to extend RiotPlanConfigSchema to include verification settings while maintaining backward compatibility.

## Tasks

### 1. 01.1

Extend RiotPlanConfigSchema in src/config/schema.ts to add verification configuration:

```typescript
export const RiotPlanConfigSchema = z.object({
    // ... existing properties
    
    /**
     * Verification enforcement level
     * - advisory: Show warnings but allow completion
     * - interactive: Prompt user for confirmation
     * - strict: Block completion unless --force flag
     */
    verification: z.object({
        enforcement: z.enum(['advisory', 'interactive', 'strict']).default('interactive'),
        
        /** Enable acceptance criteria checking */
        checkAcceptanceCriteria: z.boolean().default(true),
        
        /** Enable artifact verification */
        checkArtifacts: z.boolean().default(false),
        
        /** Auto-generate retrospectives when transitioning to completed */
        autoRetrospective: z.boolean().default(true),
        
        /** Require evidence links in reflections */
        requireEvidence: z.boolean().default(false)
    }).optional().default({})
});
```

The key design decision is making verification optional with sensible defaults - enforcement defaults to 'interactive' (the sweet spot between safety and flexibility), acceptance criteria checking is enabled by default, but artifact verification is opt-in due to complexity.

### 2. 01.2

Add environment variable support for verification settings in config/loader.ts. Extend the existing environment variable mapping to support:

```typescript
// Add to environment variable mapping
RIOTPLAN_VERIFICATION_ENFORCEMENT=advisory|interactive|strict
RIOTPLAN_VERIFICATION_CHECK_CRITERIA=true|false  
RIOTPLAN_VERIFICATION_CHECK_ARTIFACTS=true|false
RIOTPLAN_VERIFICATION_AUTO_RETROSPECTIVE=true|false
RIOTPLAN_VERIFICATION_REQUIRE_EVIDENCE=true|false
```

This allows per-project configuration via config files and per-user/CI configuration via environment variables.

## Acceptance Criteria

- [ ] Configuration schema includes all verification options with proper defaults
- [ ] Environment variables are supported for all verification settings
- [ ] Backward compatibility is maintained - existing configs work unchanged
- [ ] Schema validation provides clear error messages for invalid values

## Testing

Add tests to verify schema validation, default values, and environment variable override behavior

## Files Changed

- `src/config/schema.ts`
- `src/config/loader.ts`

## Notes

This step establishes the configuration foundation that all other steps depend on
