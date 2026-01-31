# Step 01: Add Transition Tool

## Objective

Implement `riotplan_transition` tool that allows moving between lifecycle stages (idea → shaping → built, and backwards). The tool should update LIFECYCLE.md and preserve history.

## Background

Currently, there's no way to transition between stages programmatically. The `riotplan_shaping_select` tool mentions `riotplan_transition` but it doesn't exist. We need a general-purpose transition tool that:
- Can move forward (idea → shaping → built)
- Can move backward (built → shaping → idea)
- Updates LIFECYCLE.md with new stage and reason
- Logs transition event to timeline
- Uses current working directory resolution

## Tasks

### 1. Create Transition Tool Schema

Create `src/mcp/tools/transition.ts`:
- Define `TransitionSchema` with:
  - `path?: string` (optional, defaults to current directory)
  - `stage: string` (target stage: "idea", "shaping", "built", etc.)
  - `reason: string` (why transitioning)

### 2. Implement Transition Logic

Function `transitionStage()`:
- Resolve directory (use `resolveDirectory` helper)
- Read current LIFECYCLE.md
- **Allow any transitions** (no validation for now - don't create rules we'll need to undo)
- Update LIFECYCLE.md:
  - Change current stage
  - Add to state history table
  - Update "Since" timestamp
- Log transition event to timeline
- Return success message

### 3. Handle Stage-Specific Setup

When transitioning to specific stages:
- **shaping**: Create SHAPING.md if doesn't exist (or ensure it exists)
- **built**: Don't create plan files yet (that's what build tool does)
- **idea**: Ensure IDEA.md exists

### 4. Create Tool Definition

- Export `transitionTool: McpTool`
- Export `executeTransition` function
- Register in `src/mcp/tools/index.ts`

## Acceptance Criteria

- [ ] Transition tool exists and is registered
- [ ] Can transition forward (idea → shaping → built)
- [ ] Can transition backward (built → shaping → idea)
- [ ] LIFECYCLE.md updated correctly
- [ ] Timeline event logged
- [ ] Uses current working directory when path not provided
- [ ] Returns clear success/error messages

## Testing

- Transition idea → shaping (verify LIFECYCLE.md updated)
- Transition shaping → built (verify LIFECYCLE.md updated)
- Transition built → shaping (backward, verify works)
- Transition with explicit path
- Transition without path (uses current directory)
- Verify timeline has transition events

## Files Changed

- `src/mcp/tools/transition.ts` (new file)
- `src/mcp/tools/index.ts` (register tool)

## Notes

- Keep transition logic simple - just update LIFECYCLE.md
- Don't create plan files in transition (that's build tool's job)
- Preserve all existing history/timeline data
