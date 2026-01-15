# Step 05: Tool Execution Sandboxing

## Objective

Implement configurable sandboxing for tool execution to restrict what tools can access and do.

## Architectural Decision

**This feature belongs in `agentic`, not `riotprompt`.**

Like `ToolGuard`, sandboxing is an *execution-time* concern for agentic AI workflows. It directly extends the tool execution model already present in `agentic`:
- Works alongside `ToolRegistry` and `ToolGuard`
- Extends `ToolContext` with sandbox capabilities
- Reuses `agentic`'s logging infrastructure

Placing sandboxing in `agentic` ensures any project using it for tool orchestration benefits from these security features automatically.

## Background

**Vulnerability Addressed:** Tool Execution Without Sandboxing (🔴 Critical)

Tools registered with `ToolRegistry` can execute arbitrary user-provided functions. There's no restriction on what these functions can access (file system, network, process, etc.). This creates severe risks when tools are called with LLM-generated arguments.

## Approach

True sandboxing in Node.js is difficult without process isolation. This implementation provides **capability-based restrictions**:
- Configurable context that limits what's passed to tools
- Execution timeout enforcement
- Concurrent execution limits
- Pre/post execution hooks for custom restrictions

For stricter sandboxing, users can implement tools that run in separate processes/containers.

## Tasks

### 5.1 Create ToolSandbox Class

Create `/Users/tobrien/gitw/kjerneverk/agentic/src/tool-sandbox.ts`:

```typescript
import { ToolContext, Tool } from './tools';
import { ToolSecurityConfig } from './tool-guard';
import { DEFAULT_LOGGER, wrapLogger, type Logger } from './logger';

export interface SandboxedContext extends ToolContext {
  // Restricted capabilities
  readonly sandbox: {
    allowedOperations: Set<string>;
    maxOutputSize: number;
    executionId: string;
  };
}

export interface SandboxOptions {
  maxExecutionTime: number;
  maxOutputSize: number;
  allowedOperations?: string[];
  onBeforeExecution?: (tool: Tool, params: unknown) => void | Promise<void>;
  onAfterExecution?: (tool: Tool, result: unknown, error?: Error) => void | Promise<void>;
}

export interface ToolSandboxEvents {
  onConcurrencyExceeded?: (toolName: string, activeCount: number) => void;
  onTimeout?: (toolName: string, timeoutMs: number) => void;
  onOutputSizeExceeded?: (toolName: string, size: number, maxSize: number) => void;
  onCancelled?: (executionId: string) => void;
}

export class ToolSandbox {
  private config: ToolSecurityConfig;
  private logger: Logger;
  private events: ToolSandboxEvents;
  private activeExecutions: Map<string, AbortController> = new Map();
  private executionCount: number = 0;

  constructor(
    config: Partial<ToolSecurityConfig> = {},
    logger?: Logger,
    events: ToolSandboxEvents = {}
  ) {
    this.config = {
      enabled: true,
      validateParams: true,
      sandboxExecution: true,
      maxExecutionTime: 30000,
      maxConcurrentCalls: 10,
      deniedTools: [],
      ...config,
    };
    this.logger = wrapLogger(logger || DEFAULT_LOGGER, 'ToolSandbox');
    this.events = events;
  }

  /**
   * Execute a tool with sandbox restrictions
   */
  async execute<T>(
    tool: Tool,
    params: unknown,
    baseContext: ToolContext,
    options: Partial<SandboxOptions> = {}
  ): Promise<T> {
    if (!this.config.enabled || !this.config.sandboxExecution) {
      // Bypass sandboxing if disabled
      return tool.execute(params, baseContext);
    }

    // Check concurrent execution limit
    if (this.activeExecutions.size >= this.config.maxConcurrentCalls) {
      this.logger.warn('Max concurrent executions reached', {
        toolName: tool.name,
        activeCount: this.activeExecutions.size,
        limit: this.config.maxConcurrentCalls,
      });
      this.events.onConcurrencyExceeded?.(tool.name, this.activeExecutions.size);
      throw new Error('Too many concurrent tool executions');
    }

    const executionId = `exec-${++this.executionCount}-${Date.now()}`;
    const controller = new AbortController();
    this.activeExecutions.set(executionId, controller);

    const sandboxedContext: SandboxedContext = {
      ...baseContext,
      sandbox: {
        allowedOperations: new Set(options.allowedOperations || []),
        maxOutputSize: options.maxOutputSize || 1024 * 1024, // 1MB default
        executionId,
      },
    };

    const timeout = options.maxExecutionTime || this.config.maxExecutionTime;

    try {
      // Pre-execution hook
      await options.onBeforeExecution?.(tool, params);

      // Execute with timeout
      const result = await this.executeWithTimeout(
        () => tool.execute(params, sandboxedContext),
        timeout,
        controller.signal,
        tool.name
      );

      // Check output size
      const outputSize = this.estimateSize(result);
      if (outputSize > sandboxedContext.sandbox.maxOutputSize) {
        this.logger.warn('Tool output exceeded max size', {
          toolName: tool.name,
          outputSize,
          maxSize: sandboxedContext.sandbox.maxOutputSize,
        });
        this.events.onOutputSizeExceeded?.(
          tool.name,
          outputSize,
          sandboxedContext.sandbox.maxOutputSize
        );
        throw new Error('Tool output exceeded maximum size limit');
      }

      // Post-execution hook
      await options.onAfterExecution?.(tool, result);

      return result as T;
    } catch (error) {
      await options.onAfterExecution?.(tool, undefined, error as Error);
      throw error;
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Cancel all active executions
   */
  cancelAll(): void {
    for (const [id, controller] of this.activeExecutions) {
      controller.abort();
      this.logger.info('Execution cancelled', { executionId: id });
      this.events.onCancelled?.(id);
    }
    this.activeExecutions.clear();
  }

  /**
   * Get active execution count
   */
  getActiveCount(): number {
    return this.activeExecutions.size;
  }

  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    signal: AbortSignal,
    toolName: string
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.logger.warn('Tool execution timed out', { toolName, timeoutMs });
        this.events.onTimeout?.(toolName, timeoutMs);
        reject(new Error(`Tool execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      const abortHandler = () => {
        clearTimeout(timeoutId);
        reject(new Error('Tool execution was cancelled'));
      };
      signal.addEventListener('abort', abortHandler, { once: true });

      fn()
        .then(result => {
          clearTimeout(timeoutId);
          signal.removeEventListener('abort', abortHandler);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          signal.removeEventListener('abort', abortHandler);
          reject(error);
        });
    });
  }

  private estimateSize(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') return value.length * 2; // UTF-16
    if (typeof value === 'number') return 8;
    if (typeof value === 'boolean') return 4;
    if (Buffer.isBuffer(value)) return value.length;
    return JSON.stringify(value).length * 2;
  }
}
```

### 5.2 Create Secure Tool Wrappers

Add utility function to `agentic/src/tool-sandbox.ts` for wrapping tools with security:

```typescript
import { ToolGuard } from './tool-guard';

/**
 * Create a security-wrapped version of a tool
 */
export function createSecureTool(
  tool: Tool,
  sandbox: ToolSandbox,
  guard: ToolGuard
): Tool {
  return {
    ...tool,
    execute: async (params, context) => {
      // Check if tool is allowed
      if (!guard.isToolAllowed(tool.name)) {
        throw new Error(`Tool "${tool.name}" is not allowed`);
      }

      // Validate params if schema exists
      if (tool.schema) {
        const validation = guard.validateParams(tool.name, params, tool.schema);
        if (!validation.success) {
          throw new Error(`Validation failed: ${validation.error}`);
        }
        params = validation.data;
      }
      
      // Execute in sandbox
      return sandbox.execute(tool, params, context || {});
    },
  };
}
```

### 5.3 Add Sandbox Support to ToolRegistry

Extend ToolRegistry with sandbox integration.

## Acceptance Criteria

- [ ] ToolSandbox class implemented
- [ ] Execution timeout enforcement working
- [ ] Concurrent execution limits enforced
- [ ] Output size limits enforced
- [ ] Pre/post execution hooks working
- [ ] Cancellation support working
- [ ] Integration with ToolRegistry
- [ ] Secure tool wrapper utility
- [ ] Unit tests pass
- [ ] Security tests pass

## Testing

```typescript
describe('ToolSandbox', () => {
  it('should timeout long-running tools', async () => {
    const sandbox = new ToolSandbox({ maxExecutionTime: 100 });
    const slowTool: Tool = {
      name: 'slow_tool',
      description: 'Takes forever',
      parameters: { type: 'object', properties: {} },
      execute: async () => new Promise(r => setTimeout(r, 5000)),
    };

    await expect(sandbox.execute(slowTool, {}, {})).rejects.toThrow('timed out');
  });

  it('should limit concurrent executions', async () => {
    const sandbox = new ToolSandbox({ maxConcurrentCalls: 2 });
    const slowTool: Tool = { /* ... */ };

    const p1 = sandbox.execute(slowTool, {}, {});
    const p2 = sandbox.execute(slowTool, {}, {});
    
    await expect(sandbox.execute(slowTool, {}, {})).rejects.toThrow('concurrent');
  });
});
```

## Files Changed

- `agentic/src/tool-sandbox.ts` (new)
- `agentic/src/tools.ts` (modified - integrate ToolSandbox)
- `agentic/src/index.ts` (modified - export ToolSandbox)

Note: Projects using `agentic` can integrate sandboxing via:
```typescript
import { ToolRegistry, ToolGuard, ToolSandbox } from 'agentic';

const guard = new ToolGuard({ deniedTools: ['dangerous_tool'] });
const sandbox = new ToolSandbox({ maxExecutionTime: 5000, maxConcurrentCalls: 5 });
const registry = ToolRegistry.create()
  .withSecurity(guard)
  .withSandbox(sandbox);
```

## Notes

This provides **capability-based** sandboxing, not true process isolation. For maximum security:
- Tools that need file access should use PathGuard
- Tools that make network calls should use approved endpoints only
- Consider running untrusted tools in separate processes

Document these limitations clearly.

