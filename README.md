# Kjerneverk

A monorepo of TypeScript libraries for building sophisticated AI workflows - from structured prompts to long-running plans.

## Overview

**Kjerneverk** (Norwegian: "core work") is a collection of interconnected packages that provide the foundation for AI-assisted software development. The two flagship packages are **RiotPrompt** and **RiotPlan**, supported by a suite of execution, rendering, and utility libraries.

## Core Packages

### 🎯 [RiotPrompt](./riotprompt)

A powerful, flexible prompt building library for AI applications with zero hardcoded assumptions.

**Key Features:**
- **Structured Prompts**: Specialized sections for Persona, Instructions, Context, Constraints, and more
- **Model Alignment**: Automatically adapts prompts to match provider-specific expectations (Anthropic, OpenAI, Gemini)
- **Structured Outputs**: First-class support for JSON schemas with Zod
- **CLI & Library**: Use programmatically or via command line
- **Portable**: Serialize to JSON/XML for cross-system exchange

```bash
npm install riotprompt
```

**Example:**
```typescript
import { cook } from 'riotprompt';

const prompt = await cook({
  persona: { content: 'You are a helpful AI assistant' },
  instructions: [{ content: 'Analyze the provided data' }],
  content: [{ content: data, title: 'Dataset' }],
  schema: z.object({
    summary: z.string(),
    insights: z.array(z.string())
  })
});
```

### 📋 [RiotPlan](./riotplan)

Framework for long-lived, stateful AI workflows (plans) that span multiple sessions.

**Key Features:**
- **Multi-Session Workflows**: Work on tasks over days or weeks
- **Persistent State**: Track progress in structured STATUS.md files
- **Step-Based Organization**: Numbered step files (01-STEP.md, 02-STEP.md)
- **Resumable**: Pick up exactly where you left off
- **Collaboration-Ready**: Human review and feedback loops

```bash
npm install riotplan
```

**Plan Structure:**
```
my-plan/
├── my-plan-prompt.md     # Meta-prompt
├── SUMMARY.md            # Approach overview
├── EXECUTION_PLAN.md     # Detailed strategy
├── STATUS.md             # Progress tracking
└── plan/                 # Step files
    ├── 01-first-step.md
    ├── 02-second-step.md
    └── ...
```

## Execution Layer

### ⚡ [Execution](./execution)

Core interfaces and types for LLM execution providers. Contains no SDK dependencies - only defines the contracts.

```bash
npm install execution
```

**Provider Implementations:**
- **[execution-openai](./execution-openai)** - OpenAI (GPT-4, GPT-3.5, etc.)
- **[execution-anthropic](./execution-anthropic)** - Anthropic Claude
- **[execution-gemini](./execution-gemini)** - Google Gemini

### 🤖 [Agentic](./agentic)

Components for building agentic AI workflows with tools, context management, and conversation state tracking.

```bash
npm install agentic
```

**Features:**
- **ToolRegistry**: Register, execute, and track tool usage
- **ContextManager**: Track and deduplicate conversation context
- **Provider Formats**: Export tools for OpenAI/Anthropic

## Utility Packages

### 📊 [Dashboard](./dashboard)

Web-based dashboard for visualizing and managing RiotPlan plans.

```bash
npx riotplan-dashboard ./plans
```

Features: Overview statistics, search/filter, progress visualization, real-time refresh.

### 📜 [History](./history)

History management for RiotPlan - track revisions and milestones.

```bash
npm install @riotprompt/riotplan-history
```

Track changes, create milestones, rollback to previous states.

### 🎨 [Renderer](./renderer)

Render RiotPlan plans to various output formats (Markdown, JSON, HTML).

```bash
npm install @riotprompt/riotplan-renderer
```

```typescript
import { renderToHtml, renderToMarkdown } from '@riotprompt/riotplan-renderer';

const html = renderToHtml(plan, { theme: 'dark' });
const markdown = renderToMarkdown(plan, { useTaskList: true });
```

### 📦 [Templates](./templates)

Starter templates for RiotPlan - ready-to-use templates for common scenarios.

```bash
npm install @riotprompt/riotplan-templates
```

**Available Templates:** basic, feature, refactoring, migration, sprint

### 🛠️ Command Packages

Modular command packages for the RiotPlan CLI:

- **[commands-plan](./commands-plan)** - Plan management (init, validate, archive)
- **[commands-step](./commands-step)** - Step navigation and execution
- **[commands-status](./commands-status)** - Status viewing and updates
- **[commands-feedback](./commands-feedback)** - Feedback collection and processing
- **[commands-render](./commands-render)** - Rendering plans to various formats

## Getting Started

### Quick Start with RiotPrompt

```bash
# Install
npm install riotprompt

# Create a prompt
npx riotprompt create my-prompt --persona "You are a data expert."

# Execute against an LLM
npx riotprompt execute my-prompt -m gpt-4
```

### Quick Start with RiotPlan

```bash
# Install
npm install riotplan

# Create a new plan
npx riotplan init my-feature --description "Implement new feature"

# View plan dashboard
npx riotplan-dashboard ./plans
```

## Development

This is a monorepo using npm workspaces. Each package is independently versioned and published.

```bash
# Install all dependencies
npm install

# Run tests for all packages
npm test

# Build all packages
npm run build

# Run tests for a specific package
cd riotprompt && npm test
```

## Architecture Philosophy

**Kjerneverk** follows these principles:

1. **Zero Assumptions**: Libraries are generic and unopinionated
2. **Type Safety**: Full TypeScript support throughout
3. **Composability**: Mix and match packages as needed
4. **Provider Agnostic**: Work with any LLM provider
5. **Progressive Enhancement**: Start simple, add complexity as needed

## Package Relationships

```
┌─────────────┐
│  RiotPlan   │ ◄─── Long-running workflows
└──────┬──────┘
       │
       ├──► Templates (starter templates)
       ├──► History (revisions/milestones)
       ├──► Renderer (output formats)
       ├──► Dashboard (visualization)
       └──► Commands-* (CLI functionality)

┌─────────────┐
│ RiotPrompt  │ ◄─── Structured prompts
└──────┬──────┘
       │
       └──► Execution (LLM providers)

┌─────────────┐
│  Execution  │ ◄─── Provider interface
└──────┬──────┘
       │
       ├──► execution-openai
       ├──► execution-anthropic
       └──► execution-gemini

┌─────────────┐
│   Agentic   │ ◄─── Tool & context management
└──────┬──────┘
       │
       └──► Execution (uses providers)
```

## Documentation

- **RiotPrompt**: [Full Documentation](https://kjerneverk.github.io/riotprompt/)
- **RiotPlan**: See [riotplan/README.md](./riotplan/README.md)
- **Execution**: See [execution/README.md](./execution/README.md)
- **Agentic**: See [agentic/README.md](./agentic/README.md)

## Contributing

Contributions are welcome! Each package has its own test suite and can be developed independently.

```bash
# Pick a package to work on
cd riotprompt

# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Build
npm run build
```

## License

Apache-2.0 - see individual package LICENSE files for details.

---

**Build better AI workflows, from prompts to plans.**
