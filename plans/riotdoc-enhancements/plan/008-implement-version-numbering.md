# Step 8: Implement Version Numbering

## Goal
Add version numbering system (v0.1 → v1.0) with user-controlled increments.

## Tasks

1. **Add version field to document config**:
   - Current version (e.g., "0.1", "0.2", "1.0")
   - Version history (list of versions with timestamps)
   - Published status (draft vs published)

2. **Create version increment tool**:
   - `riotdoc_increment_version` - Bumps version number
   - Parameters: increment type (minor for v0.x, major for v1.0)
   - Logs version change to timeline

3. **Version numbering rules**:
   - Start at v0.1 for new documents
   - v0.x = draft versions (user-controlled increment)
   - v1.0 = published/finalized (explicit user decision)
   - v1.x = maintenance updates after publication

4. **Store draft versions**:
   - Save each version as separate file: `drafts/draft-v0.1.md`, `draft-v0.2.md`, etc.
   - Keep version metadata in document config
   - Link versions in timeline

5. **Add version display**:
   - Show current version in document status
   - Show version history
   - Indicate if document is draft (v0.x) or published (v1.x)

## Acceptance Criteria

- [ ] Version field added to document config
- [ ] Version increment tool works
- [ ] Drafts saved as separate versioned files
- [ ] Version history tracked in timeline
- [ ] Clear distinction between draft (v0.x) and published (v1.x)
- [ ] User controls all version increments

## Dependencies
- Step 5: History infrastructure (for timeline logging)

## Estimated Effort
3-4 hours

## Notes
Keep it simple - user-controlled, no automatic bumps. Manual decision to go from v0.x to v1.0.
