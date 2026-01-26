# Start Using RiotPlan - Execution Plan

> **Execute this file directly:** When ready, say "Execute EXECUTION_PLAN.md"

## Execution Instructions

1. **Read STATUS.md first** to check current state
2. **Find the next pending step** in the sequence below
3. **Execute that step** by reading its detailed plan file
4. **Update STATUS.md** after each step completes
5. **Continue** until all steps are complete

---

## Execution Sequence

### Phase 1: Setup (Quick Start)

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 1 | Install & Verify | `plan/01-install-verify.md` | 5 minutes |
| 2 | Create First Plan | `plan/02-create-first-plan.md` | 10 minutes |

### Phase 2: Establish Workflow

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 3 | Document Workflow | `plan/03-document-workflow.md` | 15 minutes |
| 4 | Create Quick Reference | `plan/04-quick-reference.md` | 10 minutes |

### Phase 3: Future Integration (Optional)

| Order | Step | File | Est. Effort |
|-------|------|------|-------------|
| 5 | Evaluate MCP Need | `plan/05-evaluate-mcp.md` | 30 minutes |

---

## Quality Gates

After each step:
```bash
# Verify RiotPlan is working
riotplan status
```

---

## Step Details Quick Reference

### Step 01: Install & Verify
- Install RiotPlan globally
- Verify CLI commands work
- Test basic commands
- **Affects:** Global npm packages

### Step 02: Create First Plan
- Use RiotPlan CLI to create a test plan
- Validate the structure
- Compare to manual creation
- **Affects:** `plans/` directory

### Step 03: Document Workflow
- Write down the workflow that works
- Document when to use RiotPlan vs manual
- Create decision tree
- **Affects:** Documentation

### Step 04: Create Quick Reference
- Create a cheat sheet for common commands
- Add to Cursor rules or workspace docs
- Make it easily accessible
- **Affects:** `.cursor/rules/` or workspace docs

### Step 05: Evaluate MCP Need
- After using CLI for a while, evaluate if MCP is needed
- Document the decision criteria
- Create plan for MCP if needed
- **Affects:** Future planning

---

## Commit Strategy

This plan doesn't modify code, so no commits needed. However, if creating workspace documentation:

```
docs: add riotplan workflow guide
docs: add riotplan quick reference
```
