# Start Using RiotPlan - Summary

## Executive Summary

This plan addresses the ironic situation where I've built a sophisticated plan management framework but continue to manually create and manage plans. The goal is to integrate RiotPlan into my actual workflow and establish a repeatable process for plan creation and execution.

## The Decision: MCP Server vs CLI

### Option 1: MCP Server (Recommended)

**Pros:**
- Seamless integration with Cursor AI agents
- AI can directly invoke RiotPlan commands
- No context switching between terminal and editor
- Natural fit for AI-assisted workflows

**Cons:**
- Requires MCP server implementation (not yet built)
- Additional setup complexity
- Need to maintain MCP interface

### Option 2: CLI Only

**Pros:**
- Already implemented and working
- Simple, direct commands
- No additional infrastructure needed
- Easy to script and automate

**Cons:**
- Requires manual terminal commands
- AI agents can't directly invoke (must use Shell tool)
- More context switching
- Less integrated feel

### Recommendation: Start with CLI, Build MCP Later

**Phase 1 (Immediate):** Use the CLI directly
- Install RiotPlan globally: `npm install -g @riotprompt/riotplan`
- Create a simple workflow using CLI commands
- Establish patterns and habits

**Phase 2 (Future):** Build MCP server when patterns are proven
- Implement MCP server based on learned usage patterns
- Expose most-used commands as MCP tools
- Maintain CLI as fallback

## Philosophy

**Start simple.** The best tool is the one you actually use. Rather than building the perfect integration first, establish the habit of using RiotPlan via CLI, then optimize the integration once the workflow is proven.

## Success Metrics

1. **Adoption**: Created 3+ plans using RiotPlan CLI
2. **Habit**: Using `riotplan status` instead of reading STATUS.md manually
3. **Efficiency**: Plan creation time reduced from ~10 minutes to ~2 minutes
4. **Confidence**: Clear understanding of when to use RiotPlan vs manual planning
