# Proposed Projects for RiotPlan

This document lists the projects that need to exist or be created before executing the implementation plan. Some already exist; others need to be created.

> **IMPORTANT**: All new projects must follow the same infrastructure patterns as `riotprompt`. See [Project Infrastructure Template](#project-infrastructure-template) below for required files and structure.

---

## Definition of Done

> ### ⚠️ NOTHING IS DONE UNTIL `npm run precommit` PASSES ⚠️

```bash
# The precommit script:
"precommit": "npm run lint && npm run test"
```

**This applies to**:
- Every step in the plan
- Every phase completion
- Every project initialization
- Every code change

**Before marking anything as complete**:
1. Run `npm run precommit` in ALL modified projects
2. ALL must pass with no errors
3. No exceptions, no skipping

---

## Project Infrastructure Template

Every new project **MUST** include the following infrastructure, copied and adapted from `riotprompt`:

### Required Files

| File | Purpose | Source |
|------|---------|--------|
| `.github/workflows/test.yml` | CI testing on push/PR | Copy from riotprompt |
| `.github/workflows/npm-publish.yml` | Publish to npm on release | Copy from riotprompt |
| `.github/dependabot.yml` | Automated dependency updates | Copy from riotprompt |
| `.gitignore` | Git ignore patterns | Copy from riotprompt |
| `.npmrc` | npm configuration (`provenance=true`) | Copy from riotprompt |
| `.nvmrc` | Node version (`v22.0.0`) | Copy from riotprompt |
| `package.json` | Package configuration | Adapt template |
| `tsconfig.json` | TypeScript configuration | Copy from riotprompt |
| `vite.config.ts` | Vite build configuration | Adapt from riotprompt |
| `vitest.config.ts` | Vitest test configuration | Adapt from riotprompt |
| `eslint.config.mjs` | ESLint configuration | Copy from riotprompt |
| `LICENSE` | Apache 2.0 license | Copy from riotprompt |
| `README.md` | Project documentation | Create new |

### Required Directory Structure

```
project-name/
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── test.yml
│       └── npm-publish.yml
├── src/
│   └── index.ts           # Main entry point
├── tests/
│   └── index.test.ts      # Tests
├── guide/
│   └── index.md           # AI agent guide
├── .gitignore
├── .npmrc
├── .nvmrc
├── eslint.config.mjs
├── LICENSE
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### Standard package.json Scripts

All projects must include these scripts:

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "npm run lint && tsc --noEmit && vite build",
    "test": "npm run test:coverage",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  }
}
```

### Initial npm Publish (Required for Trusted Publisher)

**IMPORTANT**: Each new package must be manually published to npm **once** before GitHub Actions can use trusted publishing (provenance).

**Token Location**: `/Users/tobrien/gitw/kjerneverk/prompts/implement-riotplan/npm_token.txt`

**First-time publish process**:
```bash
# 1. Build the package
cd /Users/tobrien/gitw/kjerneverk/PROJECT_NAME
npm run build

# 2. Set npm token for this session
export NPM_TOKEN=$(cat /Users/tobrien/gitw/kjerneverk/prompts/implement-riotplan/npm_token.txt)
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN

# 3. Publish manually (first time only)
npm publish --access public

# 4. After successful publish, configure trusted publisher on npmjs.com:
#    - Go to npmjs.com → Package Settings → Publishing access
#    - Add GitHub Actions as trusted publisher
#    - Repository: kjerneverk/PROJECT_NAME
#    - Workflow: npm-publish.yml

# 5. Clear the token from your session
npm config delete //registry.npmjs.org/:_authToken
unset NPM_TOKEN
```

**After initial publish**: All subsequent releases will use GitHub Actions with provenance (see npm-publish.yml workflow).

### Standard GitHub Workflows

**test.yml** - Runs on push/PR to main/working:
```yaml
name: Run Tests

permissions:
  contents: read
  statuses: write
  id-token: write

on:
  pull_request:
    branches: [main, working]
  push:
    branches: [working, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm run test
```

**npm-publish.yml** - Runs on release:
```yaml
name: Node.js Package (npm)

on:
  release:
    types: [created]

permissions:
  contents: write
  packages: write
  id-token: write

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org/
      - run: npm install -g npm@latest
      - run: npm install --verbose --foreground-scripts
      - run: npm publish --access public
```

### Guide Directory

Every project must have a `guide/` directory with at least `index.md` containing:
- Role and goal for AI agents
- Core capabilities
- Quick start examples
- Links to detailed docs

### Project Setup Checklist

When creating a new project:

- [ ] Clone empty repository
- [ ] Copy infrastructure files from riotprompt:
  - [ ] `.github/` directory (all workflows)
  - [ ] `.gitignore`
  - [ ] `.npmrc`
  - [ ] `.nvmrc`
  - [ ] `eslint.config.mjs`
  - [ ] `tsconfig.json`
  - [ ] `vitest.config.ts`
  - [ ] `LICENSE`
- [ ] Create `vite.config.ts` (adapt entry point)
- [ ] Create `package.json` with standard scripts
- [ ] Create `src/` directory with `index.ts`
- [ ] Create `tests/` directory with test setup
- [ ] Create `guide/index.md`
- [ ] Create `README.md`
- [ ] Run `npm install`
- [ ] Run `npm run build` to verify
- [ ] **Run `npm run precommit`** ← MUST PASS (Definition of Done)
- [ ] Commit and push
- [ ] **First publish**: Manual npm publish with token (see above)
- [ ] **Configure trusted publisher** on npmjs.com for GitHub Actions

## Architecture Overview

The RiotPlan ecosystem follows a modular architecture with **shared execution packages** that bridge both riotprompt and riotplan:

```
┌─────────────────────────────────────────────────────────────────┐
│                       riotplan-cli                               │
│  (thin CLI shell - composes commands from separate packages)     │
└──────────┬──────────┬──────────┬───────────┬───────────┬────────┘
           │          │          │           │           │
           ▼          ▼          ▼           ▼           ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  commands-   │ │  commands-   │ │  commands-   │ │  commands-   │
│    plan      │ │   status     │ │  feedback    │ │   render     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
           ┌──────────────┐        ┌──────────────┐
           │   riotplan   │◄───────│   history    │
           │   (core)     │        │              │
           └──────────────┘        └──────────────┘
                    │
          ┌─────────┼─────────┬─────────────────┐
          ▼         ▼         ▼                 ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │ renderer │ │ templates│ │ SHARED:  │ │   SHARED:    │
   └──────────┘ └──────────┘ │ execution│ │ execution-*  │
                             └────┬─────┘ └──────┬───────┘
                                  │              │
                                  └──────┬───────┘
                                         │
                                         ▼
                              ┌────────────────────┐
                              │    riotprompt      │
                              │    (also uses)     │
                              └────────────────────┘
```

### Shared Packages (riotprompt ↔ riotplan)

The following packages are **shared** between riotprompt and riotplan ecosystems:

| Package | Purpose | Used By |
|---------|---------|---------|
| `@riotprompt/execution` | Core LLM provider interfaces (no SDK deps) | Both |
| `@riotprompt/execution-anthropic` | Anthropic/Claude provider | Both |
| `@riotprompt/execution-openai` | OpenAI/GPT provider | Both |
| `@riotprompt/execution-gemini` | Google Gemini provider | Both |

**Integration Point**: These execution packages are where most riotprompt ↔ riotplan integration lives. RiotPlan wraps these providers to enable AI-assisted step execution.

---

## Shared Projects (Existing - riotprompt ↔ riotplan Bridge)

These packages already exist and serve as the **integration point** between riotprompt and riotplan. RiotPlan uses them for AI-assisted step execution.

### `@riotprompt/execution` (execution/)

**Status**: ✅ Exists  
**Location**: `/Users/tobrien/gitw/kjerneverk/execution/`  
**Purpose**: Core LLM provider interfaces (no SDK dependencies)

**Exports**:
- `Provider` interface - The base contract for LLM providers
- `Request`, `Message`, `ProviderResponse` types
- `ExecutionOptions` for provider configuration
- `ModelRegistry` for model family detection

**Used by riotplan for**: Defining the base interface that execution adapters wrap

### `@riotprompt/execution-anthropic` (execution-anthropic/)

**Status**: ✅ Exists  
**Location**: `/Users/tobrien/gitw/kjerneverk/execution-anthropic/`  
**Purpose**: Anthropic/Claude provider implementation

**Provides**:
- `AnthropicProvider` class implementing `Provider`
- `createAnthropicProvider()` factory

**Used by riotplan for**: Executing steps with Claude models (claude-3-opus, claude-3-sonnet, etc.)

### `@riotprompt/execution-openai` (execution-openai/)

**Status**: ✅ Exists  
**Location**: `/Users/tobrien/gitw/kjerneverk/execution-openai/`  
**Purpose**: OpenAI provider implementation

**Provides**:
- `OpenAIProvider` class implementing `Provider`
- `createOpenAIProvider()` factory

**Used by riotplan for**: Executing steps with GPT models, Deep Research, o1/o3 reasoning

### `@riotprompt/execution-gemini` (execution-gemini/)

**Status**: ✅ Exists  
**Location**: `/Users/tobrien/gitw/kjerneverk/execution-gemini/`  
**Purpose**: Google Gemini provider implementation

**Provides**:
- `GeminiProvider` class implementing `Provider`
- `createGeminiProvider()` factory

**Used by riotplan for**: Executing steps with Gemini models

---

## Existing Projects (Need Enhancement)

### 1. `@riotprompt/riotplan` (riotplan/)

**Status**: ✅ Exists with stubs  
**Location**: `/Users/tobrien/gitw/kjerneverk/riotplan/`  
**Purpose**: Core plan management library

**Current State**:
- Types defined in `src/types.ts`
- Stub functions in `src/index.ts`
- Package.json configured correctly

**What's Needed**:
- Implement all stub functions (load, create, validate)
- Add step operations module
- Expand type definitions per RIOTPLAN_ANALYSIS.md

**Does NOT include**:
- CLI commands (separate packages)
- History management (separate package)
- Rendering (separate package)

### 2. `@riotprompt/riotplan-cli` (riotplan-cli/)

**Status**: ✅ Exists with stubs  
**Location**: `/Users/tobrien/gitw/kjerneverk/riotplan-cli/`  
**Purpose**: Thin CLI shell that composes commands from separate packages

**Current State**:
- Stub commands defined
- Commander.js integration
- Package.json configured

**New Role**:
- Import and register commands from `riotplan-commands-*` packages
- Provide shared output utilities
- Handle global options (`--json`, `--verbose`, `--no-color`)
- No direct command implementations

**What's Needed**:
- Refactor to import commands from separate packages
- Add output utilities module (`utils/output.ts`)
- Add error handling module (`utils/errors.ts`)

---

## New Projects: Command Packages

### 3. `@riotprompt/riotplan-commands-plan` (commands-plan/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/commands-plan/`  
**Repository**: `git@github.com:kjerneverk/commands-plan.git`  
**Purpose**: Plan management commands

**Commands Provided**:
- `plan init <name>` - Create a new plan
- `plan validate [path]` - Validate plan structure
- `plan archive [path]` - Archive completed plan

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-commands-plan",
  "version": "0.0.1",
  "description": "Plan management commands for RiotPlan CLI",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4",
    "commander": "^13.0.0"
  },
  "dependencies": {
    "chalk": "^5.4.1"
  }
}
```

**Source Structure**:
```
riotplan-commands-plan/
├── src/
│   ├── index.ts              # Export registerPlanCommands()
│   ├── init.ts               # plan init command
│   ├── validate.ts           # plan validate command
│   └── archive.ts            # plan archive command
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

### 4. `@riotprompt/riotplan-commands-status` (commands-status/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/commands-status/`  
**Repository**: `git@github.com:kjerneverk/commands-status.git`  
**Purpose**: Status and monitoring commands

**Commands Provided**:
- `status [path]` - Show plan status (default)
- `status list [path]` - List all steps with status
- `status dashboard` - Multi-plan dashboard
- `status blockers [path]` - Show blockers

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-commands-status",
  "version": "0.0.1",
  "description": "Status commands for RiotPlan CLI",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4",
    "commander": "^13.0.0"
  },
  "dependencies": {
    "chalk": "^5.4.1"
  }
}
```

**Source Structure**:
```
riotplan-commands-status/
├── src/
│   ├── index.ts              # Export registerStatusCommands()
│   ├── show.ts               # status (default)
│   ├── list.ts               # status list
│   ├── dashboard.ts          # status dashboard
│   └── blockers.ts           # status blockers
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

### 5. `@riotprompt/riotplan-commands-feedback` (commands-feedback/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/commands-feedback/`  
**Repository**: `git@github.com:kjerneverk/commands-feedback.git`  
**Purpose**: Feedback and deliberation capture commands

**Commands Provided**:
- `feedback create <title>` - Create feedback record
- `feedback list [path]` - List feedback records
- `feedback show <id>` - Show feedback details
- `fb <title>` - Quick feedback alias

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-commands-feedback",
  "version": "0.0.1",
  "description": "Feedback commands for RiotPlan CLI",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4",
    "commander": "^13.0.0"
  },
  "dependencies": {
    "chalk": "^5.4.1"
  }
}
```

**Source Structure**:
```
riotplan-commands-feedback/
├── src/
│   ├── index.ts              # Export registerFeedbackCommands()
│   ├── create.ts             # feedback create
│   ├── list.ts               # feedback list
│   └── show.ts               # feedback show
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

### 6. `@riotprompt/riotplan-commands-render` (commands-render/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/commands-render/`  
**Repository**: `git@github.com:kjerneverk/commands-render.git`  
**Purpose**: Document rendering commands

**Commands Provided**:
- `render pdf [path]` - Render plan to PDF
- `render html [path]` - Render plan to HTML
- `render docx [path]` - Render plan to Word
- `render markdown [path]` - Render to single markdown file
- `share [path]` - Generate shareable artifact

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-commands-render",
  "version": "0.0.1",
  "description": "Render commands for RiotPlan CLI",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4",
    "@riotprompt/riotplan-renderer": "^0.0.1",
    "commander": "^13.0.0"
  },
  "dependencies": {
    "chalk": "^5.4.1"
  }
}
```

**Source Structure**:
```
riotplan-commands-render/
├── src/
│   ├── index.ts              # Export registerRenderCommands()
│   ├── pdf.ts                # render pdf
│   ├── html.ts               # render html
│   ├── docx.ts               # render docx
│   ├── markdown.ts           # render markdown
│   └── share.ts              # share command
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

### 7. `@riotprompt/riotplan-commands-step` (commands-step/)

**Status**: ⬜ Needs Repository Creation  
**Location**: `/Users/tobrien/gitw/kjerneverk/commands-step/`  
**Repository**: `git@github.com:kjerneverk/commands-step.git` (to be created)  
**Purpose**: Step manipulation commands

**Commands Provided**:
- `step add <title>` - Add a new step
- `step remove <n>` - Remove a step
- `step move <from> <to>` - Move/reorder a step
- `step block <n>` - Mark step as blocked
- `step unblock <n>` - Unblock a step
- `step complete <n>` - Mark step complete
- `step start <n>` - Mark step in progress

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-commands-step",
  "version": "0.0.1",
  "description": "Step manipulation commands for RiotPlan CLI",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4",
    "commander": "^13.0.0"
  },
  "dependencies": {
    "chalk": "^5.4.1"
  }
}
```

**Source Structure**:
```
riotplan-commands-step/
├── src/
│   ├── index.ts              # Export registerStepCommands()
│   ├── add.ts                # step add
│   ├── remove.ts             # step remove
│   ├── move.ts               # step move
│   └── status.ts             # block, unblock, complete, start
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## New Projects: Supporting Libraries

### 8. `@riotprompt/riotplan-history` (history/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/history/`  
**Repository**: `git@github.com:kjerneverk/history.git`  
**Purpose**: Embedded versioning and history management

**Features**:
- Revision tracking without Git dependency
- Milestone creation and management
- History cleanup with protection
- Feedback protection markers

**API**:
```typescript
// Revisions
export function saveRevision(plan: Plan, options?: SaveRevisionOptions): Promise<HistoryEntry>;
export function listRevisions(planPath: string): Promise<HistoryEntry[]>;
export function getRevision(planPath: string, version: string): Promise<Plan>;
export function restoreRevision(planPath: string, version: string): Promise<void>;

// Milestones
export function createMilestone(planPath: string, name: string, options?: MilestoneOptions): Promise<Milestone>;
export function listMilestones(planPath: string): Promise<Milestone[]>;

// Cleanup
export function cleanup(planPath: string, options: CleanupOptions): Promise<CleanupResult>;
export function protectFeedback(planPath: string, feedbackId: string): Promise<void>;
```

**CLI Commands** (via `riotplan-commands-history` or bundled):
- `revision save "message"` - Save current state
- `revision list` - List all revisions
- `revision show <version>` - Show plan at version
- `revision restore <version>` - Restore to version
- `milestone create "name"` - Create milestone
- `milestone list` - List milestones
- `cleanup` - Clean up history

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-history",
  "version": "0.0.1",
  "description": "History and version management for RiotPlan",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4"
  }
}
```

**Source Structure**:
```
riotplan-history/
├── src/
│   ├── index.ts              # Export all functions
│   ├── types.ts              # History types
│   ├── revisions.ts          # Revision management
│   ├── milestones.ts         # Milestone management
│   ├── cleanup.ts            # Cleanup operations
│   └── protection.ts         # Feedback protection
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

### 9. `@riotprompt/riotplan-renderer` (renderer/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/renderer/`  
**Repository**: `git@github.com:kjerneverk/renderer.git`  
**Purpose**: Document rendering (PDF, HTML, DOCX)

**Note**: This is the rendering **library**. The commands package (`riotplan-commands-render`) provides CLI commands that use this library.

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-renderer",
  "version": "0.0.1",
  "description": "Document rendering for RiotPlan (PDF, HTML, DOCX)",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4"
  },
  "dependencies": {
    "marked": "^16.0.0"
  }
}
```

**Source Structure**:
```
riotplan-renderer/
├── src/
│   ├── index.ts
│   ├── types.ts              # Render options types
│   ├── pdf/
│   │   └── generator.ts
│   ├── html/
│   │   └── generator.ts
│   ├── docx/
│   │   └── generator.ts
│   └── templates/
│       ├── default.ts
│       └── ...
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

### 10. `@riotprompt/riotplan-templates` (templates/)

**Status**: ⬜ Repository Created (empty)  
**Location**: `/Users/tobrien/gitw/kjerneverk/templates/`  
**Repository**: `git@github.com:kjerneverk/templates.git`  
**Purpose**: Starter templates and template management

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-templates",
  "version": "0.0.1",
  "description": "Starter templates for RiotPlan",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4"
  }
}
```

**Source Structure**:
```
riotplan-templates/
├── src/
│   ├── index.ts
│   ├── templates/
│   │   ├── feature.ts
│   │   ├── bugfix.ts
│   │   ├── refactor.ts
│   │   ├── security.ts
│   │   ├── migration.ts
│   │   ├── research.ts
│   │   ├── content.ts
│   │   └── blank.ts
│   └── wizard/
│       └── interactive.ts
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### 11. `@riotprompt/riotplan-dashboard` (dashboard/)

**Status**: ⬜ Needs Repository Creation  
**Location**: `/Users/tobrien/gitw/kjerneverk/dashboard/`  
**Repository**: `git@github.com:kjerneverk/dashboard.git` (to be created)  
**Purpose**: Web-based dashboard UI - runs on port 8090

**Description**: A standalone web server that provides a browser-based dashboard for viewing and managing plans. Start it up and access via `http://localhost:8090`.

**Features**:
- Multi-plan overview with status
- Blocker visualization graph
- Suggested actions
- Context filtering (work/personal)
- Time insights (stale plans, daily progress)
- Real-time updates (file watching)

**Package.json Template**:
```json
{
  "name": "@riotprompt/riotplan-dashboard",
  "version": "0.0.1",
  "description": "Web-based dashboard for RiotPlan",
  "type": "module",
  "main": "./dist/server.js",
  "bin": {
    "riotplan-dashboard": "./dist/server.js"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "clean": "rm -rf dist",
    "build": "vite build",
    "build:client": "vite build --config vite.config.client.ts",
    "dev": "tsx watch src/server.ts",
    "start": "node dist/server.js",
    "test": "vitest run --coverage",
    "lint": "eslint src",
    "precommit": "npm run lint && npm run test",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "author": "Tim O'Brien <tobrien@discursive.com>",
  "license": "Apache-2.0",
  "peerDependencies": {
    "@riotprompt/riotplan": "^0.0.4"
  },
  "dependencies": {
    "fastify": "^5.0.0",
    "@fastify/static": "^8.0.0",
    "@fastify/websocket": "^11.0.0",
    "chokidar": "^4.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "tsx": "^4.0.0"
  }
}
```

**Source Structure**:
```
riotplan-dashboard/
├── src/
│   ├── server.ts             # Fastify server entry (port 8090)
│   ├── index.ts              # Exports for programmatic use
│   ├── api/
│   │   ├── routes.ts         # API routes
│   │   ├── plans.ts          # Plan endpoints
│   │   ├── status.ts         # Status endpoints
│   │   └── websocket.ts      # Real-time updates
│   ├── services/
│   │   ├── plan-scanner.ts   # Scan for plans
│   │   ├── insights.ts       # Time insights, suggestions
│   │   ├── blockers.ts       # Blocker graph building
│   │   └── watcher.ts        # File change watching
│   └── client/
│       ├── index.html        # SPA entry
│       ├── app.ts            # Client app
│       ├── components/
│       │   ├── plan-list.ts
│       │   ├── plan-card.ts
│       │   ├── blocker-graph.ts
│       │   └── suggestions.ts
│       └── styles/
│           └── dashboard.css
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts            # Server build
├── vite.config.client.ts     # Client build
└── vitest.config.ts
```

**CLI Usage**:
```bash
# Start dashboard server
riotplan-dashboard --port 8090 --path ./prompts

# Or via npx
npx @riotprompt/riotplan-dashboard

# Opens browser automatically
riotplan-dashboard --open
```

**API Endpoints**:
```
GET  /api/plans              # List all plans
GET  /api/plans/:code        # Get single plan
GET  /api/plans/:code/status # Get plan status
GET  /api/insights           # Get time insights
GET  /api/blockers           # Get blocker graph
GET  /api/suggestions        # Get suggested actions
WS   /ws                     # Real-time updates
```

---

## Future Projects (Phase 7+)

These are documented for awareness but NOT needed for v1.0:

### 12. `@riotprompt/riotplan-vscode` (Future)

**Status**: 🔮 Future  
**Purpose**: VS Code extension for plan management

### 13. `@riotprompt/riotplan-server` (Future)

**Status**: 🔮 Future  
**Purpose**: Background daemon for API access (may merge with dashboard)

---

## Dependency Graph

```
                     riotplan-cli
                          │
    ┌─────────┬───────────┼───────────┬─────────┬──────────┐
    │         │           │           │         │          │
    ▼         ▼           ▼           ▼         ▼          ▼
commands- commands-  commands-  commands-  commands-  (future)
  plan     status    feedback    render     step      commands
    │         │           │           │         │
    └─────────┴───────────┴─────┬─────┴─────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
               riotplan    riotplan-   riotplan-
                (core)     history     renderer
                    │           │           │
                    │           │           │
                    └───────────┴───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 riotplan-templates    ┌────────────────┐      ┌────────────────┐
                       │   execution    │◄─────│   riotprompt   │
                       │   (shared)     │      │   (also uses)  │
                       └───────┬────────┘      └────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │  execution-   │  │  execution-   │  │  execution-   │
    │   anthropic   │  │    openai     │  │    gemini     │
    └───────────────┘  └───────────────┘  └───────────────┘
```

**Key Dependencies**:
- All `commands-*` packages depend on `riotplan` core
- `commands-render` depends on `riotplan-renderer`
- `riotplan-history` depends on `riotplan` core
- `riotplan-renderer` depends on `riotplan` core
- `riotplan-templates` depends on `riotplan` core

**Shared Dependencies (riotprompt ↔ riotplan)**:
- `riotplan` core uses `@riotprompt/execution` for provider interface
- `riotplan` core uses `@riotprompt/execution-anthropic` for Claude execution
- `riotplan` core uses `@riotprompt/execution-openai` for OpenAI/GPT execution
- `riotplan` core uses `@riotprompt/execution-gemini` for Gemini execution
- These same packages are used by `riotprompt` for prompt execution

---

## Summary: What to Create by Phase

| Phase | Projects Needed | Purpose |
|-------|-----------------|---------|
| Phase 1 | `riotplan` (enhance) | Core types, load, create |
| Phase 2 | `riotplan` (enhance) | Status, step operations |
| Phase 3 | `riotplan-cli` (refactor), `commands-plan`, `commands-status`, `commands-step`, `commands-feedback` | CLI foundation |
| Phase 4 | `riotplan-dashboard` (create) | Web dashboard on port 8090, dependencies |
| Phase 5 | `riotplan-templates`, `riotplan-renderer`, `commands-render` | Templates & rendering |
| Phase 6 | `riotplan-history` | History management |

## Project Initialization Script

For each new project, run this initialization from within the cloned (empty) repository:

```bash
#!/bin/bash
# Initialize a new kjerneverk project from riotprompt template

PROJECT_NAME=$1
RIOTPROMPT_DIR="../riotprompt"

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: ./init-project.sh <project-name>"
    exit 1
fi

echo "Initializing project infrastructure..."

# Copy GitHub workflows
mkdir -p .github/workflows
cp $RIOTPROMPT_DIR/.github/workflows/test.yml .github/workflows/
cp $RIOTPROMPT_DIR/.github/workflows/npm-publish.yml .github/workflows/
cp $RIOTPROMPT_DIR/.github/dependabot.yml .github/

# Copy config files
cp $RIOTPROMPT_DIR/.gitignore .
cp $RIOTPROMPT_DIR/.npmrc .
cp $RIOTPROMPT_DIR/.nvmrc .
cp $RIOTPROMPT_DIR/tsconfig.json .
cp $RIOTPROMPT_DIR/eslint.config.mjs .
cp $RIOTPROMPT_DIR/LICENSE .

# Create directories
mkdir -p src tests guide

# Create stub files
echo "// $PROJECT_NAME entry point" > src/index.ts
echo "export const VERSION = '0.0.1';" >> src/index.ts

echo "import { describe, it, expect } from 'vitest';" > tests/index.test.ts
echo "" >> tests/index.test.ts
echo "describe('$PROJECT_NAME', () => {" >> tests/index.test.ts
echo "    it('should have version', () => {" >> tests/index.test.ts
echo "        expect(true).toBe(true);" >> tests/index.test.ts
echo "    });" >> tests/index.test.ts
echo "});" >> tests/index.test.ts

# Create guide
cat > guide/index.md << 'EOF'
# AI Agent Guide: PROJECT_NAME

**Role**: You are an AI assistant working with `PROJECT_NAME`.

**Goal**: Understand and extend this package correctly.

## Core Capabilities

TODO: Document core capabilities

## Quick Start

TODO: Add quick start examples
EOF

sed -i '' "s/PROJECT_NAME/$PROJECT_NAME/g" guide/index.md

echo "✓ Infrastructure created. Next steps:"
echo "  1. Create package.json (see PROPOSED_PROJECTS.md template)"
echo "  2. Create vite.config.ts (adapt entry point)"
echo "  3. Create vitest.config.ts"
echo "  4. Run: npm install"
echo "  5. Run: npm run build"
echo "  6. Run: npm run test"
```

## Project Setup Details

### Step-by-Step for Each New Project

1. **Clone the empty repository** (already done for most projects)
   ```bash
   cd /Users/tobrien/gitw/kjerneverk
   git clone git@github.com:kjerneverk/PROJECT_NAME.git
   cd PROJECT_NAME
   ```

2. **Copy infrastructure from riotprompt**:
   ```bash
   # GitHub workflows
   mkdir -p .github/workflows
   cp ../riotprompt/.github/workflows/test.yml .github/workflows/
   cp ../riotprompt/.github/workflows/npm-publish.yml .github/workflows/
   cp ../riotprompt/.github/dependabot.yml .github/
   
   # Config files
   cp ../riotprompt/.gitignore .
   cp ../riotprompt/.npmrc .
   cp ../riotprompt/.nvmrc .
   cp ../riotprompt/tsconfig.json .
   cp ../riotprompt/eslint.config.mjs .
   cp ../riotprompt/LICENSE .
   ```

3. **Create directory structure**:
   ```bash
   mkdir -p src tests guide
   ```

4. **Create vite.config.ts** (adapt from riotprompt):
   ```typescript
   import { defineConfig } from 'vite';
   import dts from 'vite-plugin-dts';

   export default defineConfig({
       plugins: [
           dts({
               entryRoot: 'src',
               outDir: 'dist',
               exclude: ['**/*.test.ts'],
           }),
       ],
       build: {
           target: 'esnext',
           outDir: 'dist',
           lib: {
               entry: './src/index.ts',
               formats: ['es'],
               fileName: () => 'index.js',
           },
           rollupOptions: {
               external: [/^@riotprompt\//],
               output: {
                   format: 'esm',
                   preserveModules: true,
                   exports: 'named',
               },
           },
           minify: false,
           sourcemap: true,
       },
   });
   ```

5. **Create vitest.config.ts**:
   ```typescript
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
       test: {
           environment: 'node',
           coverage: {
               provider: 'v8',
               reporter: ['text', 'json', 'html'],
               thresholds: {
                   lines: 80,
                   functions: 80,
                   branches: 80,
                   statements: 80,
               },
               exclude: [
                   'node_modules/',
                   'dist/**',
                   'vitest.config.ts',
                   'vite.config.ts',
                   'eslint.config.mjs',
               ],
           },
       },
   });
   ```

6. **Create package.json** (use template from project section above)

7. **Create guide/index.md** with AI agent documentation

8. **Create README.md**

9. **Install and verify** (Definition of Done):
   ```bash
   npm install
   npm run build
   npm run precommit   # ← MUST PASS - this is the definition of done
   ```

10. **Add to workspace** in `kjerneverk.code-workspace`

11. **Commit and push**:
    ```bash
    git add .
    git commit -m "Initialize project infrastructure"
    git push origin main
    ```

12. **Initial npm publish** (required for trusted publisher):
    ```bash
    # Set token
    export NPM_TOKEN=$(cat /Users/tobrien/gitw/kjerneverk/prompts/implement-riotplan/npm_token.txt)
    npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
    
    # Publish
    npm publish --access public
    
    # Clear token
    npm config delete //registry.npmjs.org/:_authToken
    unset NPM_TOKEN
    ```

13. **Configure trusted publisher** on npmjs.com:
    - Go to package settings → Publishing access
    - Add GitHub Actions as trusted publisher
    - Repository: `kjerneverk/PROJECT_NAME`
    - Workflow: `npm-publish.yml`

---

*Document created: 2026-01-14*
*Last updated: 2026-01-14*
