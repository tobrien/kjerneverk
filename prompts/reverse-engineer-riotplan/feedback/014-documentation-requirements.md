# Feedback: Documentation Requirements and GitHub Pages

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.7.7 → v0.7.8

## Feedback Given

> "I also want the plan that you are looking to capture to really emphasize the creation of documentation. I want a document that outlines the motivation and philosophy, and I want a document that captures some of the human stories, and I want you to create a GitHub Pages page that is very similar to the one created for riotprompt."

> "I'm convinced that we need a startup guide that is basically a book to define terms and approach, and I really want this project to launch with a lot of support so that people other than me can start using it."

## Resolution

Added "Documentation Requirements (Critical)" section with:

### Documentation Structure
```
docs/
├── public/
│   ├── philosophy.md           # Why RiotPlan exists
│   ├── human-stories.md        # Before/after experience
│   ├── getting-started/        # "The Book" - 8 chapters
│   │   ├── 00-introduction.md
│   │   ├── 01-what-is-riotplan.md
│   │   ├── 02-core-concepts.md
│   │   ├── 03-your-first-plan.md
│   │   ├── 04-feedback-and-revision.md
│   │   ├── 05-execution.md
│   │   ├── 06-working-with-multiple-plans.md
│   │   ├── 07-contexts-and-ecosystems.md
│   │   └── 08-advanced-patterns.md
│   ├── reference/              # CLI, file formats, config
│   ├── guides/                 # How-to guides
│   └── examples/               # Complete example plans
└── src/                        # React site (like riotprompt)
```

### Key Documents

1. **Philosophy & Motivation** (`philosophy.md`)
   - Why RiotPlan exists
   - The problem of lost deliberation
   - Metacognitive approach to planning

2. **Human Stories** (`human-stories.md`)
   - "A Day Without RiotPlan" - 14-hour cognitive grind
   - "A Day With RiotPlan" - streamlined workflow
   - Pain points with real examples

3. **The Startup Guide ("The Book")**
   - 8 chapters from introduction to advanced patterns
   - Should read like a book, not a reference manual
   - Goal: understand *why* RiotPlan works the way it does

### Documentation as Phase 0.5

| Phase | Focus |
|-------|-------|
| 0 | Analysis (this document) |
| **0.5** | **Documentation foundation** |
| 1 | Core implementation |
| 1.5 | CLI documentation |
| ... | Ship code, update docs |

**Why documentation first:**
- Forces clarity before implementation
- Serves as specification
- Prevents documentation debt
- "Coming soon" page builds interest

### GitHub Pages Site

Technology stack (matching riotprompt):
- Vite for build
- React for UI
- Markdown rendering
- GitHub Pages deployment

### Deliverables Checklist
- [ ] philosophy.md
- [ ] human-stories.md
- [ ] Getting Started Guide (8 chapters)
- [ ] CLI Reference
- [ ] File Format Reference
- [ ] Configuration Reference
- [ ] Example Plans (4+)
- [ ] GitHub Pages Site (React-based)
- [ ] README.md

## Key Insight

Documentation isn't an afterthought—it's a core deliverable. Someone should be able to read the getting started guide and understand not just *how* to use RiotPlan, but *why* it works the way it does.

The goal is to launch with **comprehensive support** so others can use it, not just the creator.

