# Step 07: Backward Compatibility Testing

## Objective

Ensure existing code that uses `riotprompt` continues to work without any modifications. All public APIs must remain accessible.

## Tasks

### 7.1 Create Compatibility Test Suite

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/tests/backward-compat.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import * as RiotPrompt from '../src/riotprompt';

describe('Backward Compatibility', () => {
    describe('Core Prompt Exports (Local)', () => {
        it('exports createContent', () => {
            expect(RiotPrompt.createContent).toBeDefined();
        });
        
        it('exports createContext', () => {
            expect(RiotPrompt.createContext).toBeDefined();
        });
        
        it('exports createInstruction', () => {
            expect(RiotPrompt.createInstruction).toBeDefined();
        });
        
        it('exports createSection', () => {
            expect(RiotPrompt.createSection).toBeDefined();
        });
        
        it('exports createPrompt', () => {
            expect(RiotPrompt.createPrompt).toBeDefined();
        });
        
        it('exports Formatter module', () => {
            expect(RiotPrompt.Formatter).toBeDefined();
            expect(RiotPrompt.Formatter.create).toBeDefined();
        });
        
        it('exports Parser module', () => {
            expect(RiotPrompt.Parser).toBeDefined();
        });
        
        it('exports Loader module', () => {
            expect(RiotPrompt.Loader).toBeDefined();
        });
        
        it('exports Serializer module', () => {
            expect(RiotPrompt.Serializer).toBeDefined();
        });
        
        it('exports cook function', () => {
            expect(RiotPrompt.cook).toBeDefined();
            expect(typeof RiotPrompt.cook).toBe('function');
        });
        
        it('exports registerTemplates', () => {
            expect(RiotPrompt.registerTemplates).toBeDefined();
        });
    });
    
    describe('Execution Re-exports', () => {
        it('exports getModelFamily', () => {
            expect(RiotPrompt.getModelFamily).toBeDefined();
            expect(RiotPrompt.getModelFamily('gpt-4o')).toBe('openai');
        });
        
        it('exports getPersonaRole', () => {
            expect(RiotPrompt.getPersonaRole).toBeDefined();
        });
        
        it('exports createRequest', () => {
            expect(RiotPrompt.createRequest).toBeDefined();
        });
        
        it('exports ModelRegistry', () => {
            expect(RiotPrompt.ModelRegistry).toBeDefined();
        });
    });
    
    describe('Agentic Re-exports', () => {
        it('exports ConversationBuilder', () => {
            expect(RiotPrompt.ConversationBuilder).toBeDefined();
            expect(RiotPrompt.ConversationBuilder.create).toBeDefined();
        });
        
        it('exports ToolRegistry', () => {
            expect(RiotPrompt.ToolRegistry).toBeDefined();
            expect(RiotPrompt.ToolRegistry.create).toBeDefined();
        });
        
        it('exports IterationStrategyFactory', () => {
            expect(RiotPrompt.IterationStrategyFactory).toBeDefined();
        });
        
        it('exports TokenBudgetManager', () => {
            expect(RiotPrompt.TokenBudgetManager).toBeDefined();
        });
        
        it('exports MetricsCollector', () => {
            expect(RiotPrompt.MetricsCollector).toBeDefined();
        });
    });
});
```

### 7.2 Test Common Usage Patterns

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/tests/usage-patterns.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { 
    cook, 
    Formatter, 
    ConversationBuilder, 
    ToolRegistry,
    registerTemplates,
    clearTemplates
} from '../src/riotprompt';

describe('Usage Patterns', () => {
    it('README example: basic cook', async () => {
        const prompt = await cook({
            basePath: __dirname,
            persona: { content: 'You are a helpful AI assistant' },
        });
        
        expect(prompt.persona).toBeDefined();
        expect(prompt.persona?.content).toContain('helpful');
    });
    
    it('README example: template registration', async () => {
        clearTemplates();
        
        registerTemplates({
            'analysis': {
                persona: { content: 'You are an expert analyst' },
                instructions: [{ content: 'Provide detailed analysis' }],
            },
        });
        
        const prompt = await cook({
            basePath: __dirname,
            template: 'analysis',
        });
        
        expect(prompt.persona?.content).toContain('analyst');
    });
    
    it('Conversation creation from prompt', async () => {
        const prompt = await cook({
            basePath: __dirname,
            persona: { content: 'Test' },
        });
        
        const conversation = ConversationBuilder.create({ model: 'gpt-4o' })
            .fromPrompt(prompt)
            .addUserMessage('Hello')
            .build();
        
        expect(conversation.getMessageCount()).toBeGreaterThan(0);
    });
    
    it('Tool registration and export', () => {
        const registry = ToolRegistry.create();
        
        registry.register({
            name: 'test',
            description: 'Test tool',
            parameters: {
                type: 'object',
                properties: {},
            },
            execute: async () => 'result',
        });
        
        const openai = registry.toOpenAIFormat();
        expect(openai[0].function.name).toBe('test');
    });
    
    it('Formatter works with prompts', async () => {
        const prompt = await cook({
            basePath: __dirname,
            persona: { content: 'Test persona' },
            instructions: [{ content: 'Test instruction' }],
        });
        
        const formatter = Formatter.create();
        const request = formatter.formatPrompt('gpt-4o', prompt);
        
        expect(request.messages.length).toBeGreaterThan(0);
        expect(request.model).toBe('gpt-4o');
    });
});
```

### 7.3 Test TypeScript Types

Create type compatibility test:

```typescript
// tests/types.test.ts
import { describe, it, expectTypeOf } from 'vitest';
import type {
    Prompt,
    Content,
    Section,
    ConversationMessage,
    Tool,
    Model,
    Request,
} from '../src/riotprompt';

describe('Type Exports', () => {
    it('Prompt type', () => {
        const prompt: Prompt = {
            persona: { type: 'content', content: 'test' },
        };
        expectTypeOf(prompt).toMatchTypeOf<Prompt>();
    });
    
    it('ConversationMessage type', () => {
        const msg: ConversationMessage = {
            role: 'user',
            content: 'test',
        };
        expectTypeOf(msg).toMatchTypeOf<ConversationMessage>();
    });
    
    it('Tool type', () => {
        const tool: Tool = {
            name: 'test',
            description: 'test',
            parameters: { type: 'object', properties: {} },
            execute: async () => 'result',
        };
        expectTypeOf(tool).toMatchTypeOf<Tool>();
    });
});
```

### 7.4 Test Fresh Installation

Create a test project:

```bash
mkdir /tmp/riotprompt-compat-test
cd /tmp/riotprompt-compat-test
npm init -y

# Link local packages
npm link /Users/tobrien/gitw/kjerneverk/execution
npm link /Users/tobrien/gitw/kjerneverk/agentic
npm link /Users/tobrien/gitw/kjerneverk/riotprompt
```

Create `test.mjs`:

```javascript
import { cook, Formatter, ConversationBuilder, ToolRegistry } from 'riotprompt';

// Test cook
const prompt = await cook({
    basePath: process.cwd(),
    persona: { content: 'Test persona' },
});
console.log('✅ cook works:', prompt.persona.content);

// Test formatter
const formatter = Formatter.create();
const request = formatter.formatPrompt('gpt-4o', prompt);
console.log('✅ Formatter works:', request.messages.length, 'messages');

// Test ConversationBuilder
const conv = ConversationBuilder.create({ model: 'gpt-4o' })
    .addSystemMessage('System')
    .addUserMessage('User')
    .build();
console.log('✅ ConversationBuilder works:', conv.getMessageCount(), 'messages');

// Test ToolRegistry
const tools = ToolRegistry.create();
tools.register({
    name: 'test',
    description: 'Test',
    parameters: { type: 'object', properties: {} },
    execute: async () => 'ok'
});
console.log('✅ ToolRegistry works:', tools.count(), 'tools');

console.log('\n🎉 All backward compatibility tests pass!');
```

Run: `node test.mjs`

### 7.5 Run Full Test Suite

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm test
```

Ensure all tests pass.

### 7.6 Document Any Differences

If any APIs changed behavior (not just location), document:

```markdown
## API Changes in 1.0.0

### Moved (No Breaking Change)
- Execution providers now in separate packages
- Agentic features now in `agentic` package
- All still accessible via `import from 'riotprompt'`

### Changed Behavior
- None

### Deprecated
- None

### Removed
- CLI (now in `riotprompt-cli` package)
```

## Validation Checklist

- [ ] All backward-compat tests pass
- [ ] Usage pattern tests pass
- [ ] Type tests pass
- [ ] Fresh installation test works
- [ ] Full test suite passes
- [ ] No console warnings about deprecations

## Next Step

Proceed to `08-riotplan-stub.md`

