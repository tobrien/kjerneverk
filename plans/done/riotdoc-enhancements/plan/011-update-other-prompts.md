# Step 11: Update Other Prompts for Template Integration

## Goal
Update draft, revise, and finalize prompts to read from templates and use new tools.

## Tasks

1. **Update draft_document prompt**:
   - Read template's "Output Document Structure" section
   - Use selected approach to guide draft generation
   - Integrate with version numbering (create v0.1)
   - Use narrative capture for user feedback

2. **Update revise_document prompt**:
   - Read template's revision guidance
   - Increment version on revision (v0.1 → v0.2)
   - Use checkpoint before major changes
   - Capture revision rationale in narrative

3. **Create/update finalize_document prompt**:
   - Read template's "Publishing Phase Questions"
   - Ask publishing-specific questions (SEO, categories, etc.)
   - Transition from v0.x to v1.0
   - Create final checkpoint

4. **Ensure prompt consistency**:
   - All prompts use same template reading logic
   - All prompts integrate with narrative/checkpoint tools
   - All prompts reference available MCP tools
   - All prompts explain their role in the workflow

5. **Document prompt integration**:
   - Create guide explaining how prompts work together
   - Show the full workflow: explore → draft → revise → finalize
   - Explain how templates drive each phase

## Acceptance Criteria

- [ ] Draft prompt reads template structure
- [ ] Revise prompt uses version numbering
- [ ] Finalize prompt asks publishing questions
- [ ] All prompts integrate with tools
- [ ] Prompts work together as cohesive workflow
- [ ] Documentation explains the system

## Dependencies
- Steps 1-4: Templates created
- Steps 5-9: Infrastructure and tools ready
- Step 10: explore_document prompt updated

## Estimated Effort
6-8 hours

## Notes
This is critical - prompts must stay in sync with tools/resources. The symbiotic relationship is the key.
