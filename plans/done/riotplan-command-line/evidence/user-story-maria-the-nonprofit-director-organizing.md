# User Story: Maria Organizes a Community Garden Project

- **Added**: 2026-02-09
- **Source**: user story / UX exploration
- **Original Query**: What would the CLI experience look like for someone who doesn't know about Cursor or Copilot?

## Who

Maria is a nonprofit program director. She's organized events and programs before, but she's not a software developer. She's never heard of Cursor, GitHub Copilot, or MCP. She knows how to use a terminal because she took a Python class once, and she has an OpenAI API key from experimenting with ChatGPT's API.

## What She Wants

She's planning a community garden project for her neighborhood. There are permits, volunteers, funding sources, seasonal planting schedules, and community outreach to coordinate. She wants a structured plan she can share with her board.

## How She Finds RiotPlan

A friend who's a developer mentions it. "It's like having a planning consultant that helps you think things through before you commit." He helps her install it with `npm install -g @kjerneverk/riotplan`.

---

## Session 1: Exploring the Idea (Tuesday evening, ~20 minutes)

```
$ export OPENAI_API_KEY=sk-...
$ riotplan explore community-garden \
    "Plan a community garden for the Sunnyside neighborhood"

🌱 Starting idea exploration: community-garden
   Using: OpenAI (gpt-4o)
   Plan directory: ./plans/community-garden

───────────────────────────────────────────────
  RiotPlan — Idea Exploration
  Type your thoughts. I'll ask questions and
  capture everything as we go.
  Type /done when you're ready to move on.
───────────────────────────────────────────────

🤖 I've created an idea for "community-garden". Let's
   explore this together.

   What's driving this idea? Tell me about the
   Sunnyside neighborhood and why a community
   garden makes sense there.

you> We have about 3 vacant lots on Elm Street that the
     city has been trying to figure out what to do with.
     Our nonprofit already has a relationship with the
     city parks department. We think we can get a
     5-year lease on one of the lots.

🤖 That's a strong starting position — existing
   relationship with parks, identified lots, and a
   realistic lease path. Let me capture that.

   📝 Added note: 3 vacant lots on Elm Street,
      existing relationship with city parks dept,
      targeting 5-year lease on one lot.

   A few questions that come to mind:
   - What's your budget situation? Grant-funded,
     donations, or do you need to fundraise?
   - How many volunteers do you think you can
     mobilize?
   - Is there a timeline pressure — like needing
     to plant by a certain season?

you> We have a small grant from the community
     foundation — $15,000. We'd need to raise
     probably another $10-15K. We have about 20
     active volunteers. And yes, we'd love to have
     beds ready for spring planting, which means
     we need the site prep done by March.

🤖 Ok, so there's real timeline pressure. Let me
   capture the constraints.

   📋 Constraint: $15K grant secured, need
      additional $10-15K fundraising
   📋 Constraint: ~20 active volunteers available
   📋 Constraint: Site prep must be done by March
      for spring planting season
   ❓ Question: What permits are needed from the
      city for converting a vacant lot?
   ❓ Question: What site prep is needed — soil
      testing, raised beds, water access?

   Do you know what the permitting process looks
   like?

you> Not really. That's something I need to figure out.

🤖 That's a good unknown to flag early. Let me look
   into that for you.

   🔍 Searching for community garden permitting
      requirements...

   📎 Evidence saved: "Municipal community garden
      permitting — typical requirements include
      land use permit, soil contamination testing
      (especially for vacant lots), water hookup
      permits, and sometimes neighborhood notification."

   Based on what I found, the soil testing could be
   critical since these are vacant lots. Lead and
   contamination testing is usually required. That
   could affect your March timeline if results take
   weeks.

   ❓ Question: Have the vacant lots been tested
      for soil contamination?

you> Oh wow, I hadn't thought about that. No, they
     haven't been tested. That could be a real problem.

🤖 It's good we caught this now rather than after
   you've committed to a lot. This is exactly the
   kind of thing that can derail a project if you
   don't know about it early.

   📝 Added note: Soil contamination testing is a
      critical early dependency. Could affect lot
      selection AND timeline. Must be addressed
      before committing to a specific lot.

   Want to keep exploring, or does this feel like
   enough to start thinking about approaches?

you> Let's keep going. What about the fundraising side?

🤖 Good question. Let me ask...
```

*Maria continues the conversation for another 10 minutes, discussing fundraising strategies, volunteer coordination, and seasonal planning. Everything she says gets captured as notes, constraints, and questions in the plan.*

```
you> /done

🤖 Great exploration session. Here's a summary of
   what we captured:

   📝 8 notes
   📋 6 constraints
   ❓ 9 questions (3 answered, 6 open)
   📎 2 pieces of evidence

   Your plan is saved at ./plans/community-garden/
   You can come back anytime with:
     riotplan explore ./plans/community-garden

   When you're ready to compare approaches and
   build a concrete plan, run:
     riotplan build ./plans/community-garden
```

---

## Session 2: Building the Plan (Thursday evening, ~10 minutes)

Maria has had time to think. She talked to the parks department about soil testing. She comes back.

```
$ riotplan explore ./plans/community-garden

🌱 Resuming idea exploration: community-garden
   Last session: Tuesday, 8 notes, 6 constraints

🤖 Welcome back! Last time we explored the community
   garden idea for Sunnyside. You had some open
   questions about soil testing and permits. Any
   updates?

you> Yes! I called parks dept. They said the middle lot
     on Elm was tested 2 years ago and came back clean.
     They can fast-track the lease for that one.

🤖 That's great news — removes a major risk.

   📝 Added note: Middle Elm St lot has clean soil
      test from 2 years ago. Parks dept can
      fast-track the lease.
   ✅ Resolved: "Have the vacant lots been tested
      for soil contamination?" — Middle lot is clean.

   I think we have enough to build a real plan. Want
   to move to that stage?

you> Yes, let's do it.

you> /done
```

```
$ riotplan build ./plans/community-garden

🏗️  Building plan from idea artifacts...
   Reading: IDEA.md (8 notes, 6 constraints, 9 questions)
   Reading: 2 evidence files
   Reading: conversation history

   Generating plan with OpenAI (gpt-4o)...

   ✅ Plan generated: 7 steps

   📄 SUMMARY.md — Community Garden Project Overview
   📄 EXECUTION_PLAN.md — Step-by-step execution
   📄 plan/01-secure-lease-and-permits.md
   📄 plan/02-fundraising-campaign.md
   📄 plan/03-volunteer-recruitment-and-training.md
   📄 plan/04-site-preparation.md
   📄 plan/05-garden-infrastructure.md
   📄 plan/06-spring-planting-program.md
   📄 plan/07-community-launch-event.md

   View the plan:
     riotplan status ./plans/community-garden

   Start executing:
     riotplan execute ./plans/community-garden
```

---

## What Maria Experiences

- She never opens an IDE. She never installs Cursor. She never hears the word "MCP."
- The conversation feels like talking to a knowledgeable planning consultant.
- The AI asks good questions, catches risks she hadn't considered (soil testing), and does research for her.
- Everything is captured in plain markdown files she can open in any text editor or share via email.
- She can come back days later and pick up where she left off.
- When she's ready, the plan generates into a real actionable document with steps she can hand to her board.

## Key UX Observations

1. **The `explore` command must feel conversational, not technical.** Maria doesn't think in terms of "constraints" and "evidence" — she just talks about her project. The AI extracts the structure.
2. **Research should happen proactively.** When Maria says "I don't know about permits," the AI goes and finds out.
3. **The `/done` command is a natural exit.** No complex state management from the user's perspective.
4. **Resuming is effortless.** Same command with a path instead of a description.
5. **The plan output is the deliverable.** Maria can share markdown files with her board without needing them to install anything.
