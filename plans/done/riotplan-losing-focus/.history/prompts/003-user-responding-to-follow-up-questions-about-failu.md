# Narrative: User responding to follow-up questions about failure modes, competing systems, heartbeat, and transition triggers

**Date**: 2026-02-07T21:24:43.426Z
**Source**: voice
**Speaker**: user

---

User confirmed and expanded on the two failure modes and responded to follow-up questions:

FAILURE MODE CONFIRMATION: Yes, the model drifts from documenting/discussing the plan to just having a conversation. Then when the user asks it to do something, it executes instead of continuing to talk about the plan. It starts implementing rather than planning.

COMPETING PLANNING SYSTEMS - CONCRETE EXAMPLE: This has happened multiple times where the user is working on a RiotPlan and Cursor says "Hey, what you're working on looks like a plan. Can we create a plan for it?" User wants to say "no, back off, I want to create a plan with RiotPlan." The real question is: is there a way to affect the system prompt in a Cursor conversation (or any AI conversation) in a way that's not necessarily visible to the user? Can RiotPlan somehow inject context that tells the model "a planning system is already active, don't create your own plan"?

HEARTBEAT - STRONG YES: "Every RiotPlan response should remind whatever model is calling it that it exists and that it needs to make sure it stays on task. That would be very useful."

EXPLORE IDEA ENHANCEMENT: User doesn't want explore_idea to only create new ideas. Wants to be able to: (a) give it a file path to an existing plan, (b) have it sense where the user is (current directory/file) and detect an existing plan, (c) explore_idea should work for both new and existing plans seamlessly, not as a separate command.

TRANSITION FROM EXPLORATION TO EXECUTION: It's not a clean moment - it's a discussion. When it works well, the model asks "Are you ready to develop the plan?" or "Are you ready to move to execution?" and the user gives an affirmative answer. This is an explicit handoff, not an assumption. User wants to capture what that ideal conversation/transition should look like in something the model can understand - essentially a protocol for stage transitions that requires explicit user consent.
