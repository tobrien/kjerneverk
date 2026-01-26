# Step 06: RiotPrompt CLI Extraction

## Objective

Create `riotprompt-cli` as a separate project that provides the command-line interface for prompt operations.

## Project Location

```
/Users/tobrien/gitw/kjerneverk/riotprompt-cli/
```

## Tasks

### 6.1 Create Project Directory

```bash
mkdir -p /Users/tobrien/gitw/kjerneverk/riotprompt-cli/src
cd /Users/tobrien/gitw/kjerneverk/riotprompt-cli
```

### 6.2 Create package.json

```json
{
  "name": "riotprompt-cli",
  "version": "0.0.1",
  "description": "CLI for RiotPrompt - create, process, and execute prompts",
  "type": "module",
  "bin": {
    "riotprompt": "./dist/cli.js"
  },
  "main": "./dist/cli.js",
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "start": "node dist/cli.js"
  },
  "keywords": ["cli", "prompt", "llm", "riotprompt"],
  "license": "Apache-2.0",
  "dependencies": {
    "riotprompt": "^1.0.0",
    "execution": "^0.0.1",
    "execution-openai": "^0.0.1",
    "execution-anthropic": "^0.0.1",
    "execution-gemini": "^0.0.1",
    "agentic": "^0.0.1",
    "commander": "^14.0.2",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^7.0.4",
    "rollup-plugin-preserve-shebang": "^1.0.1",
    "vitest": "^3.2.4"
  }
}
```

### 6.3 Copy CLI Source

```bash
cp /Users/tobrien/gitw/kjerneverk/riotprompt/src/cli.ts \
   /Users/tobrien/gitw/kjerneverk/riotprompt-cli/src/cli.ts
```

### 6.4 Update CLI Imports

Update `riotprompt-cli/src/cli.ts`:

```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';

// From riotprompt (core prompt modeling)
import { 
    cook, 
    Formatter, 
    Loader, 
    Serializer, 
    Writer 
} from 'riotprompt';

// From execution (interfaces)
import { 
    createRequest,
    getModelFamily 
} from 'execution';

// From execution providers (pick based on model)
import { OpenAIProvider } from 'execution-openai';
import { AnthropicProvider } from 'execution-anthropic';
import { GeminiProvider } from 'execution-gemini';

// From agentic (optional, for future agent command)
import { 
    ConversationBuilder, 
    ToolRegistry,
    IterationStrategyFactory
} from 'agentic';

config(); // Load .env

// ... rest of CLI implementation
```

### 6.5 Create ExecutionManager

Create `riotprompt-cli/src/execution-manager.ts`:

```typescript
import type { Provider, Request, ExecutionOptions, ProviderResponse } from 'execution';
import { getModelFamily } from 'execution';

// Dynamic provider loading
let openaiProvider: Provider | null = null;
let anthropicProvider: Provider | null = null;
let geminiProvider: Provider | null = null;

async function getProvider(model: string): Promise<Provider> {
    const family = getModelFamily(model);
    
    switch (family) {
        case 'openai':
            if (!openaiProvider) {
                const { OpenAIProvider } = await import('execution-openai');
                openaiProvider = new OpenAIProvider();
            }
            return openaiProvider;
            
        case 'anthropic':
            if (!anthropicProvider) {
                const { AnthropicProvider } = await import('execution-anthropic');
                anthropicProvider = new AnthropicProvider();
            }
            return anthropicProvider;
            
        case 'gemini':
            if (!geminiProvider) {
                const { GeminiProvider } = await import('execution-gemini');
                geminiProvider = new GeminiProvider();
            }
            return geminiProvider;
            
        default:
            throw new Error(`Unknown model family: ${family}`);
    }
}

export async function execute(
    request: Request, 
    options: ExecutionOptions = {}
): Promise<ProviderResponse> {
    const model = options.model || request.model;
    const provider = await getProvider(model);
    return provider.execute(request, options);
}
```

### 6.6 Update CLI Commands

**create command:**
```typescript
program
    .command('create <name>')
    .description('Create a new prompt structure')
    .option('--persona <text>', 'Initial persona')
    .option('--import <file>', 'Import from existing file')
    .action(async (name, options) => {
        await Writer.scaffold(name, options);
        console.log(`✅ Created prompt structure: ${name}`);
    });
```

**process command:**
```typescript
program
    .command('process <path>')
    .description('Process a prompt directory')
    .option('-m, --model <model>', 'Target model', 'gpt-4')
    .option('-f, --format <format>', 'Output format (text|json|xml)', 'text')
    .option('-o, --output <file>', 'Output file')
    .action(async (path, options) => {
        const prompt = await Loader.loadPrompt(path);
        const formatter = Formatter.create();
        
        let output: string;
        if (options.format === 'json') {
            output = Serializer.toJSON(prompt);
        } else if (options.format === 'xml') {
            output = Serializer.toXML(prompt);
        } else {
            const request = formatter.formatPrompt(options.model, prompt);
            output = JSON.stringify(request, null, 2);
        }
        
        if (options.output) {
            await Writer.write(options.output, output);
            console.log(`✅ Wrote to ${options.output}`);
        } else {
            console.log(output);
        }
    });
```

**execute command:**
```typescript
program
    .command('execute <path>')
    .description('Execute a prompt against an LLM')
    .option('-m, --model <model>', 'Model to use', 'gpt-4')
    .option('-k, --api-key <key>', 'API key (overrides env)')
    .option('-t, --temperature <temp>', 'Temperature', '0.7')
    .option('--max-tokens <n>', 'Max tokens')
    .option('--dry-run', 'Show request without executing')
    .action(async (path, options) => {
        const prompt = await Loader.loadPrompt(path);
        const formatter = Formatter.create();
        const request = formatter.formatPrompt(options.model, prompt);
        
        if (options.dryRun) {
            console.log('Request:', JSON.stringify(request, null, 2));
            return;
        }
        
        const response = await execute(request, {
            model: options.model,
            apiKey: options.apiKey,
            temperature: parseFloat(options.temperature),
            maxTokens: options.maxTokens ? parseInt(options.maxTokens) : undefined,
        });
        
        console.log(response.content);
    });
```

### 6.7 Create Vite Config

Create `riotprompt-cli/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { preserveShebang } from 'rollup-plugin-preserve-shebang';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/cli.ts',
            formats: ['es'],
            fileName: () => 'cli.js',
        },
        rollupOptions: {
            external: [
                'riotprompt',
                'execution',
                'execution-openai',
                'execution-anthropic',
                'execution-gemini',
                'agentic',
                'commander',
                'dotenv',
                /^node:/
            ],
            output: {
                banner: '#!/usr/bin/env node',
            },
        },
    },
    plugins: [preserveShebang()],
});
```

### 6.8 Create README

Create `riotprompt-cli/README.md`:

```markdown
# riotprompt-cli

Command-line interface for RiotPrompt.

## Installation

```bash
npm install -g riotprompt-cli
```

## Commands

### create

Create a new prompt structure:

```bash
riotprompt create my-prompt --persona "You are a helpful assistant"
```

### process

Process a prompt to different formats:

```bash
riotprompt process my-prompt -m gpt-4
riotprompt process my-prompt --format json -o prompt.json
```

### execute

Execute a prompt against an LLM:

```bash
riotprompt execute my-prompt -m gpt-4o
riotprompt execute my-prompt -m claude-3-opus -t 0.5
```

## Environment Variables

- `OPENAI_API_KEY` - For GPT models
- `ANTHROPIC_API_KEY` - For Claude models
- `GEMINI_API_KEY` - For Gemini models

## Configuration

Create `riotprompt.yaml` in your project root:

```yaml
defaultModel: "gpt-4o"
promptsDir: "./prompts"
outputDir: "./output"
```
```

### 6.9 Build and Test

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt-cli
npm install
npm run build
chmod +x dist/cli.js

# Test
./dist/cli.js --help
./dist/cli.js create test-prompt --persona "Test"
./dist/cli.js process test-prompt
rm -rf test-prompt
```

## Validation

- [ ] `npm run build` succeeds
- [ ] CLI is executable
- [ ] `riotprompt --help` works
- [ ] `riotprompt create` works
- [ ] `riotprompt process` works
- [ ] `riotprompt execute --dry-run` works
- [ ] Dynamic provider loading works

## Files Created

```
riotprompt-cli/
├── src/
│   ├── cli.ts
│   └── execution-manager.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Next Step

Proceed to `07-backward-compat.md`

