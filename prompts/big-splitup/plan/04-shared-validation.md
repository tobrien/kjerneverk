# Step 04: Shared Library Validation

## Objective

Validate that all shared libraries (`execution`, `execution-*`, `agentic`) work correctly both independently and together before modifying riotprompt.

## Tasks

### 4.1 Build All Shared Libraries

```bash
cd /Users/tobrien/gitw/kjerneverk/execution
npm install && npm run build

cd /Users/tobrien/gitw/kjerneverk/execution-openai
npm install && npm run build

cd /Users/tobrien/gitw/kjerneverk/execution-anthropic
npm install && npm run build

cd /Users/tobrien/gitw/kjerneverk/execution-gemini
npm install && npm run build

cd /Users/tobrien/gitw/kjerneverk/agentic
npm install && npm run build
```

### 4.2 Run Individual Tests

```bash
cd /Users/tobrien/gitw/kjerneverk/execution && npm test
cd /Users/tobrien/gitw/kjerneverk/execution-openai && npm test
cd /Users/tobrien/gitw/kjerneverk/execution-anthropic && npm test
cd /Users/tobrien/gitw/kjerneverk/execution-gemini && npm test
cd /Users/tobrien/gitw/kjerneverk/agentic && npm test
```

### 4.3 Create Integration Test Project

Create a temporary test project to verify packages work together:

```bash
mkdir -p /tmp/shared-integration-test
cd /tmp/shared-integration-test
npm init -y
```

Link local packages:
```bash
npm link /Users/tobrien/gitw/kjerneverk/execution
npm link /Users/tobrien/gitw/kjerneverk/execution-openai
npm link /Users/tobrien/gitw/kjerneverk/agentic
```

### 4.4 Integration Test: execution + execution-openai

Create `test-execution.mjs`:

```javascript
import { getModelFamily, getPersonaRole, createRequest } from 'execution';
import { OpenAIProvider } from 'execution-openai';

// Test model detection
console.log('Model family for gpt-4o:', getModelFamily('gpt-4o'));
console.log('Persona role for gpt-4o:', getPersonaRole('gpt-4o'));

// Test request creation
const request = createRequest('gpt-4o');
console.log('Request created:', request);

// Test provider instantiation
const provider = new OpenAIProvider();
console.log('Provider name:', provider.name);
console.log('Supports gpt-4o:', provider.supports('gpt-4o'));

console.log('\n✅ execution + execution-openai integration works!');
```

Run: `node test-execution.mjs`

### 4.5 Integration Test: agentic + execution

Create `test-agentic.mjs`:

```javascript
import { ConversationBuilder, ToolRegistry, IterationStrategyFactory } from 'agentic';

// Test ConversationBuilder
const conversation = ConversationBuilder.create({ model: 'gpt-4o' })
    .addSystemMessage('You are a test assistant')
    .addUserMessage('Hello!')
    .build();

console.log('Conversation messages:', conversation.getMessageCount());

// Test ToolRegistry
const tools = ToolRegistry.create();
tools.register({
    name: 'test_tool',
    description: 'A test tool',
    parameters: {
        type: 'object',
        properties: {
            input: { type: 'string', description: 'Input' }
        }
    },
    execute: async ({ input }) => `Processed: ${input}`
});

console.log('Tool count:', tools.count());

// Test strategy
const strategy = IterationStrategyFactory.simple({ maxIterations: 5 });
console.log('Strategy name:', strategy.name);

console.log('\n✅ agentic + execution integration works!');
```

Run: `node test-agentic.mjs`

### 4.6 Integration Test: Full Stack

Create `test-full-stack.mjs`:

```javascript
import { getModelFamily, createRequest } from 'execution';
import { OpenAIProvider } from 'execution-openai';
import { ConversationBuilder, ToolRegistry } from 'agentic';

// Build a conversation
const conversation = ConversationBuilder.create({ model: 'gpt-4o' })
    .addSystemMessage('You are a helpful assistant')
    .addUserMessage('What is 2+2?')
    .build();

// Export messages
const messages = conversation.toMessages();
console.log('Messages:', messages.length);

// Create request
const request = createRequest('gpt-4o');
messages.forEach(m => request.messages.push(m));
console.log('Request model:', request.model);
console.log('Request messages:', request.messages.length);

// Get provider
const family = getModelFamily('gpt-4o');
console.log('Model family:', family);

const provider = new OpenAIProvider();
console.log('Provider ready:', provider.supports('gpt-4o'));

// Tools
const tools = ToolRegistry.create();
const openaiTools = tools.toOpenAIFormat();
console.log('Tools format:', openaiTools.length === 0 ? 'empty (ok)' : openaiTools);

console.log('\n✅ Full stack integration works!');
```

Run: `node test-full-stack.mjs`

### 4.7 Verify No Cross-Dependencies

Check that packages don't accidentally depend on each other incorrectly:

```bash
# execution should have NO dependencies on providers or agentic
cd /Users/tobrien/gitw/kjerneverk/execution
grep -r "execution-openai\|execution-anthropic\|execution-gemini\|agentic" src/

# Each provider should only depend on execution
cd /Users/tobrien/gitw/kjerneverk/execution-openai
grep -r "execution-anthropic\|execution-gemini\|agentic" src/

# agentic should only depend on execution
cd /Users/tobrien/gitw/kjerneverk/agentic
grep -r "execution-openai\|execution-anthropic\|execution-gemini\|riotprompt" src/
```

All should return no results.

### 4.8 Type Checking

```bash
cd /Users/tobrien/gitw/kjerneverk/execution && npx tsc --noEmit
cd /Users/tobrien/gitw/kjerneverk/execution-openai && npx tsc --noEmit
cd /Users/tobrien/gitw/kjerneverk/execution-anthropic && npx tsc --noEmit
cd /Users/tobrien/gitw/kjerneverk/execution-gemini && npx tsc --noEmit
cd /Users/tobrien/gitw/kjerneverk/agentic && npx tsc --noEmit
```

### 4.9 Bundle Size Check

```bash
# Check each package's dist size
du -sh /Users/tobrien/gitw/kjerneverk/execution/dist
du -sh /Users/tobrien/gitw/kjerneverk/execution-openai/dist
du -sh /Users/tobrien/gitw/kjerneverk/execution-anthropic/dist
du -sh /Users/tobrien/gitw/kjerneverk/execution-gemini/dist
du -sh /Users/tobrien/gitw/kjerneverk/agentic/dist
```

Expected sizes:
| Package | Expected |
|---------|----------|
| execution | ~20KB |
| execution-openai | ~15KB |
| execution-anthropic | ~15KB |
| execution-gemini | ~15KB |
| agentic | ~50KB |

## Validation Checklist

- [ ] All packages build successfully
- [ ] All package tests pass
- [ ] Integration tests pass
- [ ] No cross-dependencies
- [ ] TypeScript compiles without errors
- [ ] Bundle sizes are reasonable
- [ ] READMEs are accurate

## Rollback Point

Before proceeding to modify riotprompt, tag current state:

```bash
# In each project
git tag pre-riotprompt-integration
```

## Next Step

Proceed to `05-riotprompt-slim.md`

