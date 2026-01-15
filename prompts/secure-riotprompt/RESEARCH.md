# Security Research: Similar Tools and Their Challenges

## Overview

This document captures research on security challenges faced by similar LLM orchestration frameworks. This informs our approach to securing RiotPrompt.

## Similar Tools Analysis

### LangChain

**Description**: Popular Python/JS framework for building LLM-powered applications.

**Security Issues Identified**:

| CVE/Issue | Description | Severity | Resolution |
|-----------|-------------|----------|------------|
| CVE-2023-29374 | Arbitrary code execution via tool arguments | Critical | Input validation added |
| CVE-2023-36189 | SSRF via web tools | High | URL validation |
| CVE-2023-36258 | Path traversal in file loaders | High | Path sanitization |
| CVE-2023-38896 | Code injection in Python REPL tool | Critical | Sandboxing |
| General | Prompt injection via tool outputs | Medium | Output validation |

**Lessons Learned**:
- Tool input validation is essential
- User-provided code execution needs sandboxing
- File operations need path validation
- Network operations need URL validation

**How LangChain Addressed**:
- Added `Tool.input_schema` for Pydantic validation
- Introduced experimental sandboxing
- Added security warnings in documentation
- Created security-focused agents

### LlamaIndex

**Description**: Data framework for LLM applications, focused on RAG.

**Security Issues Identified**:

| Issue | Description | Severity | Resolution |
|-------|-------------|----------|------------|
| Path Traversal | File readers accepted `../` sequences | High | Path normalization |
| Arbitrary Queries | SQL/DB tools executed arbitrary queries | Critical | Query parameterization |
| Data Leakage | Embeddings could leak sensitive data | Medium | Data filtering |
| Token Injection | Special tokens in documents | Medium | Token sanitization |

**Lessons Learned**:
- Data ingestion pipelines are attack surfaces
- Database tools need parameterization
- Embeddings can encode sensitive information
- Document preprocessing needs security review

### AutoGPT / AgentGPT

**Description**: Autonomous AI agents that execute multi-step tasks.

**Security Issues Identified**:

| Issue | Description | Severity | Resolution |
|-------|-------------|----------|------------|
| Unrestricted File Access | Could read/write any file | Critical | Allowlists |
| Command Injection | Shell commands from LLM | Critical | Command filtering |
| Infinite Loops | No execution limits | High | Iteration limits |
| Resource Exhaustion | Unbounded API calls | High | Rate limiting |

**Lessons Learned**:
- Autonomous agents need strict boundaries
- Allowlists are safer than denylists
- Execution limits are essential
- Human-in-the-loop for dangerous operations

### Microsoft Semantic Kernel

**Description**: SDK for building AI applications with plugins.

**Security Approach**:
- Strong TypeScript/C# typing throughout
- Plugin permission model
- Built-in parameter validation
- Prompt safety guidelines

**Notable Security Features**:
- Skill/plugin isolation
- Template-based prompts (reduced injection surface)
- Explicit function registration
- Kernel-level security policies

### Guidance (Microsoft)

**Description**: Language for controlling LLM generation.

**Security Approach**:
- Constrained generation reduces injection
- Typed outputs
- Schema-based validation
- No arbitrary code execution by default

## OWASP LLM Top 10 (2025)

| # | Risk | RiotPrompt Mitigation |
|---|------|----------------------|
| LLM01 | Prompt Injection | Tool validation, output sanitization |
| LLM02 | Insecure Output Handling | ToolGuard parameter validation |
| LLM03 | Training Data Poisoning | N/A (we don't train) |
| LLM04 | Denial of Service | Timeouts, rate limiting interfaces |
| LLM05 | Supply Chain | Dependency auditing (npm audit) |
| LLM06 | Sensitive Info Disclosure | SecretGuard, error sanitization |
| LLM07 | Insecure Plugin Design | ToolSandbox, validation |
| LLM08 | Excessive Agency | Allowlists, human checkpoints |
| LLM09 | Overreliance | N/A (user responsibility) |
| LLM10 | Model Theft | N/A (API-based) |

## Common Vulnerability Patterns

### 1. Tool Parameter Injection

**Pattern**: LLM generates malicious parameters passed directly to tools.

```
LLM Output: { "command": "rm -rf /", "file": "../../../etc/passwd" }
     ↓
Tool executes without validation
     ↓
System compromised
```

**Our Mitigation**: ToolGuard with Zod schema validation.

### 2. Path Traversal

**Pattern**: User or LLM provides paths that escape intended directories.

```
User Input: "Load context from ../../../etc/passwd"
     ↓
Loader resolves relative path
     ↓
Sensitive file read
```

**Our Mitigation**: PathGuard with base path restrictions.

### 3. Credential Leakage

**Pattern**: API keys appear in logs, errors, or outputs.

```
Error: "Failed to connect with key sk-abc123..."
     ↓
Error logged to file
     ↓
Log file accessed
     ↓
API key compromised
```

**Our Mitigation**: SecretGuard with automatic redaction.

### 4. ReDoS (Regular Expression Denial of Service)

**Pattern**: User-provided regex with exponential backtracking.

```
User Pattern: ^(a+)+$
Test Input: "aaaaaaaaaaaaaaaaaaaaaaaab"
     ↓
Regex engine backtracks exponentially
     ↓
Server hangs
```

**Our Mitigation**: SafeRegex with pattern analysis and timeouts.

### 5. Unbounded Resource Usage

**Pattern**: Operations without limits consume all resources.

```
LLM: "Keep calling this tool until done"
     ↓
Infinite loop
     ↓
API costs / resource exhaustion
```

**Our Mitigation**: Timeouts, iteration limits, rate limiting interfaces.

## Security Architecture Comparison

| Feature | LangChain | LlamaIndex | Semantic Kernel | RiotPrompt (Planned) |
|---------|-----------|------------|-----------------|---------------------|
| Input Validation | Pydantic | Pydantic | C#/TS Types | Zod |
| Path Security | Basic | Basic | N/A | PathGuard |
| Tool Sandboxing | Experimental | No | Plugin Isolation | ToolSandbox |
| Secret Redaction | No | No | No | SecretGuard |
| Timeout Enforcement | Partial | No | Yes | TimeoutGuard |
| Audit Logging | No | No | Partial | SecurityAuditLogger |

## Recommendations from Research

### Immediate (Critical)
1. **Validate all tool parameters** - Don't trust LLM output
2. **Restrict file operations** - Base path enforcement
3. **Redact secrets** - In logs, errors, and outputs

### Important (High)
4. **Enforce timeouts** - All external operations
5. **Safe regex handling** - User patterns are dangerous
6. **Input validation** - CLI and API inputs

### Good Practice (Medium)
7. **Schema validation** - For all deserialization
8. **Error sanitization** - Production vs. development
9. **Rate limiting interfaces** - For external integrations

### Nice to Have (Low)
10. **Audit logging** - Security event tracking
11. **Silent defaults** - Libraries shouldn't log by default
12. **Full-length hashes** - Avoid collisions

## References

- OWASP LLM Top 10: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- LangChain Security: https://python.langchain.com/docs/security
- LlamaIndex Security: https://docs.llamaindex.ai/en/stable/understanding/security/
- Semantic Kernel Security: https://learn.microsoft.com/semantic-kernel/security
- NVD CVE Database: https://nvd.nist.gov/

---

*Research conducted: 2026-01-13*

