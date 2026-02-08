# Narrative: User responding to 6 exploration questions about the losing-focus problem

**Date**: 2026-02-07T21:19:52.093Z
**Source**: voice
**Speaker**: user

---

User responded to 6 exploration questions with detailed voice note:

1. CURSOR RULE APPROACH: Didn't try it. But interested in RiotPlan itself shipping a rule that projects should install - "if you're going to use RiotPlan, this is the rule you need to put in your project." Notes a competing concern: Cursor itself is always looking to see whether it should invoke its own planning mechanism, which creates tension.

2. SESSION CONTEXT: "That's kind of what I want" - a session_start tool that establishes we're working on a plan.

3. WHERE FOCUS IS LOST: The model keeps going through problem-solving, then loses track of the fact that the user is trying to DEVELOP a plan, not IMPLEMENT something. It starts randomly implementing ideas being discussed, even though the user just wants to work on the plan and go back and forth on what it means. This is a critical distinction: plan development vs plan execution.

4. MODEL VS TOOL DESIGN: User doesn't think tool call friction is the issue. "Sometimes it just stops making the tool calls." The model just drops the behavior entirely - it's not that it's too expensive, it's that the model forgets or deprioritizes.

5. WHAT GOOD LOOKS LIKE: Two concrete things: (a) All discussion is captured and the plan is updated continuously, (b) The model doesn't switch to executing/implementing on its own without going through the RiotPlan system. User has considered running RiotPlan in its own separate model to avoid Cursor deciding to take over the plan.

6. EXPLORE IDEA PROMPT AS SOLUTION: Yes, it is part of the solution space. User wants the tool to understand "I'm exploring an idea that might already exist" and while exploring, NOT execute the plan. Fix is probably a combination of fixing the prompts in the MCP to be more aggressive.

7. HEARTBEAT APPROACH: Could work. Should prompt things like "have you updated the riot plan with these MCP tools? Have you looked at the status of the resources?"
