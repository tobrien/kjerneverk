# Plan Verification - Summary

## Executive Summary

This plan implements verification capabilities for RiotPlan. Users can verify that their plans address all analysis requirements, and that execution has completed all steps as specified. The goal is to catch the "I forgot" problem systematically.

## Philosophy

### Verification, Not Enforcement

Verification is advisory, not blocking:
- Shows gaps and issues
- Provides alignment scores
- Generates verification questions
- Does NOT prevent execution

### Three Verification Points

1. **Analysis → Plan**: Does the plan address all requirements?
2. **Plan → Execution**: Was each step completed fully?
3. **End-to-End**: Does the outcome match the original intent?

### Machine-Readable Criteria

The analysis should contain parseable verification criteria:

```markdown
## Verification Criteria

### Must Have (Plan Fails Without)
- [ ] User authentication endpoint exists
- [ ] Session tokens have 24hr expiry

### Should Have (Plan Incomplete Without)
- [ ] Rate limiting on auth endpoints

### Could Have (Nice to Have)
- [ ] Remember me functionality
```

## Verification Commands

| Command | Description |
|---------|-------------|
| `riotplan verify` | Full verification (all checks) |
| `riotplan verify --analysis` | Check plan covers analysis |
| `riotplan verify --execution` | Check execution is complete |
| `riotplan verify --criteria` | Show all verification criteria |

## Example Output

### Analysis Verification

```
$ riotplan verify --analysis

Verification: Analysis → Plan Alignment
═══════════════════════════════════════

Checking requirements coverage...

✅ COVERED (5):
   • Authentication flow requirements → Steps 01-03
   • Database schema changes → Step 02
   • API documentation → Step 07
   • Unit test coverage → Step 05
   • Error handling patterns → Step 04

⚠️  PARTIAL (2):
   • Logging requirements → Step 04 (only error logging, not audit)
   • Performance targets → Not explicitly addressed

❌ MISSING (1):
   • Rate limiting requirement → Not found in any step

Verification Questions:
  1. Does step 02 include the session management from REQUIREMENTS.md?
  2. Is the JWT implementation aligned with security requirements?
  3. Where is rate limiting addressed?

Alignment Score: 78%
```

### Execution Verification

```
$ riotplan verify --execution

Verification: Plan → Execution Alignment
════════════════════════════════════════

Checking step completion...

Step 01 - Analysis ✅
  └─ All acceptance criteria met

Step 02 - Implementation ⚠️
  ├─ ✅ Database migrations created
  ├─ ❌ API endpoints not tested
  └─ ✅ Models implemented

Step 03 - Testing ❌
  └─ Marked complete but no test files found

Step 04 - Documentation ⬜
  └─ Not started

Execution Completeness: 45%
Outstanding items: 3
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VERIFICATION LAYER                     │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ CriteriaParser │  │ CoverageChecker│  │ GapReporter   │ │
│  │ (extract from  │  │ (match reqs to │  │ (format       │ │
│  │  analysis)     │  │  steps)        │  │  output)      │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        DATA SOURCES                         │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ REQUIREMENTS.md│  │ Step Files     │  │ STATUS.md     │ │
│  │ (criteria)     │  │ (acceptance)   │  │ (completion)  │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Integration with Existing Infrastructure

- Extends the existing `validatePlan()` in validator.ts
- Uses analysis loader from Plan 01
- Parses STATUS.md using existing status parser
- Adds verification to plan lifecycle without breaking changes

## Success Metrics

1. **Coverage**: Verification catches >80% of "forgotten" requirements
2. **Usability**: Verification runs in <5 seconds
3. **Actionable**: Output clearly indicates what to fix
4. **Non-blocking**: Does not interfere with existing workflows
