# Feedback 028: Explainability and Communication (CRITICAL)

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.24 → v0.25
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md
- **Priority**: **CRITICAL** - This feedback should be elevated to a core design principle

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review provided extensive feedback on explainability:

> "A critical aspect for RiotPlan's success is how clearly its purpose and usage can be communicated to both developers and non-technical stakeholders. The concept is somewhat novel – it's not just another to-do list or project management tool, but a hybrid of a planner and a knowledge capture system. Explaining this succinctly is a challenge."

## Feedback Given

**Tim's response:**

"I want you to make sure that you elevate this to a really important part of whatever plan we create - this project needs to be explained, easily to people without having to require them to have a PhD in metacognition."

## Discussion

### The Core Problem

RiotPlan is conceptually novel. It's not:
- A to-do list (though it tracks tasks)
- A project management tool (though it manages projects)
- A documentation system (though it produces documents)
- An AI assistant (though it works with AI)

It's a **hybrid planner and knowledge capture system**. This is hard to explain.

### The Risk

If we can't explain it simply:
- Developers won't adopt it (seems like overhead)
- Managers won't approve it (unclear ROI)
- Teams won't use it (too abstract)
- The project fails despite being useful

**Communication is not a nice-to-have. It's existential.**

### Multiple Explanation Approaches

The review provided excellent framings for different audiences:

#### 1. Analogy-Driven (Universal)

> "RiotPlan is like a **lab notebook** for your projects, where not only the steps of the experiment are recorded, but also all the discussions and reasoning that led to those steps. It ensures you never lose the *why* behind your decisions."

#### 2. Problem-Oriented (Pain Point Recognition)

> "Ever reopened a project and wondered *why* a certain approach was taken? RiotPlan captures that missing context by storing the dialogue between team members (or AI assistants and developers) that shaped the plan."

#### 3. Outcome-Oriented (Benefits)

> "Using RiotPlan should mean faster onboarding for new team members, less duplicated work across projects, and more reliable AI assistance, because all the context and rationale are at your fingertips."

#### 4. Technical (For Developers)

> "It's all just Markdown and Git under the hood, with a CLI to help manage it – so it fits naturally with your code repository."

#### 5. Familiar Context (Knowledge Management)

> "RiotPlan brings best practices from knowledge management into your planning workflow—formalizing what good teams already do (meeting minutes, design docs, decision logs) and making it searchable and reusable."

### Audience-Specific Messaging

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIENCE-SPECIFIC MESSAGING                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AI-SAVVY DEVELOPER                                              │
│  "Captures prompt engineering rationale and chain-of-thought     │
│   for plans. Your AI conversations become searchable knowledge." │
│                                                                  │
│  GENERAL SOFTWARE ENGINEER                                       │
│  "Captures discussions and decisions alongside your plan.        │
│   Never ask 'why did we do it this way?' again."                 │
│                                                                  │
│  CONTENT CREATOR                                                 │
│  "Track your creative process from brainstorm to publication.    │
│   Keep all your research, feedback, and revisions in one place." │
│                                                                  │
│  PROJECT MANAGER                                                 │
│  "A living project plan that captures all decisions and their    │
│   rationale. Accountability and visibility built in."            │
│                                                                  │
│  NON-TECHNICAL STAKEHOLDER                                       │
│  "See what's happening, why decisions were made, and where       │
│   things stand—without digging through technical details."       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Terminology Cleanup

**Words to avoid (or explain):**
- ❌ "Metacognitive framework" → ✅ "Captures your reasoning"
- ❌ "Deliberation capture" → ✅ "Saves your discussions"
- ❌ "Reasoning trace" → ✅ "Decision history"
- ❌ "Epistemic context" → ✅ "Background knowledge"

**Internal names to remove from public docs:**
- ❌ kjerneverk, fjellgrunn, grunnverk → ✅ "Project A", "Project B"
- ❌ @theunwalked/offrecord → ✅ "a secrets library"

**Terms to clarify:**
| Term | Clarification Needed |
|------|---------------------|
| **Plan** | Not a calendar plan; a structured workflow with captured reasoning |
| **Project** | Can have multiple plans; plans live alongside code |
| **Metaplan** | Consider: "Template" or "Master Plan" instead |
| **Feedback** | Means "review discussion", not user product feedback |
| **Evidence** | Supporting materials gathered during inception |

### Documentation Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENTATION STRUCTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LEVEL 1: LANDING PAGE (30 seconds)                              │
│  "RiotPlan helps you plan, track, and remember why."             │
│  One-liner + 3 bullet benefits + "Get Started" button            │
│                                                                  │
│  LEVEL 2: QUICK START (5 minutes)                                │
│  Install → Create first plan → See it work                       │
│  No philosophy, just action                                      │
│                                                                  │
│  LEVEL 3: TUTORIAL (30 minutes)                                  │
│  Walk through a real scenario:                                   │
│  - Content creator planning a tutorial series                    │
│  - Developer building a feature                                  │
│  - Team planning a migration                                     │
│                                                                  │
│  LEVEL 4: CONCEPTS (as needed)                                   │
│  Explain plan structure, feedback, phases, etc.                  │
│  Reference when stuck, not required reading                      │
│                                                                  │
│  LEVEL 5: PHILOSOPHY (for the curious)                           │
│  The full story, metacognition, research references              │
│  Completely optional                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Real Examples > Abstract Concepts

**Show, don't tell.** Include case study scenarios:

**Scenario 1: Content Creator**
> Maya wants to plan a 10-episode tutorial series using an AI writing assistant. She uses RiotPlan to:
> 1. Outline episodes (plan creation)
> 2. Discuss structure with AI (feedback captured)
> 3. Revise based on editor feedback
> 4. Track writing progress (status updates)
> 
> Six months later, when creating Season 2, she reviews her original reasoning and doesn't repeat mistakes.

**Scenario 2: Developer**
> Alex is building a new API. Three months in, a new team member asks "why did you use pagination instead of cursor-based?" Alex can point to `feedback/003-pagination-decision.md` which captured the original debate, tradeoffs, and final decision.

**Scenario 3: Team Migration**
> A team is migrating from REST to GraphQL. The plan captures:
> - Why GraphQL was chosen (evidence)
> - The migration strategy (plan)
> - Concerns raised and how they were addressed (feedback)
> - What actually happened (status + retrospective)
> 
> Next year, another team doing a similar migration can learn from this.

### Non-Technical Stakeholder Interface

For managers, clients, and domain experts who won't use CLI:

**Dashboard benefits to emphasize:**
- **Accountability**: All decisions recorded; easy to review what was agreed
- **Visibility**: Real-time status (living plan, not stale document)
- **Collaboration**: Input captured, not lost in email threads
- **Audit trail**: Perfect for compliance, retrospectives, handoffs

**The dashboard should be their interface:**
- Read-only or comment-enabled view
- Human-readable status (no technical jargon)
- Exportable reports for meetings

### The Elevator Pitches

**For anyone (15 seconds):**
> "RiotPlan is a planning tool that remembers why you made decisions. It captures your discussions, tracks your progress, and makes sure good ideas don't get lost."

**For developers (15 seconds):**
> "RiotPlan is Markdown + Git + CLI for managing plans. It captures the reasoning behind your decisions so you never wonder 'why did we do it this way?' again."

**For managers (15 seconds):**
> "RiotPlan creates a living record of project decisions. It replaces stale project plans with something that's always current and shows exactly why things are the way they are."

**For AI workflows (15 seconds):**
> "When you work with AI assistants, the best ideas emerge in conversation. RiotPlan captures those conversations so they're not lost when the chat window closes."

### Design Principle: Explainability-First

**Elevate this to a core principle:**

> **Every feature, every command, every concept must be explainable in one sentence without jargon.**

Before shipping any feature, ask:
1. Can a new user understand what this does in 10 seconds?
2. Can we explain the value without using technical terms?
3. Is there a real-world analogy that makes this click?

If no to any of these, simplify or rename.

### Naming Audit

| Current Term | Issue | Proposed Alternative |
|--------------|-------|---------------------|
| `metaplan` | "Meta" is jargon | `template` or `master-plan` |
| `evidence/` | Sounds legal | `research/` or `background/` |
| `deliberation` | Academic | `discussions` |
| `inception` | Christopher Nolan? | `research` or `discovery` |
| `elaboration` | Vague | `planning` |

### Success Metrics for Communication

How do we know if we've explained it well?

1. **5-second test**: Show landing page for 5 seconds. Can user say what it does?
2. **Grandmother test**: Can you explain it to a non-technical relative?
3. **Adoption curve**: Do users stick around after first use?
4. **Support questions**: Are people asking "what is this?" or "how do I do X?"

## Resolution

1. **ELEVATE** explainability to a core design principle
2. Create audience-specific messaging guide
3. Build documentation hierarchy (landing → quick start → tutorials → concepts → philosophy)
4. Include real scenario walkthroughs
5. Audit and rename jargon-heavy terms
6. Design dashboard for non-technical stakeholders
7. Test explanations with real users before launch

## Changes Made

1. Add "Explainability-First Design Principle" to core principles section
2. Add "Audience-Specific Messaging" reference
3. Add documentation hierarchy to docs requirements
4. Include elevator pitches
5. Flag terminology for audit
6. Emphasize dashboard for non-technical users

## The One-Liner

> **If we can't explain it simply, we don't understand it well enough. Explainability is not documentation—it's design.**

