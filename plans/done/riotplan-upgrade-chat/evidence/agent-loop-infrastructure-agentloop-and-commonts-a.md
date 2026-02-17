# Evidence: Agent loop infrastructure - AgentLoop and common.ts analysis

**Source**: codebase analysis
**Original Query**: Analyze existing agent infrastructure to understand what can be reused
**Added**: 2026-02-12T16:54:52.511Z
**Gathering Method**: model-assisted

---

## Existing Agent Infrastructure

### AgentLoop (agentic/src/loop.ts)
- `AgentLoop.create()` takes: provider, toolRegistry, conversation, model, maxIterations
- `runStream(message)` yields `AgentChunk` (text, tool_start, tool_result, turn_complete, done, error)
- Handles multi-turn tool-use cycle: LLM → tool calls → execute → feed results back → repeat
- Supports streaming via `executeStream()` on the provider
- Currently used by CLI commands (explore, build, execute, chat)

### CLI Agent Session (riotplan/src/cli/commands/common.ts)
- `runAgentSession(config)` creates terminal, session, tool registry, conversation, agent loop
- Auto-indexes project at startup: `indexProjectImpl({ path: projectRoot }, projectRoot)`
- Creates `agentProvider` adapter that bridges execution-anthropic to AgentProvider interface
- Sets maxIterations: 100
- Interactive loop: readLine → runStream → writeChunk → repeat

### Tool Registry
- `ToolRegistry.create({ workingDirectory })` - tools get working directory context
- `toolRegistry.register(tool)` - adds tools
- `toolRegistry.updateContext()` - dynamic context changes (e.g., plan switching)

### Key insight for rp_build upgrade:
The ENTIRE agent infrastructure already exists. We don't need to build a new agent loop. We need to:
1. Create a `generatePlanWithAgent()` function that uses AgentLoop instead of one-shot generation
2. Give it read-only file tools + project index tools + a plan-writing tool
3. Feed it a system prompt that says "explore the codebase and generate a plan"
4. Collect the structured plan output from the agent's tool calls