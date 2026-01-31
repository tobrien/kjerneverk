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

## Constraints

- _Add constraints..._
- Solution must not break the natural conversational flow - models should still be able to think and explore freely
- Solution should work within Cursor's existing architecture (rules, MCP, context windows)
- Must be clear to the user when they're 'in a plan context' vs just having a regular conversation

## Questions

- _Add questions..._
- How do we establish context for a conversation so Cursor/models know 'what we're talking about should be reflected in a plan'?
- Is this a Cursor rules problem? Should there be a rule that says 'when working with RiotPlan, update the plan continuously'?
- Is this a RiotPlan MCP tool design problem? Should there be a 'session' or 'context' concept that explicitly links a conversation to a plan?
- Should the user explicitly say 'we're working on plan X' at the start of each conversation? Or should this be automatic somehow?
- What's the right granularity for updates? Every insight immediately? Batch at natural breakpoints? Let the model decide?

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
