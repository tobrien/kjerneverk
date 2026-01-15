# Secure RiotPrompt - Summary

## Executive Summary

This plan implements comprehensive security enhancements across the kjerneverk project suite (riotprompt, agentic, execution-*, riotplan). Security is positioned as a **first-class feature**, not just a patch. RiotPrompt will differentiate itself by offering configurable, well-documented security controls for AI agent execution.

## Security Philosophy

### Defense in Depth
Multiple layers of protection ensure that if one control fails, others provide backup:
- Input validation (first line)
- Schema validation (type safety)
- Sandbox restrictions (runtime protection)
- Output sanitization (logging/errors)
- Audit logging (detection/forensics)

### Secure by Default (Configurable)
Default configurations prioritize security, but allow advanced users to adjust:
- Sensitive data redaction: ON by default
- Path validation: ON by default
- Tool parameter validation: ON by default
- Request timeouts: Enforced by default

### Fail Secure
When security checks fail, the system should fail safely:
- Reject invalid inputs rather than trying to sanitize
- Log security events for audit
- Provide generic error messages externally

## Identified Vulnerabilities by Priority

### 🔴 Critical
1. **Tool Execution Without Sandboxing** - User functions execute without restrictions
2. **Unsafe JSON Parsing of Tool Arguments** - LLM output parsed without validation
3. **API Key Handling** - Keys could be logged or exposed in errors

### 🟠 High
4. **Path Traversal in File Operations** - No validation of file paths
5. **ReDoS in Ignore Patterns** - User regex patterns not bounded
6. **Insecure Redaction Defaults** - Sensitive data not redacted by default
7. **Missing CLI Input Validation** - Paths and options not sanitized

### 🟡 Medium
8. **Deserialization Without Schema Validation** - fromJSON() trusts input
9. **Glob Pattern Injection** - User patterns could escape intended scope
10. **Missing Request Timeouts** - LLM calls could hang indefinitely
11. **Error Information Disclosure** - Stack traces reveal internals

### 🟢 Low
12. **Missing Rate Limiting** - No protection against API abuse
13. **Weak Hash Truncation** - Collision risk in deduplication
14. **Console Logging in Libraries** - Default logging could leak data

## Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  riotprompt  │  │   agentic    │  │  execution-* │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
├─────────┼─────────────────┼─────────────────┼───────────────────┤
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              SECURITY LAYER (NEW)                          │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │ │
│  │  │ PathGuard   │ │ ToolGuard   │ │ SecretGuard │         │ │
│  │  │ (validation)│ │ (sandbox)   │ │ (redaction) │         │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘         │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │ │
│  │  │ InputGuard  │ │ TimeoutGuard│ │ AuditLogger │         │ │
│  │  │ (validation)│ │ (limits)    │ │ (events)    │         │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘         │ │
│  └────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     FILE SYSTEM / NETWORK                        │
└─────────────────────────────────────────────────────────────────┘
```

## New Exports/Types

The plan introduces these new concepts (additive, non-breaking):

### Security Configuration
```typescript
interface SecurityConfig {
  paths: PathSecurityConfig;
  tools: ToolSecurityConfig;
  secrets: SecretSecurityConfig;
  logging: LogSecurityConfig;
  timeouts: TimeoutConfig;
}
```

### Guard Classes
```typescript
// Path security
class PathGuard { validate(path: string, options?): string }

// Tool security  
class ToolGuard { validateParams(params: unknown, schema: ZodSchema): T }

// Secret security
class SecretGuard { redact(content: string): string }

// Timeout enforcement
class TimeoutGuard { wrap<T>(promise: Promise<T>, ms: number): Promise<T> }
```

### Secure Defaults
```typescript
// New factory functions with secure defaults
function createSecureToolRegistry(config?: SecurityConfig): ToolRegistry
function createSecureLoader(config?: SecurityConfig): Loader
function createSecureConversationBuilder(config?: SecurityConfig): ConversationBuilder
```

## Similar Tools Analysis

### LangChain
- Has faced multiple CVEs related to tool execution
- Introduced "Tool Input Schema" validation after incidents
- Added experimental sandboxing for Python code execution
- **Lesson**: Schema validation is essential, sandboxing is hard

### LlamaIndex
- Path traversal issues in early file readers
- Added path validation in later versions
- Uses pydantic for input validation
- **Lesson**: File operations need careful path handling

### AutoGPT/AgentGPT
- Unrestricted file system access in early versions
- Command injection via tool parameters
- Added allowlist-based command restrictions
- **Lesson**: Allowlists are safer than denylists

### Microsoft Semantic Kernel
- Strong typing throughout
- Built-in parameter validation
- Sandbox mode for plugins
- **Lesson**: Type safety provides security benefits

## Implementation Approach

1. **Non-Breaking**: All security features are additive
2. **Optional**: Existing code continues to work
3. **Documented**: Clear migration path to secure patterns
4. **Tested**: Security-focused test suites
5. **Configurable**: Tune security vs. flexibility tradeoff

## Timeline Estimate

| Phase | Steps | Description | Estimate |
|-------|-------|-------------|----------|
| 1 | 01-03 | Foundation & Infrastructure | 2-3 days |
| 2 | 04-07 | Critical Vulnerabilities | 3-4 days |
| 3 | 08-11 | High Priority Issues | 3-4 days |
| 4 | 12-14 | Medium/Low Issues | 2-3 days |
| 5 | 15-17 | Documentation & Release | 2-3 days |

**Total: ~12-17 working days**

## Success Metrics

1. **Coverage**: All identified vulnerabilities have mitigations
2. **Tests**: Security test coverage >80%
3. **Documentation**: Each security feature documented with examples
4. **Compatibility**: Zero breaking changes to existing APIs
5. **Adoption**: Clear "getting started with security" guide

