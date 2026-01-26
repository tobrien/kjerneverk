# Feedback: The Need for Deliberation Capture

## Context

| Field | Value |
|-------|-------|
| **Date** | 2026-01-14 |
| **Participants** | Tim O'Brien (human), Claude (AI) |
| **Platform** | Cursor IDE |
| **Plan Version** | Initial → v0.2 |
| **Session Type** | Analysis review and feedback |
| **Related Files** | `RIOTPLAN_ANALYSIS.md` (lines 38-44) |

## What Was Proposed

The initial `RIOTPLAN_ANALYSIS.md` document covered:
- Plan structure (directories, files)
- Plan lifecycle (creation → execution)
- Plan actions (create, load, execute, etc.)
- Requirements (R1-R8)
- Implementation roadmap

The file purposes table (lines 38-44) listed:
```markdown
| File | Purpose | Updated By |
|------|---------|------------|
| `{plan-name}-prompt.md` | Original requirements, user intent | Human (once) |
| `SUMMARY.md` | What and why; philosophy; success criteria | Human/AI during planning |
| `EXECUTION_PLAN.md` | How and in what order; dependencies; quality gates | Human/AI during planning |
| `STATUS.md` | Where are we now; step progress; blockers | AI during execution |
| `plan/*.md` | Individual step specifications | Human/AI during planning |
```

## Feedback Given

Tim highlighted lines 38-44 and responded:

> "Ok so, some feedback, I would also love to have a way to supply feedback, and to store that feedback in a filesystem - this way I don't lose the conversation. That would also suggest that we're committing plans to github after revision steps to keep track of changes, but one thing to work into this approach is that feedback conversations are often lost.
>
> For example, this conversation right here is happening in cursor, and you are going to revise the plan, but there's no record that I responded to a proposed plan, what that plan was, what section I highlighted - @RIOTPLAN_ANALYSIS.md (38-44) and what changes you are ultimately going to make.
>
> One of the goals I want to outline for Riotplan is that we lose the conversations and the debates that go into this process (and capture that, I want the analysis to be a bit deeper and I want it to form the basis not only for the plan itself but for a philosophical approach)"

### Key Points Extracted

1. **Feedback needs filesystem storage** - Not just in-memory or ephemeral
2. **Git commits after revisions** - Track changes to plans over time
3. **Conversation loss is a problem** - This specific conversation would be lost
4. **Context matters** - What was highlighted, what section, what file
5. **Deliberation is valuable** - The debates and conversations shape the plan
6. **Philosophical foundation needed** - Deeper analysis, not just mechanics

## Discussion

The feedback reveals a fundamental gap in the original analysis:

**Original assumption**: Plans are documents that evolve.
**Corrected understanding**: Plans are the *crystallized output* of a deliberation process, and that process itself is valuable.

The 10 metadata files (`what-happened-in-*.md`) were *manually created* attempts to capture this deliberation. They exist precisely because the conversations that shaped those plans would otherwise be lost.

This feedback session itself is an example of the problem:
- Tim is providing feedback in Cursor
- Claude is updating the analysis
- When Cursor closes, this conversation disappears
- The changes to the analysis will persist, but the *reasoning* won't

## Resolution

### Philosophical Addition

Added a new section "Philosophical Foundation" to the analysis that articulates:
- The problem of lost deliberation
- Why it matters (institutional knowledge, onboarding, AI context, accountability, learning)
- The principle: "RiotPlan preserves deliberation, not just decisions"

### Structural Addition

Added to plan structure:
- `feedback/` directory for deliberation records
- `CHANGELOG.md` for revision history with rationale
- Template for feedback records

### Requirements Addition

Added two new requirement categories:
- **R9: Feedback & Deliberation Capture** - Core functionality for preserving conversations
- **R10: Version Control Integration** - Git commits, tags, meaningful messages

### CLI Addition

Added commands:
- `riotplan feedback` - Create and manage feedback records
- `riotplan commit` - Commit changes with context
- `riotplan history` - Show revision history
- `riotplan changelog` - Generate changelog

## Changes Made

| File | Change |
|------|--------|
| `RIOTPLAN_ANALYSIS.md` | Added "Philosophical Foundation" section at top |
| `RIOTPLAN_ANALYSIS.md` | Added `feedback/` directory to plan structure |
| `RIOTPLAN_ANALYSIS.md` | Added `CHANGELOG.md` to file purposes |
| `RIOTPLAN_ANALYSIS.md` | Added R9, R10 requirements |
| `RIOTPLAN_ANALYSIS.md` | Added feedback/version control CLI commands |
| `feedback/001-deliberation-capture.md` | Created this record |

## Open Questions

1. **Format for feedback records**: Is markdown sufficient, or should there be structured frontmatter (YAML)?
2. **Automation**: Can Cursor/IDE plugins auto-capture conversation context?
3. **Privacy**: Should feedback be anonymizable separately from plans?
4. **Linking**: How do feedback records link to specific commits?
5. **AI integration**: Should AI agents auto-generate feedback summaries?

## Meta-Observation

This feedback record is itself an example of what RiotPlan should produce. By creating this file, we've preserved:

- The original proposal (lines 38-44)
- The specific feedback (Tim's quote)
- The reasoning (why this matters)
- The resolution (what changed)
- The changes (specific edits)

Future readers of the plan can now understand *why* the `feedback/` directory exists—because of this specific conversation on 2026-01-14.

---

*This feedback record was created during the conversation it documents, demonstrating the pattern RiotPlan should formalize.*

