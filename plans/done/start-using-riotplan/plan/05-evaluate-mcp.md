# Step 05: Evaluate MCP Need

## Goal

After using the CLI workflow for a while, evaluate whether an MCP server would provide meaningful value.

## Prerequisites

- Steps 01-04 completed
- Used RiotPlan CLI for at least 2-3 real plans
- Clear understanding of what works and what doesn't

## Tasks

### Task 1: Review CLI Experience

Reflect on the CLI workflow:

**What works well:**
- [List things that are smooth]

**What's awkward:**
- [List friction points]

**What requires too many steps:**
- [List repetitive or tedious operations]

### Task 2: Identify MCP Value Proposition

Would MCP server solve real problems? Consider:

**Potential Benefits:**
- AI agents can invoke RiotPlan without Shell tool
- More seamless integration in Cursor
- Could expose plan state to AI context
- Could enable AI to suggest next steps

**Potential Drawbacks:**
- Additional infrastructure to maintain
- Another thing that can break
- May not be significantly better than CLI + Shell tool
- Development time vs. value gained

### Task 3: Define MCP Server Scope

If MCP server seems valuable, define what it should do:

**Core Tools:**
- `riotplan_create_plan` - Create new plan
- `riotplan_get_status` - Get plan status
- `riotplan_list_steps` - List steps
- `riotplan_update_step` - Start/complete steps
- `riotplan_add_step` - Add new step

**Resources:**
- Plan status as MCP resource
- Step files as MCP resources
- Current plan context

**Prompts:**
- Plan creation templates
- Step execution prompts

### Task 4: Estimate Effort vs. Value

**Implementation effort:**
- MCP server setup: ~2-4 hours
- Tool implementations: ~4-6 hours
- Testing and refinement: ~2-3 hours
- **Total: ~8-13 hours**

**Value assessment:**
- How much time would it save per plan?
- How many plans do you create per week/month?
- Would it meaningfully improve the workflow?

### Task 5: Make Decision

Based on the analysis, decide:

**Option A: Build MCP Server Now**
- Clear value proposition identified
- Friction points are significant
- ROI is positive

**Option B: Defer MCP Server**
- CLI workflow is working well enough
- Friction points are minor
- Better to wait and see usage patterns

**Option C: Never Build MCP Server**
- CLI + Shell tool is sufficient
- No significant value from MCP
- Keep it simple

### Task 6: Document Decision

Write down the decision and reasoning:

```markdown
# MCP Server Decision

**Decision:** [Build Now / Defer / Never]

**Reasoning:**
- [Key factor 1]
- [Key factor 2]
- [Key factor 3]

**If Deferred, Revisit When:**
- [Condition 1]
- [Condition 2]

**If Building, Next Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

## Acceptance Criteria

- [ ] CLI experience reviewed honestly
- [ ] MCP value proposition evaluated
- [ ] Effort vs. value estimated
- [ ] Decision made and documented
- [ ] Next steps clear (if building MCP)

## Verification

The decision should be based on:
1. **Real usage data** (not theoretical benefits)
2. **Actual friction points** (not imagined problems)
3. **Clear ROI** (time saved vs. time invested)

## Notes

**Don't build MCP server just because it's cool.** Build it only if it solves real problems you're actually experiencing.

**The CLI might be enough.** If the workflow is working, don't over-engineer it.

**Revisit this decision** after 10+ plans. Usage patterns will become clearer over time.

### If You Decide to Build MCP Server

Create a new plan:
```bash
cd /Users/tobrien/gitw/kjerneverk/plans
riotplan plan init riotplan-mcp-server --description "Implement MCP server for RiotPlan"
```

### If You Decide to Defer

Set a reminder to revisit after:
- Creating 10 more plans
- 3 months of usage
- Identifying 3+ significant friction points
