# Step 05: RiotPrompt Slim Down

## Objective

Remove the extracted code from `riotprompt` and add dependencies on the new shared packages. Focus riotprompt on its **original mission**: prompt modeling (role vs command vs context clarity).

## Project Location

```
/Users/tobrien/gitw/kjerneverk/riotprompt/
```

## What Stays in RiotPrompt

### Core Prompt Modeling (KEEP)
- `src/items/` - Content, Context, Instruction, Section, Trait, Weighted, Parameters
- `src/prompt.ts` - Prompt definition
- `src/formatter.ts` - Prompt formatting
- `src/parser.ts` - Prompt parsing
- `src/loader.ts` - File/directory loading
- `src/serializer.ts` - JSON/XML serialization
- `src/writer.ts` - Output writing
- `src/builder.ts` - Prompt builder
- `src/recipes.ts` - Cook, templates
- `src/override.ts` - Override system
- `src/config.ts` - Configuration
- `src/constants.ts` - Constants
- `src/parse/` - Markdown, text parsing
- `src/util/general.ts`, `util/text.ts`, `util/markdown.ts` - Utilities

### To Remove (Now in Shared Packages)
- `src/chat.ts` → Now in `execution`
- `src/model-config.ts` → Now in `execution`
- `src/execution/` → Now in `execution-*`
- `src/conversation.ts` → Now in `agentic`
- `src/context-manager.ts` → Now in `agentic`
- `src/message-builder.ts` → Now in `agentic`
- `src/conversation-logger.ts` → Now in `agentic`
- `src/token-budget.ts` → Now in `agentic`
- `src/tools.ts` → Now in `agentic`
- `src/iteration-strategy.ts` → Now in `agentic`
- `src/reflection.ts` → Now in `agentic`
- `src/util/storage.ts` → Now in `agentic`

## Tasks

### 5.1 Create Feature Branch

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt
git checkout -b feature/slim-down
git tag pre-slim-backup
```

### 5.2 Update package.json

```json
{
  "name": "riotprompt",
  "version": "1.0.0",
  "description": "Get it together, and organize your prompts.",
  "type": "module",
  "main": "./dist/riotprompt.cjs",
  "module": "./dist/riotprompt.js",
  "types": "./dist/riotprompt.d.ts",
  "exports": {
    ".": {
      "types": "./dist/riotprompt.d.ts",
      "import": "./dist/riotprompt.js",
      "require": "./dist/riotprompt.cjs"
    }
  },
  "dependencies": {
    "fast-xml-parser": "^5.3.3",
    "glob": "^11.0.3",
    "js-yaml": "^4.1.1",
    "marked": "^16.0.0",
    "zod": "^4.0.2",
    "zod-to-json-schema": "^3.25.1",
    "execution": "^0.0.1",
    "agentic": "^0.0.1"
  },
  "peerDependencies": {
    "execution-openai": "^0.0.1",
    "execution-anthropic": "^0.0.1",
    "execution-gemini": "^0.0.1"
  },
  "peerDependenciesMeta": {
    "execution-openai": { "optional": true },
    "execution-anthropic": { "optional": true },
    "execution-gemini": { "optional": true }
  }
}
```

### 5.3 Delete Extracted Files

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt/src

# Remove execution (now in separate packages)
rm -rf execution/
rm chat.ts
rm model-config.ts

# Remove agentic (now in agentic package)
rm conversation.ts
rm context-manager.ts
rm message-builder.ts
rm conversation-logger.ts
rm token-budget.ts
rm tools.ts
rm iteration-strategy.ts
rm reflection.ts
rm util/storage.ts
```

### 5.4 Update src/riotprompt.ts

Update the main export file to re-export from dependencies:

```typescript
// ===== CORE PROMPT MODELING (Local) =====
export { create as createContent } from "./items/content";
export { create as createContext } from "./items/context";
export { create as createInstruction } from "./items/instruction";
export { create as createSection } from "./items/section";
export { create as createTrait } from "./items/trait";
export { create as createWeighted } from "./items/weighted";
export { create as createPrompt } from "./prompt";
export { create as createParameters } from "./items/parameters";

export * as Formatter from "./formatter";
export * as Parser from "./parser";
export * as Loader from "./loader";
export * as Override from "./override";
export * as Builder from "./builder";
export * as Serializer from "./serializer";
export * as Writer from "./writer";

// ===== RECIPES SYSTEM (Local) =====
export * as Recipes from "./recipes";
export { cook, recipe, registerTemplates, getTemplates, clearTemplates, generateToolGuidance } from "./recipes";

// ===== TYPES (Local) =====
export type { Content } from "./items/content";
export type { Context } from "./items/context";
export type { Instruction } from "./items/instruction";
export type { Parameters } from "./items/parameters";
export type { Section } from "./items/section";
export type { Trait } from "./items/trait";
export type { Weighted } from "./items/weighted";
export type { Prompt } from "./prompt";
export type { FormatOptions, SectionSeparator, SectionTitleProperty } from "./formatter";
export type { RecipeConfig, ContentItem, TemplateConfig, ToolGuidanceConfig } from "./recipes";
export type { Logger } from "./logger";

// ===== RE-EXPORTS FROM EXECUTION =====
export {
    createRequest,
    getPersonaRole,
    ModelRegistry,
    getModelRegistry,
    resetModelRegistry,
    getEncoding,
    supportsToolCalls,
    getModelFamily,
    configureModel,
} from "execution";

export type {
    Model,
    Role,
    Message,
    Request,
    Provider,
    ProviderResponse,
    ExecutionOptions,
    ModelConfig,
    PersonaRole,
    TokenizerEncoding,
} from "execution";

// ===== RE-EXPORTS FROM AGENTIC =====
export {
    ConversationBuilder,
    ContextManager,
    TokenCounter,
    TokenBudgetManager,
    MessageBuilder,
    MessageTemplates,
    ConversationLogger,
    ConversationReplayer,
    ToolRegistry,
    StrategyExecutor,
    IterationStrategyFactory,
    MetricsCollector,
    ReflectionReportGenerator,
} from "agentic";

export type {
    ConversationMessage,
    ConversationBuilderConfig,
    ConversationMetadata,
    ConversationState,
    InjectOptions,
    ToolCall,
    DynamicContentItem,
    TrackedContextItem,
    ContextStats,
    TokenUsage,
    TokenBudgetConfig,
    CompressionStats,
    CompressionStrategy,
    SemanticRole,
    MessageMetadata,
    IterationStrategy,
    StrategyPhase,
    StrategyState,
    StrategyResult,
    StrategyContext,
    PhaseResult,
    ToolResult,
    LLMClient,
    ToolUsagePolicy,
    Insight,
    ReflectionReport,
    ReflectionConfig,
    AgenticExecutionMetrics,
    ToolExecutionMetric,
    ToolStats,
    Recommendation,
    ToolEffectivenessAnalysis,
    PerformanceInsights,
    QualityAssessment,
    LogConfig,
    LogFormat,
    LoggedConversation,
    ConversationLogMetadata,
    LoggedMessage,
    ToolCallLog,
    ConversationSummary,
    ReplayOptions,
    ReplayResult,
    Tool,
    ToolParameter,
    ToolContext,
    ToolExample,
    ToolCost,
    OpenAITool,
    AnthropicTool,
    ToolDefinition,
    ToolUsageStats,
} from "agentic";
```

### 5.5 Update Internal Imports

Update any files that imported from deleted modules:

```typescript
// Before
import { Model } from "./chat";
import { getPersonaRole } from "./model-config";

// After
import type { Model } from "execution";
import { getPersonaRole } from "execution";
```

Files likely needing updates:
- `formatter.ts`
- `recipes.ts`
- `loader.ts`

### 5.6 Update formatter.ts

The formatter needs to work with Model type from execution:

```typescript
import type { Model, Message, Request } from "execution";
import { getPersonaRole, createRequest } from "execution";

// Rest of formatter stays the same
```

### 5.7 Remove CLI (Will Be Separate Project)

```bash
rm /Users/tobrien/gitw/kjerneverk/riotprompt/src/cli.ts
rm /Users/tobrien/gitw/kjerneverk/riotprompt/vite.config.cli.ts
```

Update package.json to remove `bin` entry (CLI will be in riotprompt-cli).

### 5.8 Update Tests

Move tests for extracted functionality to their respective packages.

Keep tests for:
- Items
- Prompt
- Formatter
- Parser
- Loader
- Serializer
- Recipes

### 5.9 Build and Test

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm install
npm run build
npm test
```

## Validation

- [ ] Build succeeds
- [ ] All prompt-related tests pass
- [ ] No imports from deleted files
- [ ] Re-exports work correctly
- [ ] `cook()` still works
- [ ] `Formatter.create()` still works

## Files After Slimming

```
riotprompt/src/
├── items/
│   ├── content.ts
│   ├── context.ts
│   ├── instruction.ts
│   ├── parameters.ts
│   ├── section.ts
│   ├── trait.ts
│   └── weighted.ts
├── parse/
│   ├── markdown.ts
│   └── text.ts
├── util/
│   ├── general.ts
│   ├── markdown.ts
│   └── text.ts
├── builder.ts
├── config.ts
├── constants.ts
├── formatter.ts
├── loader.ts
├── logger.ts
├── override.ts
├── parser.ts
├── prompt.ts
├── recipes.ts
├── riotprompt.ts
├── serializer.ts
└── writer.ts
```

## Next Step

Proceed to `06-riotprompt-cli.md`

