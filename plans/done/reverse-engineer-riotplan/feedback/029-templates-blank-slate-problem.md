# Feedback 029: Templates Address the Blank Slate Problem

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.25 → v0.26
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md
  - feedback/026-starter-templates.md (related earlier feedback)

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review recommended:

> "Plan templates: Implement a basic templating system (even if just a folder of example plans). This addresses the blank slate problem for new users and encodes best practices. For instance, a software project template might have steps for design, implementation, testing; a content plan template might have steps for outline, draft, review, publish. The analysis asks if templates should be provided – the answer from a product standpoint is likely yes, as long as they are easy to customize. It lowers the barrier to entry."

## Feedback Given

**Tim's response:**

"I like this idea."

## Discussion

### The Blank Slate Problem

This reinforces feedback 026, but from a **product perspective**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE BLANK SLATE PROBLEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User: "I want to plan a new feature"                           │
│                                                                  │
│   $ riotplan plan init my-feature                                │
│                                                                  │
│   Created: my-feature/                                           │
│   ├── my-feature-prompt.md    # Empty                            │
│   ├── SUMMARY.md              # Empty                            │
│   ├── EXECUTION_PLAN.md       # Empty                            │
│   └── STATUS.md               # Empty                            │
│                                                                  │
│   User: "...now what?"                                           │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │                    BLANK SLATE                          │   │
│   │                                                         │   │
│   │                    🤔 ???                                │   │
│   │                                                         │   │
│   │   - What sections should I have?                        │   │
│   │   - How detailed should steps be?                       │   │
│   │   - What does a "good" plan look like?                  │   │
│   │   - Where do I even start?                              │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Result: User abandons tool or creates poor plan                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Product Answer: Yes, Provide Templates

From a **product standpoint**, templates are essential because they:

1. **Lower barrier to entry** — New users can start immediately
2. **Encode best practices** — Users learn good patterns by example
3. **Reduce decision fatigue** — Users don't have to invent structure
4. **Enable customization** — Start with template, adapt to needs
5. **Demonstrate value** — "Oh, this is what RiotPlan can do"

### Minimum Viable Template System

Even a simple implementation helps:

```
riotplan/
└── templates/                    # Just a folder of example plans
    ├── software-feature/
    │   ├── EXECUTION_PLAN.md     # Design → Implement → Test
    │   ├── STATUS.md
    │   └── plan/
    │       ├── 01-design.md
    │       ├── 02-implement.md
    │       └── 03-test.md
    │
    ├── content-creation/
    │   ├── EXECUTION_PLAN.md     # Outline → Draft → Review → Publish
    │   ├── STATUS.md
    │   └── plan/
    │       ├── 01-outline.md
    │       ├── 02-draft.md
    │       ├── 03-review.md
    │       └── 04-publish.md
    │
    ├── bug-fix/
    │   ├── EXECUTION_PLAN.md     # Reproduce → Investigate → Fix → Verify
    │   └── ...
    │
    └── migration/
        ├── EXECUTION_PLAN.md     # Analyze → Plan → Execute → Validate
        └── ...
```

### Usage Flow

```bash
# Without templates (blank slate)
$ riotplan plan init my-feature
# User stares at empty files

# With templates (guided start)
$ riotplan plan init my-feature --template software-feature

Using template: software-feature

Created: my-feature/
├── EXECUTION_PLAN.md     # Pre-filled with phases
├── STATUS.md             # Steps ready to track
└── plan/
    ├── 01-design.md      # "Design the feature..."
    ├── 02-implement.md   # "Implement the design..."
    └── 03-test.md        # "Write tests and validate..."

✨ Template applied! Customize these files to fit your project.
```

### Key Product Principles

| Principle | Implementation |
|-----------|----------------|
| **Easy to start** | `--template` flag copies files, done |
| **Easy to customize** | It's just Markdown—edit freely |
| **Easy to skip** | Default is still blank; templates are opt-in |
| **Easy to extend** | Users can save their own templates |

### Template Discovery

Help users find the right template:

```bash
$ riotplan plan init my-feature --template

No template specified. Available templates:

  software-feature    New feature development (design → implement → test)
  content-creation    Blog/docs (outline → draft → review → publish)
  bug-fix             Bug investigation (reproduce → investigate → fix → verify)
  migration           System migration (analyze → plan → execute → validate)
  research            Exploration (question → gather → analyze → synthesize)
  incident            Incident response (detect → triage → resolve → postmortem)

Use: riotplan plan init my-feature --template <name>
Or:  riotplan plan init my-feature --wizard (interactive)
```

### Templates as Learning Tool

Templates aren't just convenience—they're **education**:

- New user sees template → learns what phases mean
- Template includes comments → explains why structure exists
- Template shows example content → demonstrates appropriate detail level

Example template content:

```markdown
# EXECUTION_PLAN.md (software-feature template)

## Phase 1: Design
Before building, we need to understand what we're building and why.

### Step 1.1: Requirements Gathering
<!-- Tip: Don't skip this. Unclear requirements = wasted implementation time -->
- [ ] Document the user need this feature addresses
- [ ] Identify constraints (time, tech, compatibility)
- [ ] Define success criteria (how will we know it works?)

### Step 1.2: Technical Design
<!-- Tip: Get feedback on design before implementing -->
- [ ] Outline the approach
- [ ] Identify integration points with existing code
- [ ] Document key decisions and alternatives considered
```

### Connection to Feedback 026

This feedback reinforces and complements feedback 026 (Starter Templates):

| Feedback 026 | Feedback 029 |
|--------------|--------------|
| Feature specification | Product justification |
| What templates to include | Why templates matter |
| Template management CLI | Minimum viable implementation |
| Wizard mode | Template discovery |

Together, they make a strong case: **templates are not optional for product success**.

### Implementation Priority

Given the "blank slate problem" is a **barrier to adoption**, templates should be:

1. **Phase 1** (not Phase 3+)
2. **Shipped with initial release**
3. **Simple implementation** (folder of examples is fine)
4. **Expandable later** (wizard, custom templates, sharing)

### The Answer

> "The analysis asks if templates should be provided – the answer from a product standpoint is likely yes."

**Confirmed: Yes, templates are required for product viability.**

## Resolution

1. Elevate templates to Phase 1 priority
2. Confirm "even just a folder of example plans" is acceptable MVP
3. Emphasize templates as learning tool, not just convenience
4. Add template discovery to CLI

## Changes Made

1. Confirm templates are Phase 1 requirement
2. Add product justification to template section
3. Document minimum viable template system
4. Add template discovery CLI example

## The One-Liner

> **Blank slates kill adoption. Templates teach by example and get users to value faster.**

