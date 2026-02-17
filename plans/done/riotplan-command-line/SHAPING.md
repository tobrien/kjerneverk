# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Layered Bottom-Up

**Description**: Build in strict dependency order across the monorepo packages. Phase 1: Extend execution packages (add tools parameter to Request, add executeStream(), update Anthropic and OpenAI providers). Phase 2: Build the agent loop in @kjerneverk/agentic (ConversationManager, AgentLoop that orchestrates LLM calls with tool use, streaming support). Phase 3: Define the tool sets — both RiotPlan tools (wrapping existing MCP tool implementations) and environment tools (read_file, list_files, grep, run_command). Phase 4: Build the CLI commands in riotplan (explore, build, execute, chat) that wire together the agent loop with the appropriate tools and system prompts. Each layer is independently useful and testable. The execution packages become useful for any project, not just RiotPlan. The agentic package becomes a real agent framework.

**Tradeoffs**:
- Pro: Each layer is independently useful — execution packages and agentic become reusable across projects
- Pro: Clean separation of concerns — easy to test each layer in isolation
- Pro: The execution package improvements benefit existing one-shot generation too
- Pro: Agentic package finally gets its planned ConversationBuilder/loop infrastructure
- Con: Longest path to a working CLI — you don't get a usable command until all layers are built
- Con: Risk of over-engineering lower layers before knowing exactly what the CLI needs
- Con: Touches 4+ packages in the monorepo which means more coordination and more publish cycles
- Con: Could spend weeks on infrastructure before seeing a single riotplan explore session work

**Assumptions**:
- The execution package extensions are generally useful beyond this project
- The agentic package agent loop will be reused by other tools
- Clean layering is worth the upfront cost
- The existing MCP tool implementations can be cleanly wrapped as LLM tool-use functions


### Approach: Vertical Slice

**Description**: Build one complete command end-to-end first, then replicate the pattern. Start with `riotplan explore` as the vertical slice — it's the most common entry point and exercises all the layers. Build just enough in each layer to make explore work: minimal executeStream() for one provider (Anthropic or OpenAI, whichever is preferred), a minimal agent loop in agentic that handles multi-turn tool-use conversations, the explore-specific tool set (read_file, list_files, grep + RiotPlan idea tools), and the explore CLI command with the system prompt. Once explore works end-to-end, extract patterns and build the other commands (build, execute, chat) which follow the same structure but with different tool sets and prompts. Extend to the second provider after the first works.

**Tradeoffs**:
- Pro: Fastest path to a working riotplan explore — could be usable within days
- Pro: Real usage informs the design — discover what the agent loop actually needs by building a real command first
- Pro: Avoids over-engineering — build only what's needed, not what might be needed
- Pro: Easy to demo and validate early — show the explore experience, get feedback, iterate
- Con: First slice might not generalize cleanly — patterns discovered during explore might not fit execute
- Con: Second provider (OpenAI/Anthropic) added later, so initially locked to one
- Con: Less clean layering — might need refactoring when adding the second and third commands
- Con: The agentic package might end up with explore-specific assumptions baked in

**Assumptions**:
- explore is the right first slice (most common, exercises all layers)
- Patterns from explore will mostly transfer to build/execute/chat
- One provider is enough to validate the architecture
- Refactoring after the first slice is acceptable and expected


### Approach: Pragmatic Layered

**Description**: A hybrid that builds layers but with a working command as the forcing function. Phase 1: Extend execution packages with tools parameter and streaming (both Anthropic and OpenAI — this is straightforward work that's well-scoped). Phase 2: Build the agent loop in agentic AND the explore command simultaneously — let the explore command's needs drive the agent loop's API. The agent loop gets built to serve explore, but designed with the other commands in mind. Phase 3: Build the environment tools (read_file, list_files, grep) and RiotPlan tool wrappers. Phase 4: Wire up explore end-to-end. Validate it works. Phase 5: Build remaining commands (build, execute, chat) using the now-proven agent loop and tool infrastructure. This approach does the foundational work first (execution packages, since it's well-understood and small), but lets the explore command shape the agent loop design rather than designing the loop in abstract.

**Tradeoffs**:
- Pro: Foundational work (execution packages) done right and for both providers from the start
- Pro: Agent loop design is informed by real usage (explore) but not limited to it
- Pro: Working explore command relatively quickly — after phases 1-4
- Pro: Clean enough layering that packages are independently useful
- Pro: Second through fourth commands (build, execute, chat) are faster because the infrastructure is proven
- Con: Slightly slower than pure vertical slice for the first working command
- Con: Still requires judgment calls about what to generalize vs what to defer
- Con: Phase 2 (simultaneous agent loop + explore) requires discipline to not over-couple them

**Assumptions**:
- Execution package extensions are well-understood enough to do for both providers upfront
- The explore command is a good-enough proxy for what the agent loop needs
- Discipline to keep the agent loop general while building it alongside explore
- The other commands (build, execute, chat) are structurally similar enough to benefit from a proven pattern


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Pragmatic Layered

**Reasoning**: Best balance of doing foundational work right (execution packages for both providers upfront since the scope is clear) while letting real usage (the explore command) drive the agent loop design. Avoids both over-engineering in the abstract and painting into a corner with a single slice.

**Selected At**: 2026-02-09T14:50:56.708Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-09T14:49:05.557Z
**Next**: Select an approach and transition to 'built'
