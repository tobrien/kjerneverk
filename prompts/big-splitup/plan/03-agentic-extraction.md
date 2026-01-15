# Step 03: Agentic Framework Extraction

## Objective

Create the `agentic` project containing conversation management, tool integration, iteration strategies, and reflection. This is a **shared library** that can be used by riotprompt, riotplan, or any other project.

## Project Location

```
/Users/tobrien/gitw/kjerneverk/agentic/
```

## Tasks

### 3.1 Create Project Directory

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/agentic/src/util
cd /Users/tobrien/gitw/kjerneverk/agentic
```

### 3.2 Create package.json

```json
{
  "name": "agentic",
  "version": "0.0.1",
  "description": "Agentic AI framework: conversations, tools, and strategies",
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
  "keywords": ["agentic", "ai", "conversation", "tools", "llm"],
  "license": "Apache-2.0",
  "dependencies": {
    "zod": "^4.0.2"
  },
  "peerDependencies": {
    "execution": "^0.0.1"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^7.0.4",
    "vite-plugin-dts": "^4.5.4",
    "vitest": "^3.2.4",
    "execution": "^0.0.1"
  }
}
```

### 3.3 Extract Files from RiotPrompt

Copy from `/Users/tobrien/gitw/kjerneverk/riotprompt/src/`:

| Source | Destination |
|--------|-------------|
| `conversation.ts` | `agentic/src/conversation.ts` |
| `context-manager.ts` | `agentic/src/context-manager.ts` |
| `message-builder.ts` | `agentic/src/message-builder.ts` |
| `conversation-logger.ts` | `agentic/src/conversation-logger.ts` |
| `token-budget.ts` | `agentic/src/token-budget.ts` |
| `tools.ts` | `agentic/src/tools.ts` |
| `iteration-strategy.ts` | `agentic/src/iteration-strategy.ts` |
| `reflection.ts` | `agentic/src/reflection.ts` |
| `logger.ts` | `agentic/src/logger.ts` |
| `util/storage.ts` | `agentic/src/util/storage.ts` |

### 3.4 Update Imports

All files need to import from `execution` instead of local:

```typescript
// Before
import { Model } from "./chat";
import { getPersonaRole } from "./model-config";

// After
import type { Model } from "execution";
import { getPersonaRole } from "execution";
```

### 3.5 Handle Formatter Dependency

The conversation module currently uses Formatter from riotprompt. Options:

**Option A: Accept formatter as parameter (RECOMMENDED)**
```typescript
export interface ConversationBuilderConfig {
    model: Model;
    formatter?: {
        format(item: any): string;
        formatPrompt(model: Model, prompt: any): any;
    };
    // ...
}
```

**Option B: Define minimal formatter interface in agentic**

This keeps agentic independent of riotprompt while allowing integration.

### 3.6 Create Package Index

Create `agentic/src/index.ts`:

```typescript
// ===== CONVERSATION MANAGEMENT =====
export { ConversationBuilder } from "./conversation";
export { ContextManager } from "./context-manager";
export { MessageBuilder, MessageTemplates } from "./message-builder";
export { ConversationLogger, ConversationReplayer } from "./conversation-logger";

// ===== TOKEN MANAGEMENT =====
export { TokenCounter, TokenBudgetManager } from "./token-budget";

// ===== TOOL INTEGRATION =====
export { ToolRegistry } from "./tools";

// ===== ITERATION STRATEGIES =====
export { StrategyExecutor, IterationStrategyFactory } from "./iteration-strategy";

// ===== OBSERVABILITY =====
export { MetricsCollector, ReflectionReportGenerator } from "./reflection";

// ===== TYPES =====
export type {
    ConversationMessage,
    ConversationBuilderConfig,
    ConversationMetadata,
    ConversationState,
    InjectOptions,
    ToolCall
} from "./conversation";

export type {
    DynamicContentItem,
    TrackedContextItem,
    ContextStats
} from "./context-manager";

export type {
    TokenUsage,
    TokenBudgetConfig,
    CompressionStats,
    CompressionStrategy
} from "./token-budget";

export type {
    SemanticRole,
    MessageMetadata
} from "./message-builder";

export type {
    IterationStrategy,
    StrategyPhase,
    StrategyState,
    StrategyResult,
    StrategyContext,
    PhaseResult,
    ToolResult,
    LLMClient,
    ToolUsagePolicy,
    Insight
} from "./iteration-strategy";

export type {
    ReflectionReport,
    ReflectionConfig,
    AgenticExecutionMetrics,
    ToolExecutionMetric,
    ToolStats,
    Recommendation,
    ToolEffectivenessAnalysis,
    PerformanceInsights,
    QualityAssessment
} from "./reflection";

export type {
    LogConfig,
    LogFormat,
    LoggedConversation,
    ConversationLogMetadata,
    LoggedMessage,
    ToolCallLog,
    ConversationSummary,
    ReplayOptions,
    ReplayResult
} from "./conversation-logger";

export type {
    Tool,
    ToolParameter,
    ToolContext,
    ToolExample,
    ToolCost,
    OpenAITool,
    AnthropicTool,
    ToolDefinition,
    ToolUsageStats
} from "./tools";
```

### 3.7 Create README

Create `agentic/README.md`:

```markdown
# agentic

Agentic AI framework for multi-turn conversations, tool integration, and execution strategies.

## Features

- **ConversationBuilder**: Manage multi-turn conversations with context tracking
- **ToolRegistry**: Define, register, and execute tools
- **IterationStrategies**: Pre-built strategies for agentic workflows
- **Reflection**: Metrics collection and execution analysis

## Installation

```bash
npm install agentic execution
```

## Quick Start

```typescript
import { ConversationBuilder, ToolRegistry, IterationStrategyFactory } from 'agentic';

// Create conversation
const conversation = ConversationBuilder.create({ model: 'gpt-4o' })
    .addSystemMessage('You are a research assistant')
    .addUserMessage('Find information about X')
    .build();

// Register tools
const tools = ToolRegistry.create();
tools.register({
    name: 'search',
    description: 'Search for information',
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
    },
    execute: async ({ query }) => searchAPI(query)
});

// Create strategy
const strategy = IterationStrategyFactory.investigateThenRespond({
    maxInvestigationSteps: 5,
    requireMinimumTools: 2
});
```

## Pre-built Strategies

- `investigateThenRespond` - Gather info with tools, then synthesize
- `multiPassRefinement` - Generate, critique, and refine
- `breadthFirst` - Explore broadly before diving deep
- `depthFirst` - Deep investigation path
- `adaptive` - Changes behavior based on progress
- `simple` - Basic tool-use loop

## Related Packages

- `execution` - Provider interfaces
- `execution-openai` - OpenAI provider
- `riotprompt` - Prompt modeling (optional)
```

### 3.8 Move Tests

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/agentic/tests

# Copy relevant tests from riotprompt
cp riotprompt/tests/conversation.test.ts agentic/tests/
cp riotprompt/tests/tools.test.ts agentic/tests/
cp riotprompt/tests/iteration-strategy.test.ts agentic/tests/
# etc.
```

## Validation

- [ ] `npm install` succeeds
- [ ] `npm run build` produces dist/
- [ ] All imports resolve to `execution` package
- [ ] No dependency on `riotprompt`
- [ ] Tests pass
- [ ] ConversationBuilder works standalone
- [ ] ToolRegistry works standalone
- [ ] Strategies work with mock LLM client

## Files Created

```
agentic/
├── src/
│   ├── index.ts
│   ├── conversation.ts
│   ├── context-manager.ts
│   ├── message-builder.ts
│   ├── conversation-logger.ts
│   ├── token-budget.ts
│   ├── tools.ts
│   ├── iteration-strategy.ts
│   ├── reflection.ts
│   ├── logger.ts
│   └── util/
│       └── storage.ts
├── tests/
│   └── *.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Next Step

Proceed to `04-shared-validation.md`

