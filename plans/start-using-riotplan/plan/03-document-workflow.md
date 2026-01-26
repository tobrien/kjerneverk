# Step 03: Document Workflow

## Goal

Document the workflow that actually works, including when to use RiotPlan vs manual planning.

## Prerequisites

- Step 02 completed (created and tested a plan with CLI)
- Experience with both manual and CLI approaches

## Tasks

### Task 1: Document the Working Workflow

Create a document that captures the actual workflow you'll use. Include:

1. **When to create a plan**
   - Complexity threshold
   - Time horizon (multi-day work)
   - Need for state tracking

2. **How to create a plan**
   ```bash
   cd /Users/tobrien/gitw/kjerneverk/plans
   riotplan plan init <plan-name> --description "..."
   cd <plan-name>
   # Edit files as needed
   ```

3. **How to work with a plan**
   ```bash
   # Check status
   riotplan status
   
   # List steps
   riotplan step list
   
   # Start a step
   riotplan step start <number>
   
   # Complete a step
   riotplan step complete <number>
   ```

4. **When to use manual planning**
   - Quick, single-session tasks
   - Exploratory work
   - When structure would be overhead

### Task 2: Create Decision Tree

Create a simple decision tree:

```
Need to track multi-step work?
├─ No → Use manual prompts or ad-hoc approach
└─ Yes → Will it take multiple sessions?
    ├─ No → Consider manual, but RiotPlan is fine
    └─ Yes → Use RiotPlan
        ├─ Complex (10+ steps) → Use CLI to create
        └─ Simple (3-5 steps) → CLI or manual, your choice
```

### Task 3: Document Common Commands

Create a cheat sheet of the commands you'll actually use:

```bash
# Create new plan
riotplan plan init <name> --description "..."

# Check status
riotplan status
riotplan status -v

# Manage steps
riotplan step list
riotplan step start <number>
riotplan step complete <number>
riotplan step add "New Step"

# Validate
riotplan plan validate

# Archive completed plan
riotplan plan archive
```

### Task 4: Document Integration with AI Agents

Document how to use RiotPlan with Cursor AI:

**Option A: Direct CLI (Current)**
```
User: "Create a plan for implementing feature X"
Agent: [Uses Shell tool to run riotplan commands]
```

**Option B: Manual with Guides (Current Alternative)**
```
User: "Create a plan following /riotplan/guide/create.md"
Agent: [Reads guide, creates structure manually]
```

**Option C: MCP Server (Future)**
```
User: "Create a plan for implementing feature X"
Agent: [Uses MCP tool to invoke riotplan directly]
```

### Task 5: Identify Friction Points

Document what's still awkward:
- What requires too many manual steps?
- What do you forget to do?
- What would MCP server solve?

## Acceptance Criteria

- [ ] Workflow document created
- [ ] Decision tree is clear and actionable
- [ ] Command cheat sheet is complete
- [ ] AI integration options documented
- [ ] Friction points identified

## Verification

The document should answer:
1. When do I use RiotPlan?
2. How do I create a plan?
3. How do I work with a plan?
4. What are the most common commands?
5. What's still painful?

## Notes

This document becomes your personal guide. It should be:
- **Practical**: Based on actual usage, not theory
- **Concise**: Quick reference, not exhaustive
- **Honest**: Include what doesn't work well

Save this document somewhere accessible:
- `/Users/tobrien/gitw/kjerneverk/.cursor/rules/riotplan-workflow.md`
- Or in workspace root as `RIOTPLAN_WORKFLOW.md`
