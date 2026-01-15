# Step 17: Release Preparation

## Objective

Prepare security enhancements for release across all packages.

## Tasks

### 17.1 Update CHANGELOG

Add security section to `/Users/tobrien/gitw/kjerneverk/riotprompt/CHANGELOG.md`:

```markdown
## [0.x.x] - 2026-0x-xx

### Security

This release includes comprehensive security enhancements. See the [Security Guide](./guide/security.md) for details.

#### New Security Features

- **ToolGuard**: Schema-based validation of tool parameters with Zod integration
- **ToolSandbox**: Execution timeout and resource limits for tools
- **PathGuard**: Path traversal prevention with base directory restrictions
- **SecretGuard**: Automatic redaction of sensitive data in logs and errors
- **TimeoutGuard**: Request timeout enforcement for LLM and tool calls
- **SafeRegex**: ReDoS protection for user-provided regex patterns
- **CLIValidator**: Input validation for command-line arguments
- **ErrorSanitizer**: Production-safe error messages with correlation IDs
- **SecurityAuditLogger**: Security event logging and monitoring

#### Breaking Changes

- `ConversationLogger` now defaults to `redactSensitive: true`
  - Migration: Set `redactSensitive: false` explicitly if needed

#### Security Fixes

- Tool parameters are now validated before execution
- Path traversal attacks are blocked in file operations
- API keys are validated and never logged
- Regex patterns are analyzed for ReDoS vulnerabilities
- Error messages are sanitized in production mode
- Hash truncation increased from 16 to 32 characters

### Added

- Security configuration via `SecurityConfig` type
- Global security guards: `getToolGuard()`, `getPathGuard()`, etc.
- Security test utilities and attack vector fixtures
- Security documentation and threat model
```

### 17.2 Update Version Numbers

Bump versions appropriately:
- If security changes are additive: minor version bump (0.x+1.0)
- If breaking changes: major version bump (1.0.0)

### 17.3 Create Migration Guide

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/MIGRATION.md`:

```markdown
# Migration Guide

## Upgrading to Security-Enhanced Version

### From < 0.x.x to >= 0.x.x

#### Breaking Changes

1. **Logging Redaction Default**
   
   `ConversationLogger` now redacts sensitive data by default.
   
   Before:
   ```typescript
   // Logs included API keys, passwords, etc.
   const logger = new ConversationLogger({ enabled: true });
   ```
   
   After:
   ```typescript
   // Logs are now redacted by default
   const logger = new ConversationLogger({ enabled: true });
   
   // To opt-out (development only):
   const logger = new ConversationLogger({ 
     enabled: true, 
     redactSensitive: false 
   });
   ```

#### New Features (Opt-In)

Most security features are opt-in to maintain backward compatibility:

```typescript
// Tool validation (opt-in)
const registry = ToolRegistry.create()
  .withSecurity(new ToolGuard());

// Path validation (opt-in)  
const storage = Storage.create({ pathGuard: new PathGuard() });

// Timeouts (opt-in)
const provider = new OpenAIProvider(new TimeoutGuard());
```

#### Recommended Configuration

For production use, we recommend enabling all security features:

```typescript
import { configureSecurityDefaults } from '@theunwalked/riotprompt/security';

configureSecurityDefaults(); // Applies secure defaults globally
```
```

### 17.4 Publish Preparation

Prepare for publishing:

1. Run full test suite
2. Run security tests specifically
3. Check bundle size impact
4. Test in example applications
5. Update package.json files

```bash
# Test all packages
npm run test --workspaces

# Run security tests
npm run test:security -w riotprompt

# Check bundle size
npm run build --workspaces
du -sh */dist

# Dry run publish
npm publish --dry-run --workspaces
```

### 17.5 Create Release Notes

Create GitHub release notes template:

```markdown
## RiotPrompt v0.x.x - Security Enhanced Release

This release introduces comprehensive security features for safer AI agent execution.

### Highlights

🔐 **Tool Security**: Parameters validated before execution
🛡️ **Path Protection**: Traversal attacks blocked
🔑 **Secret Safety**: Automatic redaction in logs
⏱️ **Timeout Enforcement**: No more hanging requests
📋 **Audit Logging**: Track security events

### Getting Started

```bash
npm install @theunwalked/riotprompt@latest
```

See the [Security Guide](./guide/security.md) for configuration.

### Full Changelog

See [CHANGELOG.md](./CHANGELOG.md)
```

### 17.6 Security Announcement

Prepare security advisory if any fixes address exploitable vulnerabilities.

## Acceptance Criteria

- [ ] CHANGELOG updated
- [ ] Version numbers bumped
- [ ] Migration guide created
- [ ] All tests passing
- [ ] Security tests passing
- [ ] Bundle size acceptable
- [ ] Release notes prepared
- [ ] npm publish dry-run successful

## Files Changed

- All `package.json` files (version bump)
- `riotprompt/CHANGELOG.md` (modified)
- `riotprompt/MIGRATION.md` (new)
- GitHub release draft

## Post-Release

After release:
1. Monitor for issues
2. Update documentation site
3. Announce in relevant channels
4. Monitor security-related bug reports
5. Plan for next security review cycle

