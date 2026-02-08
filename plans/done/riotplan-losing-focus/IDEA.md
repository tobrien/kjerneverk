# Idea: riotplan-losing-focus

## Core Concept

Solve the problem of RiotPlan conversations losing focus - models help think through problems but don't consistently update the plan with insights

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- PROBLEM STATEMENT: During cardigantime-file-resolution Q&A, had great conversation with insights and solutions, but didn't consistently update the plan until user pointed it out. Everything should flow into the plan in real-time as the conversation happens.
- CORE TENSION: Models (like Claude in Cursor) are doing what they do well - helping think through problems, having conversations, exploring ideas. BUT there's no established context that says 'this conversation should be reflected in a plan'.
- POTENTIAL SOLUTION 1: Cursor Rule - Create a rule that says 'When user mentions working on a plan or uses RiotPlan MCP tools, continuously update the plan with insights, questions answered, decisions made, and solution proposals as the conversation progresses.'
- POTENTIAL SOLUTION 2: Session Context - Add a riotplan_session_start tool that user calls at beginning: 'I'm working on plan X'. This sets context for the entire conversation. Model knows to update that plan continuously until session ends.
- POTENTIAL SOLUTION 3: Explicit Workflow - User says 'Let's work on plan X using Q&A' which triggers a specific mode/prompt that reminds model to update plan continuously. Different from regular conversation mode.
- OBSERVATION: In the cardigantime-file-resolution session, user said 'let's start doing questions and answers through the explorer idea tool' - this WAS an explicit signal, but the model didn't maintain focus on updating the plan throughout. Need stronger/clearer mechanism.
- CRITICAL INSIGHT: The core failure mode is not 'forgetting to update the plan' - it's the model switching from PLAN DEVELOPMENT mode to PLAN EXECUTION mode without being asked. The model starts implementing ideas being discussed instead of continuing to explore and document them. The user wants to go back and forth on what the plan means, not have the model run off and build it.
- TOOL CALL FRICTION IS NOT THE CAUSE: User explicitly says the model just stops making tool calls entirely - it's not that it's too expensive or takes too many turns. The model drops the behavior, not avoids it due to cost.
- COMPETING PLANNING SYSTEMS: Cursor itself has its own planning mechanism and is always evaluating whether to invoke it. This creates tension with RiotPlan - two systems competing for 'who owns the plan.' User has considered running RiotPlan in a separate model entirely to avoid this conflict.
- SOLUTION DIRECTION: Likely a combination of (1) RiotPlan shipping a recommended Cursor rule for projects, (2) more aggressive prompts in the MCP tool descriptions, (3) a heartbeat/checkpoint mechanism that reminds the model to check plan status and update, (4) explore_idea prompt improvements that reinforce 'explore, don't execute.'
- KEY DESIGN PRINCIPLE: Stage transitions (idea → shaping → plan → execution) must be EXPLICIT and require USER CONSENT. The model should ask 'Are you ready to move to X?' and wait for affirmative answer. The model should never assume a decision means 'go build it.' Decisions during exploration get captured as notes.
- HEARTBEAT DESIGN: Every RiotPlan MCP tool response should include a reminder to the calling model: you are in plan mode, stay on task, update the plan. This is a low-cost, high-leverage intervention because the model sees it on every tool call.
- EXPLORE_IDEA ENHANCEMENT: Should detect existing plans at a given path or from user's current context. Not a separate command - same explore_idea should seamlessly handle both new ideas and resuming exploration of existing ones. This removes the friction of 'how do I get back into exploration mode on something I started earlier.'
- SYSTEM PROMPT INJECTION QUESTION: Can RiotPlan, through MCP tool descriptions or responses, effectively inject system-prompt-level context that tells the model 'a planning system is already active, don't create your own plan'? This is about whether MCP tools can influence model behavior at the system level without explicit user-visible prompting. Cursor's own planning system detecting 'this looks like a plan' and offering to take over is the specific competing behavior to suppress.
- TRANSITION PROTOCOL MUST BE OPTIONAL: User sometimes wants fully autonomous execution - set up a plan, say 'execute all steps without interaction', and walk away for 2-3 hours. A key frustration is models stopping after ~20 minutes to ask 'how's that?' The protocol needs both interactive mode (ask before transitions) and autonomous mode (run everything without check-ins).
- HEARTBEAT DETAIL LEVEL: Should include plan directory, current stage, what was just done, what's planned next. The goal is to project confidence and control - tell the model 'I (RiotPlan) am in charge, I know the state, follow my lead.' More context is better.
- CONFIRMED APPROACH: Embed behavioral instructions directly in MCP tool descriptions. These are read by the model but not shown to the user. Every RiotPlan tool description should include 'When using RiotPlan tools, you are in planning mode. Do not execute code changes unless explicitly in execution mode.'
- STEP 2 DELIVERABLE - Behavioral preamble for tool descriptions: "[RiotPlan] You are in plan development mode. Capture insights using RiotPlan tools—do not implement code changes. Ask before transitioning stages."
- STEP 6 DELIVERABLE - Complete Cursor rule content saved. Key elements: globs for plan directories/files, 4 required behaviors (no Cursor plans, stay in dev mode, capture insights, ask before transitions), do/don't lists, example scenarios. Ready for Step 7 to create the generator tool.
- STEP 1 COMPLETE - All 25 tool descriptions in src/mcp/server.ts now include the behavioral preamble. Build verified successfully.
- STEP 3 COMPLETE - Created generateHeartbeat() function in src/mcp/heartbeat.ts. Reads plan state, formats contextual footer, handles edge cases gracefully. Build verified successfully.
- STEP 5 COMPLETE - Enhanced explore_idea prompt to detect and resume existing plans. Added step 1b workflow, detection logic, and example. Build verified successfully.
- STEP 7 COMPLETE - Created riotplan_generate_rule tool in src/mcp/tools/generate-rule.ts. Registered in index and server. Generates .cursor/rules/riotplan.md with full rule content. Build verified successfully.
- STEP 4 COMPLETE - Integrated generateHeartbeat() into registerTool success handler. Added import and try/catch block. Every successful tool response now includes heartbeat footer. Build verified successfully.

## Constraints

- _Add constraints..._
- Solution must not break the natural conversational flow - models should still be able to think and explore freely
- Solution should work within Cursor's existing architecture (rules, MCP, context windows)
- Must be clear to the user when they're 'in a plan context' vs just having a regular conversation
- Must prevent model from switching to execution/implementation mode when user is in plan exploration mode - the model should not start building things that are being discussed
- Must coexist with Cursor's own planning mechanism without conflict - two planning systems competing creates confusion
- Stage transitions (idea → shaping → plan → execution) must require explicit user consent - the model must ask and receive affirmative answer before moving stages

## Questions

- _Add questions..._
- How do we establish context for a conversation so Cursor/models know 'what we're talking about should be reflected in a plan'?
- Is this a Cursor rules problem? Should there be a rule that says 'when working with RiotPlan, update the plan continuously'?
- Is this a RiotPlan MCP tool design problem? Should there be a 'session' or 'context' concept that explicitly links a conversation to a plan?
- Should the user explicitly say 'we're working on plan X' at the start of each conversation? Or should this be automatic somehow?
- What's the right granularity for updates? Every insight immediately? Batch at natural breakpoints? Let the model decide?
- Should RiotPlan ship a recommended Cursor rule file that projects install? What would that rule say to keep the model focused on plan development vs execution?
- Is running RiotPlan in a separate model/process a viable approach to avoid Cursor's planning system competing with RiotPlan? What are the tradeoffs?
- What would a heartbeat/checkpoint mechanism look like technically? Can MCP tool descriptions include reminders, or does it need to be in the tool responses themselves?
- Can MCP tool descriptions or tool responses effectively act as system-prompt-level instructions? Can they suppress Cursor's own planning behavior ('this looks like a plan, want me to create one?') when RiotPlan is active?
- What does the ideal stage-transition protocol look like as a conversation? Can we define a template/script for how the model should propose transitions and how the user confirms them?

## Evidence

_Attach relevant documents, images, or files_
- [Complete transcript of CardiganTime file resolution Q&A session showing where the model lost focus and stopped updating the plan mid-conversation](.evidence/cardigantime-conversation-transcript.md)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T17:12:36.592Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
