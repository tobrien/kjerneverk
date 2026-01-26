# Step 16: Integration Testing

## Objective

Create integration tests that verify security across the full stack.

## Tasks

### 16.1 Create E2E Security Test Suite

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/tests/security/e2e/security-e2e.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as RiotPrompt from '../../../src/riotprompt';
import { PATH_TRAVERSAL_VECTORS, SENSITIVE_DATA_SAMPLES } from '../fixtures/attack-vectors';

describe('E2E Security Tests', () => {
  describe('Full Stack Path Security', () => {
    it('should block path traversal through loader', async () => {
      const loader = RiotPrompt.Loader.create({
        parameters: {},
      });

      for (const vector of PATH_TRAVERSAL_VECTORS.slice(0, 5)) {
        await expect(loader.load([vector])).rejects.toThrow();
      }
    });

    it('should block path traversal through CLI simulation', async () => {
      // Simulate CLI path handling
      const validator = RiotPrompt.createCLIValidator();
      
      for (const vector of PATH_TRAVERSAL_VECTORS) {
        expect(() => validator.validatePath(vector)).toThrow();
      }
    });
  });

  describe('Full Stack Secret Protection', () => {
    it('should redact secrets through entire pipeline', async () => {
      const logger = new RiotPrompt.ConversationLogger({
        enabled: true,
        redactSensitive: true,
      });

      for (const sample of SENSITIVE_DATA_SAMPLES) {
        logger.onMessageAdded({
          role: 'user',
          content: sample.input,
        });
      }

      const conversation = logger.getConversation();
      
      for (const message of conversation.messages) {
        for (const sample of SENSITIVE_DATA_SAMPLES) {
          // Ensure original sensitive data is not present
          expect(message.content).not.toContain(sample.input.match(/[\w-]{20,}/)?.[0]);
        }
      }
    });
  });

  describe('Full Stack Tool Security', () => {
    it('should validate tool parameters end-to-end', async () => {
      const registry = RiotPrompt.ToolRegistry.create()
        .withSecurity(new RiotPrompt.ToolGuard());

      const tool = {
        name: 'test_tool',
        description: 'Test tool',
        parameters: { type: 'object', properties: { path: { type: 'string' } } },
        schema: RiotPrompt.z.object({ path: RiotPrompt.z.string().min(1) }),
        execute: async (params: { path: string }) => params.path,
      };

      registry.register(tool);

      // Valid params should work
      await expect(registry.execute('test_tool', { path: 'valid' }))
        .resolves.toBe('valid');

      // Invalid params should fail
      await expect(registry.execute('test_tool', { path: '' }))
        .rejects.toThrow();
    });

    it('should timeout long-running tools', async () => {
      const sandbox = new RiotPrompt.ToolSandbox({ maxExecutionTime: 100 });
      
      const slowTool = {
        name: 'slow_tool',
        description: 'Slow tool',
        parameters: { type: 'object', properties: {} },
        execute: async () => new Promise(r => setTimeout(r, 5000)),
      };

      await expect(sandbox.execute(slowTool, {}, {}))
        .rejects.toThrow(/timeout/i);
    });
  });

  describe('Full Stack Error Handling', () => {
    it('should sanitize errors with secrets', () => {
      const sanitizer = RiotPrompt.getErrorSanitizer();
      
      const errorWithSecret = new Error(
        'Failed to connect with key sk-secret1234567890abcdefghijklmnop'
      );
      
      const { external } = sanitizer.sanitize(errorWithSecret);
      
      expect(external.message).not.toContain('sk-');
      expect(external.correlationId).toBeDefined();
    });
  });
});
```

### 16.2 Create Attack Simulation Tests

Create tests that simulate common attack scenarios:

```typescript
describe('Attack Simulation Tests', () => {
  describe('Prompt Injection via Tool', () => {
    it('should not execute malicious tool parameters', async () => {
      const guard = new RiotPrompt.ToolGuard();
      
      // Simulate LLM returning malicious parameters
      const maliciousJson = JSON.stringify({
        command: 'rm -rf /',
        __proto__: { polluted: true },
      });
      
      const result = guard.parseToolArguments('exec_tool', maliciousJson);
      expect(result.success).toBe(false);
    });
  });

  describe('Directory Traversal via Context', () => {
    it('should not allow context from outside base path', async () => {
      const pathGuard = new RiotPrompt.PathGuard({
        basePaths: ['/app/prompts'],
      });
      
      expect(pathGuard.validate('/app/prompts/../../etc/passwd').valid).toBe(false);
      expect(pathGuard.validate('../../../etc/passwd').valid).toBe(false);
    });
  });
});
```

### 16.3 Create Performance Impact Tests

Measure security overhead:

```typescript
describe('Security Performance Impact', () => {
  it('should have minimal overhead for path validation', () => {
    const guard = new RiotPrompt.PathGuard({ basePaths: ['/app'] });
    const iterations = 10000;
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      guard.validate('subdir/file.txt');
    }
    const duration = performance.now() - start;
    
    const avgMs = duration / iterations;
    expect(avgMs).toBeLessThan(0.1); // < 0.1ms per validation
  });

  it('should have minimal overhead for secret redaction', () => {
    const guard = new RiotPrompt.SecretGuard();
    const testContent = 'This is a test with api_key=secret123 content';
    const iterations = 10000;
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      guard.redact(testContent, 'test');
    }
    const duration = performance.now() - start;
    
    const avgMs = duration / iterations;
    expect(avgMs).toBeLessThan(0.5); // < 0.5ms per redaction
  });
});
```

### 16.4 Create Regression Test Suite

Ensure fixes stay fixed:

```typescript
describe('Security Regression Tests', () => {
  // Each fixed vulnerability gets a test
  
  it('CVE-equivalent: Tool parameter validation bypass', () => {
    // Test that the fix remains in place
  });

  it('CVE-equivalent: Path traversal in loader', () => {
    // Test that the fix remains in place
  });
  
  // etc.
});
```

## Acceptance Criteria

- [ ] E2E security test suite created
- [ ] Attack simulation tests
- [ ] Performance impact tests
- [ ] Regression test suite
- [ ] All tests pass
- [ ] Performance overhead acceptable (<1% typical)
- [ ] Test coverage for security features >80%

## Files Changed

- `riotprompt/tests/security/e2e/security-e2e.test.ts` (new)
- `riotprompt/tests/security/attacks/attack-simulation.test.ts` (new)
- `riotprompt/tests/security/performance/security-performance.test.ts` (new)
- `riotprompt/tests/security/regression/security-regression.test.ts` (new)

