# Step 24: Documentation Site

## Objective

Create and deploy comprehensive documentation for RiotPlan, following the audience-aware structure defined in the analysis.

## Background

From RIOTPLAN_ANALYSIS.md:

> RiotPlan should launch with comprehensive documentation that enables others to use it. This isn't an afterthought—it's a core deliverable.

Two paths:
- **Practical path**: "Just show me how" - no jargon, just tools
- **Philosophical path**: "Help me understand why" - full depth

## Tasks

### 1. Create Documentation Structure

```
docs/
├── public/
│   ├── index.md                 # Landing page
│   │
│   ├── quick-start/             # PRACTICAL PATH
│   │   ├── 5-minute-intro.md
│   │   ├── basic-commands.md
│   │   ├── common-workflows.md
│   │   └── cheatsheet.md
│   │
│   ├── philosophy/              # PHILOSOPHICAL PATH
│   │   ├── motivation.md
│   │   ├── human-stories.md
│   │   ├── research.md
│   │   └── design-decisions.md
│   │
│   ├── guides/                  # HOW-TO GUIDES
│   │   ├── capturing-feedback.md
│   │   ├── cross-project-deps.md
│   │   ├── creating-templates.md
│   │   └── using-with-cursor.md
│   │
│   ├── reference/               # REFERENCE
│   │   ├── cli-commands.md
│   │   ├── file-formats.md
│   │   └── configuration.md
│   │
│   └── examples/                # EXAMPLES
│       ├── simple-feature/
│       ├── security-audit/
│       └── blog-post/
│
├── src/                         # React app
│   ├── App.tsx
│   ├── components/
│   │   ├── DocPage.tsx
│   │   ├── Navigation.tsx
│   │   └── CodeBlock.tsx
│   └── main.tsx
│
├── package.json
└── vite.config.ts
```

### 2. Write Core Documentation

#### index.md (Landing Page)

```markdown
# RiotPlan

> Manage long-lived, stateful AI workflows. Preserve the reasoning behind decisions.

RiotPlan helps you plan, track, and remember *why*.

## Quick Start

```bash
npm install -g @riotprompt/riotplan-cli
riotplan plan init my-feature
```

[Get Started →](./quick-start/5-minute-intro.md)

## Why RiotPlan?

Ever reopened a project and wondered *why* that approach was taken?

RiotPlan captures not just your plans, but the conversations and decisions that shaped them. When you return in 6 months, you'll know exactly what you were thinking.

[Learn More →](./philosophy/motivation.md)
```

#### 5-minute-intro.md

```markdown
# 5-Minute Introduction

Get running in 5 minutes. No philosophy, just action.

## Install

```bash
npm install -g @riotprompt/riotplan-cli
```

## Create Your First Plan

```bash
riotplan plan init my-feature
```

This creates:
- `my-feature/SUMMARY.md` - Plan overview
- `my-feature/STATUS.md` - Current state
- `my-feature/plan/` - Step files

## Check Status

```bash
cd my-feature
riotplan status
```

## Add Feedback

When you make a decision, capture it:

```bash
riotplan feedback create "Why we chose approach X"
```

## That's It!

You now have a plan that tracks its own reasoning.

[Learn more commands →](./basic-commands.md)
```

### 3. Write Human Stories

Extract from RIOTPLAN_ANALYSIS.md "Human Experience" section into `human-stories.md`:

- "A Day Without RiotPlan" - the 14-hour cognitive grind
- "A Day With RiotPlan" - streamlined workflow
- Pain points table with real examples

### 4. Write Reference Documentation

#### cli-commands.md

Auto-generate from CLI command definitions:

```markdown
# CLI Commands

## plan

### plan init

Create a new plan.

```bash
riotplan plan init <name> [options]
```

**Arguments:**
- `<name>` - Plan code (lowercase, hyphens)

**Options:**
- `-d, --description <text>` - Plan description
- `-t, --template <id>` - Template to use
- `-p, --path <path>` - Base path (default: ./prompts)

**Examples:**
```bash
riotplan plan init my-feature
riotplan plan init security-audit -t security
```
```

### 5. Create Example Plans

Include 3-4 complete example plans:

```
examples/
├── simple-feature/
│   ├── SUMMARY.md
│   ├── STATUS.md
│   ├── plan/
│   │   ├── 01-setup.md
│   │   ├── 02-implement.md
│   │   └── 03-test.md
│   └── feedback/
│       └── 001-scope-discussion.md
│
├── security-audit/
│   └── ... (complete security plan)
│
└── blog-post/
    └── ... (complete content plan)
```

### 6. Build React Documentation Site

Following riotprompt/docs pattern:

```typescript
// src/App.tsx
import { DocPage } from './components/DocPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <div className="docs-container">
      <Navigation />
      <main>
        <DocPage />
      </main>
    </div>
  );
}
```

### 7. Deploy to GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd docs && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/dist
```

## Acceptance Criteria

- [ ] All core documentation written
- [ ] Practical path complete (no jargon)
- [ ] Philosophical path complete (full depth)
- [ ] CLI reference auto-generated
- [ ] Example plans included
- [ ] React site builds
- [ ] Deployed to GitHub Pages
- [ ] Search works
- [ ] Mobile responsive
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `docs/` - New documentation site
- `.github/workflows/docs.yml` - Deployment

## Dependencies

- All previous steps (for complete CLI reference)

## Notes

- Documentation should be written in plain language
- Use the terminology guidance from analysis
- Include real scenarios, not abstract examples

