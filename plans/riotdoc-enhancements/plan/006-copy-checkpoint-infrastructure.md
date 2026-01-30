# Step 6: Copy Checkpoint Infrastructure from RiotPlan

## Goal
Copy the checkpoint system from RiotPlan to RiotDoc, enabling state snapshots during document creation.

## Tasks

1. **Copy checkpoint functions** from RiotPlan:
   - Checkpoint creation (snapshot + prompt context)
   - Checkpoint listing
   - Checkpoint restoration
   - Adapt for document state (drafts, outline, config)

2. **Create `.history/checkpoints/` and `.history/prompts/` directories**:
   - Checkpoint JSON files with state snapshots
   - Prompt markdown files with conversation context

3. **Define what gets captured in document checkpoints**:
   - Document config
   - Current draft version
   - Outline state
   - Voice/objectives
   - Recent timeline events

4. **Add MCP tools for checkpoints**:
   - `riotdoc_checkpoint_create`
   - `riotdoc_checkpoint_list`
   - `riotdoc_checkpoint_restore`

## Acceptance Criteria

- [ ] Checkpoint code copied and adapted for RiotDoc
- [ ] Checkpoints capture full document state
- [ ] Prompt context files created in `.history/prompts/`
- [ ] MCP tools work for creating/listing/restoring checkpoints
- [ ] Can restore to previous document state

## Dependencies
- Step 5: History infrastructure copied

## Estimated Effort
3-4 hours

## Notes
Checkpoints are critical for experimentation and recovery. Make sure they capture enough state to fully restore.
