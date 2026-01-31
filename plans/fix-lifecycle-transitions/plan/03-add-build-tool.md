# Step 03: Add Build Tool

## Objective

Implement `riotplan_build` tool that transitions an idea/shaping directory to "built" stage and creates plan files (SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, plan/ directory) in the existing directory.

## Background

This is the explicit "build plan" workflow users expect. When ready to create a plan from an idea/shaping, they should be able to say "build it" and get plan files created in the same directory. This tool:
- Transitions to "built" stage (using transition logic)
- Creates plan files in existing directory
- Preserves all existing history/timeline

## Tasks

### 1. Create Build Tool Schema

Create `src/mcp/tools/build.ts`:
- Define `BuildSchema` with:
  - `path?: string` (optional, defaults to current directory)
  - `description?: string` (optional plan description, can derive from IDEA.md)
  - `steps?: number` (optional number of steps)

### 2. Implement Build Logic

Function `buildPlan()`:
- Resolve directory (use `resolveDirectory` helper)
- Verify directory is idea or shaping stage (check LIFECYCLE.md)
- If not, return error suggesting use `riotplan_create` instead
- Transition to "built" stage (call transition logic or use transition tool internally)
- Create plan files:
  - SUMMARY.md (derive from IDEA.md content)
  - EXECUTION_PLAN.md (template or derive from SHAPING.md)
  - STATUS.md (initial status)
  - plan/ directory with step files (if steps specified)
- Preserve existing files (IDEA.md, SHAPING.md, .history/, etc.)

### 3. Derive Plan Content

When creating plan files:
- Read IDEA.md for core concept and notes
- Read SHAPING.md for selected approach (if exists)
- Generate SUMMARY.md from idea content
- Generate EXECUTION_PLAN.md from shaping approach
- Create initial STATUS.md

### 4. Create Tool Definition

- Export `buildTool: McpTool`
- Export `executeBuild` function
- Register in `src/mcp/tools/index.ts`

## Acceptance Criteria

- [ ] Build tool exists and is registered
- [ ] Transitions to "built" stage
- [ ] Creates plan files in existing directory
- [ ] Preserves IDEA.md, SHAPING.md, .history/
- [ ] Works from idea stage
- [ ] Works from shaping stage
- [ ] Fails gracefully if not in idea/shaping directory
- [ ] Uses current working directory when path not provided

## Testing

- Build from idea directory → verify plan files created, stage = built
- Build from shaping directory → verify plan files created, stage = built
- Build from regular directory → should error with helpful message
- Build with explicit path → should work
- Build without path → should use current directory
- Verify existing files preserved (IDEA.md, SHAPING.md, timeline)

## Files Changed

- `src/mcp/tools/build.ts` (new file)
- `src/mcp/tools/index.ts` (register tool)
- May need to import/use plan creation utilities from `src/plan/creator.ts`

## Notes

- Build tool should be the primary way to create plans from ideas/shaping
- Can reuse plan creation logic from `create.ts` but adapt for existing directory
- **MUST use AI generation** - call `riotplan_generate` internally to create plan from idea/shaping content
