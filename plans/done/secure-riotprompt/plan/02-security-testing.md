# Step 02: Security Testing Infrastructure

## Objective

Establish security testing patterns, utilities, and fixtures that will be used to validate all subsequent security implementations.

## Background

Security features require specialized testing:
- Attack vector simulation
- Negative testing (verify rejection)
- Performance testing (security overhead)
- Regression testing (ensure fixes stay fixed)

## Tasks

### 2.1 Create Attack Vector Fixtures

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/tests/security/fixtures/attack-vectors.ts`:

```typescript
/**
 * Path traversal attack vectors
 */
export const PATH_TRAVERSAL_VECTORS = [
  '../etc/passwd',
  '..\\..\\windows\\system32\\config\\sam',
  '....//....//etc/passwd',
  '%2e%2e%2f%2e%2e%2fetc/passwd',
  '..%252f..%252f..%252fetc/passwd',
  '/etc/passwd',
  'C:\\Windows\\System32\\config\\SAM',
  '~/.ssh/id_rsa',
  '${HOME}/.ssh/id_rsa',
  'file:///etc/passwd',
  '....//....//....//etc/passwd',
  '..%c0%af..%c0%afetc/passwd',
  '%00../etc/passwd',
];

/**
 * Command injection attack vectors
 */
export const COMMAND_INJECTION_VECTORS = [
  '; rm -rf /',
  '| cat /etc/passwd',
  '`cat /etc/passwd`',
  '$(cat /etc/passwd)',
  '\n cat /etc/passwd',
  '&& cat /etc/passwd',
  '|| cat /etc/passwd',
];

/**
 * JSON injection attack vectors
 */
export const JSON_INJECTION_VECTORS = [
  '{"__proto__": {"polluted": true}}',
  '{"constructor": {"prototype": {"polluted": true}}}',
  '{"a": 1, "__proto__": {"b": 2}}',
];

/**
 * ReDoS attack vectors (exponential backtracking)
 */
export const REDOS_VECTORS = [
  { pattern: /^(a+)+$/, input: 'a'.repeat(25) + 'b' },
  { pattern: /^([a-zA-Z0-9])+$/, input: 'a'.repeat(50) + '!' },
  { pattern: /^(a|aa)+$/, input: 'a'.repeat(25) + 'b' },
];

/**
 * Sensitive data patterns for redaction testing
 */
export const SENSITIVE_DATA_SAMPLES = [
  { input: 'api_key: sk-abcd1234efgh5678', expected: 'api_key: [REDACTED]' },
  { input: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', expected: 'Bearer [REDACTED]' },
  { input: 'password="supersecret123"', expected: 'password="[REDACTED]"' },
  { input: 'OPENAI_API_KEY=sk-proj-abc123def456', expected: 'OPENAI_API_KEY=[REDACTED]' },
];

/**
 * Glob injection attack vectors
 */
export const GLOB_INJECTION_VECTORS = [
  '**/../../../etc/passwd',
  '{..,....}/*',
  '**/.*',
  '**/.git/config',
];
```

### 2.2 Create Security Test Utilities

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/tests/security/utils/security-test-utils.ts`:

```typescript
import { SecurityEvent } from '../../../src/security/events';

/**
 * Capture security events during test execution
 */
export class SecurityEventCapture {
  private events: SecurityEvent[] = [];

  capture(event: SecurityEvent): void {
    this.events.push(event);
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(e => e.type === type);
  }

  clear(): void {
    this.events = [];
  }

  expectEventOfType(type: SecurityEvent['type']): void {
    const found = this.events.some(e => e.type === type);
    if (!found) {
      throw new Error(`Expected security event of type "${type}" but none was captured`);
    }
  }

  expectNoEvents(): void {
    if (this.events.length > 0) {
      throw new Error(`Expected no security events but captured ${this.events.length}`);
    }
  }
}

/**
 * Run with timeout to catch infinite loops (ReDoS, etc.)
 */
export async function runWithSecurityTimeout<T>(
  fn: () => T | Promise<T>,
  timeoutMs: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Security timeout: operation exceeded ${timeoutMs}ms`));
    }, timeoutMs);

    Promise.resolve(fn())
      .then(result => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

/**
 * Assert that a function throws a security-related error
 */
export async function expectSecurityError(
  fn: () => unknown | Promise<unknown>,
  expectedMessage?: string | RegExp
): Promise<void> {
  let threw = false;
  let error: Error | null = null;

  try {
    await fn();
  } catch (e) {
    threw = true;
    error = e as Error;
  }

  if (!threw) {
    throw new Error('Expected function to throw a security error');
  }

  if (expectedMessage) {
    if (typeof expectedMessage === 'string') {
      if (!error?.message.includes(expectedMessage)) {
        throw new Error(`Expected error message to include "${expectedMessage}" but got "${error?.message}"`);
      }
    } else {
      if (!expectedMessage.test(error?.message || '')) {
        throw new Error(`Expected error message to match ${expectedMessage} but got "${error?.message}"`);
      }
    }
  }
}

/**
 * Measure execution time for performance testing
 */
export function measureExecutionTime<T>(fn: () => T): { result: T; durationMs: number } {
  const start = performance.now();
  const result = fn();
  const durationMs = performance.now() - start;
  return { result, durationMs };
}
```

### 2.3 Create Security Test Helpers

Create test helper for common security test patterns.

### 2.4 Add Security Test Scripts

Update `package.json` to include security-specific test commands:

```json
{
  "scripts": {
    "test:security": "vitest run tests/security",
    "test:security:watch": "vitest tests/security"
  }
}
```

## Acceptance Criteria

- [ ] Attack vector fixtures created for all vulnerability types
- [ ] Security event capture utility implemented
- [ ] Timeout utility for ReDoS testing implemented
- [ ] Security error assertion utility implemented
- [ ] Performance measurement utility implemented
- [ ] Security test script added to package.json
- [ ] Sample security tests pass

## Testing

```typescript
describe('Security Test Utils', () => {
  it('should capture security events', () => {
    const capture = new SecurityEventCapture();
    capture.capture({ type: 'path_traversal_blocked', timestamp: new Date(), severity: 'warning', message: 'test' });
    capture.expectEventOfType('path_traversal_blocked');
  });

  it('should timeout on slow operations', async () => {
    await expect(
      runWithSecurityTimeout(() => new Promise(r => setTimeout(r, 5000)), 100)
    ).rejects.toThrow('Security timeout');
  });
});
```

## Dependencies

- vitest (already a dependency)

## Files Changed

- `riotprompt/tests/security/fixtures/attack-vectors.ts` (new)
- `riotprompt/tests/security/utils/security-test-utils.ts` (new)
- `riotprompt/package.json` (modified - add script)

## Notes

This infrastructure will be used by all subsequent steps to validate security implementations. It's important to get this right as it forms the foundation of security testing.

