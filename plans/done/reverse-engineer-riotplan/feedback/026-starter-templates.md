# Feedback 026: Starter Templates and Wizards

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor)
- **Platform**: Cursor IDE
- **Plan Version**: v0.22 → v0.23
- **Related Files**: 
  - evidence/chatgpt-critical-review-2026-01-14.md
  - RIOTPLAN_ANALYSIS.md

## What Was Proposed (from ChatGPT Critical Review)

The ChatGPT 5.2 Pro review suggested:

> "As a suggestion, once a beta is available, observing real user workflows will be important: see which commands are used frequently, which are confusing, etc., and refine accordingly. Perhaps providing some default templates or wizards (the analysis asks if RiotPlan should ship with plan templates) would help new users not start from scratch every time."

## Feedback Given

**Tim's response:**

"I like the idea of having a starting set of templates."

## Discussion

### The Cold Start Problem

New users face a blank slate:

```bash
$ riotplan plan init my-feature

Created: my-feature/
├── my-feature-prompt.md    # Empty
├── SUMMARY.md              # Empty
├── EXECUTION_PLAN.md       # Empty
├── STATUS.md               # Empty
└── plan/                   # Empty

Now what?
```

Without guidance, users don't know:
- How to structure phases
- What level of detail to include
- What a "good" plan looks like
- Common patterns for different work types

### The Solution: Starter Templates

Ship RiotPlan with templates for common scenarios:

```bash
$ riotplan plan init my-feature --template feature

Using template: feature
Created: my-feature/
├── my-feature-prompt.md    # Pre-filled with feature template
├── SUMMARY.md              # Structure ready
├── EXECUTION_PLAN.md       # 4 phases pre-defined
├── STATUS.md               # Steps outlined
└── plan/                   # Phase docs created

Template applied. Customize the plan to fit your needs.
```

### Built-in Template Library

| Template | Use Case | Phases |
|----------|----------|--------|
| `feature` | New feature development | Research → Design → Implement → Test → Deploy |
| `bugfix` | Bug investigation and fix | Reproduce → Investigate → Fix → Verify |
| `refactor` | Code refactoring | Audit → Plan → Execute → Verify |
| `security` | Security audit/hardening | Assess → Identify → Remediate → Verify |
| `migration` | System/library migration | Analyze → Plan → Execute → Validate → Cleanup |
| `research` | Exploratory research | Question → Gather → Analyze → Synthesize |
| `content` | Blog/document creation | Brainstorm → Outline → Draft → Edit → Publish |
| `onboarding` | New project/team setup | Assess → Configure → Document → Train |
| `incident` | Incident response | Detect → Triage → Resolve → Postmortem |
| `blank` | Empty template (default) | No pre-defined structure |

### Example: Feature Template

```markdown
# EXECUTION_PLAN.md (feature template)

## Phase 1: Research & Discovery
Understanding the problem space before building.

### Step 1.1: Requirements Gathering
- [ ] Document user needs
- [ ] Identify constraints
- [ ] Define success criteria

### Step 1.2: Technical Research
- [ ] Review existing codebase
- [ ] Identify integration points
- [ ] Research similar solutions

## Phase 2: Design
Defining what we'll build.

### Step 2.1: API/Interface Design
- [ ] Define public interfaces
- [ ] Document data structures
- [ ] Get design review

### Step 2.2: Architecture
- [ ] Component breakdown
- [ ] Dependency mapping
- [ ] Performance considerations

## Phase 3: Implementation
Building the feature.

### Step 3.1: Core Implementation
- [ ] Implement core logic
- [ ] Unit tests
- [ ] Integration points

### Step 3.2: Edge Cases & Error Handling
- [ ] Handle error scenarios
- [ ] Add validation
- [ ] Logging and observability

## Phase 4: Testing & Validation
Ensuring quality.

### Step 4.1: Testing
- [ ] Complete test coverage
- [ ] Integration tests
- [ ] Manual testing

### Step 4.2: Documentation
- [ ] API documentation
- [ ] Usage examples
- [ ] Update README

## Phase 5: Deployment
Shipping to production.

### Step 5.1: Staging Deployment
- [ ] Deploy to staging
- [ ] Smoke tests
- [ ] Stakeholder review

### Step 5.2: Production Release
- [ ] Production deployment
- [ ] Monitor metrics
- [ ] Announce release
```

### Example: Content Template

```markdown
# EXECUTION_PLAN.md (content template)

## Phase 1: Brainstorm & Research
What are we writing about?

### Step 1.1: Topic Exploration
- [ ] Define the core message
- [ ] Identify target audience
- [ ] Gather initial ideas

### Step 1.2: Research
- [ ] Find supporting sources
- [ ] Interview/gather quotes
- [ ] Competitive analysis

## Phase 2: Outline
Structuring the content.

### Step 2.1: Create Outline
- [ ] Main sections
- [ ] Key points per section
- [ ] Flow and transitions

### Step 2.2: Review Outline
- [ ] Get feedback on structure
- [ ] Refine based on feedback

## Phase 3: Draft
Writing the content.

### Step 3.1: First Draft
- [ ] Write complete draft
- [ ] Don't edit while writing
- [ ] Include all sections

### Step 3.2: Self-Review
- [ ] Read aloud
- [ ] Check flow
- [ ] Mark problem areas

## Phase 4: Edit
Refining the content.

### Step 4.1: Structural Edit
- [ ] Reorder if needed
- [ ] Add/remove sections
- [ ] Strengthen arguments

### Step 4.2: Line Edit
- [ ] Improve sentences
- [ ] Remove filler
- [ ] Check tone

### Step 4.3: Proofread
- [ ] Grammar and spelling
- [ ] Formatting
- [ ] Links and references

## Phase 5: Publish
Getting it out there.

### Step 5.1: Final Review
- [ ] Fresh-eyes read
- [ ] Get external feedback
- [ ] Final approval

### Step 5.2: Publish
- [ ] Format for platform
- [ ] Publish
- [ ] Share/promote
```

### Interactive Wizard Mode

For users who want more guidance:

```bash
$ riotplan plan init my-feature --wizard

┌─────────────────────────────────────────────────────────────────┐
│  PLAN CREATION WIZARD                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  What type of work is this?                                      │
│                                                                  │
│  [1] Feature development                                         │
│  [2] Bug fix                                                     │
│  [3] Refactoring                                                 │
│  [4] Security work                                               │
│  [5] Migration                                                   │
│  [6] Research/exploration                                        │
│  [7] Content creation (blog, docs)                               │
│  [8] Something else (blank)                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

> 1

Using: feature template

How complex is this feature?
[1] Small (1-3 days)
[2] Medium (1-2 weeks)
[3] Large (2+ weeks)

> 2

Adjusting template for medium complexity...
- Added design review phase
- Added staging deployment
- Added documentation phase

What's the main goal? (one sentence)
> Add dark mode toggle to settings page

Setting plan summary...

Who will execute this plan?
[1] Mostly AI (Claude Code, etc.)
[2] Mostly human
[3] Mixed

> 3

Configuring executors...
- Research: openai (deep research)
- Implementation: anthropic:claude-code
- Review: human

Plan created: my-feature/
Run `riotplan status` to see your plan.
```

### Template Customization

Users can create and share their own templates:

```bash
# Save current plan as template
$ riotplan template save security-audit --from ./my-security-plan

Template saved: ~/.riotplan/templates/security-audit/

# List available templates
$ riotplan template list

Built-in:
  feature, bugfix, refactor, security, migration, research, content

Custom:
  security-audit (saved 2026-01-14)
  api-integration (saved 2026-01-10)

# Share template
$ riotplan template export security-audit > security-audit.riottemplate

# Import shared template
$ riotplan template import team-onboarding.riottemplate
```

### Connection to Metaplans

Templates are the simpler cousin of metaplans:

| Concept | What It Is | Source |
|---------|------------|--------|
| **Template** | Starting structure | Shipped with RiotPlan or user-created |
| **Metaplan** | Proven pattern with history | Extracted from successful retrospectives |

Templates are a starting point. Metaplans are battle-tested.

```
Templates → Use → Retrospectives → Insights → Metaplans
                                               ↓
                                    Refined Templates
```

### CLI Commands

```bash
# Create plan from template
riotplan plan init <name> --template <template>

# Interactive wizard
riotplan plan init <name> --wizard

# List templates
riotplan template list

# Preview template
riotplan template show <template>

# Save plan as template
riotplan template save <name> --from <plan-path>

# Export template (shareable)
riotplan template export <name> > file.riottemplate

# Import template
riotplan template import <file>

# Download community template (future)
riotplan template install <name> --from registry
```

### Why This Matters

1. **Reduces friction**: Users start with structure, not blank page
2. **Encodes best practices**: Templates embody learned patterns
3. **Speeds onboarding**: New users see what "good" looks like
4. **Encourages consistency**: Teams can share templates
5. **Builds community**: Template sharing creates ecosystem

## Resolution

1. Add requirement R28: Starter Templates
2. Define built-in template library
3. Add wizard mode for interactive creation
4. Add template management CLI commands
5. Document connection between templates and metaplans

## Changes Made

1. Add R28: Starter Templates and Wizards
2. Add template list and examples
3. Add wizard mode description
4. Add template CLI commands
5. Show template → metaplan evolution

## The One-Liner

> **Don't make users start from scratch. Ship templates that encode best practices.**

