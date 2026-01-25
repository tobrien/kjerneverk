# Interactive Plan Creation - Execution Plan

> **Execute this file directly:** When ready, say "Execute /Users/tobrien/gitw/kjerneverk/plans/riotplan-interactive-creation/EXECUTION_PLAN.md"

## Execution Instructions

1. **Read STATUS.md first** to check current state
2. **Find the next pending step** in the sequence below
3. **Execute that step** by reading its detailed plan file
4. **Update STATUS.md** after each step completes
5. **Continue** until all steps are complete

### State Management

All execution state is tracked in: `/Users/tobrien/gitw/kjerneverk/plans/riotplan-interactive-creation/STATUS.md`

---

## Dependencies

| Package | Required | Status |
|---------|----------|--------|
| `commander` | Yes | ✅ Already in riotplan |
| `chalk` | Yes | ✅ Already in riotplan |
| `inquirer` | Yes | ⬜ Needs installation |

---

## Execution Sequence

### Phase 1: Foundation

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 1 | CLI Infrastructure | `plan/01-cli-infrastructure.md` | 45 min |
| 2 | Prompt Storage | `plan/02-prompt-storage.md` | 30 min |

### Phase 2: Analysis Mode

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 3 | Analysis Directory | `plan/03-analysis-directory.md` | 45 min |
| 4 | Elaborate Command | `plan/04-elaborate-command.md` | 45 min |

### Phase 3: Plan Mode

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 5 | Plan Generation | `plan/05-plan-generation.md` | 60 min |
| 6 | Amend Command | `plan/06-amend-command.md` | 45 min |

### Phase 4: Polish

| Order | Step | File | Est. Time |
|-------|------|------|-----------|
| 7 | Interactive Flow | `plan/07-interactive-flow.md` | 60 min |
| 8 | Documentation | `plan/08-documentation.md` | 45 min |

**Total Estimated Time:** ~6 hours

---

## How to Execute a Step

For each step:

1. **Read the step file** (e.g., `plan/01-cli-infrastructure.md`)
2. **Implement all tasks** listed in the file
3. **Verify acceptance criteria** are met
4. **Run tests** to ensure nothing is broken
5. **Update STATUS.md** with completion status

### Quality Gates

```bash
# After each step:
cd /Users/tobrien/gitw/kjerneverk/riotplan && npm run precommit
```

---

## Step Details Quick Reference

### Step 01: CLI Infrastructure
- Add `create` command skeleton to CLI
- Set up inquirer for interactive prompts
- **Affects:** riotplan/src/cli/

### Step 02: Prompt Storage
- Create prompt saving utilities
- Implement prompt directory structure
- **Affects:** riotplan/src/cli/, riotplan/src/plan/

### Step 03: Analysis Directory
- Define analysis directory structure
- Create REQUIREMENTS.md template
- **Affects:** riotplan/src/plan/

### Step 04: Elaborate Command
- Implement `riotplan elaborate` command
- Save elaboration feedback to analysis/prompts/
- **Affects:** riotplan/src/cli/commands/

### Step 05: Plan Generation
- Integrate analysis into plan generation
- Generate SUMMARY.md, EXECUTION_PLAN.md from analysis
- **Affects:** riotplan/src/plan/creator.ts

### Step 06: Amend Command
- Implement `riotplan amend` command
- Save amendments to amendments/ directory
- **Affects:** riotplan/src/cli/commands/

### Step 07: Interactive Flow
- Wire up full interactive create flow
- Implement --direct and --analyze flags
- **Affects:** riotplan/src/cli/commands/

### Step 08: Documentation
- Update guide/usage.md
- Add create command examples
- **Affects:** riotplan/guide/

---

## Commit Strategy

```
feat(riotplan): add create command skeleton
feat(riotplan): implement prompt storage utilities
feat(riotplan): add analysis directory support
feat(riotplan): implement elaborate command
feat(riotplan): integrate analysis into plan generation
feat(riotplan): implement amend command
feat(riotplan): wire up interactive create flow
docs(riotplan): document interactive create workflow
```

---

## Resume Instructions

If execution is interrupted:

1. Check STATUS.md for last completed step
2. Resume from next pending step
3. Re-run quality gates before continuing
