# Step 9: Create Outline Manipulation Tools

## Goal
Add MCP tools for programmatic outline manipulation (insert, move, delete sections).

## Tasks

1. **Create outline manipulation tools**:
   - `riotdoc_outline_insert_section` - Add new section at position
   - `riotdoc_outline_move_section` - Reorder sections
   - `riotdoc_outline_delete_section` - Remove section
   - `riotdoc_outline_rename_section` - Change section title

2. **Outline file format**:
   - Simple markdown with numbered sections
   - Support nested sections (chapters > sections > subsections)
   - Easy to parse and manipulate

3. **Tool parameters**:
   - Insert: title, position (or after specific section)
   - Move: section identifier, new position
   - Delete: section identifier
   - Rename: section identifier, new title

4. **Update timeline on changes**:
   - Log outline modifications
   - Preserve history of outline evolution

5. **Validation**:
   - Prevent invalid operations (delete non-existent section)
   - Maintain outline integrity (no orphaned subsections)

## Acceptance Criteria

- [ ] Four outline manipulation tools implemented
- [ ] Tools work with nested section structure
- [ ] Outline changes logged to timeline
- [ ] Tools validate operations before executing
- [ ] Direct file editing still works (tools are optional)
- [ ] Clear error messages for invalid operations

## Dependencies
- Step 5: History infrastructure (for timeline logging)

## Estimated Effort
4-5 hours

## Notes
Primary method is still direct editing. These tools are for programmatic/conversational manipulation.
