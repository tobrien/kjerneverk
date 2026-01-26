# What Happened: Secure RiotPrompt Plan

This document records the process of creating and revising the security enhancement plan for the kjerneverk project suite.

## Plan Genesis

The secure-riotprompt plan was created to address security vulnerabilities identified across the kjerneverk projects (riotprompt, agentic, execution-*, riotplan). The initial prompt positioned security as a **first-class feature**, not a patch.

### Original Prompt Goals

From `secure-riotprompt-prompt.md`:
1. Position RiotPrompt as a security-conscious framework
2. Create configurable protection that can be tuned per use-case
3. Implement defense in depth with multiple protection layers
4. Provide clear documentation on secure usage patterns
5. Build security-focused test suites

### Industry Context

The plan referenced similar frameworks that faced security incidents:
- **LangChain**: CVE-2023-29374 (arbitrary code execution), CVE-2023-36189 (SSRF)
- **LlamaIndex**: Path traversal in file loaders
- **OWASP LLM Top 10**: Prompt injection, insecure output handling, information disclosure

## Plan Structure Created

A 17-step execution plan was created across 5 phases:

### Phase 1: Security Foundation (Steps 01-03)
- Security types and configuration schemas
- Security testing infrastructure (attack vector fixtures)
- Audit logging infrastructure

### Phase 2: Critical Vulnerabilities (Steps 04-07)
- Tool parameter validation (ToolGuard)
- Tool execution sandboxing (ToolSandbox)
- API key security (SecretGuard → offrecord)
- Secure logging defaults

### Phase 3: High Priority Issues (Steps 08-11)
- Path security (PathGuard)
- Safe regex handling (ReDoS prevention)
- CLI input validation
- Request timeouts

### Phase 4: Medium/Low Priority (Steps 12-14)
- Deserialization validation
- Error message sanitization
- Hash truncation and misc security

### Phase 5: Documentation & Release (Steps 15-17)
- Security documentation
- Integration testing
- Release preparation

## Architectural Decisions During Review

### Decision 1: ToolGuard in agentic, not riotprompt

Steps 04 and 05 (Tool Validation and Sandboxing) were placed in `agentic` rather than `riotprompt` because:
- Tool validation is an *execution-time* concern
- `agentic` already owns `ToolRegistry` and `ToolContext`
- Any project using `agentic` gets security, not just riotprompt users

### Decision 2: Fjell Logging Integration

Step 07 was revised to integrate with `@fjell/logging` rather than building custom redaction:
- Fjell already has comprehensive masking middleware
- Avoids duplicating redaction logic
- Created dependency on Fjell security features plan

### Decision 3: offrecord as Separate Utility

Step 06 was revised to create `@theunwalked/offrecord` in utilarium:

**Original Approach**: `SecretGuard` class in `riotprompt/src/security/` with hardcoded patterns for all providers.

**Problems Identified**:
1. Centralized patterns violate Open/Closed Principle
2. Each provider already knows its own key format
3. Secret handling is a general-purpose utility with high reuse potential

**Revised Approach**:
- Create `offrecord` as a zero-dependency utility in utilarium
- Providers register their own patterns with offrecord
- SecureString class for memory-safe secret handling
- Reusable across any project handling credentials

See: `/Users/tobrien/gitw/kjerneverk/prompts/reverse-engineer-riotplan/what-happened-with-offrecord.md`

## Target Architecture

The final architecture distributes security concerns appropriately:

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  riotprompt  │  │   agentic    │  │  execution-* │          │
│  │  (prompts)   │  │  (workflows) │  │  (providers) │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         │     ToolGuard ◄─┘                 │                   │
│         │     ToolSandbox                   │                   │
│         │                                   │                   │
│         ▼                                   ▼                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  offrecord (utilarium)                                      ││
│  │  - SecretRedactor (extensible patterns)                     ││
│  │  - SecureString (memory safety)                             ││
│  │  - Safe error handling                                      ││
│  │  - Providers register their own patterns                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  @fjell/logging                                             ││
│  │  - Masking middleware                                        ││
│  │  - API key patterns (via Fjell security plan)               ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Key Principles Established

1. **Defense in Depth**: Multiple layers (input validation → schema validation → sandbox → output sanitization → audit logging)

2. **Secure by Default**: Security ON by default, configurable for advanced users

3. **Fail Secure**: Reject invalid inputs rather than trying to sanitize

4. **Non-Breaking**: All security features are additive—existing code continues to work

5. **Provider Ownership**: Each provider owns knowledge of its own key formats

## Files in This Plan

| File | Purpose |
|------|---------|
| `secure-riotprompt-prompt.md` | Original prompt/goals |
| `SUMMARY.md` | Executive summary and vulnerability list |
| `EXECUTION_PLAN.md` | Execution order and quality gates |
| `STATUS.md` | Progress tracking |
| `plan/01-*.md` through `plan/17-*.md` | Individual step specifications |

## Revision History

| Date | Change |
|------|--------|
| Initial | Plan created with 17 steps across 5 phases |
| Initial | Steps 04-05 placed in agentic package |
| Initial | Step 07 revised for Fjell integration |
| 2026-01-13 | Step 06 revised to create offrecord as separate utility |

## Lessons Learned

1. **Review before execution**: Architectural concerns (centralized patterns) were caught during review, not after implementation

2. **Reusability matters**: Extracting offrecord enables security benefits beyond kjerneverk

3. **Provider autonomy**: Letting providers register their own patterns follows sound architectural principles

4. **Document the process**: Recording how plans evolve helps understand decisions later

