# Step 1: Add sourceUrl and originalQuery fields to evidence schema

**Model: Sonnet 4.5** — Schema changes across two files with type coordination. Straightforward but needs to understand the existing type system.

## Objective

Add `sourceUrl` and `originalQuery` as first-class fields to the evidence schema so that evidence metadata includes where it came from and what question prompted the research.

## Context

Investigation found that `EvidenceRecord` in `types.ts` (line 217-247) has `source` as a free-text field, but no structured fields for URL or original query. The `IdeaAddEvidenceSchema` in `idea.ts` (line 33-42) similarly lacks these fields. Evidence gathered during exploration needs chain-of-evidence metadata to be useful beyond the plan lifecycle.

## Files to Modify

1. **`src/types.ts`** (lines 217-247) — Add `sourceUrl?: string` and `originalQuery?: string` to `EvidenceRecord` interface
2. **`src/mcp/tools/idea.ts`** (lines 33-42) — Add `sourceUrl` and `originalQuery` to `IdeaAddEvidenceSchema`
3. **`src/mcp/tools/idea.ts`** (lines 243-310) — Update `ideaAddEvidence()` to include new fields in:
   - The evidence file content template (around line 265-270)
   - The timeline event data (around line 298-306)
   - The IDEA.md evidence link (around line 289)

## Tasks

- [ ] Add `sourceUrl?: string` and `originalQuery?: string` to `EvidenceRecord` interface in `types.ts`
- [ ] Add `sourceUrl` and `originalQuery` fields to `IdeaAddEvidenceSchema` in `idea.ts` with descriptive `.describe()` strings
- [ ] Update the inline evidence content template in `ideaAddEvidence()` to include sourceUrl and originalQuery in the metadata header
- [ ] Update the timeline event logging to pass through new fields
- [ ] Ensure new fields are optional for backward compatibility

## Acceptance Criteria

- [ ] `EvidenceRecord` interface has `sourceUrl` and `originalQuery` optional fields
- [ ] `IdeaAddEvidenceSchema` accepts `sourceUrl` and `originalQuery` parameters
- [ ] Inline evidence files include sourceUrl and originalQuery in their markdown header when provided
- [ ] Existing evidence without these fields still works (backward compatible)
- [ ] TypeScript compiles without errors

## Evidence

- Investigation note in IDEA.md: "Evidence metadata gaps - even the full schema is missing key metadata"
- Constraint from IDEA.md: "Evidence files must include metadata: retrieval date, source URL, original question/query"

## Dependencies

- None — this is the foundation step
