# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Embedded Behavioral Layer

**Description**: Solve the problem entirely within the MCP server - no external dependencies. Every RiotPlan MCP tool description includes behavioral instructions ("you are in planning mode, do not execute code changes"). Every tool response includes a contextual heartbeat footer with plan directory, current stage, last action, and next suggested action. The explore_idea command is enhanced to detect existing plans. A new riotplan_generate_rule tool creates a recommended Cursor rule file. The transition protocol is encoded in tool response footers that shift based on current stage.

**Tradeoffs**:
- + Everything lives inside RiotPlan - single codebase to maintain
- + Tool descriptions are a proven vector for influencing model behavior
- + Heartbeat in responses is zero-friction - model sees it automatically on every call
- + No dependency on Cursor-specific features beyond what already exists
- - Tool descriptions have limited space and models may deprioritize long descriptions
- - Heartbeat in responses adds token overhead to every tool call
- - Cannot directly suppress Cursor's own plan detection - can only instruct the model to decline it
- - Autonomous execution mode (run for hours without check-ins) is hard to enforce from tool responses alone

**Assumptions**:
- MCP tool descriptions are reliably read and influence model behavior
- Models will follow behavioral instructions embedded in tool responses
- The contextual heartbeat won't be so verbose that the model starts ignoring it
- Cursor's plan detection can be declined by the model if instructed to do so


### Approach: Session-Based State Machine

**Description**: Add an explicit session concept to RiotPlan. A riotplan_session_start tool links a conversation to a specific plan and sets the mode (explore, shape, execute). The MCP server tracks session state and enforces mode discipline - if you're in explore mode and the model tries to do something execution-like, the tool response warns it. Tool responses include contextual heartbeat AND mode-specific instructions. A riotplan_session_mode tool lets the user switch modes mid-conversation. Autonomous execution mode is a first-class concept - session_start with mode=execute and interactive=false tells the model to run all steps without check-ins. The Cursor rule is still generated, but the session state gives the rule teeth.

**Tradeoffs**:
- + Explicit session state makes mode discipline enforceable, not just suggested
- + Autonomous execution mode is a named concept the model can understand
- + Mode switching is intentional and visible - user always knows what mode they're in
- + Session state can track what has/hasn't been updated and remind more precisely
- - More complex to implement - new tools, server-side state, session lifecycle
- - Session state doesn't persist across Cursor conversations (context window resets)
- - User has to remember to call session_start at the beginning of each conversation
- - Risk of over-engineering - adding ceremony to what should feel natural

**Assumptions**:
- Users will remember to start sessions (or explore_idea can do it implicitly)
- Server-side session state is useful even though it resets between Cursor conversations
- Mode discipline enforced by tool responses is stronger than behavioral instructions alone
- The added ceremony of session management won't break conversational flow


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Embedded Behavioral Layer

**Reasoning**: Start with the simpler, lower-friction approach first. Heartbeat in tool responses, behavioral instructions in tool descriptions, explore_idea enhancement, and Cursor rule generation are all valuable on their own and can be shipped incrementally. Session-Based State Machine will be layered on top later when stronger mode enforcement is needed.

**Selected At**: 2026-02-07T21:30:55.101Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-07T21:29:13.241Z
**Next**: Select an approach and transition to 'built'
