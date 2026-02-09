# Step 02: Update STATUS.md Generator to Show Reflection Indicators

## Objective

Add a lightweight reflection indicator to the STATUS.md step progress table so users can see at a glance which steps have reflections, without bloating STATUS.md with full reflection content.

## Background

STATUS.md is regenerated (not appended) by `generateStatus()` in `src/status/generator.ts`. Full reflection content lives in `reflections/` files (Step 01). This step adds a visual indicator — a column or marker — so the status view shows reflection coverage without including the prose.

## Tasks

### 2.1 Update generateStatus to check for reflection files

In `src/status/generator.ts`:
- Import the reflection reader from Step 01
- When generating the Step Progress table, check if a reflection file exists for each completed step
- Add a "Reflected" column to the step progress table: `📝` if reflection exists, empty if not

### 2.2 Update status types if needed

If the step state type needs a `hasReflection` boolean for caching, add it to the step interface. But prefer checking the filesystem (reflection file existence) over state duplication.

### 2.3 Add tests

- Test that STATUS.md includes reflection indicator for steps with reflections
- Test that STATUS.md shows no indicator for steps without reflections
- Test that the indicator doesn't break existing STATUS.md parsing

## Acceptance Criteria

- [ ] STATUS.md step progress table has a reflection indicator column
- [ ] Indicator shows `📝` for steps with reflection files, blank otherwise
- [ ] Existing STATUS.md parsing is not broken
- [ ] Tests pass

## Key Files

- `src/status/generator.ts` (modified)
- `tests/status/generator.test.ts` (modified)

## Dependencies

- Step 01 (reflection reader must exist)
