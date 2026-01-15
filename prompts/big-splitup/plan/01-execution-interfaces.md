# Step 01: Execution Interfaces

## Objective

Create the `execution` project with provider interfaces, model registry, and shared type definitions. This package has **no SDK dependencies** and defines the contracts that all providers implement.

## Project Location

```
/Users/tobrien/gitw/kjerneverk/execution/
```

## Tasks

### 1.1 Create Project Directory

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/execution/src
cd /Users/tobrien/gitw/kjerneverk/execution
```

### 1.2 Initialize Package

```bash
npm init -y
```

Create `package.json`:

```json
{
  "name": "execution",
  "version": "0.0.1",
  "description": "Execution interfaces and model configuration for LLM providers",
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
  "keywords": ["llm", "execution", "provider", "openai", "anthropic", "gemini"],
  "license": "Apache-2.0",
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^7.0.4",
    "vite-plugin-dts": "^4.5.4",
    "vitest": "^3.2.4"
  },
  "dependencies": {
    "zod": "^4.0.2"
  }
}
```

### 1.3 Extract Files from RiotPrompt

Copy from `/Users/tobrien/gitw/kjerneverk/riotprompt/src/`:

| Source | Destination |
|--------|-------------|
| `chat.ts` | `execution/src/chat.ts` |
| `model-config.ts` | `execution/src/model-config.ts` |
| `execution/provider.ts` | `execution/src/provider.ts` |
| `logger.ts` | `execution/src/logger.ts` |

### 1.4 Create Provider Interface

Create `execution/src/provider.ts`:

```typescript
import type { Request, Message, Model } from './chat';

export interface ExecutionOptions {
    model?: Model;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string | string[];
    tools?: any[];
    toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
    responseFormat?: any;
}

export interface ProviderResponse {
    content: string | null;
    model: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason?: string;
    toolCalls?: Array<{
        id: string;
        type: 'function';
        function: {
            name: string;
            arguments: string;
        };
    }>;
    raw?: any;
}

export interface Provider {
    name: string;
    execute(request: Request, options: ExecutionOptions): Promise<ProviderResponse>;
    supports(model: string): boolean;
}
```

### 1.5 Create Chat Types

Create `execution/src/chat.ts`:

```typescript
export type Role = "user" | "assistant" | "system" | "developer" | "tool";

export type Model = string;

export interface Message {
    role: Role;
    content: string | null;
    name?: string;
    tool_calls?: Array<{
        id: string;
        type: 'function';
        function: { name: string; arguments: string };
    }>;
    tool_call_id?: string;
}

export interface Request {
    messages: Message[];
    model: Model;
    responseFormat?: any;
    validator?: any;
}

export const createRequest = (model: Model): Request => ({
    model,
    messages: [],
});
```

### 1.6 Create Model Registry

Copy and adapt `model-config.ts` - remove any SDK-specific code, keep only:
- Model family detection
- Persona role mapping
- Encoding name mapping
- Tool support flags

### 1.7 Create Package Index

Create `execution/src/index.ts`:

```typescript
// Types
export type { Role, Model, Message, Request } from './chat';
export type { Provider, ProviderResponse, ExecutionOptions } from './provider';
export type { ModelConfig, PersonaRole, TokenizerEncoding } from './model-config';

// Functions
export { createRequest } from './chat';
export {
    ModelRegistry,
    getModelRegistry,
    resetModelRegistry,
    getPersonaRole,
    getEncoding,
    supportsToolCalls,
    getModelFamily,
    configureModel
} from './model-config';

// Logger (for shared use)
export { DEFAULT_LOGGER, wrapLogger } from './logger';
export type { Logger } from './logger';
```

### 1.8 Create Build Configuration

Create `execution/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

Create `execution/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'execution',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
            external: [/^node:/],
        },
    },
    plugins: [dts()],
});
```

### 1.9 Create README

Create `execution/README.md`:

```markdown
# execution

Execution interfaces and model configuration for LLM providers.

## Overview

This package provides:
- Provider interface contract
- Model configuration registry
- Shared types for LLM execution

## Installation

```bash
npm install execution
```

## Usage

```typescript
import { 
    Provider, 
    ExecutionOptions, 
    getModelFamily,
    getPersonaRole 
} from 'execution';

// Check model family
const family = getModelFamily('gpt-4o'); // 'openai'

// Get persona role for model
const role = getPersonaRole('claude-3-opus'); // 'system'
```

## Provider Interface

Implement the `Provider` interface to create a new provider:

```typescript
import { Provider, Request, ExecutionOptions, ProviderResponse } from 'execution';

class MyProvider implements Provider {
    name = 'my-provider';
    
    async execute(request: Request, options: ExecutionOptions): Promise<ProviderResponse> {
        // Implementation
    }
    
    supports(model: string): boolean {
        return model.startsWith('my-');
    }
}
```

## Related Packages

- `execution-openai` - OpenAI provider implementation
- `execution-anthropic` - Anthropic provider implementation
- `execution-gemini` - Gemini provider implementation
```

### 1.10 Initialize Git (Optional)

```bash
cd /Users/tobrien/gitw/kjerneverk/execution
git init
git add .
git commit -m "Initial commit: execution interfaces"
```

## Validation

- [ ] `npm install` succeeds
- [ ] `npm run build` produces dist/
- [ ] No external SDK dependencies
- [ ] Types export correctly
- [ ] README is accurate

## Files Created

```
execution/
├── src/
│   ├── index.ts
│   ├── chat.ts
│   ├── model-config.ts
│   ├── provider.ts
│   └── logger.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Next Step

Proceed to `02-execution-providers.md`

