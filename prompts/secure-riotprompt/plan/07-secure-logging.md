# Step 07: Secure Logging via `@fjell/logging`

## Objective

Integrate `@fjell/logging` as the logging solution for RiotPrompt, leveraging its comprehensive masking capabilities.

## Background

**Vulnerability Addressed:** Insecure Redaction Defaults (🔴 Critical)

## Dependency: @fjell/logging ✅ AVAILABLE

**Status:** `@fjell/logging@4.4.68` is published and includes all required security features.

| Field | Value |
|-------|-------|
| Package | `@fjell/logging` |
| Version | `^4.4.68` |
| Repository | https://github.com/fjellgrunn/logging |

### What @fjell/logging Provides

The package already includes comprehensive security features:

| Feature | Description |
|---------|-------------|
| **API Key Masking** | OpenAI, Anthropic, AWS, GitHub, GitLab, Slack, Google Cloud |
| **Secrets** | Passwords, Bearer tokens, generic secret patterns |
| **PII Protection** | Email addresses, SSNs |
| **Cryptographic** | Private keys, JWTs, large base64 blobs |
| **Correlation IDs** | `createCorrelatedLogger()`, `generateCorrelationId()` |
| **Performance** | Async logging, circular reference protection |

```typescript
import { maskWithConfig, createCorrelatedLogger, generateCorrelationId } from '@fjell/logging';

// Mask sensitive data
const config = { enabled: true, maskApiKeys: true, maskPasswords: true };
const masked = maskWithConfig('API key: sk-abc123 password=secret', config);
// Output: "API key: **** ****"

// Correlation IDs for request tracking
const correlationId = generateCorrelationId();
const logger = createCorrelatedLogger(baseLogger, correlationId);
```

## Tasks

### 7.1 Add Fjell Logging Dependency

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm install @fjell/logging@^4.4.68

cd /Users/tobrien/gitw/kjerneverk/agentic
npm install @fjell/logging@^4.4.68
```

### 7.2 Create Logging Configuration

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/logging-config.ts`:

```typescript
import Logging, { maskWithConfig } from '@fjell/logging';

// Get library logger
export const RiotPromptLogger = Logging.getLogger('@theunwalked/riotprompt');

/**
 * Configure secure logging defaults for RiotPrompt
 */
export function configureSecureLogging(options: {
  enabled?: boolean;
  maskApiKeys?: boolean;
  maskPasswords?: boolean;
  maskEmails?: boolean;
} = {}) {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    enabled: options.enabled ?? isProduction,
    maskApiKeys: options.maskApiKeys ?? true,
    maskPasswords: options.maskPasswords ?? true,
    maskEmails: options.maskEmails ?? true,
    maskSSNs: true,
    maskPrivateKeys: true,
    maskJWTs: true,
    maskBase64Blobs: true,
    maxDepth: 8,
  };
}

// Default masking config
export const DEFAULT_MASKING_CONFIG = configureSecureLogging();

/**
 * Mask a string with default secure settings
 */
export function maskSensitive(content: string): string {
  return maskWithConfig(content, DEFAULT_MASKING_CONFIG);
}
```

### 7.3 Replace Logger Implementation

Update `/Users/tobrien/gitw/kjerneverk/riotprompt/src/logger.ts`:

```typescript
import Logging from '@fjell/logging';

// Re-export types
export interface Logger {
  name: string;
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  get: (...components: string[]) => Logger;
}

const LibLogger = Logging.getLogger('@theunwalked/riotprompt');

export const DEFAULT_LOGGER: Logger = {
  name: 'riotprompt',
  debug: (msg, ...args) => LibLogger.debug(msg, ...args),
  info: (msg, ...args) => LibLogger.info(msg, ...args),
  warn: (msg, ...args) => LibLogger.warning(msg, ...args),
  error: (msg, ...args) => LibLogger.error(msg, ...args),
  get: (...components) => {
    const componentLogger = LibLogger.get(...components);
    return {
      name: components.join(':'),
      debug: (msg, ...args) => componentLogger.debug(msg, ...args),
      info: (msg, ...args) => componentLogger.info(msg, ...args),
      warn: (msg, ...args) => componentLogger.warning(msg, ...args),
      error: (msg, ...args) => componentLogger.error(msg, ...args),
      get: (...more) => DEFAULT_LOGGER.get(...components, ...more),
    };
  },
};

export const wrapLogger = (toWrap: Logger, name?: string): Logger => {
  return DEFAULT_LOGGER.get(name || toWrap.name);
};
```

### 7.4 Update ConversationLogger

Update `/Users/tobrien/gitw/kjerneverk/riotprompt/src/conversation-logger.ts`:

```typescript
import { maskSensitive } from './logging-config';

export class ConversationLogger {
  private config: Required<LogConfig>;

  constructor(config: LogConfig, logger?: Logger) {
    this.config = {
      // ... existing config
      redactSensitive: true,  // Now defaults to true
    };
  }

  private redactContent(content: string): string {
    if (!this.config.redactSensitive) return content;
    return maskSensitive(content);
  }
}
```

### 7.5 Add Correlation ID Support

For request tracking across components:

```typescript
import { createCorrelatedLogger, generateCorrelationId } from '@fjell/logging';

// In execution flow
export async function executeWithCorrelation<T>(
  fn: (logger: Logger) => Promise<T>,
  baseLogger: Logger,
): Promise<T> {
  const correlationId = generateCorrelationId();
  const correlatedLogger = createCorrelatedLogger(baseLogger, correlationId);
  return fn(correlatedLogger);
}
```

### 7.6 Update Exports

Update `/Users/tobrien/gitw/kjerneverk/riotprompt/src/index.ts`:

```typescript
// Logging exports
export { configureSecureLogging, maskSensitive, DEFAULT_MASKING_CONFIG } from './logging-config';
export { Logger, DEFAULT_LOGGER, wrapLogger } from './logger';

// Re-export useful Fjell utilities
export { maskWithConfig, createCorrelatedLogger, generateCorrelationId } from '@fjell/logging';
```

## Acceptance Criteria

- [ ] `@fjell/logging` added to riotprompt
- [ ] `@fjell/logging` added to agentic
- [ ] Logger implementation uses Fjell
- [ ] Masking enabled by default in production
- [ ] ConversationLogger uses Fjell masking
- [ ] Correlation ID support available
- [ ] Configuration exported for customization
- [ ] Existing tests pass
- [ ] New tests for masking integration

## Testing

```typescript
import { maskSensitive, configureSecureLogging } from './logging-config';
import { maskWithConfig } from '@fjell/logging';

describe('Fjell Logging Integration', () => {
  it('should mask API keys', () => {
    const content = 'Using key sk-abc1234567890abcdefghijklmnop';
    const masked = maskSensitive(content);
    expect(masked).not.toContain('sk-');
    expect(masked).toContain('****');
  });

  it('should mask Anthropic keys', () => {
    const content = 'Key: sk-ant-api03-abcdef123456';
    const masked = maskSensitive(content);
    expect(masked).not.toContain('sk-ant-');
  });

  it('should mask passwords', () => {
    const content = 'password=secret123';
    const masked = maskSensitive(content);
    expect(masked).not.toContain('secret123');
  });

  it('should be configurable', () => {
    const config = configureSecureLogging({ maskEmails: false });
    expect(config.maskEmails).toBe(false);
    expect(config.maskApiKeys).toBe(true);
  });
});
```

## Files Changed

| File | Change |
|------|--------|
| `riotprompt/package.json` | Add @fjell/logging dependency |
| `riotprompt/src/logger.ts` | Replace with Fjell wrapper |
| `riotprompt/src/logging-config.ts` | NEW: Configuration helper |
| `riotprompt/src/conversation-logger.ts` | Use Fjell masking |
| `riotprompt/src/index.ts` | Export logging utilities |
| `agentic/package.json` | Add @fjell/logging dependency |
| `agentic/src/logger.ts` | Update to use Fjell |

## @fjell/logging API Reference

### Masking

```typescript
import { maskWithConfig } from '@fjell/logging';

const config = {
  enabled: true,
  maskApiKeys: true,        // OpenAI, Anthropic, AWS, GitHub, etc.
  maskPasswords: true,      // password=, pwd=, etc.
  maskEmails: true,         // email@example.com
  maskSSNs: true,           // 123-45-6789
  maskPrivateKeys: true,    // -----BEGIN PRIVATE KEY-----
  maskJWTs: true,           // eyJ...
  maskBase64Blobs: true,    // Large base64 strings
  maxDepth: 8,              // Object traversal depth
};

const masked = maskWithConfig(content, config);
```

### Logging

```typescript
import Logging from '@fjell/logging';

const LibLogger = Logging.getLogger('@myproject/core');
const componentLogger = LibLogger.get('MyComponent');

componentLogger.info('Message');
componentLogger.debug('Debug message', { data });
componentLogger.error('Error occurred', error);
```

### Correlation IDs

```typescript
import { createCorrelatedLogger, generateCorrelationId } from '@fjell/logging';

const correlationId = generateCorrelationId();
const logger = createCorrelatedLogger(baseLogger, correlationId);
logger.info('Processing request');
// Output: [lq2x5k-abc123] Processing request
```

## Notes

### Migration from Custom Redaction

**What Changed:**
- Logging now uses `@fjell/logging` instead of simple console wrappers
- Masking is enabled by default in production
- Custom `redactPatterns` replaced by Fjell's comprehensive patterns

**Migration Guide:**
```typescript
// Before: Custom redaction patterns
const logger = new ConversationLogger({
  redactPatterns: [/sk-[a-zA-Z0-9]+/g],
});

// After: Use Fjell's built-in patterns (no custom patterns needed)
import { configureSecureLogging } from '@theunwalked/riotprompt';

configureSecureLogging({ enabled: true });
const logger = new ConversationLogger({ /* ... */ });
// API keys automatically masked by Fjell
```

### Patterns Included in @fjell/logging

The package masks these patterns by default:
- **OpenAI**: `sk-*`, `sk-proj-*`
- **Anthropic**: `sk-ant-*`
- **AWS**: Access keys, secret keys
- **GitHub**: `ghp_*`, `gho_*`, `ghu_*`, `ghs_*`, `ghr_*`
- **GitLab**: `glpat-*`
- **Slack**: `xox*-*`
- **Google Cloud**: `AIza*`
- **Generic**: `api_key=`, `apikey:`, `password=`, `Bearer *`
