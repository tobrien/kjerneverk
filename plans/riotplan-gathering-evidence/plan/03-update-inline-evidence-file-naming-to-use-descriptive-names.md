# Step 3: Update inline evidence file naming to use descriptive names

**Model: Sonnet 4.5** — Needs to generate a slug from the description, handle edge cases (duplicates, long names, special characters), and align with existing evidence patterns. Moderate complexity.

## Objective

Change inline evidence file naming from `evidence-{timestamp}.md` to descriptive names like `research-voice-tone-standards.md` that match the `PLAN_CONVENTIONS.evidencePatterns` patterns, making evidence files browsable without reading each one.

## Context

Currently `ideaAddEvidence()` generates inline evidence filenames as `evidence-${Date.now()}` (line 261 of idea.ts). The types define recognized patterns: `what-happened-in-*.md`, `research-*.md`, `analysis-*.md`, `example-*.md` (from `PLAN_CONVENTIONS.evidencePatterns`). Timestamp names make it impossible to know what an evidence file contains without opening it.

## Files to Modify

1. **`src/mcp/tools/idea.ts`** (lines 260-262) — Replace timestamp-based naming with description-based naming

## Tasks

- [ ] Create a `generateEvidenceFilename(description: string, type?: EvidenceType): string` helper function that:
  - Converts description to kebab-case slug
  - Prefixes with evidence type pattern when available (e.g., `research-`, `analysis-`)
  - Falls back to generic descriptive name if no type
  - Truncates to reasonable length (50-60 chars max for the slug portion)
  - Handles duplicate filenames by appending a number suffix
- [ ] Update `ideaAddEvidence()` to use the new naming function instead of `evidence-${Date.now()}`
- [ ] Check for filename collisions in the evidence directory before writing

## Acceptance Criteria

- [ ] Inline evidence files get descriptive names like `research-voice-tone-standards.md` instead of `evidence-1234567890.md`
- [ ] Names are valid filesystem paths (no special characters)
- [ ] Duplicate descriptions produce unique filenames (e.g., `research-api-design.md`, `research-api-design-2.md`)
- [ ] Existing evidence files with timestamp names are not affected
- [ ] Long descriptions are truncated sensibly

## Evidence

- Investigation note in IDEA.md: "Timestamp names make it hard to identify content without reading the file"
- PLAN_CONVENTIONS.evidencePatterns defines: what-happened-in-*.md, research-*.md, analysis-*.md, example-*.md

## Dependencies

- None (can run in parallel with Step 2, but listed after for logical ordering)
