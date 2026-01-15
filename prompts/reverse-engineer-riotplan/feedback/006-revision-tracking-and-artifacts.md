# Feedback: Revision Tracking, Artifacts, and RiotPrompt Cross-Pollination

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.6 → v0.7
- **Trigger**: Morning reflection on the revision/feedback patterns developed yesterday

## What Was Proposed

The existing design assumed:
1. Plans/prompts live in directories
2. Git tracks version history
3. Feedback records capture conversation, not file diffs
4. The system targets RiotPlan primarily

## Feedback Given

> "I woke up this morning and had an idea that this approach to revision could also be used in Riotprompt."

The user identified several interconnected ideas:

### 1. Cross-Pollination to RiotPrompt

> "It would be interesting to have a way to track the revisions to a prompt and how feedback is provided to move a prompt forward."

The revision/feedback tracking patterns aren't just for plans—they apply to prompts too. A prompt evolves through iteration just like a plan.

### 2. Version Control Without Git Repositories

> "I had just been assuming that this system would make use of GitHub to track changes, but the more I think about this the more I wonder if it might make more sense to build a capability to track diffs within a standard like this itself."

> "I really don't want to have to create a new git repository to track every prompt or plan I'm looking to create."

Key insight: Git is powerful but heavy. Creating a repo for each prompt is overkill. The system needs **lightweight, embedded version tracking**.

### 3. Linear Timeline as Starting Point

> "This could also get really complicated if you start talking branching or creating alternatives, but as a start just supporting a single, linear timeline seems like it would be something useful."

Start simple: a linear sequence of revisions. Branching can come later (or never).

### 4. Single-File Artifact

> "Think about a prompt or a plan that you could send to someone in a Zip file that packs up all the history, revisions, and state."

> "Then also think about being able to tell the system, send this current state of this prompt without history."

Two export modes:
- **Full artifact**: Everything—history, feedback, evidence, current state
- **Snapshot**: Just the current state, no history

### 5. IDE Plugin Vision

> "It's this ability to spin up a prompt... and then have an IDE plugin that allows you to edit it with feedback would just be amazing."

> "Then having the ability to store it as a single file and have a system be able to consume it, render it into a compatible format for different engines."

The workflow:
1. Create prompt/plan
2. Edit in IDE with integrated feedback
3. System tracks revisions automatically
4. Export as single file
5. Import elsewhere, render for different engines (Anthropic, OpenAI, etc.)

### 6. Automated Improvement Process

> "A format like riotplan or riotprompt could be pivotal to an approach to apply improvement processes to a prompt."

> "One way to give it feedback would be to run it and have something look at the output. That suggests that a prompt could also have a series of checks defined in it to make sure that the prompt is performing and provide feedback to an iterative improvement process."

This introduces **prompt testing/validation**:
- Define expected behaviors
- Run prompt
- Check output against expectations
- Generate feedback automatically
- Iterate

### 7. RiotPlan ↔ RiotPrompt Convergence

> "The experience of thinking about riotplan is also going to start to affect how riotprompt works."

Plans and prompts share fundamental patterns:
- Both evolve through revision
- Both benefit from feedback capture
- Both need version history
- Both should be portable artifacts

## Discussion

### The Version Control Problem

Git is designed for:
- Large codebases
- Multiple contributors
- Complex branching
- Distributed development

A prompt/plan needs:
- Single-file or small-directory tracking
- Usually single author (or small team)
- Linear history (at least initially)
- Portability over distribution

**Possible approaches:**

| Approach | Pros | Cons |
|----------|------|------|
| **Git submodules/worktrees** | Full Git power | Complex, heavy |
| **Git bundle** | Portable Git history | Still requires Git |
| **SQLite database** | Single-file, queryable | Binary, needs tooling |
| **Inline diffs (RCS-style)** | Text-based, simple | Can get messy |
| **Snapshot directory** | Simple, human-readable | Storage-heavy |
| **JSON/YAML history log** | Structured, readable | Needs custom tooling |
| **Patch files** | Standard format | Manual management |

### The Artifact Format

What would a "riotplan artifact" look like?

**Option A: Zip bundle**
```
my-plan.riotplan  (actually a .zip)
├── manifest.json          # Metadata, version info
├── current/               # Current state
│   ├── SUMMARY.md
│   ├── EXECUTION_PLAN.md
│   └── plan/
├── history/               # Version history
│   ├── v0.1/
│   ├── v0.2/
│   └── ...
├── feedback/              # Deliberation records
├── evidence/              # Inception materials
└── diffs/                 # Change records
    ├── v0.1-to-v0.2.diff
    └── ...
```

**Option B: Single JSON/YAML file**
```yaml
# my-plan.riotplan.yaml
metadata:
  name: secure-riotprompt
  version: "0.7"
  created: 2026-01-10
  
current:
  summary: |
    # Security Implementation for RiotPrompt
    ...
  execution_plan: |
    ## Phases
    ...
  steps:
    - id: "01"
      title: "Input Validation"
      content: |
        ...

history:
  - version: "0.1"
    date: 2026-01-10
    snapshot: { ... }
  - version: "0.2"
    date: 2026-01-10
    changes:
      - file: SUMMARY.md
        diff: |
          @@ -10,3 +10,5 @@
          ...

feedback:
  - id: "001"
    date: 2026-01-10
    content: |
      ...
```

**Option C: Directory bundle (macOS-style)**
```
my-plan.riotplan/          # Directory that tools treat as single unit
├── Contents/
│   ├── Info.plist         # Metadata
│   ├── Current/           # Current state
│   ├── History/           # Versions
│   └── Resources/         # Evidence, feedback
```

### The RiotPrompt Connection

If prompts use the same patterns:

```
my-prompt.riotprompt/
├── prompt.md              # Current prompt content
├── manifest.json          # Metadata
├── tests/                 # Validation checks
│   ├── test-001.json      # Expected input/output
│   └── ...
├── history/               # Revisions
├── feedback/              # How the prompt evolved
└── renders/               # Pre-rendered for different engines
    ├── anthropic.json
    ├── openai.json
    └── raw.txt
```

### Automated Prompt Improvement

The "checks" concept opens up:

```yaml
# prompt.riotprompt/tests/test-001.yaml
name: "Handles code generation request"
input:
  user_message: "Write a function to sort an array"
  
expectations:
  - type: contains
    value: "function"
  - type: contains  
    value: "sort"
  - type: not_contains
    value: "error"
  - type: valid_code
    language: javascript

on_failure:
  feedback: "Prompt failed to generate valid code for sorting"
  suggestion: "Add explicit instruction about code formatting"
```

Run tests → Generate feedback → Revise prompt → Repeat

This is **prompt CI/CD**.

### Unified Pattern

Both RiotPlan and RiotPrompt could share:

| Component | RiotPlan | RiotPrompt |
|-----------|----------|------------|
| **Core content** | Plan steps | Prompt text |
| **Metadata** | `manifest.json` | `manifest.json` |
| **Evidence** | `evidence/` | `evidence/` |
| **Feedback** | `feedback/` | `feedback/` |
| **History** | `history/` | `history/` |
| **Tests** | Quality gates | Output validation |
| **Renders** | N/A | Engine-specific formats |

Could there be a shared `@riotplan/core` that both use?

## Resolution

### New Requirements Identified

**R14: Embedded Version Tracking**
- [ ] Track revisions without requiring external Git
- [ ] Store diffs or snapshots within the plan/prompt structure
- [ ] Support linear timeline (v0.1 → v0.2 → v0.3)
- [ ] Enable "time travel" - render plan at any historical version
- [ ] Keep it lightweight (not a full DVCS)

**R15: Artifact Packaging**
- [ ] Package plan/prompt as single transportable file
- [ ] Include all history, feedback, evidence
- [ ] Support "export current state only" mode
- [ ] Standardized format (`.riotplan`, `.riotprompt`)
- [ ] Importable by tools and other users

**R16: RiotPrompt Integration**
- [ ] Apply feedback/revision patterns to prompts
- [ ] Share core infrastructure between riotplan and riotprompt
- [ ] Consider unified "riot-core" package
- [ ] Prompt-specific features: engine renders, tests

**R17: Prompt Testing/Validation**
- [ ] Define expected behaviors for prompts
- [ ] Run prompts against test cases
- [ ] Compare output to expectations
- [ ] Generate automated feedback
- [ ] Support iterative improvement loops

### Format Decision (Deferred)

Three candidates for artifact format:
1. **Zip bundle** - Most flexible, supports binary
2. **Single YAML/JSON** - Most portable, human-readable
3. **Directory bundle** - Best for filesystem, worst for transport

Recommendation: Start with **directory structure** (current approach), add **zip export** for transport. The directory structure IS the canonical format; zip is just packaging.

### Implementation Implications

This feedback suggests:

1. **Shared infrastructure**: `@riotplan/core` providing:
   - Version tracking
   - Feedback management
   - Artifact packaging
   - History rendering

2. **Two consumers**:
   - `@riotplan/riotplan` - Plan-specific features
   - `@riotplan/riotprompt` - Prompt-specific features (or integrate into existing riotprompt)

3. **IDE plugin** (future):
   - Edit plans/prompts
   - Track revisions automatically
   - Integrated feedback capture
   - Export/import artifacts

## Changes to Make

1. Add "Revision Tracking & Artifacts" section to analysis
2. Add new requirements R14-R17
3. Update implementation roadmap
4. Note RiotPrompt cross-pollination

## Open Questions

1. **Format**: Zip vs single file vs directory bundle?
2. **Diff format**: Unified diff? Custom JSON diff? Full snapshots?
3. **History depth**: Keep all history forever? Configurable retention?
4. **RiotPrompt scope**: New package or extend existing riotprompt?
5. **Tests**: How complex should prompt validation get?
6. **Branching**: Ever support it, or keep it linear?

## Meta-Observation

This feedback represents a **phase transition** in the design:

- **Before**: RiotPlan is a tool for managing AI coding plans
- **After**: RiotPlan/RiotPrompt is a framework for versioned, portable, testable AI artifacts

The user's morning reflection expanded the scope from "plan management" to "artifact lifecycle management" that applies to both plans AND prompts.

This is exactly why we capture feedback—this morning's ideas would have been lost by afternoon without a record.

---

*This feedback record was itself created using the patterns it describes, demonstrating the recursive utility of the approach.*

