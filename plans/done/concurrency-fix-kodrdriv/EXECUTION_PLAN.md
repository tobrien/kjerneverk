# Concurrency Fix for Kodrdriv - Execution Plan

> **Execute this file directly:** When ready, say "Execute EXECUTION_PLAN.md"

## Execution Instructions

1. **Read STATUS.md first** to check current state
2. **Find the next pending step** in the sequence below
3. **Execute that step** by reading its detailed plan file
4. **Update STATUS.md** after each step completes
5. **Continue** until all steps are complete

---

## Execution Sequence

### Phase 1: Analysis & Diagnosis

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 1 | Reproduce & Document Bug | `plan/01-reproduce-bug.md` | Small |
| 2 | Analyze Shared State | `plan/02-analyze-shared-state.md` | Medium |
| 3 | Design Isolation Strategy | `plan/03-design-isolation.md` | Medium |

### Phase 2: Implementation

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 4 | Create Execution Context | `plan/04-create-context.md` | Medium |
| 5 | Isolate Git Operations | `plan/05-isolate-git.md` | Large |
| 6 | Isolate GitHub Client | `plan/06-isolate-github.md` | Medium |

### Phase 3: Testing & Validation

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 7 | Add Unit Tests | `plan/07-unit-tests.md` | Medium |
| 8 | Add Integration Tests | `plan/08-integration-tests.md` | Large |
| 9 | Validate Fix | `plan/09-validate-fix.md` | Small |

### Phase 4: Completion

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 10 | Documentation | `plan/10-documentation.md` | Small |

---

## Quality Gates

After each implementation step (4-6):

```bash
cd /Users/tobrien/gitw/grunnverk/kodrdriv
npm run precommit
```

After testing steps (7-9):

```bash
# Run full test suite
npm test

# Run specific parallel execution tests
npm test -- parallel
```

---

## Step Details Quick Reference

### Step 01: Reproduce & Document Bug
- Create minimal reproduction case
- Document exact failure scenario
- Capture logs showing repository mixing
- **Affects:** `tests/` directory

### Step 02: Analyze Shared State
- Identify all shared state in parallel execution
- Map data flow through execution path
- Document current architecture
- **Affects:** Documentation, understanding

### Step 03: Design Isolation Strategy
- Design `PackageExecutionContext` class
- Plan refactoring approach
- Create architecture diagrams
- **Affects:** Design docs

### Step 04: Create Execution Context
- Implement `PackageExecutionContext` class
- Add context factory
- Add validation methods
- **Affects:** `src/commands-tree/`, new files

### Step 05: Isolate Git Operations
- Refactor git repository detection
- Ensure working directory isolation
- Add context-scoped git operations
- **Affects:** `src/commands-tree/git-utils.ts`, `src/commands-tree/executor.ts`

### Step 06: Isolate GitHub Client
- Create per-package GitHub clients
- Pass repository info explicitly
- Add repository URL validation
- **Affects:** `src/github-tools/`, `src/commands-tree/executor.ts`

### Step 07: Add Unit Tests
- Test context isolation
- Test repository detection
- Test GitHub client creation
- **Affects:** `tests/commands-tree/`

### Step 08: Add Integration Tests
- Test parallel execution with multiple packages
- Test cross-package isolation
- Test error scenarios
- **Affects:** `tests/integration/`

### Step 09: Validate Fix
- Run against real monorepo
- Verify no cross-contamination
- Performance benchmarking
- **Affects:** Validation, metrics

### Step 10: Documentation
- Update architecture docs
- Add inline comments
- Update README
- **Affects:** `docs/`, `README.md`, code comments

---

## Commit Strategy

```
fix(tree): add reproduction test for parallel execution bug

fix(tree): analyze and document shared state in parallel execution

feat(tree): design execution context isolation strategy

feat(tree): implement PackageExecutionContext for isolation

fix(tree): isolate git operations per package context

fix(tree): isolate GitHub client per package execution

test(tree): add unit tests for execution context isolation

test(tree): add integration tests for parallel execution

fix(tree): validate parallel execution with real monorepo

docs(tree): document execution context isolation architecture
```

---

## Rollback Strategy

If issues arise:

1. **Before Step 5**: Easy rollback, minimal code changes
2. **Steps 5-6**: May need to revert multiple commits
3. **After Step 8**: Should be stable with tests passing

Keep feature branch until validation complete.

---

## Dependencies

- Access to `/Users/tobrien/gitw/grunnverk/kodrdriv` codebase
- Node.js 24+ environment
- Git access to test repositories
- GitHub API token for testing

---

## Notes

- Sequential execution path should remain unchanged
- Focus on parallel execution isolation only
- Maintain backward compatibility
- Performance should not degrade significantly
