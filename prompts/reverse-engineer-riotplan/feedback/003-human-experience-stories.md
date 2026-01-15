# Feedback: Human Experience Stories

## Context

| Field | Value |
|-------|-------|
| **Date** | 2026-01-14 |
| **Participants** | Tim O'Brien (human), Claude (AI) |
| **Platform** | Cursor IDE |
| **Plan Version** | v0.3 → v0.4 |
| **Session Type** | Human experience documentation |
| **Related Files** | `RIOTPLAN_ANALYSIS.md` (full document) |
| **Feedback Number** | 003 |

## What Was Proposed

The analysis covered technical requirements, lifecycle, and patterns but lacked the human story—what it actually *feels like* to manage plans at scale.

## Feedback Given

Tim responded:

> "Ok, I'm going to ask you for something else, I want you to add a human story about experience. You can see all my experience creating and drafting these plans. I literally write a book of prompts to get to where we are and it's heavy heavy head work that I do for 14 hours a day. Part of the challenges (and I'd love for you to capture the challenges) is that I have to keep track of not just the plans, but plans for the plans and metaplans and the relationships between plans.
>
> How is riotplan going to help with that? How am I going to get ahead of that fact that I have to keep track of all these directories.
>
> But, what I'm looking for in the analysis is a section that writes up two human experience stories. Document what my life is like now without RiotPrompt and then document what my experience would be with it."

### Key Points Extracted

1. **Cognitive load is extreme** - "14 hours a day" of "heavy head work"
2. **Volume is significant** - "a book of prompts" to reach this point
3. **Meta-levels compound** - Plans, plans for plans, meta-plans, relationships
4. **Directory tracking is painful** - Keeping track of all the directories
5. **Before/after stories needed** - Ground the technical in human experience

## Discussion

### The Real Cost

The technical analysis identified "multi-plan overwhelm" as Pattern 3. But the human cost is:
- **14-hour days** of intense cognitive work
- **Constant context switching** between plans, projects, repositories
- **Fear of losing track** - "where was that discussion about X?"
- **Mental fatigue** from holding complex relationships in working memory

The `what-happened-in-*.md` files exist because Tim *had* to capture context somewhere. They're survival mechanisms, not designed artifacts.

### What "Plans for Plans" Means

```
Level 0: The actual code (riotprompt, agentic, execution-*)
Level 1: The plans for code (secure-riotprompt, big-splitup)
Level 2: Plans for plans (this analysis - how should riotplan work?)
Level 3: Meta-plans (plan-prompt-to-end-all-prompts.md - how should we plan?)
Level 4: Relationships (which plans depend on which? what spawned what?)
```

A human brain is holding all of this. Every day. For 14 hours.

## Resolution

Add a new section to RIOTPLAN_ANALYSIS.md: **"Human Experience: Before and After"**

This section will include:
1. **The Current Reality** - A story of a day without RiotPlan
2. **The Envisioned Future** - A story of a day with RiotPlan
3. **The Pain Points** - Explicit list of what hurts
4. **How RiotPlan Helps** - Specific features addressing each pain

## Changes Made

| File | Change |
|------|--------|
| `feedback/003-human-experience-stories.md` | Created this record |
| `RIOTPLAN_ANALYSIS.md` | (pending) Add human experience section |

## Meta-Observation

This feedback is different from the previous two. It's not about features or philosophy—it's about *suffering*. Tim is telling us that the current state is exhausting. The analysis was technically complete but emotionally hollow.

By adding human stories, we transform RiotPlan from "a tool that manages plans" to "a tool that gives a human their life back."

---

*Feedback record 003 documenting the human cost of manual plan management.*

