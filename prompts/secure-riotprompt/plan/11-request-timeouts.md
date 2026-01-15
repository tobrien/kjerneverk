# Step 11: Request Timeouts

## Objective

Implement and enforce request timeouts for LLM calls and other external operations.

## Background

**Vulnerability Addressed:** Missing Request Timeouts (🟡 Medium)

LLM API calls can hang indefinitely if:
- Provider has an outage
- Network issues occur
- Rate limiting with long waits
- Model inference is extremely slow

This can cause resource exhaustion and poor user experience.

## Tasks

### 11.1 Create TimeoutGuard Class

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/timeout-guard.ts`:

```typescript
import { TimeoutConfig } from './types';
import { getAuditLogger, SecurityAuditLogger } from './audit-logger';

const DEFAULT_CONFIG: TimeoutConfig = {
  enabled: true,
  defaultTimeout: 30000,      // 30 seconds
  llmTimeout: 120000,         // 2 minutes
  toolTimeout: 30000,         // 30 seconds
  fileTimeout: 5000,          // 5 seconds
};

export class TimeoutGuard {
  private config: TimeoutConfig;
  private auditLogger: SecurityAuditLogger;

  constructor(config: Partial<TimeoutConfig> = {}, auditLogger?: SecurityAuditLogger) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.auditLogger = auditLogger || getAuditLogger();
  }

  /**
   * Wrap a promise with timeout
   */
  async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    operation: string
  ): Promise<T> {
    if (!this.config.enabled || timeoutMs <= 0) {
      return promise;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const result = await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            this.auditLogger.requestTimeout(operation, timeoutMs);
            reject(new TimeoutError(`Operation "${operation}" timed out after ${timeoutMs}ms`));
          });
        }),
      ]);
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Wrap an LLM call with appropriate timeout
   */
  async withLLMTimeout<T>(promise: Promise<T>, operation: string = 'llm-call'): Promise<T> {
    return this.withTimeout(promise, this.config.llmTimeout, operation);
  }

  /**
   * Wrap a tool execution with appropriate timeout
   */
  async withToolTimeout<T>(promise: Promise<T>, toolName: string): Promise<T> {
    return this.withTimeout(promise, this.config.toolTimeout, `tool:${toolName}`);
  }

  /**
   * Wrap a file operation with appropriate timeout
   */
  async withFileTimeout<T>(promise: Promise<T>, operation: string = 'file-operation'): Promise<T> {
    return this.withTimeout(promise, this.config.fileTimeout, operation);
  }

  /**
   * Create an AbortController with timeout
   */
  createAbortController(timeoutMs: number, operation: string): AbortController {
    const controller = new AbortController();
    
    setTimeout(() => {
      if (!controller.signal.aborted) {
        this.auditLogger.requestTimeout(operation, timeoutMs);
        controller.abort(new TimeoutError(`Operation "${operation}" timed out`));
      }
    }, timeoutMs);

    return controller;
  }

  /**
   * Get timeout for a specific operation type
   */
  getTimeout(type: 'default' | 'llm' | 'tool' | 'file'): number {
    switch (type) {
      case 'llm': return this.config.llmTimeout;
      case 'tool': return this.config.toolTimeout;
      case 'file': return this.config.fileTimeout;
      default: return this.config.defaultTimeout;
    }
  }
}

/**
 * Custom timeout error for identification
 */
export class TimeoutError extends Error {
  readonly isTimeout = true;

  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Global instance
let globalTimeoutGuard: TimeoutGuard | null = null;

export function getTimeoutGuard(): TimeoutGuard {
  if (!globalTimeoutGuard) {
    globalTimeoutGuard = new TimeoutGuard();
  }
  return globalTimeoutGuard;
}

export function configureTimeoutGuard(config: Partial<TimeoutConfig>): void {
  globalTimeoutGuard = new TimeoutGuard(config);
}
```

### 11.2 Update Execution Providers

Modify each execution provider to use TimeoutGuard:

```typescript
// In execution-openai/src/index.ts
import { getTimeoutGuard, TimeoutGuard, TimeoutError } from '@riotprompt/security';

export class OpenAIProvider implements Provider {
  private timeoutGuard: TimeoutGuard;

  constructor(timeoutGuard?: TimeoutGuard) {
    this.timeoutGuard = timeoutGuard || getTimeoutGuard();
  }

  async execute(request: Request, options: ExecutionOptions = {}): Promise<ProviderResponse> {
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API key is required');

    const client = new OpenAI({ apiKey });
    const model = options.model || request.model || 'gpt-4';

    // Determine timeout
    const timeout = options.timeout || this.timeoutGuard.getTimeout('llm');

    try {
      // Create AbortController for the request
      const controller = this.timeoutGuard.createAbortController(timeout, 'openai-chat');

      const response = await client.chat.completions.create({
        model,
        messages: /* ... */,
        // Pass abort signal if SDK supports it
        signal: controller.signal,
      });

      return { /* ... */ };
    } catch (error) {
      if (error instanceof TimeoutError) {
        // Re-throw with provider context
        throw new Error(`OpenAI request timed out after ${timeout}ms`);
      }
      throw error;
    }
  }
}
```

### 11.3 Update Iteration Strategy

Ensure iteration strategy uses timeouts for LLM calls.

### 11.4 Document Timeout Configuration

Add documentation for timeout configuration.

## Acceptance Criteria

- [ ] TimeoutGuard class implemented
- [ ] Custom TimeoutError class for identification
- [ ] Integration with all execution providers
- [ ] Integration with iteration strategy
- [ ] Configurable timeouts per operation type
- [ ] AbortController integration where supported
- [ ] Audit logging of timeouts
- [ ] Unit tests pass
- [ ] Integration tests pass

## Testing

```typescript
describe('TimeoutGuard', () => {
  it('should timeout slow operations', async () => {
    const guard = new TimeoutGuard({ defaultTimeout: 100 });
    
    const slowPromise = new Promise(resolve => setTimeout(resolve, 5000));
    
    await expect(guard.withTimeout(slowPromise, 100, 'test'))
      .rejects.toThrow(TimeoutError);
  });

  it('should allow fast operations', async () => {
    const guard = new TimeoutGuard();
    
    const fastPromise = Promise.resolve('done');
    
    await expect(guard.withTimeout(fastPromise, 1000, 'test'))
      .resolves.toBe('done');
  });

  it('should use operation-specific timeouts', () => {
    const guard = new TimeoutGuard({
      llmTimeout: 120000,
      toolTimeout: 30000,
    });
    
    expect(guard.getTimeout('llm')).toBe(120000);
    expect(guard.getTimeout('tool')).toBe(30000);
  });
});
```

## Files Changed

- `riotprompt/src/security/timeout-guard.ts` (new)
- `execution-openai/src/index.ts` (modified)
- `execution-anthropic/src/index.ts` (modified)
- `execution-gemini/src/index.ts` (modified)
- `riotprompt/src/iteration-strategy.ts` (modified)
- `riotprompt/src/security/index.ts` (modified)

## Notes

Timeout configuration should balance:
- User experience (don't timeout too quickly)
- Resource usage (don't wait forever)
- Provider capabilities (some models are slower)

Default recommendations:
- LLM calls: 2 minutes (large models can be slow)
- Tool execution: 30 seconds (should be fast)
- File operations: 5 seconds (should be very fast)

