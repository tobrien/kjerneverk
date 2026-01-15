# Step 23: Execution Providers

## Objective

Implement plan step execution by wrapping the existing `@riotprompt/execution-*` packages, enabling steps to be executed by different backends: AI models (Claude, GPT, Gemini), humans, or CI/CD systems.

## Background

From RIOTPLAN_ANALYSIS.md (R26):

> Plans aren't executed by one tool. Different steps need different capabilities.

| Step Type | Best Executed By | Package |
|-----------|------------------|---------|
| Code generation | Claude Code | `@riotprompt/execution-anthropic` |
| Complex reasoning | o1/o3 | `@riotprompt/execution-openai` |
| Multimodal tasks | Gemini | `@riotprompt/execution-gemini` |
| Human approval | Human | Built-in `HumanProvider` |
| CI/CD pipeline | GitHub Actions | Built-in `CICDProvider` |

**Key Design Decision**: RiotPlan reuses the existing `@riotprompt/execution-*` packages. This creates a shared integration point between riotprompt and riotplan ecosystems.

## Shared Packages (Already Exist)

These packages are already implemented and used by riotprompt:

| Package | Provider Class | Models Supported |
|---------|---------------|------------------|
| `@riotprompt/execution` | (interfaces only) | Provider, Request, Response types |
| `@riotprompt/execution-anthropic` | `AnthropicProvider` | claude-3-opus, claude-3-sonnet, etc. |
| `@riotprompt/execution-openai` | `OpenAIProvider` | gpt-4o, o1, o3, etc. |
| `@riotprompt/execution-gemini` | `GeminiProvider` | gemini-pro, gemini-ultra, etc. |

## Tasks

### 1. Define RiotPlan Execution Interface

Create `riotplan/src/execution/types.ts`:

```typescript
import type { Provider, ExecutionOptions, ProviderResponse } from '@riotprompt/execution';
import type { Plan, PlanStep } from '../types.js';

/**
 * Extended execution provider for plan step execution.
 * Wraps the base Provider interface with plan-specific context.
 */
export interface StepExecutionProvider {
  /** Provider identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Underlying LLM provider (from execution-*) */
  readonly provider?: Provider;
  
  /** Check if provider is available */
  isAvailable(): Promise<boolean>;
  
  /** Execute a step */
  execute(
    step: PlanStep,
    context: StepExecutionContext
  ): Promise<StepExecutionResult>;
  
  /** Get provider capabilities */
  capabilities: ProviderCapabilities;
}

export interface ProviderCapabilities {
  /** Can execute code */
  codeExecution: boolean;
  
  /** Can do research/reasoning */
  research: boolean;
  
  /** Can interact with user */
  interactive: boolean;
  
  /** Requires API key */
  requiresApiKey: boolean;
  
  /** Supports tool/function calling */
  toolCalling: boolean;
}

export interface StepExecutionContext {
  /** Plan being executed */
  plan: Plan;
  
  /** Working directory */
  workingDirectory: string;
  
  /** Environment variables */
  env?: Record<string, string>;
  
  /** Options to pass to underlying provider */
  executionOptions?: ExecutionOptions;
  
  /** Callback for progress */
  onProgress?: (progress: ExecutionProgress) => void;
}

export interface ExecutionProgress {
  phase: 'preparing' | 'executing' | 'validating' | 'complete';
  message: string;
  percent?: number;
}

export interface StepExecutionResult {
  /** Success or failure */
  success: boolean;
  
  /** Output/result */
  output?: string;
  
  /** Error if failed */
  error?: Error;
  
  /** Duration in ms */
  duration: number;
  
  /** Files changed */
  filesChanged?: string[];
  
  /** Raw provider response (from execution-*) */
  providerResponse?: ProviderResponse;
  
  /** AI self-reflection (if AI executed) */
  reflection?: {
    confidence: number;
    difficulty: 'low' | 'medium' | 'high';
    iterations: number;
    notes?: string;
  };
}
```

### 2. Create LLM Provider Adapter

Create `riotplan/src/execution/llm-adapter.ts`:

```typescript
import type { Provider, ExecutionOptions, Request, Message } from '@riotprompt/execution';
import type { PlanStep } from '../types.js';
import type { 
  StepExecutionProvider, 
  StepExecutionContext, 
  StepExecutionResult,
  ProviderCapabilities 
} from './types.js';

/**
 * Adapter that wraps an @riotprompt/execution-* Provider
 * for use with plan step execution.
 */
export class LLMProviderAdapter implements StepExecutionProvider {
  readonly id: string;
  readonly name: string;
  readonly provider: Provider;
  readonly capabilities: ProviderCapabilities;

  constructor(
    provider: Provider,
    options: {
      id?: string;
      name?: string;
      capabilities?: Partial<ProviderCapabilities>;
    } = {}
  ) {
    this.provider = provider;
    this.id = options.id || provider.name;
    this.name = options.name || `${provider.name} Provider`;
    this.capabilities = {
      codeExecution: true,
      research: true,
      interactive: false,
      requiresApiKey: true,
      toolCalling: true,
      ...options.capabilities,
    };
  }

  async isAvailable(): Promise<boolean> {
    // Check if API key is configured
    const envVar = this.getApiKeyEnvVar();
    return !!process.env[envVar];
  }

  private getApiKeyEnvVar(): string {
    switch (this.provider.name) {
      case 'anthropic': return 'ANTHROPIC_API_KEY';
      case 'openai': return 'OPENAI_API_KEY';
      case 'gemini': return 'GOOGLE_API_KEY';
      default: return `${this.provider.name.toUpperCase()}_API_KEY`;
    }
  }

  async execute(
    step: PlanStep,
    context: StepExecutionContext
  ): Promise<StepExecutionResult> {
    const startTime = Date.now();
    
    try {
      context.onProgress?.({ 
        phase: 'preparing', 
        message: 'Building prompt from step...' 
      });

      // Build request from step content
      const request = this.buildRequest(step, context);
      
      context.onProgress?.({ 
        phase: 'executing', 
        message: `Executing with ${this.name}...` 
      });

      // Execute via underlying provider
      const response = await this.provider.execute(
        request,
        context.executionOptions
      );

      context.onProgress?.({ 
        phase: 'validating', 
        message: 'Processing response...' 
      });

      // Parse and return result
      return this.parseResult(response, startTime);
      
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        duration: Date.now() - startTime,
      };
    }
  }

  private buildRequest(step: PlanStep, context: StepExecutionContext): Request {
    const messages: Message[] = [];

    // System message with context
    messages.push({
      role: 'system',
      content: `You are executing step ${step.number} of a plan.
Plan: ${context.plan.metadata.name}
Working Directory: ${context.workingDirectory}

Step Title: ${step.title}
${step.description ? `Description: ${step.description}` : ''}

Execute this step and report the results.`,
    });

    // User message with step content
    messages.push({
      role: 'user',
      content: step.content || `Execute step ${step.number}: ${step.title}`,
    });

    return {
      messages,
      model: context.executionOptions?.model || this.getDefaultModel(),
      addMessage: (msg: Message) => messages.push(msg),
    };
  }

  private getDefaultModel(): string {
    switch (this.provider.name) {
      case 'anthropic': return 'claude-3-opus-20240229';
      case 'openai': return 'gpt-4o';
      case 'gemini': return 'gemini-pro';
      default: return 'unknown';
    }
  }

  private parseResult(response: any, startTime: number): StepExecutionResult {
    return {
      success: true,
      output: response.content,
      duration: Date.now() - startTime,
      providerResponse: response,
      reflection: this.extractReflection(response.content),
    };
  }

  private extractReflection(content: string): StepExecutionResult['reflection'] | undefined {
    // Try to extract structured reflection from response
    // This could be enhanced with structured output schemas
    return undefined;
  }
}
```

### 3. Create Provider Factory

Create `riotplan/src/execution/providers.ts`:

```typescript
import { createAnthropicProvider } from '@riotprompt/execution-anthropic';
import { createOpenAIProvider } from '@riotprompt/execution-openai';
import { createGeminiProvider } from '@riotprompt/execution-gemini';
import { LLMProviderAdapter } from './llm-adapter.js';
import { HumanProvider } from './human.js';
import { CICDProvider } from './cicd.js';
import type { StepExecutionProvider } from './types.js';

/**
 * Create a step execution provider by ID
 */
export function createStepProvider(
  providerId: string
): StepExecutionProvider {
  switch (providerId) {
    case 'anthropic':
    case 'claude':
      return new LLMProviderAdapter(createAnthropicProvider(), {
        id: 'anthropic',
        name: 'Anthropic Claude',
      });

    case 'openai':
    case 'gpt':
      return new LLMProviderAdapter(createOpenAIProvider(), {
        id: 'openai',
        name: 'OpenAI GPT',
      });

    case 'gemini':
    case 'google':
      return new LLMProviderAdapter(createGeminiProvider(), {
        id: 'gemini',
        name: 'Google Gemini',
      });

    case 'human':
      return new HumanProvider();

    case 'cicd':
      return new CICDProvider();

    default:
      throw new Error(`Unknown provider: ${providerId}`);
  }
}

/**
 * Get all available providers
 */
export async function getAvailableProviders(): Promise<StepExecutionProvider[]> {
  const allProviders = [
    createStepProvider('anthropic'),
    createStepProvider('openai'),
    createStepProvider('gemini'),
    createStepProvider('human'),
  ];

  const available: StepExecutionProvider[] = [];
  for (const provider of allProviders) {
    if (await provider.isAvailable()) {
      available.push(provider);
    }
  }

  return available;
}

/**
 * Parse executor string (e.g., "anthropic:claude-3-opus")
 */
export function parseExecutorConfig(
  executor: string
): { provider: string; model?: string } {
  const [provider, model] = executor.split(':');
  return { provider, model };
}
```

### 4. Implement Built-in Providers

Create `riotplan/src/execution/human.ts`:

```typescript
import type { 
  StepExecutionProvider, 
  StepExecutionContext, 
  StepExecutionResult,
  ProviderCapabilities 
} from './types.js';
import type { PlanStep } from '../types.js';

/**
 * Human provider - prompts for human completion
 */
export class HumanProvider implements StepExecutionProvider {
  readonly id = 'human';
  readonly name = 'Human Executor';
  readonly capabilities: ProviderCapabilities = {
    codeExecution: true,
    research: true,
    interactive: true,
    requiresApiKey: false,
    toolCalling: false,
  };

  async isAvailable(): Promise<boolean> {
    return true; // Always available
  }

  async execute(
    step: PlanStep,
    context: StepExecutionContext
  ): Promise<StepExecutionResult> {
    const startTime = Date.now();

    context.onProgress?.({
      phase: 'executing',
      message: 'Waiting for human completion...',
    });

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Step ${step.number}: ${step.title}`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\nThis step requires human execution.`);
    console.log(`See: ${step.filePath}`);
    console.log(`\nMark as complete when done.`);

    // In CLI context, this would prompt for confirmation
    // For now, return pending result
    return {
      success: false,
      output: 'Step marked for human execution. Use `riotplan step complete` when done.',
      duration: Date.now() - startTime,
    };
  }
}
```

Create `riotplan/src/execution/cicd.ts`:

```typescript
import type { 
  StepExecutionProvider, 
  StepExecutionContext, 
  StepExecutionResult,
  ProviderCapabilities 
} from './types.js';
import type { PlanStep } from '../types.js';

/**
 * CI/CD provider - triggers external pipeline
 */
export class CICDProvider implements StepExecutionProvider {
  readonly id = 'cicd';
  readonly name = 'CI/CD Pipeline';
  readonly capabilities: ProviderCapabilities = {
    codeExecution: true,
    research: false,
    interactive: false,
    requiresApiKey: false,
    toolCalling: false,
  };

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async execute(
    step: PlanStep,
    context: StepExecutionContext
  ): Promise<StepExecutionResult> {
    const startTime = Date.now();

    // For now, just marks as pending external completion
    // Future: integrate with GitHub Actions, etc.
    return {
      success: false,
      output: 'CI/CD pipeline trigger not yet implemented. Mark as pending.',
      duration: Date.now() - startTime,
    };
  }
}
```

### 5. Provider Registry

Create `riotplan/src/execution/registry.ts`:

```typescript
import type { StepExecutionProvider } from './types.js';
import { createStepProvider } from './providers.js';

const providers: Map<string, StepExecutionProvider> = new Map();

/**
 * Register a custom provider
 */
export function registerProvider(provider: StepExecutionProvider): void {
  providers.set(provider.id, provider);
}

/**
 * Get provider by ID (creates if not registered)
 */
export function getProvider(id: string): StepExecutionProvider {
  if (!providers.has(id)) {
    providers.set(id, createStepProvider(id));
  }
  return providers.get(id)!;
}

/**
 * List all registered providers
 */
export function listProviders(): StepExecutionProvider[] {
  return Array.from(providers.values());
}

/**
 * Clear registry (for testing)
 */
export function clearProviders(): void {
  providers.clear();
}
```

### 6. Step Schema with Executor

Add executor parsing to step file loading:

```markdown
# Step 05: Implementation

**Executor**: anthropic:claude-3-opus
**Fallback**: human
**Reason**: Needs code generation capabilities
```

```typescript
export interface StepExecutorConfig {
  /** Provider ID */
  provider: string;
  
  /** Model (if applicable) */
  model?: string;
  
  /** Fallback if provider unavailable */
  fallback?: 'human' | 'skip' | 'block';
  
  /** Why this provider */
  reason?: string;
}
```

### 7. Export from Index

Update `riotplan/src/index.ts`:

```typescript
// Execution
export type {
  StepExecutionProvider,
  StepExecutionContext,
  StepExecutionResult,
  ProviderCapabilities,
  ExecutionProgress,
} from './execution/types.js';

export { LLMProviderAdapter } from './execution/llm-adapter.js';
export { HumanProvider } from './execution/human.js';
export { CICDProvider } from './execution/cicd.js';
export {
  createStepProvider,
  getAvailableProviders,
  parseExecutorConfig,
} from './execution/providers.js';
export {
  registerProvider,
  getProvider,
  listProviders,
} from './execution/registry.js';
```

## Acceptance Criteria

- [ ] `LLMProviderAdapter` wraps `@riotprompt/execution-*` providers
- [ ] `createStepProvider('anthropic')` returns working adapter
- [ ] `createStepProvider('openai')` returns working adapter
- [ ] `createStepProvider('gemini')` returns working adapter
- [ ] Human provider prompts for completion
- [ ] Provider registry works
- [ ] Step executor config parsed from step files
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/execution/providers.test.ts
import { describe, it, expect, vi } from 'vitest';
import { 
  createStepProvider, 
  getAvailableProviders,
  LLMProviderAdapter 
} from '../src/execution';

describe('Execution Providers', () => {
  describe('createStepProvider', () => {
    it('should create anthropic adapter', () => {
      const provider = createStepProvider('anthropic');
      expect(provider.id).toBe('anthropic');
      expect(provider).toBeInstanceOf(LLMProviderAdapter);
    });

    it('should create openai adapter', () => {
      const provider = createStepProvider('openai');
      expect(provider.id).toBe('openai');
    });

    it('should create human provider', () => {
      const provider = createStepProvider('human');
      expect(provider.id).toBe('human');
      expect(provider.capabilities.requiresApiKey).toBe(false);
    });
  });

  describe('LLMProviderAdapter', () => {
    it('should check availability via env var', async () => {
      const provider = createStepProvider('anthropic');
      
      // Without API key
      delete process.env.ANTHROPIC_API_KEY;
      expect(await provider.isAvailable()).toBe(false);
      
      // With API key
      process.env.ANTHROPIC_API_KEY = 'sk-test';
      expect(await provider.isAvailable()).toBe(true);
    });
  });
});
```

## Files Changed

- `riotplan/src/execution/types.ts` - Execution interfaces
- `riotplan/src/execution/llm-adapter.ts` - Provider adapter
- `riotplan/src/execution/providers.ts` - Provider factory
- `riotplan/src/execution/human.ts` - Human provider
- `riotplan/src/execution/cicd.ts` - CI/CD provider
- `riotplan/src/execution/registry.ts` - Provider registry
- `riotplan/src/index.ts` - Exports
- `riotplan/tests/execution/` - Tests

## Dependencies

- Step 02 (Plan Loading) - Parse executor config from step files
- `@riotprompt/execution` - Core interfaces
- `@riotprompt/execution-anthropic` - Anthropic provider
- `@riotprompt/execution-openai` - OpenAI provider
- `@riotprompt/execution-gemini` - Gemini provider

## Notes

- The `LLMProviderAdapter` wraps existing `@riotprompt/execution-*` providers
- This is the main **integration point** between riotprompt and riotplan
- Human provider is essential for mixed AI/human workflows
- Future: Add support for custom providers via plugin system

## References

- RIOTPLAN_ANALYSIS.md: R26 (Execution Providers)
- `execution/src/types.ts` - Base Provider interface
- `execution-anthropic/src/index.ts` - Anthropic implementation
