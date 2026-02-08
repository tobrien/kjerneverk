# Step 2: Fix MCP server registration to expose full evidence schema

**Model: Haiku 4.5** — This is a mechanical fix. The schema already exists in `idea.ts`, it just needs to be mirrored in `server.ts`. Copy the fields from one place to the other.

## Objective

Fix the MCP server tool registration for `riotplan_idea_add_evidence` so it exposes ALL schema fields, not just `evidencePath`, `description`, and `path`. Currently the metadata fields (source, gatheringMethod, relevanceScore, summary, content, and the new sourceUrl/originalQuery) are dead code because the server doesn't pass them through.

## Context

The tool implementation in `idea.ts` accepts rich metadata via `IdeaAddEvidenceSchema` (source, gatheringMethod, relevanceScore, summary, content). But the server registration in `server.ts` (lines 412-420) only declares three fields: `evidencePath`, `description`, and `path`. Any metadata passed by the model is silently dropped.

## Files to Modify

1. **`src/mcp/server.ts`** (lines 412-420) — Update the `riotplan_idea_add_evidence` registration to include all fields from `IdeaAddEvidenceSchema`

## Tasks

- [ ] Update the tool registration at lines 412-420 of `server.ts` to include: `content`, `source`, `gatheringMethod`, `relevanceScore`, `summary`, `sourceUrl`, `originalQuery`
- [ ] Make `evidencePath` optional (it already is in the schema — can be omitted for inline evidence)
- [ ] Verify the field types match `IdeaAddEvidenceSchema` exactly
- [ ] Also check `riotplan_shaping_add_evidence` registration to see if it has the same gap

## Acceptance Criteria

- [ ] `riotplan_idea_add_evidence` MCP registration includes all fields from `IdeaAddEvidenceSchema`
- [ ] Model can pass `sourceUrl`, `originalQuery`, `source`, `content`, `gatheringMethod`, `relevanceScore`, `summary` through MCP and they reach the tool implementation
- [ ] `evidencePath` is optional in the registration (matches schema)
- [ ] TypeScript compiles without errors

## Evidence

- Investigation note in IDEA.md: "The MCP server registration only exposes evidencePath, description, and path - the other schema fields are NOT exposed through MCP"
- Server registration code at `server.ts` lines 412-420

## Dependencies

- Requires Step 1 (new sourceUrl/originalQuery fields must exist in schema first)
