# Idea: riotplan-sampling

## Core Concept

Enable RiotPlan to use MCP sampling so it doesn't need its own AI provider when called via MCP - let the calling model do the generation work

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- PROBLEM STATEMENT: riotplan_generate failed because it requires @kjerneverk/execution-anthropic package and API keys. But when using RiotPlan via MCP in Cursor, you're ALREADY talking to a reasoning model. RiotPlan shouldn't need its own AI provider - it should use the calling model via MCP sampling.
- CORE INSIGHT: RiotPlan has two usage modes: (1) Standalone CLI - needs its own AI provider (OpenAI/Anthropic keys), (2) Via MCP in Cursor/IDEs - already has access to reasoning model. Mode 2 shouldn't require duplicate setup.
- USABILITY OBSTACLE: User already has Cursor with Claude access. Asking them to set up another API key for RiotPlan creates friction and confusion. 'Why do I need an API key when I'm already using an AI model?' This is a major barrier to adoption.
- HOW MCP SAMPLING WOULD WORK: (1) User calls riotplan_generate via MCP, (2) RiotPlan detects it's being called via MCP, (3) RiotPlan uses MCP sampling to send a prompt back to the calling model, (4) Model generates the plan content, (5) RiotPlan receives result and incorporates it into plan files. No API keys needed.
- USER QUOTE: 'If I'm already using cursor and I want to use riot plan, I don't want to have to set up another account to get an API key. Getting MCP sampling to work allowing RiotPlan to execute something back in the model and then incorporate back into RiotPlan would be huge.'
- DETECTION STRATEGY: RiotPlan should auto-detect when it's being called via MCP. If MCP context detected, automatically use sampling for all AI operations instead of direct API calls. No user configuration needed - just works.
- EXECUTION-SAMPLING PROJECT: Create a new project called 'execution-sampling' - sampling itself is almost a provider. It's the Uber/omni provider that works across all MCP environments. This would be a reusable abstraction for any tool that needs AI generation via MCP.
- MOTIVATING USE CASE: User has Cursor account, wants to use RiotPlan. Telling them 'you need an OpenAI key' is a COMPLETE BLOCKAGE of usage. Instead: they run it, it senses MCP, uses sampling automatically. Just works. This is the biggest win possible.
- FALLBACK STRATEGY: If sampling is unavailable, stop and tell user clearly: 'Unable to use sampling. To use this feature, configure with environment variable [X] or set up API key.' Don't fail silently - explain what's needed.
- BROADER IMPACT: If we get this right for RiotPlan, we can do it for a bunch of different applications. This pattern is reusable across any tool that needs AI generation when used via MCP.

## Constraints

- _Add constraints..._
- Must work seamlessly in Cursor, Cloud Code, and other MCP-enabled environments
- No API keys or provider packages required when using RiotPlan via MCP
- Standalone CLI mode must still function for users who want to run RiotPlan independently
- Solution must be transparent to user - they shouldn't need to know about sampling vs direct AI calls
- Detection must be automatic - no user configuration required to enable sampling mode
- Must work identically across Cursor, Claude Code, and ideally GitHub Copilot
- Error messages must be clear when sampling unavailable - tell user exactly what to do
- execution-sampling should be reusable across multiple projects, not RiotPlan-specific

## Questions

- _Add questions..._
- How does MCP sampling work? What's the API for requesting the calling model to generate content?
- How can RiotPlan detect if it's being called via MCP vs standalone CLI? Is there context available?
- What tools/features in RiotPlan need AI generation? Just riotplan_generate, or others too?
- Should standalone CLI mode still work with direct AI providers, or should we push everyone to MCP?
- What happens if MCP sampling isn't available? Fallback to manual mode? Error message?
- Does MCP sampling work consistently across Claude Code and Cursor? Same API, same behavior?
- Does sampling work in GitHub Copilot? Are there differences in how different MCP hosts implement sampling?
- Does the sampling stuff in MCP even work? Need to test basic sampling functionality before building on it.
- What's the MCP sampling API? How do you request generation? What parameters are available? What's returned?
- How does RiotPlan detect MCP context? Is there an environment variable, API call, or context object available?
- Should execution-sampling be a separate npm package that other projects can use? Part of @kjerneverk ecosystem?

## Evidence

_Attach relevant documents, images, or files_

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T17:32:55.028Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
