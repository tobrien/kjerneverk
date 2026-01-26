# Step 10: Documentation

## Objective

Update all documentation across all projects to reflect the new multi-project architecture.

## Tasks

### 10.1 Update RiotPrompt README

Update `/Users/tobrien/gitw/kjerneverk/riotprompt/README.md`:

```markdown
# RiotPrompt

Get it together, and organize your prompts.

## What is RiotPrompt?

RiotPrompt brings structure and clarity to prompt engineering. Instead of sprawling text files, you get:

- **Clear separation** of persona, instructions, context, and content
- **Type-safe** prompt construction
- **Model-agnostic** formatting
- **Template system** for reusable patterns

## Installation

```bash
npm install riotprompt
```

For CLI tools:
```bash
npm install -g riotprompt-cli
```

## Quick Start

```typescript
import { cook, Formatter } from 'riotprompt';

const prompt = await cook({
  basePath: __dirname,
  persona: { content: 'You are a helpful code reviewer' },
  instructions: [
    { content: 'Review code for bugs and improvements' },
    { content: 'Be constructive and specific' },
  ],
  context: [
    { title: 'Project Context', content: 'This is a TypeScript project' },
  ],
});

const formatter = Formatter.create();
const request = formatter.formatPrompt('gpt-4o', prompt);
```

## Ecosystem

RiotPrompt is part of a larger ecosystem:

| Package | Description |
|---------|-------------|
| **riotprompt** | Core prompt modeling |
| **riotprompt-cli** | CLI for prompt operations |
| **agentic** | Multi-turn conversations & tools |
| **execution** | LLM provider interfaces |
| **execution-openai** | OpenAI provider |
| **execution-anthropic** | Anthropic provider |
| **execution-gemini** | Gemini provider |
| **riotplan** | Long-lived workflows (coming) |

## Importing Features

```typescript
// Core prompt features (always available)
import { cook, Formatter, Loader, Serializer } from 'riotprompt';

// Agentic features (re-exported)
import { ConversationBuilder, ToolRegistry } from 'riotprompt';

// Execution features (re-exported)
import { getModelFamily, createRequest } from 'riotprompt';

// Or import directly for smaller bundles
import { cook } from 'riotprompt';
import { ConversationBuilder } from 'agentic';
import { OpenAIProvider } from 'execution-openai';
```

## Documentation

- [API Reference](./docs/api-reference.md)
- [Recipes System](./docs/recipes.md)
- [Template Configuration](./docs/template-configuration.md)

## Philosophy

RiotPrompt is designed to be completely generic and unopinionated. Unlike other prompt libraries that assume specific use cases, RiotPrompt provides the building blocks for any prompt-based application while maintaining type safety.

## License

Apache-2.0
```

### 10.2 Create Ecosystem Overview

Create `/Users/tobrien/gitw/kjerneverk/ECOSYSTEM.md`:

```markdown
# Kjerneverk Ecosystem

This workspace contains a suite of packages for AI application development.

## Package Overview

```
kjerneverk/
├── riotprompt/           # Core prompt modeling
├── riotprompt-cli/       # Prompt CLI
├── agentic/              # Agentic AI framework
├── execution/            # Provider interfaces
├── execution-openai/     # OpenAI provider
├── execution-anthropic/  # Anthropic provider
├── execution-gemini/     # Gemini provider
├── riotplan/             # Plan framework (dev)
└── riotplan-cli/         # Plan CLI (dev)
```

## Dependency Graph

```
                    ┌──────────────┐     ┌──────────────┐
                    │ riotprompt   │     │  riotplan    │
                    │    -cli      │     │    -cli      │
                    └──────┬───────┘     └──────┬───────┘
                           │                    │
         ┌─────────────────┼────────────────────┤
         │                 │                    │
         ▼                 ▼                    ▼
┌──────────────┐   ┌──────────────┐    ┌──────────────┐
│ riotprompt   │   │   agentic    │    │  riotplan    │
└──────────────┘   └──────┬───────┘    └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  execution   │
                   └──────┬───────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ openai   │    │anthropic │    │  gemini  │
   └──────────┘    └──────────┘    └──────────┘
```

## Package Details

### riotprompt
Core prompt modeling: items, formatting, parsing, recipes.

### agentic
Shared agentic framework: conversations, tools, strategies.

### execution
Provider interfaces and model configuration.

### execution-* 
Individual LLM provider implementations.

### riotplan
Framework for long-lived, stateful workflows (under development).

## Development

Each package is an independent project with its own:
- `package.json`
- Build configuration
- Test suite
- README

## License

All packages are Apache-2.0 licensed.
```

### 10.3 Update Each Package README

Ensure each package has accurate README (already created in previous steps).

### 10.4 Update API Documentation

Update `/Users/tobrien/gitw/kjerneverk/riotprompt/docs/`:

- Update import examples
- Note which features come from which packages
- Add cross-references

### 10.5 Create Migration Guide

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/MIGRATION.md`:

```markdown
# Migration Guide

## From Pre-1.0 to 1.0

### No Breaking Changes

All existing imports continue to work:

```typescript
// This still works!
import { cook, ConversationBuilder, ToolRegistry } from 'riotprompt';
```

### What Changed Internally

Code was reorganized into separate packages:
- Execution providers → `execution-*` packages
- Agentic features → `agentic` package
- CLI → `riotprompt-cli` package

### Optional: Direct Imports

For smaller bundles, import directly from packages:

```typescript
// Instead of
import { cook, ConversationBuilder, OpenAIProvider } from 'riotprompt';

// You can use
import { cook } from 'riotprompt';
import { ConversationBuilder } from 'agentic';
import { OpenAIProvider } from 'execution-openai';
```

### CLI Installation

CLI is now a separate package:

```bash
# Before
npm install riotprompt  # CLI included

# After
npm install riotprompt      # Library only
npm install -g riotprompt-cli  # CLI separate
```
```

### 10.6 Update Changelogs

Create/update CHANGELOG.md in riotprompt:

```markdown
# Changelog

## [1.0.0] - 2026-XX-XX

### Added
- Re-exports from `agentic` package
- Re-exports from `execution` package

### Changed
- Execution providers moved to separate packages
- Agentic features moved to `agentic` package
- CLI moved to `riotprompt-cli` package

### Migration
- No breaking changes for existing code
- All imports from 'riotprompt' continue to work
- See MIGRATION.md for optimization tips
```

## Validation

- [ ] All README files are accurate
- [ ] ECOSYSTEM.md created
- [ ] Migration guide created
- [ ] API docs updated
- [ ] Changelogs updated
- [ ] Cross-references work

## Next Step

Proceed to `11-release.md`
