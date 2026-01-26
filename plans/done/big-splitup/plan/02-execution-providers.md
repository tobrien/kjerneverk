# Step 02: Execution Providers

## Objective

Create three separate provider packages: `execution-openai`, `execution-anthropic`, and `execution-gemini`. Each package depends only on `execution` (for interfaces) and its respective SDK.

## Projects to Create

```
/Users/tobrien/gitw/kjerneverk/execution-openai/
/Users/tobrien/gitw/kjerneverk/execution-anthropic/
/Users/tobrien/gitw/kjerneverk/execution-gemini/
```

---

## 2A: execution-openai

### 2A.1 Create Project

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/execution-openai/src
cd /Users/tobrien/gitw/kjerneverk/execution-openai
```

### 2A.2 Create package.json

```json
{
  "name": "execution-openai",
  "version": "0.0.1",
  "description": "OpenAI provider for execution",
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
    "test": "vitest run"
  },
  "keywords": ["llm", "openai", "gpt", "execution"],
  "license": "Apache-2.0",
  "dependencies": {
    "openai": "^6.15.0",
    "tiktoken": "^1.0.22"
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

### 2A.3 Extract OpenAI Provider

Copy from `riotprompt/src/execution/openai.ts` to `execution-openai/src/openai.ts`

Update imports:
```typescript
import type { Provider, Request, ExecutionOptions, ProviderResponse } from 'execution';
```

### 2A.4 Create Index

```typescript
// execution-openai/src/index.ts
export { OpenAIProvider } from './openai';
export { createOpenAIClient } from './client';
```

### 2A.5 Create README

```markdown
# execution-openai

OpenAI provider implementation for the execution interface.

## Installation

```bash
npm install execution execution-openai
```

## Usage

```typescript
import { OpenAIProvider } from 'execution-openai';

const provider = new OpenAIProvider();

const response = await provider.execute(request, {
    model: 'gpt-4o',
    temperature: 0.7,
});
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key

## Supported Models

- GPT-4, GPT-4o, GPT-4-turbo
- GPT-3.5-turbo
- o1 series
```

---

## 2B: execution-anthropic

### 2B.1 Create Project

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/execution-anthropic/src
cd /Users/tobrien/gitw/kjerneverk/execution-anthropic
```

### 2B.2 Create package.json

```json
{
  "name": "execution-anthropic",
  "version": "0.0.1",
  "description": "Anthropic provider for execution",
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
    "test": "vitest run"
  },
  "keywords": ["llm", "anthropic", "claude", "execution"],
  "license": "Apache-2.0",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.71.2"
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

### 2B.3 Extract Anthropic Provider

Copy from `riotprompt/src/execution/anthropic.ts` to `execution-anthropic/src/anthropic.ts`

Update imports to use `execution` package.

### 2B.4 Create README

```markdown
# execution-anthropic

Anthropic (Claude) provider implementation for the execution interface.

## Installation

```bash
npm install execution execution-anthropic
```

## Usage

```typescript
import { AnthropicProvider } from 'execution-anthropic';

const provider = new AnthropicProvider();

const response = await provider.execute(request, {
    model: 'claude-3-opus-20240229',
    temperature: 0.7,
});
```

## Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key

## Supported Models

- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku
```

---

## 2C: execution-gemini

### 2C.1 Create Project

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/execution-gemini/src
cd /Users/tobrien/gitw/kjerneverk/execution-gemini
```

### 2C.2 Create package.json

```json
{
  "name": "execution-gemini",
  "version": "0.0.1",
  "description": "Google Gemini provider for execution",
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
    "test": "vitest run"
  },
  "keywords": ["llm", "gemini", "google", "execution"],
  "license": "Apache-2.0",
  "dependencies": {
    "@google/generative-ai": "^0.24.1"
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

### 2C.3 Extract Gemini Provider

Copy from `riotprompt/src/execution/gemini.ts` to `execution-gemini/src/gemini.ts`

Update imports to use `execution` package.

### 2C.4 Create README

```markdown
# execution-gemini

Google Gemini provider implementation for the execution interface.

## Installation

```bash
npm install execution execution-gemini
```

## Usage

```typescript
import { GeminiProvider } from 'execution-gemini';

const provider = new GeminiProvider();

const response = await provider.execute(request, {
    model: 'gemini-1.5-pro',
    temperature: 0.7,
});
```

## Environment Variables

- `GEMINI_API_KEY` - Your Google AI Studio API key

## Supported Models

- Gemini 1.5 Pro
- Gemini 1.5 Flash
```

---

## Validation

For each provider package:

- [ ] `npm install` succeeds
- [ ] `npm run build` produces dist/
- [ ] Provider correctly implements interface
- [ ] Can be installed without other providers
- [ ] Tests pass (mocked API calls)

## Dependency Check

```
execution-openai:
  ├── execution (peer)
  ├── openai
  └── tiktoken

execution-anthropic:
  ├── execution (peer)
  └── @anthropic-ai/sdk

execution-gemini:
  ├── execution (peer)
  └── @google/generative-ai
```

No cross-provider dependencies!

## Files Created

```
execution-openai/
├── src/
│   ├── index.ts
│   └── openai.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

execution-anthropic/
├── src/
│   ├── index.ts
│   └── anthropic.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

execution-gemini/
├── src/
│   ├── index.ts
│   └── gemini.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Next Step

Proceed to `03-agentic-extraction.md`

