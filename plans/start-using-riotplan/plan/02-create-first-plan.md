# Step 02: Create First Plan

## Goal

Use RiotPlan CLI to create a test plan and validate that it works better than manual creation.

## Prerequisites

- Step 01 completed (RiotPlan installed and verified)
- Access to `plans/` directory

## Tasks

### Task 1: Create a Test Plan

Create a simple test plan to verify the workflow:

```bash
cd /Users/tobrien/gitw/kjerneverk/plans
riotplan plan init test-riotplan-workflow --description "Test plan to verify RiotPlan CLI workflow"
```

### Task 2: Inspect the Generated Structure

Look at what was created:

```bash
cd test-riotplan-workflow
ls -la
cat STATUS.md
cat EXECUTION_PLAN.md
```

### Task 3: Compare to Manual Creation

Compare the generated structure to a manually created plan (like `done/riotdoc/`):

- Does it have all required files?
- Is the STATUS.md format correct?
- Are the step files properly numbered?
- Is anything missing?

### Task 4: Test Status Commands

Try the status commands:

```bash
# Show status
riotplan status

# List steps
riotplan step list

# Show verbose status
riotplan status -v
```

### Task 5: Test Step Management

Try managing steps:

```bash
# Start first step
riotplan step start 01

# Check status again
riotplan status

# Complete the step
riotplan step complete 01

# Verify status updated
riotplan status
```

### Task 6: Add a New Step

Test adding steps:

```bash
# Add a new step
riotplan step add "Additional Testing"

# Verify it was added
riotplan step list
```

### Task 7: Validate the Plan

Test the validation command:

```bash
riotplan plan validate
```

## Acceptance Criteria

- [ ] Plan created successfully with all required files
- [ ] `riotplan status` shows correct information
- [ ] `riotplan step list` shows all steps
- [ ] Step status can be updated (start/complete)
- [ ] New steps can be added
- [ ] Plan validation passes
- [ ] Process is faster than manual creation

## Verification

```bash
cd /Users/tobrien/gitw/kjerneverk/plans/test-riotplan-workflow
riotplan plan validate
riotplan status
riotplan step list
```

All commands should work without errors and show expected output.

## Notes

### Time Comparison

Track how long it takes to:
- **Manual creation**: ~10 minutes (create dirs, copy templates, edit files)
- **CLI creation**: ~2 minutes (one command + minor edits)

### What Works Well

Document what aspects of the CLI workflow feel good.

### What's Missing

Document any gaps or friction points in the CLI workflow. This will inform whether MCP server is needed.

### Decision Point

After this step, you should have a clear sense of:
1. Does the CLI actually save time?
2. What's still awkward or manual?
3. Would MCP server integration help?
