# Feedback: Expanded Lifecycle, Archive Utility, and Metaplans

## Context

| Field | Value |
|-------|-------|
| **Date** | 2026-01-14 |
| **Participants** | Tim O'Brien (human), Claude (AI) |
| **Platform** | Cursor IDE |
| **Plan Version** | v0.4 → v0.5 |
| **Session Type** | Major conceptual expansion |
| **Related Files** | `RIOTPLAN_ANALYSIS.md` (Part 2: Plan Lifecycle) |
| **Feedback Number** | 004 |
| **Significance** | High - expands core concepts |

## What Was Proposed

The original lifecycle was:
```
Creation → Review → Revision → Execution → Completion
```

Plans were treated as ephemeral artifacts that served their purpose and were done.

## Feedback Given

Tim provided extensive feedback (quoted in full due to significance):

> "we are only thinking about this until completion, but there's an archival and a history function that these plans play into. I'm frequently referring to a completed plan from a week ago to use when I'm writing a document or a blog about a feature. I don't know how to do this, but I think that the lifecycle needs to focus on the utility of plans and historical plans to help inform new plans.
>
> For example, if plans can be indexed and categorized we can look back on history and identify, 'Prior plans that might be related to this one.'
>
> There's an even larger opportunity in that we might be able to capture the idea of a metaplan. There are plans for specific projects that I've done recently that are something like, 'Figure out what we can do to the Node.js code if our new minimum is Node 24. If that's the case what can we stop doing.' And, what's interesting about that is that this turned into a metaprompt that I could copy across different projects. I think we could start to think about plans the same way, if Riotplan was a thing then I could write a blog post with 'hey there's a new security problem with React, if you are using, I created a shared RiotPlan, download here and apply it to your project.' That would then allow people shared metaplans with each other, and I think that's the idea that's really going to drive a conversation.
>
> Also, this is bigger than code and writing code, tests, etc. One of the things I keep on thinking about when I see this is that this could be used to facilitate the creation of a document, a financial model, an academic paper. I really think that riotplan, while focused on coding could be bigger than just a tool for developers like myself. Please correct this if I'm sounding annoying, but it's a way to capture metacognitive ideas and input that will shape execution.
>
> but back to my original input - the Plan Lifecycle - there's a step before creation which is contemplating the nature of the Plan. Just look at what we are doing right now, I'm not actually asking you to create a plan I'm asking you to help me structure and think about an outcome that will then drive us to a plan. so, there's an inception and elaboration phase. Then there's a creation phase followed by a review. There's execution, but sometimes execution can get complicated by review cycles that happen after difficulties during execution.
>
> Plans can also always be abandoned or reverted
>
> After execution and completion there is sometimes a verification and integration phase, sometimes that can feed back to generate additional plans (which forks off a whole new process) or it can go back to execution.
>
> the other idea for feedback is that the last big plan I made forked off at least 4 other plans. It would be amazing to have a way in the tool to say, 'Ok, here's some feedback, these steps over here are too big, can you fork off another plan' and give it different context.
>
> Then after completion there's a phase where the plan is done, but can be referred to in the future, maybe it's in the archive or something like that, but think beyond just executing a plan."

### Key Points Extracted

1. **Plans have utility after completion** - Referenced for documentation, blogs, learning
2. **Historical indexing** - "Prior plans that might be related to this one"
3. **Metaplans** - Reusable, shareable plan templates that work across projects
4. **Beyond code** - Documents, financial models, academic papers, any structured work
5. **Metacognitive capture** - "a way to capture metacognitive ideas and input that will shape execution"
6. **Expanded lifecycle phases**:
   - **Inception/elaboration** (before creation) - What we're doing right now
   - **Creation** - Actually writing the plan
   - **Review** - Feedback cycles
   - **Execution** - Running the plan
   - **Execution complications** - Review cycles during difficulties
   - **Abandonment/reversion** - Plans can be stopped
   - **Verification/integration** - After execution
   - **Forking** - Plans spawn new plans
   - **Archive/reference** - Plans live on for future use
7. **Explicit plan forking** - "these steps are too big, fork off another plan"

## Discussion

### The Archive as Knowledge Base

Tim's observation reveals that plans are not disposable:

```
Plan Lifecycle (Original View):
  Creation → Execution → Done ❌

Plan Lifecycle (Expanded View):
  Inception → Creation → Execution → Completion → Archive → Reference → Influence
                                                              ↓
                                                        New Plans
```

A completed plan becomes:
- **Documentation source** - "How did we build feature X?"
- **Blog material** - "Here's how we approached security"
- **Learning artifact** - "What worked? What didn't?"
- **Template candidate** - "Can this be reused?"
- **Historical context** - "Prior plans related to this one"

### The Metaplan Concept

This is a significant expansion. A **metaplan** is:

> A reusable, parameterized plan template that can be applied across different projects.

**Example metaplans**:
- "Upgrade to Node 24" - Apply to any Node.js project
- "Fix React Security Issue CVE-2026-XXXX" - Apply to any React app
- "Add TypeScript Strict Mode" - Apply to any TypeScript project
- "Implement OAuth 2.0" - Apply to any web application

**Metaplan sharing**:
```markdown
# Blog Post: Fixing the New React Vulnerability

I created a RiotPlan for this. Download it here:

    riotplan import https://riotplans.dev/react-security-2026-01.plan

Apply it to your project:

    riotplan apply react-security-2026-01 --project ./my-app
```

This transforms RiotPlan from a personal tool to a **community knowledge-sharing platform**.

### Beyond Code: Metacognitive Tool

Tim's insight that this could apply to:
- Financial models
- Academic papers
- Documents
- Any structured creative work

...suggests RiotPlan is really about **metacognition**:

> The act of thinking about thinking. Planning how to approach a complex task. Structuring work before doing it.

This is bigger than "AI coding assistant." It's a framework for **structured deliberation on any complex endeavor**.

### The Full Lifecycle (Revised)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXPANDED PLAN LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PHASE 0: INCEPTION & ELABORATION                                    │    │
│  │   - Contemplating the nature of the work                            │    │
│  │   - Structuring thinking (what we're doing NOW)                     │    │
│  │   - May produce: analysis documents, requirements, feedback         │    │
│  │   - May not produce a plan at all (just understanding)              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PHASE 1: CREATION                                                   │    │
│  │   - Writing the plan structure                                      │    │
│  │   - Defining steps, phases, dependencies                            │    │
│  │   - Creating SUMMARY, EXECUTION_PLAN, STATUS                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PHASE 2: REVIEW & REVISION                                          │    │
│  │   - Human review of plan                                            │    │
│  │   - Feedback cycles (captured in feedback/)                         │    │
│  │   - Multiple iterations (v0.1 → v0.2 → v0.3...)                     │    │
│  │   - May FORK new plans here ("step X is too big")                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│              ┌───────────────┼───────────────┐                               │
│              ▼               ▼               ▼                               │
│         ABANDON          EXECUTE         DEFER                               │
│              │               │               │                               │
│              ▼               ▼               ▼                               │
│  ┌─────────────┐   ┌─────────────────┐   ┌─────────┐                        │
│  │  ABANDONED  │   │ PHASE 3: EXEC   │   │ BACKLOG │                        │
│  │  (archived  │   │ - Step by step  │   │ (future)│                        │
│  │  with why)  │   │ - Quality gates │   └─────────┘                        │
│  └─────────────┘   │ - Status updates│                                      │
│                    │ - May FORK here │                                      │
│                    │ - May BLOCK     │                                      │
│                    │ - May need more │                                      │
│                    │   review ──────────────────┐                           │
│                    └─────────────────┘          │                           │
│                              │                  │                           │
│                              │     ┌────────────┘                           │
│                              ▼     ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PHASE 4: VERIFICATION & INTEGRATION                                 │    │
│  │   - Does it work?                                                   │    │
│  │   - Integration with other systems                                  │    │
│  │   - May spawn follow-up plans                                       │    │
│  │   - May require re-execution                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│              ┌───────────────┼───────────────┐                               │
│              ▼               ▼               ▼                               │
│          RE-EXEC         COMPLETE       SPAWN NEW                            │
│              │               │               │                               │
│              │               ▼               ▼                               │
│              │   ┌─────────────────┐   ┌─────────────────┐                  │
│              │   │ PHASE 5: DONE   │   │ NEW PLAN CYCLE  │                  │
│              │   │ - Mark complete │   │ (back to Phase 0)                  │
│              │   │ - Final docs    │   └─────────────────┘                  │
│              │   └─────────────────┘                                        │
│              │               │                                               │
│              └───────────────┼───────────────────────────────────────┐      │
│                              ▼                                       │      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PHASE 6: ARCHIVE & REFERENCE                                        │    │
│  │   - Indexed and categorized                                         │    │
│  │   - Searchable                                                      │    │
│  │   - Referenced by future plans ("related plans")                    │    │
│  │   - Used for documentation, blogs, learning                         │    │
│  │   - Candidate for metaplan extraction                               │    │
│  │   - Influences future inception phases                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ METAPLAN EXTRACTION (Optional)                                      │    │
│  │   - Generalize project-specific plan                                │    │
│  │   - Parameterize for reuse                                          │    │
│  │   - Publish/share                                                   │    │
│  │   - Others can: import, apply, adapt                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Plan Forking

Tim's observation about secure-riotprompt spawning 4 plans is captured in the analysis, but the *mechanism* wasn't explicit:

```bash
# During review:
$ riotplan feedback "Step 6 is too big"
> These steps are too big, can you fork off another plan?

$ riotplan fork step-06 --to ../utilarium/prompts/offrecord
Created: utilarium/prompts/offrecord
Linked: secure-riotprompt Step 6 → offrecord (BLOCKED)

# During execution:
$ riotplan fork step-09 --reason "Safe regex should be reusable"
Created: utilarium/prompts/pressurelid
```

This makes forking a **first-class operation** rather than an ad-hoc manual process.

## Resolution

### Update Lifecycle Diagram

Replace the simple lifecycle with the expanded 7-phase model including:
- Phase 0: Inception & Elaboration
- Phase 6: Archive & Reference
- Metaplan extraction

### Add Metaplan Concept

New section explaining:
- What metaplans are
- How they're created from completed plans
- How they're shared and applied
- Examples

### Add Plan Forking

Explicit support for:
- `riotplan fork` command
- Forking during review ("this is too big")
- Forking during execution ("this should be reusable")
- Automatic linking of forked plans

### Expand Scope

Acknowledge that RiotPlan is:
- Bigger than code
- A metacognitive tool
- Applicable to any structured work
- A knowledge management system

### Add Archive Features

- Indexing and categorization
- "Related plans" discovery
- Search across historical plans
- Documentation generation from plans

## Changes Made

| File | Change |
|------|--------|
| `feedback/004-expanded-lifecycle-and-metaplans.md` | Created this record |
| `RIOTPLAN_ANALYSIS.md` | (pending) Major lifecycle expansion |

## Open Questions

1. **Metaplan format**: How do you parameterize a plan for reuse?
2. **Metaplan registry**: Should there be a public registry of metaplans?
3. **Plan versioning vs. metaplan versioning**: Different concerns?
4. **Non-code plans**: Should RiotPlan support plans without code context?
5. **Archive storage**: Where do completed plans live long-term?
6. **Related plans algorithm**: How do we determine plan similarity?

## Meta-Observation

This feedback fundamentally changes what RiotPlan is.

**Before this feedback**: RiotPlan was a tool for managing multi-step AI coding tasks.

**After this feedback**: RiotPlan is a **metacognitive framework** for:
- Structured deliberation on complex work
- Knowledge capture and preservation
- Shareable expertise (metaplans)
- Historical learning from past approaches

Tim's observation that this conversation itself is Phase 0 (Inception) is profound. We're not creating a plan—we're thinking about what plans are, how they work, and what a tool for managing them should do.

**This feedback record documents the moment RiotPlan's scope expanded from "coding tool" to "metacognitive framework."**

---

*Feedback record 004 - a pivotal expansion of RiotPlan's conceptual foundation.*

