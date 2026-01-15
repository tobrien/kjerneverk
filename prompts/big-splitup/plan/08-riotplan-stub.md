# Step 08: RiotPlan Stub

## Objective

Create `riotplan` as a properly structured project for managing long-lived, stateful AI workflows. This step establishes the types, conventions, and stub implementations based on real-world plan examples.

## Project Location

```
/Users/tobrien/gitw/kjerneverk/riotplan/
```

## What is RiotPlan?

RiotPlan is a framework for **long-lived, stateful AI workflows** (plans). Unlike prompts (single interaction) or agentic conversations (multi-turn session), plans:

- Span multiple sessions/days/weeks
- Have a directory structure that IS the plan
- Use numbered files for sequential steps (01-STEP.md, 02-STEP.md)
- Track state persistently in STATUS.md
- Can be interrupted and resumed
- Support human review and feedback loops

## Plan Structure (from Real Examples)

Based on analysis of real plans:

```
my-plan/
├── my-plan-prompt.md     # Meta-prompt (prompt-of-prompts)
├── SUMMARY.md            # Overview of the approach
├── EXECUTION_PLAN.md     # Step-by-step execution strategy
├── STATUS.md             # Current state (auto-updated)
├── README.md             # Navigation guide (optional)
├── plan/                 # Step files (optional subdirectory)
│   ├── 01-first-step.md
│   ├── 02-second-step.md
│   └── ...
├── analysis/             # Analysis output (optional)
├── architecture/         # Design docs (optional)
├── implementation/       # Implementation details (optional)
└── testing/              # Test strategies (optional)
```

### Real Examples

- `/Users/tobrien/gitw/kjerneverk/prompts/big-splitup/` - This plan!
- `/Users/tobrien/gitw/grunnverk/prompts/big-splitup/` - Larger example with phases
- `/Users/tobrien/gitw/grunnverk/prompts/parallel-execution/` - Complex feature
- `/Users/tobrien/gitw/grunnverk/prompts/commit-splitting/` - Feature plan
- `/Users/tobrien/gitw/grunnverk/prompts/shared-utils/` - Package extraction
- `/Users/tobrien/gitw/grunnverk/prompts/ai-service/` - Service extraction

## Tasks

### 8.1 Create Project Structure

Directory already exists at `/Users/tobrien/gitw/kjerneverk/riotplan/`

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/riotplan/src
mkdir -p /Users/tobrien/gitw/kjerneverk/riotplan/tests
```

### 8.2 Create Type Definitions

Create `riotplan/src/types.ts` with types based on real plan patterns:

```typescript
/**
 * RiotPlan Type Definitions
 *
 * Types for long-lived, stateful AI workflows (plans).
 *
 * Key concepts:
 * - A plan has a directory (the plan code/name)
 * - A meta-prompt initiates the plan
 * - Numbered step files (01-STEP.md) define the sequence
 * - STATUS.md tracks progress
 * - EXECUTION_PLAN.md documents strategy
 */

// Task status (matches checkbox states)
export type TaskStatus =
  | "pending"      // ⬜ Not started
  | "in_progress"  // 🔄 Currently active
  | "completed"    // ✅ Done
  | "failed"       // ❌ Failed with error
  | "blocked"      // ⏸️ Waiting on dependency
  | "skipped";     // ⏭️ Intentionally skipped

// A single step (corresponds to 01-STEP.md file)
export interface PlanStep {
  number: number;           // Step number (1, 2, 3...)
  code: string;             // Step code (e.g., "execution-interfaces")
  filename: string;         // Full filename
  title: string;            // Human-readable title
  description?: string;
  status: TaskStatus;
  dependencies?: number[];  // Step numbers this depends on
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  notes?: string;
  filePath: string;
}

// Plan metadata
export interface PlanMetadata {
  code: string;             // Directory name (e.g., "big-splitup")
  name: string;             // Human-readable name
  description?: string;
  version?: string;
  author?: string;
  tags?: string[];
  createdAt?: Date;
  path: string;             // Directory path
}

// File discovery
export interface PlanFiles {
  metaPrompt?: string;      // {code}-prompt.md or prompt-of-prompts.md
  summary?: string;         // SUMMARY.md
  status?: string;          // STATUS.md
  executionPlan?: string;   // EXECUTION_PLAN.md
  readme?: string;          // README.md
  steps: string[];          // Numbered step files in order
  analysisDir?: string;     // analysis/ directory
  subdirectories: string[]; // Other directories
}

// Plan state (from STATUS.md)
export interface PlanState {
  status: TaskStatus;
  currentStep?: number;
  lastCompletedStep?: number;
  startedAt?: Date;
  lastUpdatedAt: Date;
  completedAt?: Date;
  blockers: Blocker[];
  issues: Issue[];
  progress: number;         // 0-100 percentage
}

// Complete plan
export interface Plan {
  metadata: PlanMetadata;
  files: PlanFiles;
  steps: PlanStep[];
  phases?: PlanPhase[];     // Optional grouping
  state: PlanState;
}

// ... additional types for Blocker, Issue, PlanPhase, etc.
```

### 8.3 Create Index with Stub Functions

Create `riotplan/src/index.ts`:

```typescript
/**
 * RiotPlan - Framework for long-lived, stateful AI workflows
 *
 * @example Plan directory structure:
 * ```
 * my-plan/
 * ├── my-plan-prompt.md     # Meta-prompt
 * ├── SUMMARY.md            # Overview
 * ├── EXECUTION_PLAN.md     # Strategy
 * ├── STATUS.md             # Current state
 * └── plan/
 *     ├── 01-first-step.md
 *     ├── 02-second-step.md
 *     └── ...
 * ```
 */

// Export types
export type { TaskStatus, PlanStep, Plan, PlanMetadata, PlanFiles, PlanState } from './types';

// Export constants
export { PLAN_CONVENTIONS } from './types';

export const VERSION = '0.0.1';

// Stub functions that throw until implemented
export async function loadPlan(_path: string): Promise<never> {
  throw new Error('riotplan.loadPlan is not yet implemented. Coming in v0.1.0!');
}

export async function createPlan(_config: {...}): Promise<never> {
  throw new Error('riotplan.createPlan is not yet implemented. Coming in v0.1.0!');
}

export function parseStatus(_content: string): never {
  throw new Error('riotplan.parseStatus is not yet implemented. Coming in v0.1.0!');
}

export function generateStatus(_plan: unknown): never {
  throw new Error('riotplan.generateStatus is not yet implemented. Coming in v0.1.0!');
}

export async function executeStep(_plan: unknown, _stepNumber: number): Promise<never> {
  throw new Error('riotplan.executeStep is not yet implemented. Coming in v0.1.0!');
}

export async function resumePlan(_plan: unknown): Promise<never> {
  throw new Error('riotplan.resumePlan is not yet implemented. Coming in v0.1.0!');
}
```

### 8.4 Create package.json

```json
{
  "name": "riotplan",
  "version": "0.0.1",
  "description": "Framework for long-lived, stateful AI workflows (plans)",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "keywords": ["plan", "workflow", "ai", "stateful", "llm", "prompts"],
  "license": "Apache-2.0",
  "dependencies": {
    "glob": "^11.0.3",
    "js-yaml": "^4.1.1",
    "marked": "^16.0.0"
  },
  "peerDependencies": {
    "agentic": "^0.0.1",
    "execution": "^0.0.1",
    "riotprompt": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "agentic": { "optional": true },
    "execution": { "optional": true },
    "riotprompt": { "optional": true }
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^7.0.4",
    "vite-plugin-dts": "^4.5.4",
    "vitest": "^3.2.4"
  }
}
```

### 8.5 Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 8.6 Create vite.config.ts

```typescript
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "riotplan",
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "glob", "js-yaml", "marked",
        "riotprompt", "agentic", "execution",
        "node:fs", "node:path", "node:fs/promises",
      ],
    },
    sourcemap: true,
    minify: false,
  },
  plugins: [dts({ rollupTypes: true })],
});
```

### 8.7 Create README.md

Document:
- What plans are
- Plan structure conventions
- Real-world examples
- Roadmap (v0.1.0: Load/Create, v0.2.0: Execute, v0.3.0: CLI)
- Related packages

### 8.8 Initialize Git

```bash
cd /Users/tobrien/gitw/kjerneverk/riotplan
git init
git add .
git commit -m "Initial: riotplan framework for stateful AI workflows"
```

## File Conventions

RiotPlan recognizes these patterns:

| Pattern | Purpose |
|---------|---------|
| `{code}-prompt.md` | Meta-prompt (prompt-of-prompts) |
| `prompt-of-prompts.md` | Alternative meta-prompt name |
| `SUMMARY.md` | Overview of approach |
| `STATUS.md` | Current execution state |
| `EXECUTION_PLAN.md` | Step-by-step strategy |
| `/^\d{2}-(.+)\.md$/` | Step files (01-foo.md, 02-bar.md) |
| `plan/` | Subdirectory for step files |
| `analysis/` | Analysis output |

## Status Emoji Mapping

```typescript
const statusEmoji = {
  pending: "⬜",
  in_progress: "🔄",
  completed: "✅",
  failed: "❌",
  blocked: "⏸️",
  skipped: "⏭️",
};
```

## Validation

- [ ] Types reflect real plan patterns
- [ ] Stub functions throw helpful errors
- [ ] Build configuration works
- [ ] README documents conventions
- [ ] References real plan examples

## Files Created

```
riotplan/
├── src/
│   ├── index.ts      # Exports and stub functions
│   └── types.ts      # Type definitions
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Next Step

Proceed to `09-riotplan-cli-stub.md`
