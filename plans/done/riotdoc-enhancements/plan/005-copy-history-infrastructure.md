# Step 5: Copy History Infrastructure from RiotPlan

## Goal
Copy the history/timeline system from RiotPlan to RiotDoc, adapting it for document workflows.

## Tasks

1. **Copy core history files** from RiotPlan:
   - `src/mcp/tools/history.ts` - Timeline and checkpoint functions
   - `src/mcp/tools/timeline-utils.ts` - Timeline utilities
   - Adapt type imports for RiotDoc context

2. **Create RiotDoc-specific types**:
   - Document events (document_created, draft_created, revision_added, etc.)
   - Adapt from RiotPlan's step events

3. **Integrate with existing RiotDoc structure**:
   - Add `.history/` directory creation
   - Add `timeline.jsonl` logging
   - Ensure compatibility with existing document workspace structure

4. **Test timeline logging**:
   - Create test document
   - Verify events log correctly
   - Verify timeline can be read and parsed

## Acceptance Criteria

- [ ] History code copied and adapted for RiotDoc
- [ ] Timeline events defined for document lifecycle
- [ ] `.history/timeline.jsonl` logs document events correctly
- [ ] No breaking changes to existing RiotDoc functionality
- [ ] Code documented with source attribution (copied from RiotPlan)

## Dependencies
- RiotPlan source code at `/Users/tobrien/gitw/kjerneverk/riotplan`

## Estimated Effort
3-4 hours

## Notes
Accept code duplication for now. Document what was copied for future shared library creation.
