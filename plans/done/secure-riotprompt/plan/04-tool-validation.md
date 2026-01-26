# Step 04: Tool Parameter Validation

## Objective

Implement schema-based validation of tool parameters before execution, preventing injection attacks and ensuring type safety.

## Architectural Decision

**This feature belongs in `agentic`, not `riotprompt`.**

Tool validation is fundamentally an *execution-time* concern for agentic AI workflows, not a prompt-building concern. The `agentic` package already owns:
- `ToolRegistry` - tool registration and execution
- `ToolContext` - execution context
- `ToolExecutionResult` - execution results

Adding `ToolGuard` as a companion to `ToolRegistry` ensures:
1. Any project using `agentic` gets tool security, not just `riotprompt` users
2. Security lives with the code it protects (execution logic)
3. Clear separation: `riotprompt` = prompts, `agentic` = agentic workflows + security

## Background

**Vulnerability Addressed:** Unsafe JSON Parsing of Tool Arguments (🔴 Critical)

Currently, tool arguments from LLM responses are parsed with `JSON.parse()` and passed directly to tool functions without validation. This creates multiple risks:
- Type mismatches causing runtime errors
- Injection of unexpected properties
- Prototype pollution attacks
- Schema violations that tools aren't designed to handle

## Tasks

### 4.1 Create ToolGuard Class

Create `/Users/tobrien/gitw/kjerneverk/agentic/src/tool-guard.ts`:

```typescript
import { z, ZodSchema, ZodError } from 'zod';
import { DEFAULT_LOGGER, wrapLogger, type Logger } from './logger';

export interface ToolSecurityConfig {
  enabled: boolean;
  validateParams: boolean;
  sandboxExecution: boolean;
  maxExecutionTime: number;
  maxConcurrentCalls: number;
  deniedTools: string[];
  allowedTools?: string[];
}

export interface ToolValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  violations?: string[];
}

export interface ToolGuardEvents {
  onValidationFailed?: (toolName: string, message: string) => void;
  onExecutionBlocked?: (toolName: string, reason: string) => void;
  onPrototypePollution?: (toolName: string) => void;
}

export class ToolGuard {
  private config: ToolSecurityConfig;
  private logger: Logger;
  private events: ToolGuardEvents;

  constructor(
    config: Partial<ToolSecurityConfig> = {},
    logger?: Logger,
    events: ToolGuardEvents = {}
  ) {
    this.config = {
      enabled: true,
      validateParams: true,
      sandboxExecution: false,
      maxExecutionTime: 30000,
      maxConcurrentCalls: 10,
      deniedTools: [],
      ...config,
    };
    this.logger = wrapLogger(logger || DEFAULT_LOGGER, 'ToolGuard');
    this.events = events;
  }

  /**
   * Validate tool parameters against a Zod schema
   */
  validateParams<T>(
    toolName: string,
    params: unknown,
    schema: ZodSchema<T>
  ): ToolValidationResult<T> {
    if (!this.config.enabled || !this.config.validateParams) {
      // Bypass validation if disabled
      return { success: true, data: params as T };
    }

    try {
      const data = schema.parse(params);
      return { success: true, data };
    } catch (error) {
      if (error instanceof ZodError) {
        const violations = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        const message = `Schema validation failed: ${violations.join('; ')}`;
        
        this.logger.warn('Tool validation failed', { toolName, violations });
        this.events.onValidationFailed?.(toolName, message);

        return {
          success: false,
          error: 'Parameter validation failed',
          violations,
        };
      }
      throw error;
    }
  }

  /**
   * Safely parse JSON tool arguments
   */
  parseToolArguments(
    toolName: string,
    jsonString: string
  ): ToolValidationResult<Record<string, unknown>> {
    if (!this.config.enabled) {
      return { success: true, data: JSON.parse(jsonString) };
    }

    try {
      // First, try to parse as JSON
      const parsed = JSON.parse(jsonString);

      // Check for prototype pollution attempts
      if (this.hasPrototypePollution(parsed)) {
        this.logger.error('Prototype pollution attempt detected', { toolName });
        this.events.onPrototypePollution?.(toolName);
        return {
          success: false,
          error: 'Invalid tool arguments: potentially malicious content detected',
        };
      }

      // Ensure it's an object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return {
          success: false,
          error: 'Tool arguments must be a JSON object',
        };
      }

      return { success: true, data: parsed };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn('JSON parsing failed', { toolName, error: errorMsg });
      this.events.onValidationFailed?.(toolName, `JSON parsing failed: ${errorMsg}`);
      return {
        success: false,
        error: 'Invalid JSON in tool arguments',
      };
    }
  }

  /**
   * Check if a tool is allowed to execute
   */
  isToolAllowed(toolName: string): boolean {
    if (!this.config.enabled) return true;

    // Check deny list
    if (this.config.deniedTools.includes(toolName)) {
      this.logger.warn('Tool blocked by deny list', { toolName });
      this.events.onExecutionBlocked?.(toolName, 'Tool is in deny list');
      return false;
    }

    // Check allow list if specified
    if (this.config.allowedTools && !this.config.allowedTools.includes(toolName)) {
      this.logger.warn('Tool not in allow list', { toolName });
      this.events.onExecutionBlocked?.(toolName, 'Tool is not in allow list');
      return false;
    }

    return true;
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ToolSecurityConfig> {
    return { ...this.config };
  }

  /**
   * Detect prototype pollution attempts
   */
  private hasPrototypePollution(obj: unknown, depth: number = 0): boolean {
    if (depth > 10) return false; // Prevent stack overflow
    if (typeof obj !== 'object' || obj === null) return false;

    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    
    for (const key of Object.keys(obj)) {
      if (dangerousKeys.includes(key)) {
        return true;
      }
      
      if (typeof (obj as Record<string, unknown>)[key] === 'object') {
        if (this.hasPrototypePollution((obj as Record<string, unknown>)[key], depth + 1)) {
          return true;
        }
      }
    }

    return false;
  }
}
```

### 4.2 Update ToolRegistry to Use ToolGuard

Modify `/Users/tobrien/gitw/kjerneverk/agentic/src/tools.ts` to integrate ToolGuard:

```typescript
// Add to ToolRegistry class
private toolGuard?: ToolGuard;

/**
 * Configure security guard for tool execution
 */
withSecurity(guard: ToolGuard): this {
  this.toolGuard = guard;
  return this;
}

// Modify execute method to use guard
async execute(name: string, params: any): Promise<any> {
  const tool = this.tools.get(name);
  if (!tool) {
    throw new Error(`Tool "${name}" not found`);
  }

  // Security check: is tool allowed?
  if (this.toolGuard && !this.toolGuard.isToolAllowed(name)) {
    throw new Error(`Tool "${name}" is not allowed`);
  }

  // Security check: validate parameters if schema exists
  if (this.toolGuard && tool.schema) {
    const validation = this.toolGuard.validateParams(name, params, tool.schema);
    if (!validation.success) {
      throw new Error(`Tool "${name}": ${validation.error}`);
    }
    params = validation.data;
  }

  // ... rest of existing execute logic
}
```

### 4.3 Add Schema Support to Tool Interface

Update tool interface to support optional Zod schemas:

```typescript
export interface Tool {
  name: string;
  description: string;
  parameters: { /* existing */ };
  execute: (params: any, context?: ToolContext) => Promise<any>;
  
  // NEW: Optional Zod schema for parameter validation
  schema?: ZodSchema<any>;
}
```

### 4.4 Update Iteration Strategy to Use Guard

Modify the iteration strategy to use ToolGuard when parsing LLM responses.

## Acceptance Criteria

- [ ] ToolGuard class implemented with Zod integration
- [ ] JSON parsing with prototype pollution detection
- [ ] Tool allow/deny list enforcement
- [ ] ToolRegistry integration with optional guard
- [ ] Tool interface extended with schema support
- [ ] Iteration strategy uses guard for LLM response parsing
- [ ] Audit logging for validation failures
- [ ] Unit tests for all validation scenarios
- [ ] Security tests with attack vectors pass

## Testing

```typescript
describe('ToolGuard', () => {
  it('should validate params against schema', () => {
    const guard = new ToolGuard();
    const schema = z.object({ path: z.string(), recursive: z.boolean().optional() });
    
    const result = guard.validateParams('read_file', { path: '/test' }, schema);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ path: '/test' });
  });

  it('should reject invalid params', () => {
    const guard = new ToolGuard();
    const schema = z.object({ path: z.string() });
    
    const result = guard.validateParams('read_file', { path: 123 }, schema);
    expect(result.success).toBe(false);
  });

  it('should detect prototype pollution', () => {
    const guard = new ToolGuard();
    const result = guard.parseToolArguments('test', '{"__proto__": {"polluted": true}}');
    expect(result.success).toBe(false);
  });

  it('should enforce deny list', () => {
    const guard = new ToolGuard({ deniedTools: ['dangerous_tool'] });
    expect(guard.isToolAllowed('dangerous_tool')).toBe(false);
    expect(guard.isToolAllowed('safe_tool')).toBe(true);
  });
});
```

## Files Changed

- `agentic/src/tool-guard.ts` (new)
- `agentic/src/tools.ts` (modified - integrate ToolGuard)
- `agentic/src/index.ts` (modified - export ToolGuard)

Note: Projects using `agentic` (like `riotprompt`) can integrate ToolGuard via:
```typescript
import { ToolRegistry, ToolGuard } from 'agentic';

const guard = new ToolGuard({ deniedTools: ['dangerous_tool'] });
const registry = ToolRegistry.create().withSecurity(guard);
```

## Notes

This is a **critical** security fix. The ToolGuard provides defense-in-depth:
1. JSON parsing safety (prototype pollution)
2. Schema validation (type safety)
3. Allow/deny lists (access control)

The guard is optional to maintain backward compatibility, but should be strongly recommended in documentation.

