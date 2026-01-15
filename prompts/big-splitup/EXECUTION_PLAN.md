# RiotPrompt Split-Up - Execution Plan

## Execution Strategy

This plan uses a **dependency-first extraction** approach: extract shared libraries with the fewest dependencies first, then move up to product-specific code. Each step produces working, publishable packages.

## Prerequisites

Before starting execution:
- [ ] Ensure all tests pass on current riotprompt
- [ ] Create a feature branch in riotprompt: `feature/slim-down`
- [ ] Tag current release as backup
- [ ] Review and approve the plan

## Phase 1: Shared Library Extraction

### Step 01 - Execution Interfaces
**File:** `plan/01-execution-interfaces.md`

Create the `execution` project with provider interfaces, model registry, and type definitions. No SDK dependencies.

### Step 02 - Execution Providers
**File:** `plan/02-execution-providers.md`

Create `execution-openai`, `execution-anthropic`, and `execution-gemini` as separate projects, each with only their SDK dependency.

### Step 03 - Agentic Framework
**File:** `plan/03-agentic-extraction.md`

Create the `agentic` project with conversations, tools, strategies, and reflection.

### Step 04 - Shared Library Validation
**File:** `plan/04-shared-validation.md`

Validate all shared libraries work independently and together.

## Phase 2: RiotPrompt Slimming

### Step 05 - RiotPrompt Core Focus
**File:** `plan/05-riotprompt-slim.md`

Remove extracted code from riotprompt, add dependencies on new packages, focus on prompt modeling.

### Step 06 - RiotPrompt CLI Extraction
**File:** `plan/06-riotprompt-cli.md`

Extract CLI into `riotprompt-cli` project.

### Step 07 - Backward Compatibility
**File:** `plan/07-backward-compat.md`

Ensure existing imports from `riotprompt` continue to work via re-exports.

## Phase 3: Future Projects (Stubs)

### Step 08 - RiotPlan Stub
**File:** `plan/08-riotplan-stub.md`

Create `riotplan` project stub with basic structure and README.

### Step 09 - RiotPlan CLI Stub
**File:** `plan/09-riotplan-cli-stub.md`

Create `riotplan-cli` project stub.

## Phase 4: Release

### Step 10 - Documentation
**File:** `plan/10-documentation.md`

Update all documentation across all projects.

### Step 11 - Release
**File:** `plan/11-release.md`

Coordinate release of all new packages.

---

## Execution Commands

### Starting Execution
To begin execution from step 1:
```
Execute plan/01-execution-interfaces.md
```

### Resuming After Interruption
Check `STATUS.md` for current state, then:
```
Execute plan/[NEXT_STEP].md
```

## Project Creation Order

```
1. execution/              # Interfaces first (no deps)
2. execution-openai/       # Then providers (depend on execution)
3. execution-anthropic/
4. execution-gemini/
5. agentic/                # Depends on execution
6. riotprompt (slim)/      # Update existing, add deps
7. riotprompt-cli/         # Extract from riotprompt
8. riotplan/ (stub)        # Future
9. riotplan-cli/ (stub)    # Future
```

## Directory Creation

Each new project gets created in `/Users/tobrien/gitw/kjerneverk/`:

```bash
# Phase 1
mkdir -p /Users/tobrien/gitw/kjerneverk/execution
mkdir -p /Users/tobrien/gitw/kjerneverk/execution-openai
mkdir -p /Users/tobrien/gitw/kjerneverk/execution-anthropic
mkdir -p /Users/tobrien/gitw/kjerneverk/execution-gemini
mkdir -p /Users/tobrien/gitw/kjerneverk/agentic

# Phase 2
mkdir -p /Users/tobrien/gitw/kjerneverk/riotprompt-cli

# Phase 3
mkdir -p /Users/tobrien/gitw/kjerneverk/riotplan
mkdir -p /Users/tobrien/gitw/kjerneverk/riotplan-cli
```

## Quality Gates

Each step must pass before proceeding:

1. **Build**: `npm run build` succeeds
2. **Tests**: `npm run test` passes
3. **Lint**: `npm run lint` passes
4. **Types**: TypeScript compiles without errors
5. **Independence**: Package works when installed alone

## Commit Strategy

Each new project gets its own git repository:

```bash
cd /Users/tobrien/gitw/kjerneverk/execution
git init
git add .
git commit -m "Initial commit: execution interfaces"
```

Or, if using a single repo approach, commits follow pattern:
```
chore(execution): initial setup
feat(execution): add provider interfaces
feat(execution-openai): initial implementation
```

## Communication Plan

- Update STATUS.md after each step
- Each project gets its own README.md explaining its purpose
- Main SUMMARY.md links to all projects
