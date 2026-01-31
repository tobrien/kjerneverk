# Step 02: Make Create Tool Smart

## Objective

Modify `riotplan_create` to detect if the current directory (or specified directory) is already an idea/shaping directory. If so, warn or prevent creating a duplicate plan directory.

## Background

Currently `riotplan_create` always creates a new directory. This causes the bug where working in an idea/shaping directory and calling "create plan" creates a duplicate directory. We should:
- Check if current directory has IDEA.md, SHAPING.md, or LIFECYCLE.md
- If found, warn user or prevent creation
- Suggest using `riotplan_build` or `riotplan_transition` instead

## Tasks

### 1. Add Detection Function

In `src/mcp/tools/create.ts` (or shared utilities):
- Function `isIdeaOrShapingDirectory(path: string): boolean`
- Check for existence of:
  - IDEA.md
  - SHAPING.md  
  - LIFECYCLE.md (with idea or shaping stage)
- Return true if any found

### 2. Update Create Tool Logic

In `executeCreate()`:
- Before creating new directory, check if target directory is idea/shaping
- If yes:
  - **WARN but allow** (with clear message suggesting use of `riotplan_build` instead)
  - Include warning in success message
- If no, proceed with normal creation

### 3. Improve Error Messages

When detecting existing directory:
- Clear error message explaining why
- Suggest correct tool to use (`riotplan_build` or `riotplan_transition`)
- Show what was detected (IDEA.md, SHAPING.md, etc.)

## Acceptance Criteria

- [ ] Create tool detects existing idea/shaping directories
- [ ] Prevents or warns about duplicate creation
- [ ] Clear error messages with suggestions
- [ ] Normal creation still works when not in idea/shaping directory
- [ ] Detection uses current working directory resolution

## Testing

- Call create in directory with IDEA.md → should detect and prevent/warn
- Call create in directory with SHAPING.md → should detect and prevent/warn
- Call create in directory with LIFECYCLE.md (shaping) → should detect
- Call create in empty directory → should work normally
- Call create with explicit path to idea directory → should detect

## Files Changed

- `src/mcp/tools/create.ts`
- `src/mcp/tools/shared.ts` (if adding detection utility)

## Notes

- Detection should be fast (just file existence checks)
- Error messages should be helpful and actionable
- Consider making this configurable (strict vs warning mode)
