# Secure RiotPrompt - Execution Plan

> **Execute this file directly:** When you're ready to execute, just say "Execute /Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt/EXECUTION_PLAN.md"

## Execution Instructions

This plan is designed to be executed as a single unit. The executor should:

1. **Read STATUS.md first** to check current state
2. **Find the next pending step** in the execution sequence below
3. **Execute that step** by reading its detailed plan file
4. **Update STATUS.md** after each step completes
5. **Continue** until all steps are complete or a blocker is encountered

### State Management

All execution state is tracked in: `/Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt/STATUS.md`

After completing each step:
1. Mark the step as `✅ Completed` in STATUS.md
2. Record the completion timestamp
3. Note any issues encountered
4. Identify the next step to execute

---

## External Dependencies - All Available ✅

| Package | Version | Status |
|---------|---------|--------|
| `@theunwalked/offrecord` | ^0.0.2 | ✅ Published |
| `@theunwalked/pressurelid` | ^1.0.2 | ✅ Published |
| `@theunwalked/cardigantime` | ^0.0.22 | ✅ Published |
| `@theunwalked/spotclean` | ^0.0.3 | ✅ Published |
| `@fjell/logging` | ^4.4.68 | ✅ Published |

---

## Execution Sequence

Execute steps in order. Each step file contains detailed implementation instructions.

### Phase 1: Security Foundation

| Order | Step | File | Priority | Est. Time |
|-------|------|------|----------|-----------|
| 1 | Security Types | `plan/01-security-types.md` | Foundation | 30 min |
| 2 | Security Testing | `plan/02-security-testing.md` | Foundation | 45 min |
| 3 | Audit Logging | `plan/03-audit-logging.md` | Foundation | 30 min |

### Phase 2: Critical Vulnerabilities

| Order | Step | File | Priority | Dependency | Est. Time |
|-------|------|------|----------|------------|-----------|
| 4 | Tool Validation | `plan/04-tool-validation.md` | 🔴 Critical | - | 45 min |
| 5 | Tool Sandboxing | `plan/05-tool-sandboxing.md` | 🔴 Critical | - | 60 min |
| 6 | API Key Security | `plan/06-api-key-security.md` | 🔴 Critical | offrecord | 45 min |
| 7 | Secure Logging | `plan/07-secure-logging.md` | 🔴 Critical | @fjell/logging | 30 min |

### Phase 3: High Priority Issues

| Order | Step | File | Priority | Dependency | Est. Time |
|-------|------|------|----------|------------|-----------|
| 8 | Path Security | `plan/08-path-security.md` | 🟠 High | - | 45 min |
| 9 | Safe Regex | `plan/09-safe-regex.md` | 🟠 High | pressurelid | 30 min |
| 10 | CLI Validation | `plan/10-cli-validation.md` | 🟠 High | cardigantime | 45 min |
| 11 | Request Timeouts | `plan/11-request-timeouts.md` | 🟡 Medium | - | 30 min |

### Phase 4: Medium/Low Priority

| Order | Step | File | Priority | Dependency | Est. Time |
|-------|------|------|----------|------------|-----------|
| 12 | Deserialization | `plan/12-deserialization.md` | 🟡 Medium | - | 30 min |
| 13 | Error Sanitization | `plan/13-error-sanitization.md` | 🟡 Medium | spotclean | 30 min |
| 14 | Misc Security | `plan/14-misc-security.md` | 🟢 Low | - | 30 min |

### Phase 5: Documentation & Release

| Order | Step | File | Priority | Est. Time |
|-------|------|------|----------|-----------|
| 15 | Security Docs | `plan/15-security-docs.md` | Docs | 60 min |
| 16 | Integration Tests | `plan/16-integration-testing.md` | Testing | 60 min |
| 17 | Release | `plan/17-release.md` | Release | 30 min |

**Total Estimated Time:** ~11 hours

---

## How to Execute a Step

For each step:

1. **Read the step file** (e.g., `plan/01-security-types.md`)
2. **Implement all tasks** listed in the file
3. **Verify acceptance criteria** are met
4. **Run tests** to ensure nothing is broken
5. **Update STATUS.md** with completion status

### Quality Gates (Must Pass Before Moving On)

```bash
# After each step, verify:
cd /Users/tobrien/gitw/kjerneverk/riotprompt && npm run precommit
cd /Users/tobrien/gitw/kjerneverk/agentic && npm run precommit
cd /Users/tobrien/gitw/kjerneverk/execution && npm run precommit
# ... for each affected package
```

---

## Step Details Quick Reference

### Step 01: Security Types
- Create `SecurityConfig` type with all sub-configurations
- Create Zod schemas for validation
- Define default secure configuration
- **Affects:** riotprompt, agentic

### Step 02: Security Testing Infrastructure
- Create security test utilities (attack vectors)
- Create test fixtures for common attack scenarios
- **Affects:** All packages (test utilities)

### Step 03: Audit Logging
- Create `SecurityAuditLogger` class
- Define security event types
- **Affects:** riotprompt, agentic

### Step 04: Tool Validation
- Implement `ToolGuard` class with Zod integration
- Add validation hooks in ToolRegistry
- **Affects:** agentic

### Step 05: Tool Sandboxing
- Implement `ToolSandbox` class
- Add allowlist/denylist for tool operations
- **Affects:** agentic

### Step 06: API Key Security
- Install `@theunwalked/offrecord`
- Register provider patterns (OpenAI, Anthropic, Gemini)
- Use SecureString for key handling
- **Affects:** execution-openai, execution-anthropic, execution-gemini

### Step 07: Secure Logging
- Install `@fjell/logging`
- Configure masking by default
- Update ConversationLogger
- **Affects:** riotprompt, agentic

### Step 08: Path Security
- Implement `PathGuard` class
- Add path validation to loader
- **Affects:** riotprompt

### Step 09: Safe Regex
- Install `@theunwalked/pressurelid`
- Use SafeRegex for ignore patterns
- **Affects:** riotprompt

### Step 10: CLI Validation
- Install `@theunwalked/cardigantime`
- Define security profile and config schema
- Add validation to CLI commands
- **Affects:** riotprompt-cli, riotplan-cli

### Step 11: Request Timeouts
- Implement `TimeoutGuard` class
- Add default timeouts by provider
- **Affects:** execution, execution-*

### Step 12: Deserialization
- Add Zod schemas for serialized types
- Implement validated `fromJSON` methods
- **Affects:** agentic

### Step 13: Error Sanitization
- Install `@theunwalked/spotclean`
- Configure error sanitizer
- Add to all packages
- **Affects:** All packages

### Step 14: Misc Security
- Full-length hash option
- Silent-by-default logging
- Rate limiting interfaces
- **Affects:** riotprompt, agentic

### Step 15: Security Documentation
- Create security guides for each package
- Document threat model
- **Affects:** All packages (docs)

### Step 16: Integration Testing
- Create end-to-end security tests
- Attack simulation tests
- **Affects:** All packages (tests)

### Step 17: Release
- Update CHANGELOGs
- Create migration guide
- Version bump
- **Affects:** All packages

---

## Commit Strategy

Use security-focused commit messages:

```
security(agentic): add ToolGuard for parameter validation
security(riotprompt): implement PathGuard in loader
security(execution-openai): add request timeout enforcement
docs(security): add threat model documentation
```

---

## Rollback Strategy

All security features are:
- **Additive** (can be disabled via config)
- **Non-breaking** (existing APIs unchanged)
- **Feature-flagged** (major features can be turned off)

If a step causes issues:
1. The feature can be disabled via configuration
2. Previous code remains functional
3. Tests should catch regressions before merge

---

## Resume Instructions

If execution is interrupted:

1. Check `/Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt/STATUS.md`
2. Find the last completed step
3. Resume from the next pending step
4. Re-run quality gates for the current package before continuing

---

## Plan Evolution History

This plan underwent significant evolution during planning:

| Date | Event |
|------|-------|
| 2026-01-13 | Initial 17-step plan created |
| 2026-01-13 | Step 06 → spawned offrecord library |
| 2026-01-13 | Step 09 → spawned pressurelid library |
| 2026-01-13 | Step 10 → cardigantime enhanced with security |
| 2026-01-13 | Step 13 → spawned spotclean library |
| 2026-01-14 | All external dependencies published to npm |
| 2026-01-14 | Step 07 → @fjell/logging now has all features |
| 2026-01-14 | Plan ready for execution |

See `/Users/tobrien/gitw/kjerneverk/prompts/reverse-engineer-riotplan/` for detailed history.
