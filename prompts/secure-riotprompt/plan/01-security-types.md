# Step 01: Security Types and Configuration

## Objective

Define the foundational security types, configuration schemas, and interfaces that will be used throughout the security implementation.

## Background

Security features need consistent configuration across all kjerneverk packages. This step establishes:
- A unified `SecurityConfig` type
- Zod schemas for validation
- Secure defaults
- Configuration merging utilities

## Tasks

### 1.1 Create Security Types File

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/types.ts`:

```typescript
import { z } from 'zod';

// Path Security Configuration
export const PathSecurityConfigSchema = z.object({
  enabled: z.boolean().default(true),
  basePaths: z.array(z.string()).default([]),
  allowAbsolute: z.boolean().default(false),
  allowSymlinks: z.boolean().default(false),
  denyPatterns: z.array(z.string()).default([
    '\\.\\.',        // Parent directory
    '~',             // Home directory expansion
    '\\$\\{',        // Variable expansion
  ]),
});

// Tool Security Configuration
export const ToolSecurityConfigSchema = z.object({
  enabled: z.boolean().default(true),
  validateParams: z.boolean().default(true),
  sandboxExecution: z.boolean().default(false),
  allowedTools: z.array(z.string()).optional(),
  deniedTools: z.array(z.string()).default([]),
  maxExecutionTime: z.number().default(30000), // 30 seconds
  maxConcurrentCalls: z.number().default(10),
});

// Secret Security Configuration
export const SecretSecurityConfigSchema = z.object({
  enabled: z.boolean().default(true),
  redactInLogs: z.boolean().default(true),
  redactInErrors: z.boolean().default(true),
  patterns: z.array(z.instanceof(RegExp)).default([
    /api[_-]?key[\s:="']+[\w-]+/gi,
    /password[\s:="']+[\w-]+/gi,
    /Bearer\s+[\w-]+/gi,
    /sk-[a-zA-Z0-9]{48,}/g,
    /AKIA[0-9A-Z]{16}/g,  // AWS Access Key
  ]),
  customPatterns: z.array(z.instanceof(RegExp)).default([]),
});

// Logging Security Configuration
export const LogSecurityConfigSchema = z.object({
  enabled: z.boolean().default(true),
  auditSecurityEvents: z.boolean().default(true),
  sanitizeStackTraces: z.boolean().default(true),
  maxContentLength: z.number().default(10000),
});

// Timeout Configuration
export const TimeoutConfigSchema = z.object({
  enabled: z.boolean().default(true),
  defaultTimeout: z.number().default(30000),
  llmTimeout: z.number().default(120000), // 2 minutes for LLM calls
  toolTimeout: z.number().default(30000),
  fileTimeout: z.number().default(5000),
});

// Complete Security Configuration
export const SecurityConfigSchema = z.object({
  paths: PathSecurityConfigSchema.default({}),
  tools: ToolSecurityConfigSchema.default({}),
  secrets: SecretSecurityConfigSchema.default({}),
  logging: LogSecurityConfigSchema.default({}),
  timeouts: TimeoutConfigSchema.default({}),
});

// Type exports
export type PathSecurityConfig = z.infer<typeof PathSecurityConfigSchema>;
export type ToolSecurityConfig = z.infer<typeof ToolSecurityConfigSchema>;
export type SecretSecurityConfig = z.infer<typeof SecretSecurityConfigSchema>;
export type LogSecurityConfig = z.infer<typeof LogSecurityConfigSchema>;
export type TimeoutConfig = z.infer<typeof TimeoutConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
```

### 1.2 Create Default Configuration

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/defaults.ts`:

```typescript
import { SecurityConfig, SecurityConfigSchema } from './types';

/**
 * Secure default configuration
 * All security features enabled by default
 */
export const SECURE_DEFAULTS: SecurityConfig = SecurityConfigSchema.parse({});

/**
 * Permissive configuration for development/testing
 * Security features disabled for convenience
 */
export const PERMISSIVE_DEFAULTS: SecurityConfig = {
  paths: { enabled: false, basePaths: [], allowAbsolute: true, allowSymlinks: true, denyPatterns: [] },
  tools: { enabled: false, validateParams: false, sandboxExecution: false, maxExecutionTime: 0, maxConcurrentCalls: 0, deniedTools: [] },
  secrets: { enabled: false, redactInLogs: false, redactInErrors: false, patterns: [], customPatterns: [] },
  logging: { enabled: false, auditSecurityEvents: false, sanitizeStackTraces: false, maxContentLength: Infinity },
  timeouts: { enabled: false, defaultTimeout: 0, llmTimeout: 0, toolTimeout: 0, fileTimeout: 0 },
};

/**
 * Merge user configuration with defaults
 */
export function mergeSecurityConfig(
  userConfig: Partial<SecurityConfig> | undefined,
  defaults: SecurityConfig = SECURE_DEFAULTS
): SecurityConfig {
  if (!userConfig) return defaults;
  
  return SecurityConfigSchema.parse({
    paths: { ...defaults.paths, ...userConfig.paths },
    tools: { ...defaults.tools, ...userConfig.tools },
    secrets: { ...defaults.secrets, ...userConfig.secrets },
    logging: { ...defaults.logging, ...userConfig.logging },
    timeouts: { ...defaults.timeouts, ...userConfig.timeouts },
  });
}
```

### 1.3 Create Security Event Types

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/events.ts`:

```typescript
export type SecurityEventType =
  | 'path_validation_failed'
  | 'path_traversal_blocked'
  | 'tool_validation_failed'
  | 'tool_execution_blocked'
  | 'tool_timeout'
  | 'secret_redacted'
  | 'api_key_used'
  | 'deserialization_failed'
  | 'regex_timeout'
  | 'request_timeout'
  | 'rate_limit_exceeded';

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  context?: Record<string, unknown>;
  // Never include actual sensitive values
}
```

### 1.4 Export from Index

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/index.ts` with all exports.

## Acceptance Criteria

- [ ] All security type schemas defined with Zod
- [ ] Default configurations for secure and permissive modes
- [ ] Configuration merging utility works correctly
- [ ] Security event types defined
- [ ] All types exported from index
- [ ] TypeScript compiles without errors
- [ ] Unit tests for configuration merging

## Testing

```typescript
describe('SecurityConfig', () => {
  it('should provide secure defaults', () => {
    const config = SecurityConfigSchema.parse({});
    expect(config.secrets.redactInLogs).toBe(true);
    expect(config.paths.enabled).toBe(true);
  });

  it('should merge user config with defaults', () => {
    const merged = mergeSecurityConfig({ paths: { allowAbsolute: true } });
    expect(merged.paths.allowAbsolute).toBe(true);
    expect(merged.paths.enabled).toBe(true); // default preserved
  });
});
```

## Dependencies

- zod (already a dependency)

## Files Changed

- `riotprompt/src/security/types.ts` (new)
- `riotprompt/src/security/defaults.ts` (new)
- `riotprompt/src/security/events.ts` (new)
- `riotprompt/src/security/index.ts` (new)

## Notes

This step establishes the foundation. No existing code is modified yet—these are purely additive changes that subsequent steps will integrate.

