# Checkpoint: plan-approved

**Timestamp**: 2026-02-07T21:19:43.703Z
**Stage**: idea
**Message**: Execution plan developed and ready for implementation. Synthesized from 71 timeline events, 7 evidence files, and 4 narrative chunks. Plan includes 14 steps across 5 phases: Session Architecture, execution-sampling Package, RiotPlan Integration, Testing & Validation, and Documentation & Advocacy. Session-based architecture enables per-session provider mode determination. FastMCP enables testing before major IDE adoption. All constraints honored, no breaking changes.

## Current State

**Current Stage**: idea

### IDEA.md

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
- ANSWER - MCP Sampling API Signature: Request is JSON-RPC 'sampling/createMessage' with params: messages (array), modelPreferences (hints, priorities), systemPrompt, maxTokens. Response includes: role, content, model, stopReason. Full details in evidence/mcp-sampling-spec.md
- ANSWER - How MCP Server Accesses Sampling: Server sends 'sampling/createMessage' JSON-RPC request to client. Client must declare 'sampling' capability during initialization. No server API keys needed - client controls model access.
- ANSWER - Error Handling: Spec defines error codes: -1 (user rejected request), -32602 (invalid params). Errors return JSON-RPC error object with code and message. Need to handle user rejection gracefully.
- ANSWER - Parameters Supported: YES to systemPrompt, maxTokens, modelPreferences (hints, priorities). TEMPERATURE NOT IN SPEC - may not be available. Need to test what Cursor actually supports.
- ANSWER - Streaming: NOT MENTIONED in spec. Appears to be all-or-nothing response. This means RiotPlan can't show progress during generation - user waits for complete response. May need loading indicator.
- CRITICAL FINDING - User Approval Required: Spec says there SHOULD be human in loop. Cursor may show approval dialog for sampling requests. RiotPlan must handle -1 error (user rejected). This is NOT transparent - user sees the sampling request.
- NEXT STEP - Test in Cursor: Need to verify sampling actually works in Cursor. Create minimal test MCP server that calls sampling/createMessage and see: (1) Does it work? (2) Does Cursor show approval dialog? (3) What parameters does Cursor support? (4) How long does it take?
- HYPOTHESIS - MCP Detection: Anticipate that Cursor includes something in user agent or connection metadata to identify itself. Even with STDIO transport, server should be able to detect it's being called by Cursor. Need to investigate what's actually available.
- ANSWER - What needs AI generation: Not just riotplan_generate. Other features too - like exploring ideas (back-and-forth questions), possibly shaping, possibly other interactive features. Need to audit RiotPlan codebase to find all AI generation points.
- DECISION - Standalone CLI Mode: YES, standalone CLI mode should absolutely still work with direct AI providers. Don't want to force everyone to MCP. Users should be able to use their own model if they want. execution-sampling is an ADDITION, not a replacement.
- DECISION - Packaging: YES, execution-sampling should be a separate npm package that other projects can use. Part of @kjerneverk ecosystem. This is a reusable pattern, not RiotPlan-specific.
- 🚨 CRITICAL FINDING - Cursor Does NOT Support Sampling: Research shows Cursor only supports MCP tools, NOT sampling. Claude Code also lacks sampling. Only GitHub Copilot supports sampling (as of 2026). This invalidates the core assumption of the idea.
- ANSWER - Client Detection: YES, MCP servers can detect client identity. During initialization, client sends 'clientInfo' with name, version, etc. Server can check if clientInfo exists (MCP mode) vs absent (standalone CLI). Can also check capabilities.sampling to see if sampling is available.
- ANSWER - Cross-Platform Consistency: NO, MCP sampling does NOT work consistently. GitHub Copilot: YES (full support). Cursor: NO (tools only). Claude Code: NO (no sampling). This is a major problem for the original idea.
- PIVOT NEEDED: Original idea assumed Cursor users could use sampling to avoid API keys. But Cursor doesn't support sampling. Need to either: (1) Target GitHub Copilot instead, (2) Wait for Cursor to add sampling, (3) Design different solution using only tools, (4) Keep current approach until sampling is widely supported.
- ANSWER - What Needs AI Generation: Currently only generatePlan() in src/ai/generator.ts. Used by CLI 'generate' command and MCP 'riotplan_generate' tool. Future: idea exploration, shaping assistance, feedback summarization (not implemented yet). Clean Provider interface makes execution-sampling a drop-in replacement.
- ANSWER - Which Clients Support Sampling: FastMCP (Python) has production-ready sampling with built-in handlers. mcp-go (Go) has working examples. Claude Desktop, Cursor, Claude Code do NOT support sampling. GitHub Copilot status unclear. FastMCP is PERFECT for testing - can use it to verify RiotPlan sampling works.
- ARCHITECTURE DECISION - Session-Based Provider Mode: Since RiotPlan supports both STDIO and HTTP transports, sampling availability is per-session. Need to track: sessionId, clientInfo, capabilities.sampling, and providerMode (sampling|direct|none) for each session. Different sessions can have different capabilities.
- STRATEGY - Build It Anyway: Even though major IDEs don't support sampling yet, build it now. Use FastMCP for testing. When Cursor/Claude Desktop add sampling, RiotPlan will be ready. Shows what's possible, puts pressure on IDE vendors to adopt. Positions RiotPlan as MCP sampling leader.
- NEXT STEP - Create FastMCP Unit Test: Build a Python test using FastMCP with OpenAI/Anthropic handler to verify RiotPlan sampling works end-to-end. This proves the concept and provides concrete example for blog posts about why MCP sampling is important.
- CONTENT PLAN - Blog Posts: Write about MCP sampling benefits and why it needs wider adoption. Having working test with FastMCP provides concrete proof-of-concept and demonstrates the value proposition to IDE vendors.

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
- What is the exact MCP sampling API signature? What does the request look like? What does the response look like?
- Does MCP sampling actually work in Cursor right now? Need to verify with a simple test before building on it.
- How does an MCP server access the sampling capability? Is it passed in context? Available via SDK? What's the mechanism?
- What happens if sampling times out or fails mid-generation? How do we handle partial results or errors?
- Can we pass system prompts, temperature, max_tokens, and other generation parameters through MCP sampling?
- How does streaming work with MCP sampling? Can we show progress as the model generates, or is it all-or-nothing?
- How does an MCP server detect which client is calling it? Is there client identification in the connection metadata, user agent, or initialization handshake?
- Where in RiotPlan codebase does AI generation currently happen? Need to audit all locations that would need to use execution-sampling.

## Evidence

_Attach relevant documents, images, or files_
- [MCP Sampling specification (2025-11-25) - complete API signature, parameters, error handling, and capabilities](evidence/mcp-sampling-spec.md)
- [How MCP servers detect client identity via clientInfo in initialization handshake - includes detection strategy for RiotPlan](evidence/mcp-client-detection.md)
- [CRITICAL: MCP sampling support matrix showing Cursor does NOT support sampling, only GitHub Copilot does](evidence/mcp-sampling-support-matrix.md)
- [Audit of where AI generation happens in RiotPlan - only generatePlan() currently needs it, clean Provider interface for execution-sampling to implement](evidence/riotplan-ai-usage-audit.md)
- [FastMCP (Python) has production-ready sampling support with built-in OpenAI/Anthropic handlers - perfect for testing RiotPlan sampling](evidence/mcp-clients-with-sampling.md)
- [Complete session-based architecture design - SessionContext, SessionManager, per-session provider mode determination, supports both STDIO and HTTP transports](evidence/session-based-architecture.md)
- [Complete FastMCP unit test plan - Python pytest suite with OpenAI/Anthropic handlers, tests sampling detection, request format, end-to-end generation, includes CI/CD integration](evidence/fastmcp-test-plan.md)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T17:32:55.028Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._




## Files at This Point

- EXECUTION_PLAN.md
- IDEA.md
- LIFECYCLE.md
- STATUS.md
- SUMMARY.md

## Recent Timeline

- 2/7/2026, 1:03:33 PM: narrative_chunk - {"content":"Complete investigation of MCP sampling feasibility revealed CRITICAL BLOCKER: Cursor does NOT support MCP sampling, only tools. Research shows: (1) MCP sampling API is well-defined and documented, (2) Client detection works via clientInfo in initialization handshake, (3) GitHub Copilot DOES support sampling as of 2026, (4) But Cursor and Claude Code do NOT support sampling. This invalidates core assumption that \"Cursor users can avoid API keys via sampling.\" \n\nRiotPlan codebase audit shows clean architecture: only generatePlan() currently needs AI, uses Provider interface that execution-sampling could implement as drop-in replacement. Detection logic would go in provider-loader.ts.\n\nDECISION POINT: Need to pivot the idea. Options: (1) Target GitHub Copilot instead of Cursor, (2) Wait for Cursor to add sampling support, (3) Design different solution using only MCP tools (what Cursor supports), (4) Keep current approach until sampling widely supported. User confirmed standalone CLI mode must still work with direct providers - execution-sampling is addition, not replacement, and should be separate @kjerneverk npm package.","source":"typing","context":"Investigation complete - critical findings and pivot needed","speaker":"assistant"}
- 2/7/2026, 1:08:52 PM: evidence_added - {"evidencePath":"evidence/mcp-clients-with-sampling.md","description":"FastMCP (Python) has production-ready sampling support with built-in OpenAI/Anthropic handlers - perfect for testing RiotPlan sampling"}
- 2/7/2026, 1:08:54 PM: note_added - {"note":"ANSWER - Which Clients Support Sampling: FastMCP (Python) has production-ready sampling with built-in handlers. mcp-go (Go) has working examples. Claude Desktop, Cursor, Claude Code do NOT support sampling. GitHub Copilot status unclear. FastMCP is PERFECT for testing - can use it to verify RiotPlan sampling works."}
- 2/7/2026, 1:08:55 PM: note_added - {"note":"ARCHITECTURE DECISION - Session-Based Provider Mode: Since RiotPlan supports both STDIO and HTTP transports, sampling availability is per-session. Need to track: sessionId, clientInfo, capabilities.sampling, and providerMode (sampling|direct|none) for each session. Different sessions can have different capabilities."}
- 2/7/2026, 1:08:57 PM: note_added - {"note":"STRATEGY - Build It Anyway: Even though major IDEs don't support sampling yet, build it now. Use FastMCP for testing. When Cursor/Claude Desktop add sampling, RiotPlan will be ready. Shows what's possible, puts pressure on IDE vendors to adopt. Positions RiotPlan as MCP sampling leader."}
- 2/7/2026, 1:09:32 PM: evidence_added - {"evidencePath":"evidence/session-based-architecture.md","description":"Complete session-based architecture design - SessionContext, SessionManager, per-session provider mode determination, supports both STDIO and HTTP transports"}
- 2/7/2026, 1:09:37 PM: narrative_chunk - {"content":"User correctly identified that sampling availability must be per-session, not global, because RiotPlan supports both STDIO (local, single client) and HTTP (remote, multiple clients) transports. Each session tracks clientInfo, capabilities, and determines providerMode (sampling|direct|none) during initialization.\n\nResearch found FastMCP (Python) has production-ready sampling with built-in OpenAI/Anthropic handlers - perfect for testing. mcp-go also works. Cursor/Claude Desktop/Claude Code don't support sampling yet, but user wants to build it anyway to: (1) be ready when they add it, (2) test with FastMCP today, (3) put pressure on vendors, (4) position RiotPlan as MCP sampling leader.\n\nArchitecture design complete: SessionManager tracks per-session context, determineProviderMode() checks capabilities.sampling then falls back to direct providers, loadProviderForSession() returns appropriate provider. Clean separation means execution-sampling is drop-in replacement for execution-anthropic/openai/gemini with same Provider interface. No breaking changes for existing users.","source":"typing","context":"Architecture pivot - session-based sampling with FastMCP for testing","speaker":"assistant"}
- 2/7/2026, 1:11:39 PM: note_added - {"note":"NEXT STEP - Create FastMCP Unit Test: Build a Python test using FastMCP with OpenAI/Anthropic handler to verify RiotPlan sampling works end-to-end. This proves the concept and provides concrete example for blog posts about why MCP sampling is important."}
- 2/7/2026, 1:11:41 PM: note_added - {"note":"CONTENT PLAN - Blog Posts: Write about MCP sampling benefits and why it needs wider adoption. Having working test with FastMCP provides concrete proof-of-concept and demonstrates the value proposition to IDE vendors."}
- 2/7/2026, 1:12:28 PM: evidence_added - {"evidencePath":"evidence/fastmcp-test-plan.md","description":"Complete FastMCP unit test plan - Python pytest suite with OpenAI/Anthropic handlers, tests sampling detection, request format, end-to-end generation, includes CI/CD integration"}

---

This checkpoint captures the state of the plan at this moment in time.
You can restore to this checkpoint using: `riotplan_checkpoint_restore({ checkpoint: "plan-approved" })`
