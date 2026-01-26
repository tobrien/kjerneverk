# Feedback 027: Collaboration via Git (Not Real-Time Multi-User)

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.23 → v0.24
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review raised concerns about collaboration:

> "Collaboration in the context of RiotPlan refers to multiple people (and possibly multiple AI agents) working on the same plan. The current state is that v1 is strictly single-user: no real-time collaborative editing, and no server backend for sharing. Each plan lives in a local directory (or git repo) and one person at a time edits it. This is understandable for an MVP, but it limits RiotPlan's use in team settings where you'd ideally want several contributors.
>
> The analysis explicitly lists 'Collaborative editing – Single-user initially. No real-time sync.' as out-of-scope for v1, and similarly 'Hosted sharing' is not in initial release (the riotplan share command just creates local files, not sharable links). These are significant exclusions that could create friction later."

## Feedback Given

**Tim's response:**

"Ok, well that's not entirely true, sometimes these plans will be stored in GitHub and people will be able to revise and amend plans in the context of what is checked in. And, I also do think that multiple people will be generating feedback to alter plans. But I think the larger question is answered by, yes, we are not going to be focused on building multi-user systems for now."

## Discussion

### Clarifying "Single-User"

The critical review interpreted "single-user" as "isolated"—one person works alone, no sharing. But that's not the reality:

```
┌─────────────────────────────────────────────────────────────────┐
│  WHAT "SINGLE-USER" ACTUALLY MEANS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ NOT THIS:                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Alice works alone                                       │    │
│  │  ↓                                                       │    │
│  │  Plan stays on Alice's machine                           │    │
│  │  ↓                                                       │    │
│  │  No one else ever sees it                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ✅ THIS:                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Alice creates plan locally                              │    │
│  │  ↓                                                       │    │
│  │  Pushes to GitHub                                        │    │
│  │  ↓                                                       │    │
│  │  Bob pulls, adds feedback/003-bobs-concerns.md           │    │
│  │  ↓                                                       │    │
│  │  Carol reviews, creates PR with revisions                │    │
│  │  ↓                                                       │    │
│  │  Alice merges, continues execution                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  "Single-user" means no real-time sync built into RiotPlan.     │
│  Git provides the collaboration layer.                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Git IS the Collaboration Model

For v1, Git provides everything teams need:

| Collaboration Need | Git Solution |
|--------------------|--------------|
| Multiple contributors | Push/pull to shared repo |
| Review process | Pull requests |
| Conflict resolution | Merge/rebase |
| History | Git log |
| Branching | Feature branches for alternative approaches |
| Feedback from others | Add files to `feedback/` directory |
| Attribution | Git commit author |

### Multiple People CAN Generate Feedback

The feedback system naturally supports multiple contributors:

```
my-plan/
└── feedback/
    ├── 001-initial-scope-tim.md         # Tim's feedback
    ├── 002-security-concerns-alice.md   # Alice's feedback
    ├── 003-api-design-review-bob.md     # Bob's feedback
    └── 004-stakeholder-input-carol.md   # Carol's feedback
```

Each team member:
1. Pulls the repo
2. Creates a feedback file
3. Pushes/creates PR
4. Feedback is captured and attributed

### What We're NOT Building (For Now)

| Feature | Why Not Now |
|---------|-------------|
| Real-time collaborative editing | Complex, requires server infrastructure |
| Live presence ("Alice is editing Step 3") | Requires always-on connection |
| Hosted sharing (shareable URLs) | Requires hosting service |
| Comment threads | Git PR comments serve this purpose |
| Notifications | Git/GitHub handles this |
| Access control | Git/GitHub handles this |

### Why This Is The Right Approach

1. **Git is already there**: Teams already use Git for code; plans live alongside code
2. **No new infrastructure**: No server to deploy, no accounts to manage
3. **Proven workflow**: PR-based review is well-understood
4. **Asynchronous by design**: Plans don't need real-time sync; deliberate review is better
5. **Offline-first**: Works without internet connection
6. **No vendor lock-in**: Any Git host works (GitHub, GitLab, Bitbucket, self-hosted)

### Collaboration Patterns That Work Now

**Pattern 1: Shared Repo**
```bash
# Team shares a repo
git clone git@github.com:team/project.git
cd project/plans/feature-x

# Anyone can add feedback
riotplan feedback create "concerns about scope"
git add feedback/
git commit -m "feedback: scope concerns"
git push
```

**Pattern 2: PR-Based Review**
```bash
# Alice creates plan on branch
git checkout -b plan/feature-x
riotplan plan init feature-x --template feature
git add .
git commit -m "plan: initial feature-x plan"
git push -u origin plan/feature-x

# Creates PR for review
# Bob, Carol add feedback via PR comments or feedback/ files
# Merged when approved
```

**Pattern 3: Async Feedback Collection**
```bash
# Export plan for review
riotplan render pdf --output feature-x-v3.pdf

# Send to stakeholders (email, Slack, etc.)
# Collect feedback via any channel

# Import feedback
riotplan feedback import stakeholder-notes.md --source "Product Review Meeting"
```

### Future: What Real-Time Might Look Like

If we build real-time collaboration later (Phase 3+), it would be additive:

```bash
# Future: start collaborative session
riotplan collaborate start feature-x

# Generates shareable URL
Collaboration session started!
Share: https://riotplan.io/session/abc123

# Others can join and see live updates
# Changes sync via server
# Still commits to Git periodically
```

But this is **not v1**. Git-based collaboration is sufficient for initial adoption.

### Documentation Clarification

The analysis should clarify:
- "Single-user" means "no built-in real-time sync"
- Git provides team collaboration
- Multiple people CAN contribute feedback
- This is a deliberate design choice, not a limitation

## Resolution

1. Clarify "single-user" scope in analysis
2. Document Git as the collaboration layer
3. Show team workflow patterns
4. Keep real-time collaboration as future consideration

## Changes Made

1. Update "Out of Scope" section to clarify Git-based collaboration works
2. Add "Collaboration via Git" section explaining team workflows
3. Document feedback from multiple contributors pattern

## The One-Liner

> **"Single-user" means no real-time sync—not no collaboration. Git is the collaboration layer.**

