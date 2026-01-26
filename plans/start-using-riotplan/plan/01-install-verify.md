# Step 01: Install & Verify

## Goal

Install RiotPlan globally and verify that all CLI commands work correctly.

## Prerequisites

- Node.js 24+ installed
- npm access to workspace packages

## Tasks

### Task 1: Check Current Installation

First, check if RiotPlan is already installed:

```bash
which riotplan
riotplan --version
```

### Task 2: Install from Workspace

Since RiotPlan is in development, install it from the local workspace:

```bash
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm run build
npm install -g .
```

This installs the built package globally from your local workspace.

**Note:** If you need to make changes to RiotPlan and want them reflected immediately without reinstalling, use `npm link` instead of `npm install -g .`

### Task 3: Verify Installation

Test that the CLI is working:

```bash
# Should show version
riotplan --version

# Should show help
riotplan --help

# Should show plan commands
riotplan plan --help

# Should show status commands
riotplan status --help

# Should show step commands
riotplan step --help
```

### Task 4: Test Basic Commands

Navigate to an existing plan and test status:

```bash
cd /Users/tobrien/gitw/kjerneverk/plans/done/riotdoc
riotplan status
```

Expected output: Should show the plan status, current step, and progress.

## Acceptance Criteria

- [ ] `riotplan --version` shows version number
- [ ] `riotplan --help` shows available commands
- [ ] `riotplan status` works in an existing plan directory
- [ ] No error messages during installation

## Verification

```bash
# All these should work without errors
riotplan --version
riotplan --help
cd /Users/tobrien/gitw/kjerneverk/plans/done/riotdoc && riotplan status
```

## Notes

Using `npm link` instead of `npm install -g` allows you to continue developing RiotPlan while using it. Any changes you make to the RiotPlan source will be immediately available in the CLI.

If you encounter issues, try:
```bash
npm unlink -g @riotprompt/riotplan
cd /Users/tobrien/gitw/kjerneverk/riotplan
npm link
```
