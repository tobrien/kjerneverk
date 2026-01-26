# Feedback 020: Audience-Aware Documentation

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.16 → v0.17
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review raised a concern about jargon:

> "Jargon and clarity: Terms like 'metacognitive framework' might confuse or alienate users if not well explained. The concept may sound abstract, making it hard to explain to non-technical stakeholders without simplification."

## Feedback Given

**Tim's response:**

"I get it, and that's why I want to specify that the documentation needs to be intelligent enough to provide a simple message before it pivots to a complicated set of terms like 'metacognitive' blah blah blah. What I'd love to have is an interface for multiple audiences. I'd love to provide an onboarding interface for people that don't need all of the philosophical baggage alongside an interface for people that want to get that full picture."

## Discussion

### The Insight: Two Audiences, Two Paths

Not everyone needs the philosophy. Some users just want to:
- Manage their plans
- Track what's blocked
- Resume where they left off

They don't care about "metacognition" or "deliberation preservation." They want a tool that works.

Other users want to understand **why** the tool works the way it does:
- The philosophical foundation
- The research grounding
- The design decisions

Both are valid. Documentation should serve both.

### Proposed Documentation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RiotPlan Documentation                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    LANDING PAGE                            │  │
│  │                                                            │  │
│  │   "RiotPlan helps you manage complex, multi-step work."   │  │
│  │                                                            │  │
│  │   [Get Started →]              [Why RiotPlan? →]          │  │
│  │   (practical path)             (philosophical path)        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │   PRACTICAL PATH        │  │   PHILOSOPHICAL PATH         │  │
│  │   "Just show me how"    │  │   "Help me understand why"   │  │
│  │                         │  │                              │  │
│  │   - Quick Start (5 min) │  │   - Philosophy & Motivation  │  │
│  │   - Basic Commands      │  │   - Human Stories            │  │
│  │   - Common Workflows    │  │   - Research Grounding       │  │
│  │   - Examples            │  │   - Design Decisions         │  │
│  │                         │  │   - "The Book" (full guide)  │  │
│  │   No jargon.            │  │   All the jargon.            │  │
│  │   No philosophy.        │  │   All the philosophy.        │  │
│  │   Just tools.           │  │   The full picture.          │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    REFERENCE (for everyone)                │  │
│  │   - CLI Reference                                          │  │
│  │   - API Reference                                          │  │
│  │   - File Formats                                           │  │
│  │   - Configuration                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Practical Path: No Philosophical Baggage

**Quick Start (5 minutes)**
```markdown
# Quick Start

RiotPlan manages plans. A plan is a directory with markdown files.

## Create a plan
$ riotplan plan init my-feature

## See where you are
$ riotplan status

## Mark step complete
$ riotplan step complete 1

That's it. You're using RiotPlan.
```

No mention of:
- Metacognition
- Deliberation preservation
- Evolving records of reasoning
- Phase 0 inception

Just: here's how to use the tool.

### Philosophical Path: The Full Picture

**Philosophy & Motivation**
```markdown
# Why RiotPlan Exists

Plans are not static documents. They're evolving records of reasoning—
trajectories of thought that capture not just what you decided, but 
why you decided it and how you got there.

The conversation between human and AI is where the real work happens.
It's metacognition—thinking about thinking, reasoning about approach...
```

All the philosophy, research grounding, human stories—for people who want it.

### Key Principle: Simple First, Deep Optional

Every documentation entry point should:
1. **Start simple**: What does this do? How do I use it?
2. **Link to depth**: "Want to understand why? See Philosophy."

Example CLI help:
```
$ riotplan feedback --help

USAGE: riotplan feedback <command>

Capture conversations about your plan.

COMMANDS:
  create <title>    Start a new feedback record
  list              Show all feedback
  show <id>         View specific feedback
  summarize         Generate summary of all feedback

Learn more: https://riotplan.dev/docs/feedback
Deep dive: https://riotplan.dev/docs/philosophy/deliberation
```

The help is practical. The links go deeper for those who want it.

### Documentation Tones

| Path | Tone | Example |
|------|------|---------|
| **Practical** | Direct, instructional | "Run this command. You'll see this output." |
| **Philosophical** | Reflective, explanatory | "The insight behind this feature is..." |
| **Reference** | Neutral, comprehensive | "Parameters: --format (pdf\|html\|docx)" |

### Implementation

1. **docs/ structure** reflects both paths:
   ```
   docs/
   ├── index.md                 # Landing with both paths
   ├── quick-start/             # Practical path
   │   ├── 5-minute-intro.md
   │   ├── common-workflows.md
   │   └── examples/
   ├── philosophy/              # Philosophical path
   │   ├── motivation.md
   │   ├── human-stories.md
   │   ├── research.md
   │   └── the-book/           # Full guide
   └── reference/               # For everyone
       ├── cli/
       ├── api/
       └── formats/
   ```

2. **Navigation** clearly shows both paths
3. **Cross-links** let users dive deeper or stay shallow
4. **Tone markers** help users know which path they're on

## Resolution

Update documentation requirements to specify:
1. Two explicit paths: practical and philosophical
2. Simple messaging before complex terms
3. Cross-linking between paths
4. Quick Start that works in 5 minutes with zero jargon

## Changes Made

1. Add "Audience-Aware Documentation" section to Documentation Requirements
2. Specify dual-path structure
3. Document tone expectations for each path
4. Update docs/ directory structure

## Meta-Observation

This feedback itself demonstrates the principle: the ChatGPT review (philosophical analysis) identified a real usability concern. The response is practical: give users a choice of paths.

The philosophy matters—it's why RiotPlan is different from other tools. But not everyone needs to understand it to benefit from using it.

