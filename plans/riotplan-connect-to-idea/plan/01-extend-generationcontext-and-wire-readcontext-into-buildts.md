# Step 01: Extend GenerationContext and wire read_context into build.ts

## Objective

Refactor `build.ts` to load ALL idea artifacts via the `read_context` logic before passing them to the generator. Extend `GenerationContext` to carry structured artifact data instead of a flat description string.

## Background

Currently `build.ts` (lines 53-88) reads IDEA.md and SHAPING.md as raw text and concatenates them with simple string markers (`"--- IDEA CONTEXT ---"`). It does not read evidence files, timeline/history, LIFECYCLE.md, or prompt history. Meanwhile, `context.ts` (`riotplan_read_context`) already aggregates all of these artifacts into a structured result with extracted constraints, questions, selected approach, evidence previews, and recent history. The two are completely disconnected.

## Tasks

### 1. Extend GenerationContext interface in generator.ts

Add structured fields to `GenerationContext` beyond just `description`:

```typescript
export interface GenerationContext {
    planName: string;
    description: string;
    elaborations?: string[];
    stepCount?: number;
    // New structured artifact fields
    constraints?: string[];
    questions?: string[];
    selectedApproach?: {
        name: string;
        description: string;
        reasoning: string;
    };
    evidence?: {
        name: string;
        content: string;  // full or summarized
        size: number;
    }[];
    historyContext?: {
        recentEvents: { type: string; timestamp: string; summary: string }[];
        totalEvents: number;
    };
    ideaContent?: string;
    shapingContent?: string;
}
```

### 2. Refactor build.ts to use read_context logic

Extract the artifact-loading logic from `context.ts` into a shared function (or call the context tool's internal functions directly). Replace the raw IDEA.md/SHAPING.md concatenation in build.ts with structured artifact loading:

- Read IDEA.md, SHAPING.md, LIFECYCLE.md
- Read all evidence files from `evidence/` directory
- Read recent timeline events from `.history/timeline.jsonl`
- Extract constraints, questions from IDEA.md
- Extract selected approach from SHAPING.md
- Pass all of this as structured `GenerationContext`

### 3. Maintain fallback behavior

If artifact loading fails (no evidence dir, no history, malformed files), fall back to the current behavior (raw IDEA.md + SHAPING.md concatenation). Memory-based generation is the degraded mode, not the failure mode.

## Acceptance Criteria

- [ ] `GenerationContext` interface includes fields for constraints, evidence, selectedApproach, history
- [ ] `build.ts` loads evidence files, timeline, constraints, and selected approach before generation
- [ ] If artifact loading partially fails, generation still proceeds with available data
- [ ] Existing tests (if any) continue to pass
- [ ] The shared artifact-loading logic is reusable (not duplicated between build.ts and context.ts)

## Files Changed

- `src/ai/generator.ts` - Extend `GenerationContext` interface
- `src/mcp/tools/build.ts` - Refactor to use full artifact loading
- `src/mcp/tools/context.ts` - Extract reusable artifact-loading functions (or create shared module)
- Possibly new: `src/ai/artifacts.ts` - Shared artifact loading utilities

## Testing

- Build a plan from an idea directory that has IDEA.md, SHAPING.md, evidence files, and history
- Verify that all artifacts are loaded into GenerationContext
- Build a plan from a minimal idea (only IDEA.md) and verify fallback works
- Check that evidence files, constraints, and selected approach appear in the context passed to the generator

## Notes

- Don't change the generator prompt yet (that's step 2) - just ensure the data flows through
- The context.ts `readEvidenceFiles` function already handles both `evidence/` and `.evidence/` directories
- Keep evidence content manageable for now - step 4 handles smart tiering
