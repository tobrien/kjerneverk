# Step 13: Error Message Sanitization

## Objective

Sanitize error messages in production environments to prevent information disclosure.

## Background

**Vulnerability Addressed:** Error Information Disclosure (🟡 Medium)

Current error handling exposes:
- Full file paths revealing directory structure
- Stack traces with internal code paths
- Implementation details in error messages

## Dependency: spotclean ✅ AVAILABLE

**Status:** `@theunwalked/spotclean@0.0.3` is published and available on npm.

| Field | Value |
|-------|-------|
| Package | `@theunwalked/spotclean` |
| Version | `^0.0.3` |
| Repository | https://github.com/utilarium/spotclean |
| Homepage | https://utilarium.github.io/spotclean/ |

### What spotclean Provides

| Feature | Description |
|---------|-------------|
| `ErrorSanitizer` | Main error sanitization class |
| `SecretGuard` | Secret detection and redaction |
| `PathSanitizer` | File path sanitization |
| `sanitize()` | Quick error sanitization |
| `createSafeError()` | Create sanitized Error object |
| `withErrorHandling()` | Async function wrapper |
| `sanitizeUnknownError()` | Handle unknown error types |
| `configureErrorSanitizer()` | Global configuration |

## Tasks

### 13.1 Add Spotclean Dependency

Add `@theunwalked/spotclean` to relevant packages:

```bash
# In riotprompt
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm install @theunwalked/spotclean@^0.0.3

# In execution providers
cd /Users/tobrien/gitw/kjerneverk/execution-openai && npm install @theunwalked/spotclean@^0.0.3
cd /Users/tobrien/gitw/kjerneverk/execution-anthropic && npm install @theunwalked/spotclean@^0.0.3
cd /Users/tobrien/gitw/kjerneverk/execution-gemini && npm install @theunwalked/spotclean@^0.0.3

# In CLI tools
cd /Users/tobrien/gitw/kjerneverk/riotprompt-cli && npm install @theunwalked/spotclean@^0.0.3
```

### 13.2 Configure Error Sanitizer at Startup

Configure spotclean at application startup:

```typescript
import { 
  configureErrorSanitizer, 
  configureSecretGuard,
  configurePathSanitizer,
} from '@theunwalked/spotclean';

// Configure for environment
configureErrorSanitizer({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  includeCorrelationId: true,
  sanitizeStackTraces: true,
  maxMessageLength: 500,
});

// Configure path sanitization
configurePathSanitizer({
  basePaths: [process.cwd()],
  redactSystemPaths: true,
});

// Add custom patterns for kjerneverk-specific secrets (if any)
configureSecretGuard({
  customPatterns: [
    // Add any kjerneverk-specific secret patterns here
  ],
});
```

### 13.3 Integrate with Execution Providers

Update execution providers to use spotclean:

```typescript
import { withErrorHandling, sanitize, createSafeError } from '@theunwalked/spotclean';

// Option 1: Wrap API calls with automatic handling
const safeExecute = withErrorHandling(
  async (request: ExecutionRequest) => {
    // ... execution logic
  },
  { 
    logger: {
      error: (msg, ctx) => console.error(msg, ctx),
    },
    context: { provider: 'openai' }
  }
);

// Option 2: Manual handling in catch blocks
try {
  // ... provider call
} catch (error) {
  const { external, internal } = sanitize(error);
  
  // Log full details internally
  console.error('Provider error', { 
    correlationId: internal.correlationId,
    message: internal.originalMessage,
    stack: internal.originalStack,
  });
  
  // Throw sanitized error externally
  throw createSafeError(error);
}
```

### 13.4 Integrate with CLI

Update CLI error handling:

```typescript
import { sanitize, configureErrorSanitizer } from '@theunwalked/spotclean';

// Configure at startup
configureErrorSanitizer({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  includeCorrelationId: true,
});

async function main() {
  try {
    await runCommand();
  } catch (error) {
    const { external } = sanitize(error);
    console.error(`Error: ${external.message}`);
    if (external.correlationId) {
      console.error(`Reference: ${external.correlationId}`);
    }
    process.exit(1);
  }
}
```

### 13.5 Integrate with RiotPrompt Loader

Update loader error handling:

```typescript
import { createSafeError } from '@theunwalked/spotclean';

class Loader {
  async load(path: string): Promise<Block[]> {
    try {
      // ... loading logic
    } catch (error) {
      throw createSafeError(error);
    }
  }
}
```

### 13.6 Create Error Handling Utility

Create a shared utility for consistent error handling:

```typescript
// riotprompt/src/error-handling.ts
import { 
  sanitize, 
  createSafeError, 
  configureErrorSanitizer,
  type SanitizedError,
} from '@theunwalked/spotclean';

// Re-export for convenience
export { sanitize, createSafeError, configureErrorSanitizer };

// Initialize error handling
export function initializeErrorHandling(): void {
  configureErrorSanitizer({
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    includeCorrelationId: true,
    sanitizeStackTraces: process.env.NODE_ENV === 'production',
  });
}

// Utility for logging + rethrowing
export function handleError(error: unknown, context?: Record<string, unknown>): never {
  const { external, internal } = sanitize(error);
  
  // Log internal details
  console.error('Error occurred', {
    correlationId: internal.correlationId,
    context,
    message: internal.originalMessage,
  });
  
  // Throw sanitized error
  throw createSafeError(error);
}
```

## Acceptance Criteria

- [ ] `@theunwalked/spotclean` added to riotprompt
- [ ] `@theunwalked/spotclean` added to execution-openai
- [ ] `@theunwalked/spotclean` added to execution-anthropic
- [ ] `@theunwalked/spotclean` added to execution-gemini
- [ ] `@theunwalked/spotclean` added to riotprompt-cli
- [ ] Error sanitizer configured at startup
- [ ] Execution providers use spotclean
- [ ] CLI uses spotclean for error display
- [ ] Loader uses spotclean for error handling
- [ ] No secrets leak in error messages
- [ ] No file paths leak in production error messages
- [ ] Correlation IDs available for debugging
- [ ] Stack traces removed in production
- [ ] Unit tests pass

## Testing

```typescript
import { ErrorSanitizer, sanitize, configureErrorSanitizer } from '@theunwalked/spotclean';

describe('Error handling integration', () => {
  beforeEach(() => {
    configureErrorSanitizer({ environment: 'production' });
  });

  it('should not leak secrets in errors', () => {
    const error = new Error('Failed to connect to postgres://admin:secret@db.local:5432');
    const { external } = sanitize(error);
    
    expect(external.message).not.toContain('secret');
    expect(external.message).not.toContain('postgres://');
    expect(external.correlationId).toBeDefined();
  });

  it('should not leak file paths in errors', () => {
    const error = new Error('Failed to read /home/deploy/app/config/secrets.yaml');
    const { external } = sanitize(error);
    
    expect(external.message).not.toContain('/home/deploy');
    expect(external.message).not.toContain('secrets.yaml');
  });

  it('should preserve correlation ID for debugging', () => {
    const error = new Error('Something went wrong');
    const { external, internal } = sanitize(error);
    
    expect(external.correlationId).toBeDefined();
    expect(internal.correlationId).toBe(external.correlationId);
  });

  it('should show detailed errors in development', () => {
    configureErrorSanitizer({ environment: 'development' });
    const error = new Error('Detailed error message');
    const { external } = sanitize(error);
    
    // Development shows more details
    expect(external.message).toContain('Detailed error message');
  });
});
```

## Files Changed

- `riotprompt/package.json` (add dependency)
- `riotprompt/src/index.ts` (configure sanitizer)
- `riotprompt/src/loader.ts` (use sanitizer)
- `riotprompt/src/error-handling.ts` (new utility)
- `execution-openai/package.json` (add dependency)
- `execution-openai/src/index.ts` (use sanitizer)
- `execution-anthropic/package.json` (add dependency)
- `execution-anthropic/src/index.ts` (use sanitizer)
- `execution-gemini/package.json` (add dependency)
- `execution-gemini/src/index.ts` (use sanitizer)
- `riotprompt-cli/package.json` (add dependency)
- `riotprompt-cli/src/cli.ts` (use sanitizer)

## spotclean API Reference

### Quick Functions

```typescript
import { 
  sanitize, 
  createSafeError, 
  withErrorHandling,
  configureErrorSanitizer,
} from '@theunwalked/spotclean';

// Quick sanitization
const { external, internal } = sanitize(error);

// Create a new sanitized Error
const safeError = createSafeError(error);

// Wrap async function
const safeFn = withErrorHandling(asyncFn, { logger });

// Configure globally
configureErrorSanitizer({
  environment: 'production',
  includeCorrelationId: true,
});
```

### ErrorSanitizer Class

```typescript
import { ErrorSanitizer } from '@theunwalked/spotclean';

const sanitizer = new ErrorSanitizer({
  enabled: true,
  environment: 'production',
  includeCorrelationId: true,
  maxMessageLength: 500,
  sanitizeStackTraces: true,
});

const { external, internal } = sanitizer.sanitize(error);
```

### SecretGuard and PathSanitizer

```typescript
import { SecretGuard, PathSanitizer } from '@theunwalked/spotclean';

const secretGuard = new SecretGuard({
  enabled: true,
  redactionText: '[REDACTED]',
  customPatterns: [/* ... */],
});

const pathSanitizer = new PathSanitizer({
  enabled: true,
  basePaths: ['/app/project'],
  redactSystemPaths: true,
});
```

## Notes

Error handling philosophy:
- **Development**: Show detailed errors for debugging (with secrets redacted)
- **Production**: Show generic messages for security
- **Always**: Log full details internally with correlation IDs

Users should be able to report issues using correlation IDs without exposing sensitive details.

### Error Message Mapping in Production

spotclean maps errors to generic messages in production:

| Error Type/Content | Generic Message |
|-------------------|-----------------|
| TimeoutError | The operation timed out. Please try again. |
| Not found, ENOENT | The requested resource was not found. |
| Permission, EACCES | You do not have permission to perform this action. |
| Invalid, validation | The provided data is invalid. |
| Network, connection | A network error occurred. Please check your connection. |
| Authentication | Authentication failed. |
| Rate limit | Too many requests. Please slow down. |
