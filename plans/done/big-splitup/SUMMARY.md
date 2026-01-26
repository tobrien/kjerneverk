# RiotPrompt Split-Up Strategy - Summary

## Overview

RiotPrompt has evolved into a comprehensive prompt engineering library with multiple distinct concerns. This plan splits the monolithic codebase into **flat peer projects** within the kjerneverk workspace, with clear separation between product-specific and shared libraries.

## Architecture Philosophy

### Flat Peer Projects (Not Monorepo)
Every project is a **sibling directory** in `/Users/tobrien/gitw/kjerneverk/`. No nested packages, no workspace linking—just independent npm packages with explicit peer dependencies.

### Product-Specific vs Shared
- **Product-specific**: Prefixed with product name (`riotprompt-*`, `riotplan-*`)
- **Shared**: Generic names, usable across products (`agentic`, `execution-*`)

## Target Directory Structure

```
/Users/tobrien/gitw/kjerneverk/
│
├── riotprompt/              # Core prompt modeling (THE original mission)
│                            # Role vs Command vs Context clarity
│                            # Templates, formatting, serialization, recipes
│
├── riotprompt-cli/          # CLI for prompt operations
│
├── riotplan/                # Plans framework (FUTURE - stubbed)
│                            # Long-lived stateful workflows
│                            # STATUS.md, phases, interruption recovery
│
├── riotplan-cli/            # CLI for plan operations (FUTURE - stubbed)
│
├── agentic/                 # SHARED: Agentic framework
│                            # ConversationBuilder, ToolRegistry
│                            # IterationStrategy, Reflection
│
├── execution/               # SHARED: Execution interfaces
│                            # Provider contracts, ModelRegistry
│                            # No SDK dependencies
│
├── execution-openai/        # SHARED: OpenAI provider
│                            # Only depends on: openai, tiktoken
│
├── execution-anthropic/     # SHARED: Anthropic provider
│                            # Only depends on: @anthropic-ai/sdk
│
├── execution-gemini/        # SHARED: Gemini provider
│                            # Only depends on: @google/generative-ai
│
└── prompts/                 # Prompt/plan files (not a package)
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
│              │   │   (shared)   │    │              │
└──────────────┘   └──────┬───────┘    └──────┬───────┘
                          │                   │
                          ▼                   │
                   ┌──────────────┐           │
                   │  execution   │ ◄─────────┘
                   │ (interfaces) │
                   └──────┬───────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ exec-    │    │  exec-   │    │  exec-   │
   │ openai   │    │anthropic │    │  gemini  │
   └──────────┘    └──────────┘    └──────────┘
```

## Package Responsibilities

### riotprompt (Core Prompt Modeling)
The **original mission**: making prompt structure clear and manageable.

**Contains:**
- Items: Content, Context, Instruction, Section, Trait, Weighted, Parameters
- Prompt definition and creation
- Formatter (model-agnostic output)
- Parser (markdown, text input)
- Loader (file/directory loading)
- Serializer (JSON/XML)
- Recipes (cook, templates)
- Override system

**Standalone Value:** Structure your prompts without any execution or agentic concerns.

### agentic (Shared Agentic Framework)
Multi-turn conversations and tool orchestration.

**Contains:**
- ConversationBuilder
- ContextManager
- TokenBudgetManager, TokenCounter
- MessageBuilder
- ToolRegistry
- IterationStrategy, StrategyExecutor
- Reflection, MetricsCollector

**Standalone Value:** Build AI agents with tool use, works with any prompt library.

### execution (Shared Interfaces)
Provider contracts and model configuration.

**Contains:**
- Provider interface
- ExecutionOptions, ProviderResponse types
- ModelRegistry
- Model family detection
- Encoding/tokenizer mapping

**Standalone Value:** Define execution contracts without SDK dependencies.

### execution-openai / execution-anthropic / execution-gemini
Individual provider implementations.

**Contains (each):**
- Provider implementation
- SDK-specific transformations
- Model-specific handling

**Standalone Value:** Install only the providers you use.

### riotplan (Future - Stubbed)
Long-lived stateful AI workflows.

A **plan** bridges the gap between prompts (single interaction) and agentic conversations (multi-turn sessions). Plans manage work that:
- Spans multiple sessions/days/weeks
- Has persistent state tracked in files
- Is organized into numbered steps (01-STEP.md, 02-STEP.md)
- Can be interrupted and resumed
- Supports human review and feedback loops

**Plan Structure:**
```
my-plan/
├── my-plan-prompt.md     # Meta-prompt (prompt-of-prompts)
├── SUMMARY.md            # Overview of approach
├── EXECUTION_PLAN.md     # Step-by-step strategy
├── STATUS.md             # Current state (auto-updated)
├── plan/                 # Step files
│   ├── 01-first-step.md
│   ├── 02-second-step.md
│   └── ...
└── analysis/             # Analysis output (optional)
```

**Real Examples:**
- `/Users/tobrien/gitw/kjerneverk/prompts/big-splitup/` - This plan!
- `/Users/tobrien/gitw/grunnverk/prompts/parallel-execution/`
- `/Users/tobrien/gitw/grunnverk/prompts/commit-splitting/`

**Will Contain:**
- Plan loading and creation
- Step discovery and sequencing
- STATUS.md parsing and generation
- State management and updates
- Interruption recovery
- Type definitions for plans, steps, phases

**Standalone Value:** Orchestrate multi-step AI workflows with persistence.

## Benefits of This Architecture

1. **No Dependency Bloat**: Install `execution-openai` without pulling in Anthropic/Gemini SDKs
2. **Clear Boundaries**: Each project has one job
3. **Independent Versioning**: `agentic` can evolve without touching `riotprompt`
4. **Reusability**: `agentic` and `execution-*` work with any prompt library
5. **Future-Proof**: `riotplan` can build on these foundations
6. **Simple Structure**: No monorepo complexity, just npm packages

## Migration Path

1. **Phase 1**: Extract shared libraries (`execution`, `execution-*`, `agentic`)
2. **Phase 2**: Slim down `riotprompt` to core prompt concerns
3. **Phase 3**: Create `riotprompt-cli` as separate project
4. **Phase 4**: Stub out `riotplan` and `riotplan-cli`
5. **Phase 5**: Update all docs and release

## Success Criteria

1. Each project builds and tests independently
2. `npm install riotprompt` still works (re-exports from dependencies)
3. `npm install execution-openai` works without other SDKs
4. Existing code using `riotprompt` continues to work
5. Clear documentation for new structure

## Timeline Estimate

- **Phase 1** (Steps 01-04): Shared library extraction - 3-4 days
- **Phase 2** (Steps 05-07): RiotPrompt slimming - 2-3 days
- **Phase 3** (Steps 08-09): CLI and riotplan stubs - 1-2 days
- **Phase 4** (Steps 10-11): Integration and release - 1-2 days

**Total: ~8-11 working days**
