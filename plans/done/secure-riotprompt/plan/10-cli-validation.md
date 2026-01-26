# Step 10: CLI Input Validation via `@theunwalked/cardigantime`

## Objective

Add comprehensive input validation to CLI commands to prevent injection attacks and ensure safe operation.

## Background

**Vulnerability Addressed:** Missing CLI Input Validation (🟠 High)

CLI commands accept user input (paths, options) without validation:
- Path arguments could contain traversal sequences
- Numeric options parsed without range checking
- No validation of file types or extensions

## Dependency: cardigantime ✅ AVAILABLE

**Status:** `@theunwalked/cardigantime@0.0.22` is published and available on npm with comprehensive security validation features.

| Field | Value |
|-------|-------|
| Package | `@theunwalked/cardigantime` |
| Version | `^0.0.22` |
| Repository | https://github.com/utilarium/cardigantime |
| Homepage | https://utilarium.github.io/cardigantime/ |

### What cardigantime Provides

| Feature | Description |
|---------|-------------|
| **Zod Extensions** | `securePath()`, `secureNumber()`, `secureString()`, `secureEnum()` |
| **PathGuard** | Traversal detection, base directory enforcement, extension filtering |
| **NumericGuard** | Bounds checking, NaN/Infinity detection, safe integer ranges |
| **StringGuard** | Null byte detection, control character blocking, injection detection |
| **SecurityValidator** | Unified pipeline for CLI + config validation |
| **Security Profiles** | `development`, `production`, preset configurations |
| **SecurityAuditLogger** | Structured security event logging |

### cardigantime Security Features (v0.0.22+)

The cardigantime package now includes a full security module:

```typescript
// Zod schema extensions
import { securePath, secureNumber, secureString, secureEnum } from '@theunwalked/cardigantime';

// Guard classes
import { PathGuard, NumericGuard, StringGuard } from '@theunwalked/cardigantime';

// Validators
import { CLIValidator, ConfigValidator, SecurityValidator } from '@theunwalked/cardigantime';

// Profiles and logging
import { createProfile, SecurityAuditLogger } from '@theunwalked/cardigantime';
```

## Tasks

### 10.1 Add cardigantime Dependency

```bash
cd /Users/tobrien/gitw/kjerneverk/riotprompt
npm install @theunwalked/cardigantime@^0.0.22

cd /Users/tobrien/gitw/kjerneverk/riotprompt-cli
npm install @theunwalked/cardigantime@^0.0.22

cd /Users/tobrien/gitw/kjerneverk/riotplan-cli
npm install @theunwalked/cardigantime@^0.0.22
```

### 10.2 Define RiotPrompt Security Profile

Create a security profile specific to RiotPrompt:

```typescript
// riotprompt/src/security/cli-security.ts
import { 
  createProfile,
  PathGuard,
  securePath,
  secureNumber,
  secureString,
  type SecurityValidationConfig,
} from '@theunwalked/cardigantime';

// RiotPrompt-specific security profile
export const RIOTPROMPT_SECURITY_PROFILE: Partial<SecurityValidationConfig> = {
  enabled: true,
  failFast: true,
  paths: {
    enabled: true,
    allowTraversal: false,
    allowedExtensions: ['.md', '.json', '.xml', '.yaml', '.yml', '.txt'],
    maxPathLength: 500,
    allowHiddenFiles: false,
  },
  strings: {
    enabled: true,
    maxLength: 10000,
    allowNullBytes: false,
    allowControlChars: false,
  },
  numbers: {
    enabled: true,
    allowNaN: false,
    allowInfinity: false,
  },
};

// Create production profile
export function createRiotPromptProfile() {
  return createProfile('production')
    .failFast(true)
    .restrictPathsTo([process.cwd()])
    .allowExtensions(['.md', '.json', '.xml', '.yaml', '.yml', '.txt'])
    .build();
}

// Create path guard with riotprompt settings
export function createRiotPromptPathGuard() {
  return new PathGuard({
    baseDirectories: [process.cwd()],
    allowedExtensions: ['.md', '.json', '.xml', '.yaml', '.yml', '.txt'],
    maxPathLength: 500,
    allowHidden: false,
    allowSymlinks: false,
  });
}
```

### 10.3 Define Config Schema with Secure Types

Define Zod schemas for `riotprompt.yaml` using cardigantime's secure extensions:

```typescript
// riotprompt/src/config-schema.ts
import { z } from 'zod';
import { 
  securePath, 
  secureNumber, 
  secureString,
  secureEnum,
  securePort,
  secureTimeout,
  secureModelName,
} from '@theunwalked/cardigantime';

export const RiotPromptConfigSchema = z.object({
  // Model name with secure validation
  defaultModel: secureModelName().optional(),
  
  // Paths with traversal protection
  promptsDir: securePath({ 
    allowRelative: true,
    allowedExtensions: [], // Directories don't need extensions
  }).optional(),
  
  outputDir: securePath({ 
    allowRelative: true,
  }).optional(),
  
  // Enum with secure validation
  format: secureEnum(['text', 'json', 'xml']).optional(),
  
  // Numbers with range checking
  temperature: secureNumber(0, 2, { allowDecimal: true }).optional(),
  maxTokens: secureNumber(1, 100000, { integer: true }).optional(),
  
  // Timeout with preset
  timeout: secureTimeout().optional(),
});

export type RiotPromptConfig = z.infer<typeof RiotPromptConfigSchema>;
```

### 10.4 Update riotprompt CLI

Modify CLI to use cardigantime validation:

```typescript
// riotprompt/src/cli.ts
import { 
  PathGuard, 
  StringGuard,
  SecurityValidator,
  createProfile,
} from '@theunwalked/cardigantime';
import { createRiotPromptPathGuard } from './security/cli-security';

const pathGuard = createRiotPromptPathGuard();
const stringGuard = new StringGuard({
  maxLength: 10000,
  allowNullBytes: false,
  allowControlChars: false,
  allowAnsiEscapes: false,
});

export async function processAction(promptPath: string, options: Record<string, unknown>) {
  // Validate prompt path
  const pathResult = pathGuard.validate(promptPath);
  if (!pathResult.valid) {
    console.error(`Invalid path: ${pathResult.error}`);
    process.exit(1);
  }
  const safePath = pathResult.normalizedPath!;

  // Validate model name if provided
  if (options.model) {
    const modelResult = stringGuard.validate(options.model as string);
    if (!modelResult.valid) {
      console.error(`Invalid model name: ${modelResult.error}`);
      process.exit(1);
    }
  }

  // Validate output path if provided
  if (options.output) {
    const outputResult = pathGuard.validate(options.output as string);
    if (!outputResult.valid) {
      console.error(`Invalid output path: ${outputResult.error}`);
      process.exit(1);
    }
  }

  // ... rest of processing with validated inputs
}
```

### 10.5 Integrate with cardigantime Configuration

Use cardigantime's config management with security:

```typescript
// riotprompt/src/config.ts
import { create } from '@theunwalked/cardigantime';
import { RiotPromptConfigSchema } from './config-schema';

const cardigantime = create({
  defaults: {
    configDirectory: '.riotprompt',
    configFile: 'config.yaml',
    isRequired: false,
    security: {
      profile: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      auditLogging: true,
    },
  },
  configShape: RiotPromptConfigSchema.shape,
  features: ['config'],
});

export async function loadConfig(program: Command): Promise<RiotPromptConfig> {
  await cardigantime.configure(program);
  program.parse();
  
  const args = program.opts();
  const config = await cardigantime.read(args);
  await cardigantime.validate(config);
  
  return config as RiotPromptConfig;
}
```

### 10.6 Add Security Audit Logging

Log security-relevant events:

```typescript
// riotprompt/src/security/audit.ts
import { SecurityAuditLogger } from '@theunwalked/cardigantime';

export const auditLogger = new SecurityAuditLogger({
  enabled: process.env.NODE_ENV === 'production',
  destination: 'console', // or 'file' or custom handler
});

// Log path validation failures
pathGuard.onValidationFailure = (path, reason) => {
  auditLogger.log({
    type: 'path_validation_failed',
    severity: 'warning',
    details: { path, reason },
  });
};
```

### 10.7 Update riotprompt-cli

Apply the same validation patterns to the standalone CLI.

### 10.8 Update riotplan-cli

Apply validation when riotplan-cli is implemented.

## Acceptance Criteria

- [ ] `@theunwalked/cardigantime@^0.0.22` added to riotprompt
- [ ] `@theunwalked/cardigantime@^0.0.22` added to riotprompt-cli
- [ ] RiotPrompt security profile defined
- [ ] RiotPrompt config schema uses secure Zod types
- [ ] PathGuard validates all path inputs
- [ ] StringGuard validates string inputs
- [ ] NumericGuard validates numeric options
- [ ] Security audit logging enabled
- [ ] Integration tests pass
- [ ] Unit tests pass

## Testing

```typescript
import { 
  PathGuard, 
  NumericGuard, 
  StringGuard,
  securePath,
  secureNumber,
} from '@theunwalked/cardigantime';
import { RiotPromptConfigSchema, createRiotPromptPathGuard } from './security/cli-security';

describe('RiotPrompt CLI Security', () => {
  describe('PathGuard', () => {
    const pathGuard = createRiotPromptPathGuard();

    it('should reject path traversal attempts', () => {
      expect(pathGuard.validate('../../../etc/passwd').valid).toBe(false);
      expect(pathGuard.validate('..%2f..%2fetc/passwd').valid).toBe(false);
    });

    it('should accept valid paths', () => {
      expect(pathGuard.validate('prompts/test.md').valid).toBe(true);
      expect(pathGuard.validate('./prompts/test.md').valid).toBe(true);
    });

    it('should reject invalid extensions', () => {
      expect(pathGuard.validate('prompts/script.sh').valid).toBe(false);
      expect(pathGuard.validate('prompts/binary.exe').valid).toBe(false);
    });
  });

  describe('Config Schema', () => {
    it('should validate correct config', () => {
      const validConfig = { 
        defaultModel: 'gpt-4o', 
        promptsDir: './prompts',
        temperature: 0.7,
      };
      expect(() => RiotPromptConfigSchema.parse(validConfig)).not.toThrow();
    });

    it('should reject invalid temperature', () => {
      const invalidConfig = { temperature: 5 }; // out of range
      expect(() => RiotPromptConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject path traversal in config', () => {
      const invalidConfig = { promptsDir: '../../../etc' };
      expect(() => RiotPromptConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('StringGuard', () => {
    const stringGuard = new StringGuard({ allowNullBytes: false });

    it('should reject null bytes', () => {
      expect(stringGuard.validate('model\x00.name').valid).toBe(false);
    });

    it('should accept valid strings', () => {
      expect(stringGuard.validate('claude-3-opus-20240229').valid).toBe(true);
    });
  });
});
```

## Files Changed

- `riotprompt/package.json` (add cardigantime dependency)
- `riotprompt/src/security/cli-security.ts` (new - security profile)
- `riotprompt/src/config-schema.ts` (new - Zod schema with secure types)
- `riotprompt/src/config.ts` (new - cardigantime integration)
- `riotprompt/src/cli.ts` (modified - use validators)
- `riotprompt-cli/package.json` (add cardigantime dependency)
- `riotprompt-cli/src/cli.ts` (modified - use validators)

## cardigantime Security API Reference

### Zod Secure Extensions

```typescript
import { 
  securePath,      // Path with traversal protection
  secureNumber,    // Number with bounds and type checking
  secureString,    // String with injection detection
  secureEnum,      // Enum with strict validation
  securePort,      // Port number preset
  secureTimeout,   // Timeout preset
  secureModelName, // AI model name preset
} from '@theunwalked/cardigantime';

// Examples
const pathSchema = securePath({ 
  allowRelative: true,
  allowedExtensions: ['.md', '.json'],
});

const numberSchema = secureNumber(0, 100, { 
  integer: true,
  allowNaN: false,
});

const stringSchema = secureString({
  maxLength: 1000,
  allowNullBytes: false,
});
```

### Guard Classes

```typescript
import { PathGuard, NumericGuard, StringGuard } from '@theunwalked/cardigantime';

const pathGuard = new PathGuard({
  baseDirectories: [process.cwd()],
  allowedExtensions: ['.md', '.yaml'],
  maxPathLength: 500,
  allowHidden: false,
  allowSymlinks: false,
});

const result = pathGuard.validate(userPath);
// { valid: boolean, normalizedPath?: string, error?: string }
```

### Security Profiles

```typescript
import { createProfile, getSecurityDefaults } from '@theunwalked/cardigantime';

// Use preset
const prodProfile = createProfile('production')
  .failFast(true)
  .restrictPathsTo(['/app'])
  .build();

// Get defaults for environment
const defaults = getSecurityDefaults('production');
```

### Attack Vectors Covered

| Category | Vectors |
|----------|---------|
| Path Traversal | `../`, `..\\`, `%2e%2e/`, `%252e%252e/`, `.%2e/`, null bytes |
| Numeric | NaN, Infinity, overflow, underflow, out-of-range |
| String Injection | Null bytes, control chars, ANSI escapes, shell metacharacters |

## Notes

This step is now an **integration step** rather than an implementation step.

The heavy lifting (validation primitives, security profiles, path guards) is done by cardigantime. RiotPrompt's responsibility is:
1. Define its security profile (allowed extensions, etc.)
2. Define its config schema (Zod with secure types)
3. Wire up the validator in CLI commands
4. Wire up config validation on load

This ensures:
- Consistent security across all cardigantime-based tools
- Centralized security updates benefit all consumers
- Less code duplication across kjerneverk projects
