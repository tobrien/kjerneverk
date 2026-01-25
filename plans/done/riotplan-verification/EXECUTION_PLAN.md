# Plan Verification - Execution Plan

> **Execute this file directly:** When ready, say "Execute /Users/tobrien/gitw/kjerneverk/plans/riotplan-verification/EXECUTION_PLAN.md"

## Execution Instructions

1. **Read STATUS.md first** to check current state
2. **Find the next pending step** in the sequence below
3. **Execute that step** by reading its detailed plan file
4. **Update STATUS.md** after each step completes
5. **Continue** until all steps are complete

### Prerequisites

This plan depends on Plan 01 (Interactive Creation). Ensure the analysis directory structure is implemented before starting.

---

## Execution Sequence

### Phase 1: Foundation

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 1 | Verification Types | `plan/01-verification-types.md` | 30 min |
| 2 | Criteria Parser | `plan/02-criteria-parser.md` | 45 min |

### Phase 2: Analysis Verification

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 3 | Coverage Checker | `plan/03-coverage-checker.md` | 60 min |
| 4 | Analysis Verify Command | `plan/04-analysis-verify-command.md` | 45 min |

### Phase 3: Execution Verification

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 5 | Completion Checker | `plan/05-completion-checker.md` | 60 min |
| 6 | Execution Verify Command | `plan/06-execution-verify-command.md` | 45 min |

### Phase 4: Integration

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 7 | Unified Verify Command | `plan/07-unified-verify-command.md` | 45 min |
| 8 | Documentation | `plan/08-documentation.md` | 30 min |

**Total Estimated Time:** ~6 hours

---

## Quality Gates

```bash
# After each step:
cd /Users/tobrien/gitw/kjerneverk/riotplan && npm run precommit
```

---

## Step Details Quick Reference

### Step 01: Verification Types
- Define VerificationResult, CoverageReport types
- Define severity levels (must/should/could)
- **Affects:** riotplan/src/verification/

### Step 02: Criteria Parser
- Parse verification criteria from REQUIREMENTS.md
- Extract checklist items with priority levels
- **Affects:** riotplan/src/verification/

### Step 03: Coverage Checker
- Match analysis requirements to plan steps
- Calculate coverage percentage
- **Affects:** riotplan/src/verification/

### Step 04: Analysis Verify Command
- `riotplan verify --analysis` implementation
- Display coverage report
- **Affects:** riotplan/src/cli/commands/

### Step 05: Completion Checker
- Parse acceptance criteria from step files
- Check STATUS.md for completion state
- **Affects:** riotplan/src/verification/

### Step 06: Execution Verify Command
- `riotplan verify --execution` implementation
- Display completion report
- **Affects:** riotplan/src/cli/commands/

### Step 07: Unified Verify Command
- `riotplan verify` runs all checks
- `--criteria` flag shows all criteria
- **Affects:** riotplan/src/cli/commands/

### Step 08: Documentation
- Document verification workflow
- Add to guide/usage.md
- **Affects:** riotplan/guide/

---

## Commit Strategy

```
feat(riotplan): add verification types and interfaces
feat(riotplan): implement criteria parser for analysis
feat(riotplan): add coverage checker for analysis→plan
feat(riotplan): implement verify --analysis command
feat(riotplan): add completion checker for execution
feat(riotplan): implement verify --execution command
feat(riotplan): add unified verify command
docs(riotplan): document verification workflow
```
