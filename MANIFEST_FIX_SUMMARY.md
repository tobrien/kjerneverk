# Plan Manifest (plan.yaml) Fix - Summary

## Problem

The `plan.yaml` manifest file was implemented in step 05 of the global-riotplan-rules plan, but it was only being created conditionally:

- ✅ Created when `riotplan_create` was called **with** catalysts parameter
- ❌ NOT created when `riotplan_create` was called without catalysts
- ❌ NOT created by `riotplan_idea_create`
- ❌ NOT created by `riotplan_build`
- ❌ NOT created when other tools touched existing plans

This meant that most plans created through the normal workflow (idea → shaping → build) never got a manifest file.

## Solution

### 1. Created `ensurePlanManifest()` Utility Function

Added to `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/shared.ts`:

```typescript
export async function ensurePlanManifest(
    planPath: string,
    options?: { id?: string; title?: string; catalysts?: string[] }
): Promise<boolean>
```

**Behavior:**
- Checks if `plan.yaml` already exists
- If exists: returns `false` (no-op, preserves existing data)
- If missing: creates minimal manifest with id, title, created timestamp
- Auto-generates id and title from directory name if not provided
- Gracefully handles missing riotplan-catalyst package (backward compatibility)
- Returns `true` if manifest was created, `false` if it already existed

### 2. Updated Plan Creation Tools

**Always create manifest:**
- `riotplan_create` - Now always creates manifest (not just when catalysts provided)
- `riotplan_idea_create` - Now creates manifest when creating new idea
- `riotplan_build` - Now creates manifest when building from idea/shaping

**Auto-create manifest on plan access:**
- `riotplan_step_start` - Ensures manifest exists before starting step
- `riotplan_step_complete` - Ensures manifest exists before completing step
- `riotplan_shaping_start` - Ensures manifest exists when starting shaping
- `riotplan_status` - Ensures manifest exists when checking status

### 3. Created Backfill Tool

New MCP tool: `riotplan_backfill_manifests`

**Purpose:** Add `plan.yaml` to all existing plans that lack it

**Features:**
- Recursively scans directory tree for plan directories
- Identifies plans by presence of LIFECYCLE.md, STATUS.md, or plan/ directory
- Creates manifest for each plan that lacks one
- Safe to run multiple times (idempotent)
- Skips hidden directories and node_modules
- Configurable max depth (default: 3 levels)

**Parameters:**
- `path` (optional): Base directory to scan (defaults to current directory)
- `verbose` (optional): Include detailed results for each plan
- `dryRun` (optional): Show what would be done without making changes

**Example usage:**
```typescript
// Backfill all plans in workspace
riotplan_backfill_manifests({ path: '/Users/tobrien/gitw/kjerneverk/plans' })

// Dry run to see what would happen
riotplan_backfill_manifests({ 
    path: '/Users/tobrien/gitw/kjerneverk/plans',
    dryRun: true,
    verbose: true
})
```

## Files Modified

1. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/shared.ts`
   - Added `ensurePlanManifest()` function
   - Updated imports

2. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/create.ts`
   - Removed direct `writePlanManifest` import
   - Added `ensurePlanManifest` import
   - Always creates manifest (not just when catalysts provided)
   - Updated success message to indicate manifest creation

3. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/build.ts`
   - Added `ensurePlanManifest` import
   - Creates manifest after building plan
   - Includes catalyst info from artifacts if available
   - Updated success message

4. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/idea.ts`
   - Added `ensurePlanManifest` import
   - Creates manifest when creating new idea
   - Updated success message

5. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/step.ts`
   - Added `ensurePlanManifest` import
   - Calls `ensurePlanManifest` in `executeStepStart`
   - Calls `ensurePlanManifest` in `executeStepComplete`

6. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/shaping.ts`
   - Added `ensurePlanManifest` import
   - Calls `ensurePlanManifest` in `shapingStart`

7. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/status.ts`
   - Added `ensurePlanManifest` import
   - Calls `ensurePlanManifest` in `executeStatus`

8. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/backfill-manifests.ts` (NEW)
   - New tool for backfilling existing plans
   - Recursive directory scanning
   - Plan detection logic
   - Batch processing with results

9. `/Users/tobrien/gitw/kjerneverk/riotplan/src/mcp/tools/index.ts`
   - Added `backfillManifestsTool` import
   - Registered tool in tools array

## Manifest Structure

The minimal manifest created by `ensurePlanManifest`:

```yaml
id: plan-directory-name
title: Plan Directory Name
created: 2026-02-09T05:30:00.000Z
```

When catalysts are associated:

```yaml
id: plan-directory-name
title: Plan Directory Name
catalysts:
  - '@kjerneverk/catalyst-nodejs'
  - '@kjerneverk/catalyst-react'
created: 2026-02-09T05:30:00.000Z
```

## Backward Compatibility

✅ **Fully backward compatible:**

- Existing plans without manifests continue to work
- `readPlanManifest()` returns `null` for missing manifests (not an error)
- `ensurePlanManifest()` is a no-op if manifest already exists
- If `@kjerneverk/riotplan-catalyst` is not installed, silently skips manifest creation

## Testing

Build completed successfully:
```bash
cd /Users/tobrien/gitw/kjerneverk/riotplan && npm run build
# ✓ built in 1.70s
# MCP build complete!
```

No linter errors in modified files.

## Next Steps

1. **Test the backfill tool:**
   ```bash
   # Via MCP
   riotplan_backfill_manifests({ 
       path: '/Users/tobrien/gitw/kjerneverk/plans',
       verbose: true
   })
   ```

2. **Verify manifest creation on new plans:**
   - Create a new idea and verify `plan.yaml` is created
   - Build a plan from idea and verify manifest includes catalyst info
   - Start a step and verify manifest is auto-created if missing

3. **Check existing plans:**
   ```bash
   find /Users/tobrien/gitw/kjerneverk/plans -name "plan.yaml" -type f
   ```

## Benefits

1. **Consistent plan identity:** Every plan now has a manifest with id and title
2. **Catalyst tracking:** Plans remember which catalysts influenced their creation
3. **Future extensibility:** Manifest provides a place for plan-level metadata
4. **Automatic backfill:** Existing plans get manifests automatically when touched
5. **Bulk backfill:** Can backfill all plans at once with new tool
6. **No breaking changes:** Fully backward compatible

## Implementation Notes

- The `ensurePlanManifest` function is defensive and fails gracefully
- Manifest creation is fast (no AI calls, just file I/O)
- The backfill tool respects directory structure and skips non-plan directories
- All tools that modify plans now ensure manifest exists first
- The manifest is created before any plan operations, ensuring consistency
