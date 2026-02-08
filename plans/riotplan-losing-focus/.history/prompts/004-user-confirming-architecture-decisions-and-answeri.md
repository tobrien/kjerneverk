# Narrative: User confirming architecture decisions and answering final exploration questions

**Date**: 2026-02-07T21:29:03.237Z
**Source**: voice
**Speaker**: user

---

User confirmed the four-layer architecture and answered final questions:

HEARTBEAT: Confirmed. Every RiotPlan MCP tool response should include a reminder about current mode.

CURSOR RULE: Confirmed. RiotPlan should tell the user "for this to work best, you should put this rule in place" or have a prompt/command that generates it automatically.

EXPLORE IDEA: Confirmed. Should detect existing plans at a given path.

EXPLICIT TRANSITION PROTOCOL - NUANCE: User wants this to be OPTIONAL, not mandatory. Sometimes the user sets up a plan and knows it will take 2-3 hours to run. They want to be able to say "execute all steps without interaction" and walk away. A key frustration with Cursor models is they stop after ~20 minutes and ask "how's that?" when the user doesn't want that. So the transition protocol needs a mode where it's fully autonomous execution without check-ins.

HEARTBEAT WORDING: Should be CONTEXTUAL and DETAILED. Include: what directory the plan is in, what you just did, what you're planning on doing next if known. Give the model a sense that "I'm in control and I know what's going on." More detail is better than less.

CURSOR RULE GENERATION: Yes, RiotPlan should generate the rule automatically. User thinks that would be awesome.

MCP TOOL DESCRIPTIONS AS BEHAVIORAL INSTRUCTIONS: Strong yes. Every RiotPlan tool description should include behavioral instructions like "When using RiotPlan tools, you are in planning mode. Do not execute code changes." User said "let's do that."

READY FOR SHAPING: User says probably yes, ready to move to shaping.
