# Cross-Project Plan Coordination: Fjell Logging ↔ Kjerneverk Security

## Overview

This document tracks the relationship between plans in `fjellgrunn` and `kjerneverk` projects, specifically around logging and security features.

## The Problem

During the security review of Kjerneverk (riotprompt, agentic), we identified that:

1. **RiotPrompt had basic logging** - Simple console wrapper in `logger.ts`
2. **Fjell already has robust logging** - `@fjell/logging` with masking middleware
3. **Security plan called for redaction** - Step 07 was going to build custom masking

This was duplicative. The right solution is:
- Extend `@fjell/logging` with missing patterns (API keys, etc.)
- Have RiotPrompt depend on `@fjell/logging`

## Plan Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        FJELLGRUNN                                │
│  /Users/tobrien/gitw/fjellgrunn/status/prompts/                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ security-logging-features/                                │   │
│  │ - SUMMARY.md                                              │   │
│  │ - EXECUTION-PLAN.md                                       │   │
│  │ - STATUS.md                                               │   │
│  │                                                           │   │
│  │ Adds:                                                     │   │
│  │ - API key masking (OpenAI, Anthropic, AWS, GitHub, etc.) │   │
│  │ - Correlation ID support                                  │   │
│  │ - Password/secret patterns                                │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ DEPENDS ON
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        KJERNEVERK                                │
│  /Users/tobrien/gitw/kjerneverk/prompts/                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ secure-riotprompt/                                        │   │
│  │ - plan/07-secure-logging.md  ← SIMPLIFIED                │   │
│  │                                                           │   │
│  │ Now just:                                                 │   │
│  │ - Adds @fjell/logging dependency                          │   │
│  │ - Configures masking middleware                           │   │
│  │ - Updates ConversationLogger to use Fjell                 │   │
│  │                                                           │   │
│  │ Removed (moved to Fjell plan):                            │   │
│  │ - API key pattern definitions                             │   │
│  │ - Password patterns                                       │   │
│  │ - Custom masking implementation                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Execution Order

```
1. FIRST: fjellgrunn/security-logging-features
   ├── Phase 1: API key masking patterns
   ├── Phase 2: Correlation ID support
   └── Phase 3: Documentation & release

2. THEN: kjerneverk/secure-riotprompt
   ├── Step 07: Integrate @fjell/logging (BLOCKED until Fjell plan done)
   └── Other steps can proceed in parallel
```

## Key Decision Made

**Date:** 2026-01-13

**Decision:** Use `@fjell/logging` for all masking/redaction in Kjerneverk rather than building custom solution.

**Rationale:**
1. Don't duplicate effort - Fjell already has masking infrastructure
2. Fjell masking is battle-tested with performance profiling
3. Centralizes security patterns in one place
4. RiotPrompt stays focused on prompt engineering, not logging

**Trade-offs:**
- Adds external dependency
- Couples release schedules (need Fjell features before Kjerneverk security)
- Users get comprehensive masking "for free" via dependency

## What Each Plan Owns

### Fjell Logging Plan Owns:
- Pattern definitions for all secret types
- Masking algorithm implementation
- Performance optimization
- Correlation ID infrastructure
- Documentation of masking patterns

### Kjerneverk Security Plan Owns:
- Integration/configuration of Fjell logging
- Security audit logging (typed security events)
- Error sanitization
- Security-specific test fixtures
- Documentation of secure usage patterns

## Gaps Identified

| Gap | Goes Where | Rationale |
|-----|------------|-----------|
| API key patterns | Fjell | Core masking capability |
| Correlation IDs | Fjell | Generic logging feature |
| Security event types | Kjerneverk | Domain-specific to AI agents |
| Error redaction | Kjerneverk | Not a logging concern |
| Audit logging | Kjerneverk | Domain-specific to AI agents |

## Status Tracking

| Plan | Location | Status |
|------|----------|--------|
| Fjell Security Logging | `fjellgrunn/status/prompts/security-logging-features/` | `PLANNING_COMPLETE` |
| Kjerneverk Secure RiotPrompt | `kjerneverk/prompts/secure-riotprompt/` | `PLANNING_COMPLETE` |

### Blocking Relationships

- kjerneverk Step 07 is **BLOCKED** by Fjell security-logging-features
- Other kjerneverk steps (01-06, 08-17) can proceed independently

## Observations for RiotPlan

This cross-project coordination reveals patterns for RiotPlan:

### 1. Cross-Project Dependencies
Plans can depend on plans in other projects. Need:
- A way to express "blocked by external plan"
- Status tracking across project boundaries
- Notifications when upstream plans complete

### 2. Plan Splitting
A single plan may need to be split across projects based on ownership:
- Original: "Implement secure logging in RiotPrompt"
- Split into: "Add patterns to Fjell" + "Integrate Fjell in RiotPrompt"

### 3. Coordination Documents
This file (`what-happened-in-fjell-logging.md`) serves as a coordination point:
- Documents the relationship
- Explains the decision
- Tracks status across both projects

### 4. Execution Order Constraints
Some steps can run in parallel, others have strict ordering:
- Fjell plan MUST complete before Kjerneverk step 07
- Other Kjerneverk steps have no external dependencies

## Links

- Fjell Logging Source: `/Users/tobrien/gitw/fjellgrunn/logging/`
- Fjell Plan: `/Users/tobrien/gitw/fjellgrunn/status/prompts/security-logging-features/`
- Kjerneverk Plan: `/Users/tobrien/gitw/kjerneverk/prompts/secure-riotprompt/`
- RiotPrompt Logger: `/Users/tobrien/gitw/kjerneverk/riotprompt/src/logger.ts`

---

## 2026-01-13: Meta-Observation - Plan Proliferation and User Overwhelm

### The Problem

During this planning session, a critical observation emerged:

**The user reported feeling overwhelmed by the complexity and simultaneous work happening across multiple projects.**

### What's Happening

The user is now tracking:

| Plan | Project | Steps | Status |
|------|---------|-------|--------|
| secure-riotprompt | kjerneverk | 17 steps | Planning complete |
| security-logging-features | fjellgrunn | 3 phases | Planning complete |
| big-splitup | kjerneverk | 11 steps | Near complete |
| (other work) | various | ? | In progress |

This creates cognitive load:
- Which plan am I working on?
- What's blocked on what?
- Did something finish that unblocks my work?
- Where should I focus?

### Why This Matters for RiotPlan

This cross-project coordination case study reveals that:

1. **Plans spawn other plans** - Security review → security plan → logging plan
2. **Plans have cross-project dependencies** - Kjerneverk blocked on Fjell
3. **Users lose track** - "Overwhelmed with complexity"
4. **Manual tracking doesn't scale** - These `what-happened-in-*.md` files are a workaround

### RiotPlan Requirements Implied

1. **Multi-Plan Dashboard**
   ```
   Active Plans:
   ├── kjerneverk/secure-riotprompt [7/17] ⏸️ Step 7 blocked
   │   └── Blocked by: fjellgrunn/security-logging-features
   ├── fjellgrunn/security-logging-features [0/3] ⬜ Ready
   └── kjerneverk/big-splitup [10/11] 🔄 In progress
   ```

2. **Dependency Notifications**
   ```
   fjellgrunn/security-logging-features completed!
   This unblocks: kjerneverk/secure-riotprompt Step 7
   ```

3. **Context Preservation**
   - Where was I?
   - What was I thinking?
   - What's the next action?

4. **Plan Spawning**
   - Track when one plan creates another
   - Maintain relationship graph
   - Roll-up progress across related plans

### Current State

These manual coordination documents serve as proto-RiotPlan:
- `what-happened-in-fjell-logging.md` (this file) tracks Fjell↔Kjerneverk
- `what-happened-in-riotplan.md` tracks secure-riotprompt planning
- `what-happened-in-kodrdriv-versions.md` tracks version strategy

**This approach doesn't scale.** RiotPlan needs to formalize these patterns.

---

*Last Updated: 2026-01-13*

---

## 2026-01-14: @fjell/logging Features Complete - Step 07 Unblocked

### Resolution

The `@fjell/logging` package (v4.4.68) now includes all the security features that were planned:

| Feature | Status | Location |
|---------|--------|----------|
| API Key Masking | ✅ Implemented | Built-in patterns |
| Correlation IDs | ✅ Implemented | `createCorrelatedLogger()`, `generateCorrelationId()` |
| Password Patterns | ✅ Implemented | Built-in patterns |
| Circular Reference Protection | ✅ Implemented | Automatic |
| Performance Optimization | ✅ Implemented | Async logging, buffering |

### Patterns Available in @fjell/logging

The package masks these secret types out of the box:

- **OpenAI**: `sk-*`, `sk-proj-*`
- **Anthropic**: `sk-ant-*`
- **AWS**: Access keys, secret keys
- **GitHub**: `ghp_*`, `gho_*`, `ghu_*`, `ghs_*`, `ghr_*`
- **GitLab**: `glpat-*`
- **Slack**: `xox*-*`
- **Google Cloud**: `AIza*`
- **Generic**: `api_key=`, `apikey:`, `password=`, `Bearer *`
- **PII**: Email addresses, SSNs
- **Crypto**: Private keys, JWTs, base64 blobs

### Updated Plan Files

| File | Change |
|------|--------|
| `secure-riotprompt/plan/07-secure-logging.md` | Complete rewrite to use @fjell/logging |
| `secure-riotprompt/STATUS.md` | Step 07 no longer blocked |
| `secure-riotprompt/EXECUTION_PLAN.md` | Added @fjell/logging to dependencies |

### How Kjerneverk Will Use @fjell/logging

```typescript
import Logging, { maskWithConfig, createCorrelatedLogger, generateCorrelationId } from '@fjell/logging';

// Get a logger
const LibLogger = Logging.getLogger('@theunwalked/riotprompt');
const componentLogger = LibLogger.get('Loader');

// Mask sensitive content
const config = { enabled: true, maskApiKeys: true, maskPasswords: true };
const masked = maskWithConfig('API key: sk-abc123 password=secret', config);
// Output: "API key: **** ****"

// Request correlation
const correlationId = generateCorrelationId();
const requestLogger = createCorrelatedLogger(componentLogger, correlationId);
requestLogger.info('Processing request');
// Output: [lq2x5k-abc123] Processing request
```

### Impact on Execution

With @fjell/logging ready:

1. **Step 07 is now UNBLOCKED** and can be executed
2. **All 17 steps** have their dependencies available
3. **Execution can proceed** without any blockers

### The Dependency Chain (Complete)

```
@fjell/logging (v4.4.68) ─────────────────────┐
                                              │
@theunwalked/offrecord (v0.0.2) ──────────────┤
                                              │
@theunwalked/pressurelid (v1.0.2) ────────────┼──► secure-riotprompt
                                              │     (17 steps, all unblocked)
@theunwalked/cardigantime (v0.0.22) ──────────┤
                                              │
@theunwalked/spotclean (v0.0.3) ──────────────┘
```

All five external dependencies are now published and available. The secure-riotprompt plan can be executed in full.

