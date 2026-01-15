# Step 14: Miscellaneous Security Enhancements

## Objective

Address remaining lower-priority security issues: hash truncation, console logging, rate limiting interfaces, and glob pattern sanitization.

## Background

**Vulnerabilities Addressed:**
- Weak Hash Truncation (🟢 Low)
- Console Logging in Libraries (🟢 Low)
- Missing Rate Limiting (🟢 Low - interfaces only)
- Glob Pattern Injection (🟢 Low)

## Tasks

### 14.1 Fix Hash Truncation

Update `/Users/tobrien/gitw/kjerneverk/agentic/src/context-manager.ts`:

```typescript
// Change from 16 characters to 32 (128 bits)
private hashContent(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, 32); // 128 bits of entropy
}
```

Also update in any other locations using truncated hashes.

### 14.2 Silent Library Logging

Update default logging to be silent unless explicitly configured:

```typescript
// In logger.ts
export const SILENT_LOGGER: Logger = {
  name: 'silent',
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  verbose: () => {},
  silly: () => {},
};

// Change default
export const DEFAULT_LOGGER: Logger = 
  process.env.RIOTPROMPT_LOGGING === 'true' ? CONSOLE_LOGGER : SILENT_LOGGER;
```

### 14.3 Rate Limiting Interfaces

Create rate limiting interfaces (implementation left to users):

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/rate-limiter.ts`:

```typescript
/**
 * Rate limiter interface
 * Implementation is left to users (use your preferred library)
 */
export interface RateLimiter {
  /**
   * Check if request is allowed
   * @returns true if allowed, false if rate limited
   */
  check(key: string): Promise<boolean>;
  
  /**
   * Get remaining requests
   */
  remaining(key: string): Promise<number>;
  
  /**
   * Reset rate limit for a key
   */
  reset(key: string): Promise<void>;
}

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (context: any) => string;
}

/**
 * No-op rate limiter (always allows)
 */
export class NoOpRateLimiter implements RateLimiter {
  async check(_key: string): Promise<boolean> {
    return true;
  }
  
  async remaining(_key: string): Promise<number> {
    return Infinity;
  }
  
  async reset(_key: string): Promise<void> {
    // No-op
  }
}

/**
 * Simple in-memory rate limiter (for development/testing)
 */
export class MemoryRateLimiter implements RateLimiter {
  private requests: Map<string, { count: number; resetAt: number }> = new Map();
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  async check(key: string): Promise<boolean> {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || record.resetAt < now) {
      this.requests.set(key, { count: 1, resetAt: now + this.config.windowMs });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  async remaining(key: string): Promise<number> {
    const record = this.requests.get(key);
    if (!record || record.resetAt < Date.now()) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - record.count);
  }

  async reset(key: string): Promise<void> {
    this.requests.delete(key);
  }
}
```

### 14.4 Glob Pattern Sanitization

Create glob sanitization utility:

```typescript
// In path-guard.ts or new file
export function sanitizeGlobPattern(pattern: string): string {
  // Remove potentially dangerous sequences
  let safe = pattern
    // Remove parent directory references
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\/g, '')
    // Remove absolute path starters
    .replace(/^\//, '')
    .replace(/^[a-zA-Z]:/, '')
    // Remove home directory references
    .replace(/^~/, '')
    // Remove hidden file access unless explicit
    .replace(/\/\.\w+/g, '/');
  
  return safe;
}

export function isGlobSafe(pattern: string): boolean {
  const dangerous = [
    /\.\.\//,           // Parent directory
    /^\//,              // Absolute path
    /^[a-zA-Z]:/,       // Windows absolute
    /^~/,               // Home directory
    /\$\{/,             // Variable expansion
  ];
  
  return !dangerous.some(re => re.test(pattern));
}
```

### 14.5 Documentation Updates

Document all security features and best practices.

## Acceptance Criteria

- [ ] Hash truncation fixed (32+ chars)
- [ ] Silent logging by default
- [ ] Environment variable to enable logging
- [ ] Rate limiter interfaces defined
- [ ] Memory rate limiter for testing
- [ ] Glob pattern sanitization
- [ ] Documentation for all features
- [ ] Unit tests pass

## Testing

```typescript
describe('Hash Truncation', () => {
  it('should use at least 128 bits of entropy', () => {
    const manager = new ContextManager();
    // Access private method via any cast for testing
    const hash = (manager as any).hashContent('test');
    expect(hash.length).toBeGreaterThanOrEqual(32);
  });
});

describe('Silent Logging', () => {
  it('should be silent by default', () => {
    const spy = vi.spyOn(console, 'log');
    // Create component without explicit logger
    const registry = ToolRegistry.create();
    registry.register({ /* ... */ });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('Rate Limiter', () => {
  it('should limit requests', async () => {
    const limiter = new MemoryRateLimiter({
      windowMs: 1000,
      maxRequests: 2,
    });
    
    expect(await limiter.check('user1')).toBe(true);
    expect(await limiter.check('user1')).toBe(true);
    expect(await limiter.check('user1')).toBe(false);
  });
});

describe('Glob Sanitization', () => {
  it('should remove dangerous patterns', () => {
    expect(sanitizeGlobPattern('../../../etc/*')).toBe('etc/*');
    expect(sanitizeGlobPattern('/absolute/path/*')).toBe('absolute/path/*');
  });
});
```

## Files Changed

- `agentic/src/context-manager.ts` (modified)
- `riotprompt/src/logger.ts` (modified)
- `agentic/src/logger.ts` (modified)
- `riotprompt/src/security/rate-limiter.ts` (new)
- `riotprompt/src/security/path-guard.ts` (modified - add glob functions)
- `riotprompt/src/security/index.ts` (modified)

## Notes

These are lower-priority fixes that improve overall security posture:
- Hash truncation: Low probability of collision, but better safe than sorry
- Silent logging: Prevents accidental data leakage
- Rate limiting: Interfaces only, users implement as needed
- Glob sanitization: Defense in depth for file operations

