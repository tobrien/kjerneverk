# Feedback: Plan Contexts and Rendering Modes

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.7.3 → v0.7.4

## Feedback Given (Plan Contexts)

> "In this dashboard section, it also has me thinking that this user also really needs to have the concept of contexts for these plans. Plans should have context so you can support how life really works. Maybe he only wants to look at Work plans, or plans for a specific project. Maybe he wants to look at plans to support something in his personal life like planning for a skiing trip or managing his son's academic challenges."

## Resolution

Added context to human story (6:15 AM):
```
$ riotplan dashboard --context personal

📋 Active Plans in "personal" (3 total)

trips/tahoe-ski-2026            [2/5]  🔄 Step 2 in progress
home/kitchen-renovation         [0/8]  ⬜ Waiting on contractor quote
family/alex-tutoring-plan       [3/4]  🔄 Math tutor search
```

Added **R19: Plan Contexts**:
- Assign plans to contexts (work, personal, family)
- Filter dashboard by context
- Support hierarchical contexts: `work/kjerneverk`, `personal/travel`
- Easy context switching

Added CLI commands:
```bash
riotplan contexts
riotplan context set <name>
riotplan dashboard --context work
riotplan assign <plan> <context>
```

---

## Feedback Given (Rendering Modes)

> "And that rendering I just mentioned in the last feedback I'd also love the ability to render everything—all the feedback along with a way to track revisions. Or to render current state. For the purposes of getting feedback from people it's often better to just be able to render current state."

## Resolution

Updated R20 with two rendering modes:
- `--current` (default for sharing): Just the plan as it is now—clean, focused
- `--full`: Everything—feedback records, revision history, evidence, changelog

Updated CLI commands:
```bash
riotplan render --pdf             # Current state
riotplan render --pdf --full      # Everything
riotplan render --version v0.3    # Plan at specific version
riotplan share                    # Current state artifact
riotplan share --full             # With complete history
```

## Key Insight

**Life isn't just work.** The same structured planning that helps with Node.js libraries can help with ski trips and tutoring plans—all in one system, separated by context.

**Different audiences need different views.** Someone reviewing for feedback wants current state. Someone doing a retrospective wants everything.

