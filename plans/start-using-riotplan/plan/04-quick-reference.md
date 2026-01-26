# Step 04: Create Quick Reference

## Goal

Create a quick reference card that's easily accessible when working with plans.

## Prerequisites

- Step 03 completed (workflow documented)
- Clear understanding of most-used commands

## Tasks

### Task 1: Create Quick Reference Card

Create a concise reference card with the most essential information:

```markdown
# RiotPlan Quick Reference

## Create a Plan
```bash
cd /Users/tobrien/gitw/kjerneverk/plans
riotplan plan init <name> --description "Brief description"
cd <name>
```

## Check Status
```bash
riotplan status          # Summary
riotplan status -v       # Verbose
riotplan step list       # List all steps
```

## Work with Steps
```bash
riotplan step start <number>     # Start a step
riotplan step complete <number>  # Complete a step
riotplan step add "Step Name"    # Add new step
```

## Validate & Archive
```bash
riotplan plan validate   # Check structure
riotplan plan archive    # Archive completed plan
```

## When to Use RiotPlan
- Multi-day work
- 5+ steps
- Need state tracking
- Collaborative work

## When NOT to Use
- Quick tasks
- Single session
- Exploratory work
```

### Task 2: Add to Cursor Rules

Create a Cursor rule that makes this accessible to AI agents:

File: `/Users/tobrien/gitw/kjerneverk/.cursor/rules/riotplan.md`

```markdown
# RiotPlan Usage

When the user mentions creating a plan or working with multi-step workflows:

1. **Check if RiotPlan is appropriate:**
   - Multi-day work? → Yes
   - 5+ steps? → Yes
   - Need tracking? → Yes
   - Quick task? → No, use manual approach

2. **Use RiotPlan CLI:**
   ```bash
   cd /Users/tobrien/gitw/kjerneverk/plans
   riotplan plan init <name> --description "..."
   ```

3. **Common commands:**
   - Status: `riotplan status`
   - Steps: `riotplan step list`
   - Start: `riotplan step start <n>`
   - Complete: `riotplan step complete <n>`

4. **Plan location:**
   - All plans go in `/Users/tobrien/gitw/kjerneverk/plans/`
   - Completed plans in `/Users/tobrien/gitw/kjerneverk/plans/done/`

5. **Don't manually create plan structures** - use the CLI instead.
```

### Task 3: Create Workspace Documentation

Add a section to the main workspace README or create a dedicated doc:

File: `/Users/tobrien/gitw/kjerneverk/RIOTPLAN_USAGE.md`

Include:
- Quick reference commands
- When to use RiotPlan
- Link to full guides
- Examples from completed plans

### Task 4: Add Shell Aliases (Optional)

Consider adding shell aliases for frequently used commands:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias rps='riotplan status'
alias rpl='riotplan step list'
alias rpstart='riotplan step start'
alias rpcomplete='riotplan step complete'
```

### Task 5: Test Accessibility

Verify the quick reference is actually quick to access:

1. Can you find it in < 10 seconds?
2. Is it visible in Cursor when needed?
3. Do AI agents reference it correctly?

## Acceptance Criteria

- [ ] Quick reference card created
- [ ] Added to Cursor rules
- [ ] Workspace documentation updated
- [ ] Reference is easily accessible (< 10 seconds)
- [ ] AI agents can find and use it

## Verification

Test the workflow:
1. Start a new Cursor session
2. Ask AI to "create a plan for X"
3. Verify AI uses RiotPlan CLI (not manual creation)
4. Verify AI can find the quick reference

## Notes

The goal is to make RiotPlan the path of least resistance. If it's easier to manually create a plan structure, you won't use the tool.

Key success metric: **Next time you need a plan, you reach for `riotplan plan init` without thinking.**
