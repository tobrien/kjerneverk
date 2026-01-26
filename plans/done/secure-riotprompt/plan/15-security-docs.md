# Step 15: Security Documentation

## Objective

Create comprehensive security documentation for all packages.

## Tasks

### 15.1 Create SECURITY.md for Each Package

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/SECURITY.md`:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing [security@example.com].

**Do not open a public GitHub issue for security vulnerabilities.**

You can expect:
- Acknowledgment within 48 hours
- Status update within 7 days
- Resolution timeline based on severity

## Security Features

RiotPrompt includes several security features to protect your AI workflows:

### Tool Execution Security
- **Parameter Validation**: All tool parameters can be validated against Zod schemas
- **Execution Sandboxing**: Tools run with configurable restrictions
- **Timeout Protection**: Automatic timeout for long-running tools

### Path Security
- **Path Validation**: Prevents directory traversal attacks
- **Base Path Restriction**: Limit file access to specific directories
- **Pattern Blocking**: Blocks dangerous path patterns

### Secret Protection
- **Automatic Redaction**: Sensitive data redacted in logs
- **API Key Security**: Keys validated and never logged
- **Error Sanitization**: Production errors don't leak secrets

### Request Security
- **Timeout Enforcement**: All external requests have timeouts
- **Rate Limiting Interfaces**: Built-in interfaces for rate limiting

## Secure Configuration

### Recommended Defaults

```typescript
import { configureSecurityDefaults } from '@theunwalked/riotprompt/security';

configureSecurityDefaults({
  paths: {
    enabled: true,
    basePaths: ['./prompts', './context'],
    allowAbsolute: false,
  },
  tools: {
    enabled: true,
    validateParams: true,
    sandboxExecution: true,
    maxExecutionTime: 30000,
  },
  secrets: {
    enabled: true,
    redactInLogs: true,
    redactInErrors: true,
  },
  timeouts: {
    enabled: true,
    llmTimeout: 120000,
    toolTimeout: 30000,
  },
});
```

## Known Limitations

1. **Tool Sandboxing**: Not true process isolation; tools share the Node.js process
2. **Regex Analysis**: Static analysis may not catch all ReDoS patterns
3. **Rate Limiting**: Interfaces provided; implementation is user responsibility

## Security Checklist

- [ ] Use environment variables for API keys, not CLI flags
- [ ] Configure base paths for file operations
- [ ] Enable parameter validation for tools
- [ ] Set appropriate timeouts
- [ ] Enable log redaction in production
- [ ] Review tool definitions for security
- [ ] Monitor audit logs for security events
```

### 15.2 Create Security Guide

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/guide/security.md`:

```markdown
# Security Guide

## Overview

This guide covers security best practices when using RiotPrompt and related packages.

## Threat Model

### Assets
- API Keys (OpenAI, Anthropic, Gemini)
- User Data in prompts and conversations
- File system access
- External API access

### Threats
1. **Tool Injection**: LLM generates malicious tool parameters
2. **Path Traversal**: Accessing files outside intended directories
3. **Secret Leakage**: API keys or sensitive data in logs/errors
4. **Resource Exhaustion**: Infinite loops, ReDoS, timeout failures
5. **Prompt Injection**: LLM output influences security-critical operations

### Mitigations
| Threat | Mitigation |
|--------|------------|
| Tool Injection | ToolGuard with Zod schema validation |
| Path Traversal | PathGuard with base path restrictions |
| Secret Leakage | SecretGuard with automatic redaction |
| Resource Exhaustion | TimeoutGuard, SafeRegex, rate limiting |
| Prompt Injection | Careful tool design, output validation |

## Configuration Examples

### Minimal Security (Development)
```typescript
// For local development only
const config = {
  paths: { enabled: false },
  tools: { enabled: false },
  secrets: { redactInLogs: false },
};
```

### Standard Security (Production)
```typescript
// Recommended for production
const config = {
  paths: {
    enabled: true,
    basePaths: [process.cwd()],
  },
  tools: {
    enabled: true,
    validateParams: true,
  },
  secrets: {
    enabled: true,
    redactInLogs: true,
  },
  timeouts: {
    enabled: true,
  },
};
```

### High Security (Sensitive Data)
```typescript
// For handling PII or sensitive data
const config = {
  paths: {
    enabled: true,
    basePaths: ['./approved'],
    allowAbsolute: false,
    allowSymlinks: false,
  },
  tools: {
    enabled: true,
    validateParams: true,
    sandboxExecution: true,
    allowedTools: ['read_file', 'search'], // Explicit allowlist
  },
  secrets: {
    enabled: true,
    redactInLogs: true,
    redactInErrors: true,
    // Add custom patterns for your data
    customPatterns: [/customer_id:\s*\d+/gi],
  },
  logging: {
    sanitizeStackTraces: true,
  },
};
```

## Best Practices

### API Key Management
1. **Never** pass API keys via CLI flags
2. Use environment variables
3. Use a secrets manager in production
4. Rotate keys regularly
5. Use separate keys for dev/prod

### Tool Development
1. Define Zod schemas for all parameters
2. Validate outputs as well as inputs
3. Implement proper error handling
4. Avoid shell commands when possible
5. Log security-relevant operations

### Prompt Security
1. Don't include secrets in prompts
2. Sanitize user input before prompting
3. Be cautious with user-provided file paths
4. Review LLM outputs before executing tools
```

### 15.3 Update All READMEs

Add security sections to all package READMEs.

### 15.4 Create Security Changelog Entry

Document security features in CHANGELOG.

## Acceptance Criteria

- [ ] SECURITY.md created for all packages
- [ ] Security guide created
- [ ] Threat model documented
- [ ] Configuration examples provided
- [ ] Best practices documented
- [ ] READMEs updated with security sections
- [ ] CHANGELOG entries for security features

## Files Changed

- `riotprompt/SECURITY.md` (new)
- `riotprompt/guide/security.md` (new)
- `agentic/SECURITY.md` (new)
- `execution/SECURITY.md` (new)
- All package README.md files (modified)
- `riotprompt/CHANGELOG.md` (modified)

