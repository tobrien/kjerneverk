# Step 09: Safe Regex Handling via `@theunwalked/pressurelid`

## Objective

Implement safe regex handling in `riotprompt` by integrating the `@theunwalked/pressurelid` library.

## Background

**Vulnerability Addressed:** ReDoS in Ignore Patterns (🟠 High)

User-provided ignore patterns in the loader are converted directly to RegExp. Malicious patterns with exponential backtracking could freeze the application.

## Dependency: pressurelid ✅ AVAILABLE

**Status:** `@theunwalked/pressurelid@1.0.2` is published and available on npm.

| Field | Value |
|-------|-------|
| Package | `@theunwalked/pressurelid` |
| Version | `^1.0.2` |
| Repository | https://github.com/utilarium/pressurelid |
| Homepage | https://utilarium.github.io/pressurelid/ |

### What pressurelid Provides

| Feature | Description |
|---------|-------------|
| `SafeRegex` class | Main API for safe regex creation |
| `createSafeRegex()` | Convenience function |
| `globToSafeRegex()` | Safe glob-to-regex conversion |
| `escapeForRegex()` | Escape user input for literal matching |
| Pattern analysis | Detects nested quantifiers, overlapping alternation |
| Timeout protection | `testWithTimeout()` for runtime protection |

## Tasks

### 9.1 Add pressurelid Dependency

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm install @theunwalked/pressurelid@^1.0.2
```

### 9.2 Update Loader to Use pressurelid

Modify `/Users/tobrien/gitw/kjerneverk/riotprompt/src/loader.ts`:

```typescript
import { SafeRegex, type SafeRegexResult } from '@theunwalked/pressurelid';

// Create a SafeRegex instance with configuration
const safeRegex = new SafeRegex({
  maxLength: 500,      // Maximum pattern length
  timeoutMs: 1000,     // 1 second timeout for regex execution
  onBlock: (message, pattern) => {
    console.warn(`Blocked unsafe pattern: ${message}`);
  },
  onWarning: (message, _pattern) => {
    console.warn(`Regex warning: ${message}`);
  },
});

// In the loader function
function createIgnorePatterns(patterns: string[]): RegExp[] {
  return patterns
    .map(pattern => {
      const result = safeRegex.globToRegex(pattern);
      
      if (result.safe && result.regex) {
        return result.regex;
      } else {
        console.warn(`Ignoring unsafe pattern "${pattern}": ${result.error}`);
        return null;
      }
    })
    .filter((regex): regex is RegExp => regex !== null);
}
```

### 9.3 Integrate Audit Logging (Optional)

If security audit logging is set up (Step 03), integrate callbacks:

```typescript
import { SafeRegex } from '@theunwalked/pressurelid';
import { getAuditLogger } from './security/audit-logger';

const auditLogger = getAuditLogger();

const safeRegex = new SafeRegex({
  onBlock: (message, pattern) => {
    auditLogger.log({
      type: 'regex_blocked',
      severity: 'warning',
      message,
      details: { patternLength: pattern.length },
    });
  },
  onWarning: (message, _pattern) => {
    auditLogger.log({
      type: 'regex_warning',
      severity: 'info',
      message,
    });
  },
});
```

### 9.4 Handle User-Provided Patterns

For any user input that becomes a regex:

```typescript
import { createSafeRegex, escapeForRegex } from '@theunwalked/pressurelid';

// For patterns meant to be regex
function validateUserRegex(pattern: string): RegExp | null {
  const result = createSafeRegex(pattern);
  if (result.safe && result.regex) {
    return result.regex;
  }
  console.warn(`Invalid regex pattern: ${result.error} (reason: ${result.reason})`);
  return null;
}

// For literal text matching
function createLiteralMatcher(text: string): RegExp {
  const escaped = escapeForRegex(text);
  return new RegExp(escaped);
}
```

### 9.5 Update Tests

Add tests to verify integration:

```typescript
import { SafeRegex, createSafeRegex, globToSafeRegex } from '@theunwalked/pressurelid';

describe('Loader with SafeRegex', () => {
  it('should handle safe ignore patterns', () => {
    const result = globToSafeRegex('**/*.md');
    expect(result.safe).toBe(true);
    expect(result.regex).toBeDefined();
    expect(result.regex!.test('docs/readme.md')).toBe(true);
  });

  it('should reject dangerous ignore patterns', () => {
    // Pattern with nested quantifiers (exponential backtracking)
    const result = createSafeRegex('^(a+)+$');
    expect(result.safe).toBe(false);
    expect(result.reason).toBe('nested_quantifiers');
  });

  it('should handle pattern length limits', () => {
    const longPattern = 'a'.repeat(1000);
    const safe = new SafeRegex({ maxLength: 500 });
    const result = safe.create(longPattern);
    expect(result.safe).toBe(false);
    expect(result.reason).toBe('pattern_too_long');
  });
});
```

### 9.6 Export for Consumers (Optional)

If downstream users need direct access to SafeRegex:

```typescript
// riotprompt/src/index.ts
export { SafeRegex, createSafeRegex, globToSafeRegex, escapeForRegex } from '@theunwalked/pressurelid';
```

## Acceptance Criteria

- [ ] `@theunwalked/pressurelid` installed as dependency
- [ ] Loader updated to use SafeRegex for ignore patterns
- [ ] Dangerous patterns are blocked (not executed)
- [ ] Blocked patterns logged with reason
- [ ] Audit logging integration (if Step 03 complete)
- [ ] Tests verify integration
- [ ] Documentation updated

## Files Changed

- `riotprompt/package.json` (add dependency)
- `riotprompt/src/loader.ts` (use SafeRegex)
- `riotprompt/tests/loader.test.ts` (add tests)
- `riotprompt/src/index.ts` (optional re-export)

## pressurelid API Reference

### SafeRegex Class

```typescript
const safe = new SafeRegex({
  maxLength: 500,        // Maximum pattern length (default: 500)
  timeoutMs: 1000,       // Execution timeout in ms (default: 1000)
  onBlock: (msg, pattern) => {},   // Called when pattern is blocked
  onWarning: (msg, pattern) => {}, // Called on warnings
});

// Create regex with safety checks
const result = safe.create('^hello$', 'i');
// { safe: true, regex: /^hello$/i, reason: 'ok' }

// Convert glob to regex
const globResult = safe.globToRegex('*.{ts,tsx}');

// Execute with timeout protection
const matches = await safe.testWithTimeout(/pattern/, 'input');
```

### Result Types

```typescript
interface SafeRegexResult {
  safe: boolean;           // Was the pattern deemed safe?
  regex?: RegExp;          // The compiled regex (if safe)
  error?: string;          // Error message (if not safe)
  reason?: SafeRegexReason; // Machine-readable reason code
}

type SafeRegexReason =
  | 'ok'
  | 'pattern_too_long'
  | 'nested_quantifiers'
  | 'overlapping_alternation'
  | 'catastrophic_backtracking'
  | 'invalid_syntax'
  | 'execution_timeout';
```

### Dangerous Patterns Detected

| Pattern Type | Example | Risk |
|-------------|---------|------|
| Nested quantifiers | `(a+)+` | Exponential backtracking |
| Overlapping alternation | `(a\|ab)+` | Polynomial backtracking |
| Repeated groups | `(.*a){20}` | Catastrophic backtracking |
| Deep nesting | `((a+)+)+` | Exponential backtracking |

## Notes

- The full SafeRegex implementation is in `pressurelid`, not in this codebase
- Static analysis cannot catch all ReDoS patterns - always use `testWithTimeout()` for runtime protection
- Consider re-exporting pressurelid types for downstream consumers
