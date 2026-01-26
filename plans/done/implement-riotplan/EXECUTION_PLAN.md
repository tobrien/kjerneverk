# RiotPlan Implementation: Execution Plan

> ## ⚠️ DEFINITION OF DONE
> 
> **Nothing is complete until `npm run precommit` passes on ALL affected projects.**
> 
> ```bash
> npm run precommit   # Runs: npm run lint && npm run test
> ```
> 
> This is non-negotiable. Every step, every phase, every change.

---

## Strategy

Implementation follows a **phased approach** where each phase delivers working functionality that can be used immediately. The core principle is **progressive enhancement**—RiotPlan adds capabilities without requiring changes to existing plans.

**Key Architectural Decisions**:

1. **Command Packages**: Separated from the CLI shell:
   - `riotplan-cli` is a thin shell that composes commands
   - `riotplan-commands-*` packages provide discrete command groups
   - Supporting libraries (`riotplan-history`, `riotplan-renderer`, `riotplan-templates`) provide non-CLI functionality

2. **Shared Execution Packages**: RiotPlan reuses the existing `@riotprompt/execution-*` packages:
   - `@riotprompt/execution` - Core interfaces (Provider, Request, Response)
   - `@riotprompt/execution-anthropic` - Claude provider
   - `@riotprompt/execution-openai` - OpenAI provider
   - `@riotprompt/execution-gemini` - Gemini provider
   
   This creates a **shared integration point** between riotprompt and riotplan ecosystems.

Phases are sequenced by dependency and value delivery:

1. **Phase 1: Core Foundation** - Types, plan operations, feedback capture
2. **Phase 2: Status & Steps** - Status tracking, step manipulation
3. **Phase 3: CLI & Commands** - CLI shell, command packages (plan, status, step, feedback)
4. **Phase 4: Dependencies & Dashboard** - Cross-plan coordination
5. **Phase 5: Templates & Rendering** - Starter templates, document rendering
6. **Phase 6: Advanced Features** - History management, retrospectives

## Prerequisites

Before execution:

- [ ] Ensure Node 24.x is installed
- [ ] Verify existing `@riotprompt/riotplan` and `@riotprompt/riotplan-cli` structure
- [ ] Review RIOTPLAN_ANALYSIS.md for detailed requirements
- [ ] Review PROPOSED_PROJECTS.md for project structure
- [ ] **Initialize all empty repositories** with infrastructure from riotprompt (see PROPOSED_PROJECTS.md)

## Infrastructure Requirements

**CRITICAL**: All new projects must be initialized with the same infrastructure as `riotprompt` before any implementation work begins:

| Infrastructure | Source | Required |
|---------------|--------|----------|
| `.github/workflows/test.yml` | Copy from riotprompt | ✅ |
| `.github/workflows/npm-publish.yml` | Copy from riotprompt | ✅ |
| `.github/dependabot.yml` | Copy from riotprompt | ✅ |
| `.gitignore`, `.npmrc`, `.nvmrc` | Copy from riotprompt | ✅ |
| `tsconfig.json`, `eslint.config.mjs` | Copy from riotprompt | ✅ |
| `vite.config.ts`, `vitest.config.ts` | Adapt from riotprompt | ✅ |
| `LICENSE` (Apache 2.0) | Copy from riotprompt | ✅ |
| `src/`, `tests/`, `guide/` directories | Create new | ✅ |
| `package.json` with standard scripts | See PROPOSED_PROJECTS.md | ✅ |
| `guide/index.md` | Create new | ✅ |
| `README.md` | Create new | ✅ |

**Repositories already created (need infrastructure)**:
- `commands-plan/`
- `commands-status/`
- `commands-feedback/`
- `commands-render/`
- `history/`
- `renderer/`
- `templates/`

**Repositories still needed**:
- `commands-step/`
- `dashboard/`

## Initial npm Publish Requirement

**CRITICAL**: Each new package requires a **manual first publish** to npm before GitHub Actions can use trusted publishing.

- **Token location**: `/Users/tobrien/gitw/kjerneverk/prompts/implement-riotplan/npm_token.txt`
- **Process**: See PROPOSED_PROJECTS.md "Initial npm Publish" section
- **After first publish**: Configure trusted publisher on npmjs.com for automated releases

## Phase Breakdown

### Phase 1: Core Foundation (Steps 01-04)

**Goal**: Core plan infrastructure with feedback capture from day one

**Projects Involved**:
- `riotplan` (enhance)

| Step | Focus | Deliverable |
|------|-------|-------------|
| 01 | Type System Enhancement | Extended types for feedback, evidence, versioning |
| 02 | Plan Loading | `loadPlan()` - parse plan directories |
| 03 | Plan Creation | `createPlan()` - scaffold new plans |
| 04 | Feedback Capture | `createFeedback()` - preserve deliberation |

**Quality Gate**: Can create, load, and validate a plan with feedback records

### Phase 2: Status & Steps (Steps 05-08)

**Goal**: Complete status tracking and step manipulation

**Projects Involved**:
- `riotplan` (enhance)

| Step | Focus | Deliverable |
|------|-------|-------------|
| 05 | STATUS.md Parsing | Parse existing STATUS.md files |
| 06 | STATUS.md Generation | Generate STATUS.md from plan state |
| 07 | Step Operations | Insert, remove, reorder steps with auto-renumbering |
| 08 | Plan Validation | Validate structure, numbering, dependencies |

**Quality Gate**: Can manipulate plan structure and maintain valid STATUS.md

### Phase 3: CLI & Command Packages (Steps 09-12)

**Goal**: Usable CLI with modular command packages

**Projects Involved**:
- `riotplan-cli` (refactor to shell)
- `riotplan-commands-plan` (create)
- `riotplan-commands-status` (create)
- `riotplan-commands-step` (create)
- `riotplan-commands-feedback` (create)

| Step | Focus | Deliverable |
|------|-------|-------------|
| 09 | CLI Architecture | Refactor CLI to thin shell, shared utilities |
| 09a | Commands Package: Plan | `riotplan-commands-plan` with init, validate, archive |
| 10 | Commands Package: Status | `riotplan-commands-status` with show, list, dashboard, blockers |
| 11 | Commands Package: Step | `riotplan-commands-step` with add, remove, move, block, etc. |
| 12 | Commands Package: Feedback | `riotplan-commands-feedback` with create, list, show |

**Quality Gate**: All Phase 1-2 features accessible via CLI with modular command structure

### Phase 4: Dependencies & Web Dashboard (Steps 13-16)

**Goal**: Cross-plan coordination and web-based dashboard

**Projects Involved**:
- `riotplan` (enhance with dependency tracking)
- `riotplan-dashboard` (create - web server on port 8090)

| Step | Focus | Deliverable |
|------|-------|-------------|
| 13 | Internal Dependencies | Dependency tracking within plans |
| 14 | External Dependencies | Cross-plan and cross-repo links |
| 15 | Plan Registry | Track plans across directories/repos |
| 16 | Web Dashboard | `riotplan-dashboard` - browser UI on port 8090 |

**Quality Gate**: Can manage multiple related plans; web dashboard running

### Phase 5: Templates & Rendering (Steps 17-20)

**Goal**: Easy onboarding and shareable output

**Projects Involved**:
- `riotplan-templates` (create)
- `riotplan-renderer` (create)
- `riotplan-commands-render` (create)

| Step | Focus | Deliverable |
|------|-------|-------------|
| 17 | Starter Templates | `riotplan-templates` package with built-in templates |
| 18 | Template Commands | Add template commands to `riotplan-commands-plan` |
| 19 | Renderer Package | `riotplan-renderer` for PDF, HTML, DOCX generation |
| 20 | Render Commands | `riotplan-commands-render` package |

**Quality Gate**: New users can start with templates; plans can be exported

### Phase 6: Advanced Features (Steps 21-24)

**Goal**: Complete feature set for power users

**Projects Involved**:
- `riotplan-history` (create)
- `riotplan` (enhance with execution adapters)
- Uses existing: `execution`, `execution-anthropic`, `execution-openai`, `execution-gemini`

| Step | Focus | Deliverable |
|------|-------|-------------|
| 21 | History Management | `riotplan-history` package with versioning, cleanup |
| 22 | Retrospectives | Completion reflection, RETROSPECTIVE.md |
| 23 | Execution Providers | Wrap `@riotprompt/execution-*` for step execution |
| 24 | Documentation Site | GitHub Pages documentation |

**Quality Gate**: Full feature set documented and deployed

**Note**: Step 23 reuses the existing `@riotprompt/execution-*` packages rather than creating new providers. This is the key integration point between riotprompt and riotplan.

## Package Dependencies Summary

```
Phase 3 creates these packages:
┌────────────────────┐
│   riotplan-cli     │ (thin shell, imports commands)
└────────┬───────────┘
         │ imports
         ▼
┌────────────────────────────────────────────────────────┐
│  commands-plan   commands-status   commands-step       │
│  commands-feedback                                     │
└────────────────────────────┬───────────────────────────┘
                             │ depend on
                             ▼
                    ┌─────────────────┐
                    │    riotplan     │
                    │     (core)      │
                    └─────────────────┘

Phase 5 adds:
┌────────────────────┐     ┌──────────────────┐
│ commands-render    │ ──▶ │ riotplan-renderer│
└────────────────────┘     └──────────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │    riotplan     │
                           └─────────────────┘

Phase 4 adds:
┌────────────────────────────┐
│   riotplan-dashboard       │ (web server on port 8090)
│   http://localhost:8090    │
└────────────┬───────────────┘
             │ depends on
             ▼
    ┌─────────────────┐
    │    riotplan     │
    │     (core)      │
    └─────────────────┘

Phase 6 adds:
┌────────────────────┐
│  riotplan-history  │ ──▶ riotplan (core)
└────────────────────┘

Phase 6 execution (reuses existing packages):
┌─────────────────┐
│    riotplan     │
│     (core)      │
└────────┬────────┘
         │ wraps via LLMProviderAdapter
         ▼
┌─────────────────────────────────────────────────────────────┐
│          SHARED PACKAGES (also used by riotprompt)          │
│  execution   execution-anthropic   execution-openai         │
│              execution-gemini                               │
└─────────────────────────────────────────────────────────────┘
```

## Definition of Done

> **CRITICAL**: Nothing is "done" until `npm run precommit` passes on ALL affected projects.

```bash
# The precommit script runs:
npm run lint && npm run test
```

This is the **single source of truth** for completion. Before marking any step, phase, or task as complete:

1. Run `npm run precommit` in EVERY project that was modified
2. ALL projects must pass
3. No exceptions

## Quality Gates (All Phases)

### After EVERY Change

```bash
# In each modified project:
npm run precommit   # MUST PASS - this is the definition of done
```

### After Each Step

1. **Precommit**: `npm run precommit` passes in ALL modified projects ✅ **REQUIRED**
2. **Build**: `npm run build` produces valid output
3. **Integration**: Works with existing plans in kjerneverk

### After Each Phase

1. **Precommit ALL**: Run `npm run precommit` in EVERY project in the workspace
2. **End-to-end test**: Complete workflow exercise
3. **Documentation**: README updated, guide files current
4. **Version bump**: Update package versions appropriately

### Verification Script

Run this to verify all projects pass:

```bash
#!/bin/bash
# verify-all.sh - Run precommit on all projects

PROJECTS=(
    "riotplan"
    "riotplan-cli"
    "commands-plan"
    "commands-status"
    "commands-step"
    "commands-feedback"
    "commands-render"
    "history"
    "renderer"
    "templates"
    "dashboard"
)

FAILED=()

for project in "${PROJECTS[@]}"; do
    dir="/Users/tobrien/gitw/kjerneverk/$project"
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "=== Checking $project ==="
        cd "$dir"
        if ! npm run precommit; then
            FAILED+=("$project")
        fi
    fi
done

if [ ${#FAILED[@]} -eq 0 ]; then
    echo "✅ ALL PROJECTS PASS"
else
    echo "❌ FAILED PROJECTS:"
    printf '%s\n' "${FAILED[@]}"
    exit 1
fi
```

## Rollback Strategy

Each step is atomic. If `npm run precommit` fails:

1. **DO NOT** mark the step as complete
2. Revert to last passing state
3. Analyze failure cause
4. Fix the issue
5. Run `npm run precommit` again
6. Only proceed when it passes

## Estimated Timeline

| Phase | Steps | Estimated Duration |
|-------|-------|-------------------|
| Phase 1 | 01-04 | 2-3 days |
| Phase 2 | 05-08 | 2-3 days |
| Phase 3 | 09-12 | 3-4 days (more packages to create) |
| Phase 4 | 13-16 | 3-4 days |
| Phase 5 | 17-20 | 3-4 days |
| Phase 6 | 21-24 | 3-4 days |

**Total**: ~16-22 days for v1.0

## Dependencies Between Steps

```
Phase 1: [01] → [02] → [03] → [04]
                 ↓
Phase 2: [05] → [06] → [07] → [08]
                 ↓
Phase 3: [09] → [09a] → [10] → [11] → [12]
                 ↓
Phase 4: [13] → [14] → [15] → [16]
                 ↓
Phase 5: [17] → [18] → [19] → [20]
                 ↓
Phase 6: [21] → [22] → [23] → [24]
```

Steps within a phase are largely sequential. Phases can overlap slightly where independent work exists.

## Project Creation Order

### Phase 0: Infrastructure Setup (Before Any Implementation)

Initialize all empty repositories with infrastructure from riotprompt:

```bash
# For each empty repo (commands-plan, commands-status, etc.):
cd /Users/tobrien/gitw/kjerneverk/REPO_NAME

# Copy infrastructure
cp -r ../riotprompt/.github .
cp ../riotprompt/.gitignore ../riotprompt/.npmrc ../riotprompt/.nvmrc .
cp ../riotprompt/tsconfig.json ../riotprompt/eslint.config.mjs ../riotprompt/LICENSE .

# Create directories
mkdir -p src tests guide

# Create vite.config.ts, vitest.config.ts, package.json
# Create src/index.ts, guide/index.md, README.md

# Initialize and VERIFY
npm install
npm run build
npm run precommit   # ← MUST PASS before committing

# Only commit if precommit passes
git add . && git commit -m "Initialize project infrastructure"
git push
```

**⚠️ DO NOT commit or push until `npm run precommit` passes!**

### Phase 1-2: Core Enhancement

Enhance existing `riotplan` package only

### Phase 3: Command Packages

Initialize and implement (repos already created):
- `commands-plan/` → `@riotprompt/riotplan-commands-plan`
- `commands-status/` → `@riotprompt/riotplan-commands-status`
- `commands-step/` → `@riotprompt/riotplan-commands-step` (create repo)
- `commands-feedback/` → `@riotprompt/riotplan-commands-feedback`
- Refactor `riotplan-cli` to import from above

### Phase 4: Dashboard

Create and implement:
- `dashboard/` → `@riotprompt/riotplan-dashboard` (create repo, web server on port 8090)

### Phase 5: Templates & Rendering

Initialize and implement (repos already created):
- `templates/` → `@riotprompt/riotplan-templates`
- `renderer/` → `@riotprompt/riotplan-renderer`
- `commands-render/` → `@riotprompt/riotplan-commands-render`

### Phase 6: History

Initialize and implement (repo already created):
- `history/` → `@riotprompt/riotplan-history`

---

*Execution plan version: 2.0*
*Last updated: 2026-01-14*
