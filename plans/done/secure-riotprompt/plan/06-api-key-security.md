# Step 06: API Key Security

## Objective

Implement secure handling of API keys throughout the execution pipeline, preventing exposure in logs, errors, and memory.

## Background

**Vulnerability Addressed:** API Key Handling Vulnerabilities (🔴 Critical)

API keys are currently:
- Read directly from environment variables or options
- Not validated before use
- Potentially logged in debug output
- Exposed in error messages
- Passed through CLI flags (visible in process lists)

## Dependency: offrecord ✅ AVAILABLE

**Status:** `@theunwalked/offrecord@0.0.2` is published and available on npm.

The secret handling functionality is provided by the `@theunwalked/offrecord` library.

| Field | Value |
|-------|-------|
| Package | `@theunwalked/offrecord` |
| Version | `^0.0.2` |
| Repository | https://github.com/utilarium/offrecord |
| Homepage | https://utilarium.github.io/offrecord/ |

### What offrecord Provides

| Feature | Description |
|---------|-------------|
| `SecretRedactor` | Extensible pattern-based redaction engine |
| `SecureString` | Memory-safe secret wrapper preventing serialization |
| `createSafeError()` | Error sanitization utilities |
| `withSafeErrors()` | Function wrapper for automatic error sanitization |
| `PatternRegistry` | Global registry for secret patterns |
| Default patterns | Common secrets (AWS, GitHub, JWT, Bearer, etc.) |

## Tasks

### 6.1 Add offrecord Dependency

Add to each execution provider's `package.json`:

```bash
# In each execution provider directory
npm install @theunwalked/offrecord@^0.0.2
```

### 6.2 Register Provider-Specific Patterns

Each execution provider registers its own key patterns with offrecord at module load time.

**execution-openai/src/index.ts:**
```typescript
import { getRedactor } from '@theunwalked/offrecord';

// Register OpenAI patterns on module load
getRedactor().register({
  name: 'openai',
  patterns: [
    /sk-[a-zA-Z0-9]{20,}/g,
    /sk-proj-[a-zA-Z0-9_-]+/g,
  ],
  validator: (key) => /^sk-(proj-)?[a-zA-Z0-9_-]{20,}$/.test(key),
  envVar: 'OPENAI_API_KEY',
  description: 'OpenAI API keys',
});
```

**execution-anthropic/src/index.ts:**
```typescript
import { getRedactor } from '@theunwalked/offrecord';

getRedactor().register({
  name: 'anthropic',
  patterns: [
    /sk-ant-[a-zA-Z0-9_-]+/g,
    /sk-ant-api\d+-[a-zA-Z0-9_-]+/g,
  ],
  validator: (key) => /^sk-ant(-api\d+)?-[a-zA-Z0-9_-]+$/.test(key),
  envVar: 'ANTHROPIC_API_KEY',
  description: 'Anthropic API keys',
});
```

**execution-gemini/src/index.ts:**
```typescript
import { getRedactor } from '@theunwalked/offrecord';

getRedactor().register({
  name: 'gemini',
  patterns: [
    /AIza[a-zA-Z0-9_-]{35}/g,
  ],
  validator: (key) => /^AIza[a-zA-Z0-9_-]{35}$/.test(key),
  envVar: 'GEMINI_API_KEY',
  description: 'Google Gemini API keys',
});
```

### 6.3 Use SecureString for Key Handling

Wrap API keys in SecureString to prevent accidental exposure:

```typescript
import { secure, SecureString } from '@theunwalked/offrecord';

async execute(request: Request, options: ExecutionOptions = {}): Promise<ProviderResponse> {
  const envVar = 'OPENAI_API_KEY';
  const rawKey = options.apiKey || process.env[envVar];
  
  if (!rawKey) {
    throw new Error(`OpenAI API key is required. Set ${envVar} environment variable.`);
  }

  // Wrap in SecureString to prevent accidental logging
  const apiKey = secure(rawKey);

  // Validate key format
  const redactor = getRedactor();
  const validation = redactor.validateKey(rawKey, 'openai');
  if (!validation.valid) {
    throw new Error('Invalid OpenAI API key format');
  }

  // Use the key only when needed
  apiKey.use((key) => {
    const client = new OpenAI({ apiKey: key });
    // ... perform API call
  });
}
```

### 6.4 Use Safe Errors for Provider Errors

Ensure all errors are sanitized before propagation:

```typescript
import { createSafeError, withSafeErrorsAsync } from '@theunwalked/offrecord';

// Option 1: Wrap the entire execute method
const safeExecute = withSafeErrorsAsync(
  async (request: Request, options: ExecutionOptions) => {
    // ... original implementation
  }
);

// Option 2: Manual error handling
async execute(request: Request, options: ExecutionOptions = {}): Promise<ProviderResponse> {
  try {
    const client = new OpenAI({ apiKey: rawKey });
    // ... rest of implementation
  } catch (error) {
    // Error messages will have any secrets redacted
    throw createSafeError(error as Error);
  }
}
```

### 6.5 Update Logger Integration

Ensure all logging uses offrecord for redaction:

```typescript
import { getRedactor } from '@theunwalked/offrecord';

function safeLog(level: string, message: string, ...args: unknown[]): void {
  const redactor = getRedactor();
  const safeMessage = redactor.redact(message);
  const safeArgs = args.map(arg => 
    typeof arg === 'string' ? redactor.redact(arg) : arg
  );
  console.log(`[${level}] ${safeMessage}`, ...safeArgs);
}
```

### 6.6 Document Secure Key Handling

Add security documentation to each provider's README.

## Acceptance Criteria

- [ ] `@theunwalked/offrecord` added to execution-openai
- [ ] `@theunwalked/offrecord` added to execution-anthropic
- [ ] `@theunwalked/offrecord` added to execution-gemini
- [ ] execution-openai registers OpenAI patterns
- [ ] execution-anthropic registers Anthropic patterns
- [ ] execution-gemini registers Gemini patterns
- [ ] Providers validate key format before use
- [ ] Providers use SecureString for key handling
- [ ] Providers sanitize errors using createSafeError
- [ ] Logging integrates with offrecord redaction
- [ ] Unit tests pass
- [ ] Security tests pass

## Testing

```typescript
import { getRedactor, createSafeError, secure } from '@theunwalked/offrecord';

describe('API Key Security', () => {
  it('should redact OpenAI keys in errors', async () => {
    const provider = new OpenAIProvider();
    try {
      // Force an error that might contain a key
      await provider.execute({ /* invalid request */ });
    } catch (error) {
      expect((error as Error).message).not.toContain('sk-');
      expect((error as Error).message).not.toContain('sk-proj-');
    }
  });

  it('should validate key format', () => {
    const redactor = getRedactor();
    expect(redactor.validateKey('sk-proj-abc123xyz789012345678901234567890', 'openai').valid).toBe(true);
    expect(redactor.validateKey('invalid', 'openai').valid).toBe(false);
  });

  it('should not serialize SecureString', () => {
    const secret = secure('sk-secret-key');
    expect(JSON.stringify({ key: secret })).not.toContain('sk-secret');
    expect(String(secret)).toBe('[SecureString]');
  });

  it('should redact keys in log messages', () => {
    const redactor = getRedactor();
    const message = 'Connecting with key sk-proj-abc123xyz789012345678901234567890';
    const safe = redactor.redact(message);
    expect(safe).not.toContain('sk-proj-');
    expect(safe).toContain('[REDACTED]');
  });
});
```

## Files Changed

| Location | File | Change |
|----------|------|--------|
| kjerneverk | `execution-openai/package.json` | Add offrecord dependency |
| kjerneverk | `execution-openai/src/index.ts` | Register patterns, use SecureString, safe errors |
| kjerneverk | `execution-anthropic/package.json` | Add offrecord dependency |
| kjerneverk | `execution-anthropic/src/index.ts` | Register patterns, use SecureString, safe errors |
| kjerneverk | `execution-gemini/package.json` | Add offrecord dependency |
| kjerneverk | `execution-gemini/src/index.ts` | Register patterns, use SecureString, safe errors |

## Notes

Key security best practices to document:
1. Never pass API keys via CLI flags (visible in `ps`)
2. Use environment variables or secure config files
3. Rotate keys regularly
4. Use separate keys for development/production
5. Monitor key usage through audit logs

### Why Providers Own Their Patterns

1. **Open/Closed Principle**: Adding new providers doesn't require modifying offrecord
2. **Domain Expertise**: Each provider library knows its key formats best
3. **Version Independence**: Provider key formats can change without offrecord updates
4. **Encapsulation**: Key knowledge stays with the code that uses it

### offrecord API Reference

Key functions used in this step:

```typescript
// Get global redactor instance
import { getRedactor } from '@theunwalked/offrecord';

// Create memory-safe secret
import { secure, SecureString, secureFromEnv } from '@theunwalked/offrecord';

// Safe error handling
import { createSafeError, withSafeErrors, withSafeErrorsAsync } from '@theunwalked/offrecord';

// Redact strings
const redactor = getRedactor();
redactor.redact('message with sk-secret');  // 'message with [REDACTED]'
redactor.detect('message with sk-secret');  // { found: true, matches: [...] }
redactor.validateKey('sk-...', 'openai');   // { valid: true/false }
```
