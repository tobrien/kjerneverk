# Step 05: Define plan manifest (plan.yaml) schema and read/write

## Phase
Phase 1: Catalyst Engine (Local Directory Support)

## Objective
Add a `plan.yaml` manifest file to plans. This gives each plan an identity (title, ID) and records which catalysts are associated with it. This is new plan infrastructure.

## Tasks

### 5.1 Define the plan.yaml schema (Zod)
```typescript
const PlanManifestSchema = z.object({
  id: z.string(),              // Plan identifier (e.g., "add-user-auth")
  title: z.string(),           // Human-readable title
  catalysts: z.array(z.string()).optional(),  // Ordered list of catalyst IDs
  created: z.string().optional(),             // ISO timestamp
  metadata: z.record(z.string()).optional(),  // Extensible metadata
});
```

### 5.2 Implement read/write
- `readPlanManifest(planDir: string): Promise<PlanManifest | null>` -- read and validate, return null if not present
- `writePlanManifest(planDir: string, manifest: PlanManifest): Promise<void>` -- write YAML to plan.yaml
- `updatePlanManifest(planDir: string, updates: Partial<PlanManifest>): Promise<void>` -- merge updates into existing manifest

### 5.3 Consider backward compatibility
- Existing plans don't have plan.yaml -- reading must handle absence gracefully
- plan.yaml is created when catalysts are first associated, or when a new plan is created with catalyst support
- Never break existing plans that don't use catalysts

### 5.4 Write tests
- Test reading a valid plan.yaml
- Test reading from a directory without plan.yaml (returns null, no error)
- Test writing and re-reading roundtrip
- Test updating specific fields while preserving others
- Test schema validation rejects invalid manifests

## Definition of Done
- [ ] plan.yaml schema defined and exported
- [ ] Read/write/update functions work correctly
- [ ] Backward compatible -- missing plan.yaml is not an error
- [ ] Tests cover CRUD operations and edge cases
