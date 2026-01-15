# Feedback 018: History Pruning and Cleanup

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.14 → v0.15
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro Deep Research review identified a risk:

> "Maintenance and relevance of captured context: There's a risk that the captured 'deliberation' becomes stale or too voluminous to sift through. Without summarization or highlighting of key decisions, newcomers might still struggle to get the essence of past debates. Additionally, it requires discipline to update documentation when decisions change; otherwise outdated rationale could mislead."

## Feedback Given

**Tim's response:**

"Agreed, this could become very heavyweight which is what I'm anticipating that we reach milestones where we can, ideally, discard some of the older versions. I think, fundamentally, I'm still going to be storing these files in GitHub and we'll commit so that we can ultimately recover a version, but I think it's going to be important to reach a point of clarity with an analysis or a plan that we can run 'clean up' and just focus on a smaller set of versions."

## Discussion

The concern is valid: if every plan captures 15-20 feedback records and maintains full revision history, the deliberation archive becomes unwieldy. The value of preserved context diminishes if no one can find what they need.

However, the solution isn't to capture less—it's to provide **lifecycle management** for captured context:

### The Insight: Milestone-Based History Management

Plans reach points of clarity where early iterations become noise rather than signal. At these milestones:
1. **Git remains the ultimate archive** - Full history recoverable via version control
2. **Embedded history can be pruned** - Remove intermediate versions, keep significant ones
3. **Feedback can be summarized** - Consolidate 15 records into 3-5 key decision summaries
4. **"Clean up" as explicit action** - User decides when clarity is reached

### The Pattern: Compress Don't Delete

```
Before cleanup:
  feedback/
    001-initial-review.md
    002-scope-discussion.md
    003-architecture-debate.md
    004-api-design.md
    005-security-concerns.md
    006-testing-strategy.md
    007-performance-requirements.md
    008-final-refinements.md
  .history/
    v0.1/ v0.2/ v0.3/ v0.4/ v0.5/ v0.6/ v0.7/ v0.8/

After cleanup (at milestone):
  feedback/
    SUMMARY-decisions.md          # Key decisions consolidated
    008-final-refinements.md      # Most recent feedback retained
  .history/
    v0.1/                         # Initial state
    v0.8/                         # Final state
    cleanup-manifest.json         # Record of what was pruned
```

### Key Principles

1. **Git is the safety net** - Commit before cleanup; history is recoverable
2. **Explicit milestones** - User decides when to clean up (not automatic)
3. **Summarization, not deletion** - Key decisions extracted before pruning
4. **Manifest of changes** - Record what was removed and why
5. **Preserve bookends** - Keep first and latest versions minimum

## Resolution

Add new requirement and CLI commands for history management:

**R25: History Lifecycle Management**
- Commit to Git before any cleanup
- Prune intermediate versions while keeping bookends
- Generate decision summary from feedback records
- Create cleanup manifest documenting what was removed
- Support "milestone" concept for when to clean up

**New CLI commands:**
```bash
riotplan cleanup                    # Interactive cleanup wizard
riotplan cleanup --commit           # Commit to Git first, then cleanup
riotplan cleanup --summarize        # Generate decision summary before pruning
riotplan cleanup --keep-versions 1,3,8  # Keep specific versions
riotplan cleanup --dry-run          # Preview what would be removed
riotplan feedback summarize         # Generate summary of all feedback
```

## Changes Made

1. Add R25: History Lifecycle Management to requirements
2. Add cleanup CLI commands
3. Document the "compress don't delete" pattern
4. Note Git as ultimate safety net
5. Add milestone concept to lifecycle

## Open Questions

1. Should cleanup be automatic at certain thresholds (e.g., >20 feedback records)?
2. Should there be "protected" feedback records that can't be pruned?
3. How to handle cleanup in artifact packages (.riotplan files)?

## Meta-Observation

This feedback demonstrates the value of the external review pattern (R24). The ChatGPT review identified a real risk that we hadn't fully addressed. By capturing this response as feedback 018, we're:
1. Acknowledging the criticism
2. Proposing a solution
3. Documenting the reasoning
4. Keeping the deliberation preserved

The very concern about "too much deliberation" is being addressed by... more deliberation. But this deliberation proposes the mechanism for managing the volume.

