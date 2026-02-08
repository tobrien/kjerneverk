# The Best Code I Wrote This Week Was a Conversation

## How an AI planning partner saved me from building the wrong thing

---

I almost spent three weeks building something that wouldn't work for the people I was building it for. Not because I'm careless, but because I was excited and I had momentum. The thing that stopped me wasn't a code review. It wasn't a failing test. It was a conversation -- with an AI planning tool that knew how to push back.

Let me tell you about the plan that changed itself.

---

## It Started With a Frustration

I was using RiotPlan, a planning tool I've been building, through Cursor via MCP. Everything was working fine until I tried to generate a plan. The tool needed an Anthropic API key.

I already had Claude. I was *literally talking to Claude right now*. Why was my tool asking me for a separate API key?

> "If I'm already using Cursor and I want to use RiotPlan, I don't want to have to set up another account to get an API key."

This is the kind of friction that kills adoption. Not a bug. Not a missing feature. Just... unnecessary complexity. The kind of thing that makes someone close the tab and never come back.

I had an idea. A good one, I thought. MCP has a feature called "sampling" -- it lets a tool send a prompt *back* to the model that called it. If RiotPlan could use sampling, it wouldn't need its own AI provider at all. The calling model would do the work. No duplicate API keys. No setup friction. It would just... work.

And that's where most developers would have started coding.

## But I Didn't Start Coding

Instead, I opened up RiotPlan and started a conversation. Not "write me a plan" -- I mean an actual back-and-forth dialogue about whether this idea was even viable.

This is what makes planning with an LLM different from a TODO list or a Kanban board. I wasn't organizing tasks. I was *thinking out loud* with a partner that could challenge my assumptions and go find answers I didn't have.

Here's how that conversation unfolded:

**Me:** "RiotPlan should auto-detect when it's being called via MCP. If MCP context is detected, automatically use sampling for all AI operations instead of direct API calls. No user configuration needed -- just works."

The tool captured that as a note. Then it started asking questions:

- *How does MCP sampling actually work? What's the API?*
- *Does sampling work consistently across Cursor, Claude Code, and GitHub Copilot?*
- *What happens if sampling isn't available?*
- *Does the sampling stuff in MCP even work?*

That last question is the one that matters. Not "how do we build it?" but "does the foundation we're building on actually exist?"

## The Tool Went to the Internet

This is where things get interesting. RiotPlan didn't just record my ideas and wait for me to research everything myself. It went out and found evidence.

It pulled the MCP sampling specification from November 2025. It documented the exact API signature -- `sampling/createMessage` with JSON-RPC, the parameters it accepts, the error codes it returns. It found that the spec requires human-in-the-loop approval, meaning users would see a dialog every time sampling is used. It discovered that streaming isn't supported, so users would have to wait for complete responses.

All of this was captured as evidence -- timestamped, sourced, attached to the plan. Not lost in a chat window. Not buried in browser tabs. *Part of the plan itself.*

And then the tool found something that changed everything.

## The Finding That Saved Me Three Weeks

Here's a support matrix the tool assembled from multiple sources:

| Client | MCP Sampling |
|--------|-------------|
| **Cursor** | No |
| **Claude Code** | No |
| **Claude Desktop** | No |
| **GitHub Copilot** | Yes |

Read that first line again. **Cursor does not support MCP sampling.** My *entire idea* was predicated on Cursor users avoiding API key setup through sampling. And Cursor doesn't support sampling. Only tools.

If I had started coding immediately -- and let's be honest, that's what most of us would have done -- I would have built a sampling provider, integrated it into the session layer, tested it with mock clients, and then discovered weeks later that none of my actual users could use it.

The plan captured this moment as a critical finding:

> "CRITICAL FINDING - Cursor Does NOT Support Sampling. This invalidates the core assumption of the idea."

And then something beautiful happened. The plan didn't die. It *pivoted*.

## Plans Are Living Things

Here's what most planning tools get wrong: they treat a plan like a contract. You write it, you execute it, you're done. But real plans -- the kind that lead to good software -- are living documents that change as you learn.

RiotPlan has a lifecycle for this:

```
Idea → Shaping → Plan → Execution → Done
         ↑                    |
         └──── pivot ─────────┘
```

Sometimes an idea needs to marinate. Sometimes the best insights come after a long drive, or a few days of skiing, or a conversation with a colleague who asks the one question you hadn't considered. The plan needs to survive those gaps. It needs to be there when you come back, with all the context intact.

My sampling plan started on January 31st. I was excited, I captured the problem, the vision, the constraints. Then I stepped away. When I came back on February 7th -- a week later -- the plan was waiting with all that context. I didn't have to re-read Slack threads or search my browser history. The plan had everything: 19 questions I'd raised, 8 constraints I'd identified, narrative chunks that captured not just *what* I said but *why* I said it.

And when the critical finding dropped, the plan adapted. Here's what the conversation looked like:

**The tool, after research:** "This invalidates the core assumption of the idea. Need to either: (1) Target GitHub Copilot instead, (2) Wait for Cursor to add sampling, (3) Design a different solution, (4) Keep current approach until sampling is widely supported."

**Me:** "Build it anyway."

Not because I'm stubborn. Because the conversation had given me enough context to see the strategic picture:

- FastMCP (a Python client) *does* support sampling -- we can test with it today
- GitHub Copilot supports it -- real users exist
- Cursor will likely add it -- we'll be ready when they do
- Building it demonstrates value and puts pressure on vendors to adopt

That's not a gut feeling. That's a decision grounded in evidence that was gathered, organized, and presented during the planning process itself.

## What the Final Plan Looks Like

After 71 timeline events, 7 evidence files, and 4 narrative chunks, the plan crystallized into something concrete:

**5 Phases. 14 Steps. 3-4 weeks of work.**

1. **Session Architecture** -- Track per-session client capabilities so sampling availability isn't global
2. **execution-sampling Package** -- A reusable provider that any MCP tool can use
3. **RiotPlan Integration** -- Wire up automatic detection and graceful fallback
4. **Testing with FastMCP** -- Prove it works end-to-end with a real sampling client
5. **Documentation and Advocacy** -- Blog posts (like this one) to demonstrate the value

But here's what makes this plan different from what I would have written on Day 1: it has *fallback logic*. If sampling isn't available, it falls back to direct API providers. If neither works, it gives the user a clear error message telling them exactly what to do. The original "just use sampling" idea had none of that. The planning conversation surfaced the complexity, and the plan adapted.

## This Is Not Cursor Plans

I need to be direct about something. Cursor has a "plans" feature. It's useful for what it does -- laying out a sequence of code changes. But it's solving a different problem.

A Cursor plan says: "Here are the files I'll change and the order I'll change them in."

A RiotPlan says: "Here's an idea I had three weeks ago. Here's what I thought then. Here's what I learned since. Here's the conversation I had about it. Here's the evidence that changed my mind. Here's why I pivoted. Here's the strategy I landed on. Here are the risks I'm watching. And here's the execution plan that emerged from all of that."

The difference is *time*. Cursor plans are ephemeral -- they exist for the duration of a coding session. RiotPlan plans are persistent -- they survive across days, weeks, or months. They capture the *why* alongside the *what*. They have history.

Look at the prompt history from my sampling plan:

```
001 - Identifying critical usability obstacle
002 - Complete solution vision
003 - Investigation complete - critical findings and pivot
004 - Architecture pivot - session-based sampling with FastMCP
005 - Step 1 execution complete
006 - Step 2 execution complete
007 - Phase 1 done
...
```

That's not a task list. That's the story of how a plan evolved from a frustrated observation to a researched, pivoted, evidence-backed strategy. Each entry is a snapshot of the conversation at that moment -- what we knew, what changed, what we decided.

## LLMs Are Here to Support You, Not Replace You

There's a narrative in the AI space that models are here to replace developers. Write the code for you. Think for you. That framing is wrong, and it leads to bad outcomes.

Here's what actually happened in this planning process:

- **I** identified the problem (API key friction)
- **I** had the vision (use MCP sampling)
- **The tool** researched the feasibility (found the spec, the support matrix, the edge cases)
- **The tool** discovered the critical blocker (Cursor doesn't support sampling)
- **I** made the strategic decision (build it anyway, here's why)
- **The tool** organized the evidence and synthesized the plan
- **I** approved the plan and started execution
- **We** built it together

The LLM didn't replace my judgment. It amplified it. It caught the thing I would have missed because I was excited. It gathered information I would have spent hours Googling. It maintained context across a week-long gap when my own memory would have lost the thread.

That's not replacement. That's partnership.

## The Meta-Lesson

The most valuable code I wrote this week wasn't TypeScript. It was a conversation that generated a plan that *prevented me from building the wrong thing*.

Three weeks of development effort, redirected before a single line of production code. Evidence gathered from the MCP specification, client support matrices, and codebase audits -- all integrated into a living document that captured the journey from "wouldn't it be cool if..." to "here's exactly what we're building, why, and what to do when things go sideways."

If you're reaching for your keyboard the moment you have an idea, pause. Have the conversation first. Let the plan breathe. Let it challenge you. Let it change.

The best plans aren't the ones you write. They're the ones you grow.

---

*RiotPlan is an open-source planning tool that integrates with AI-powered development environments via MCP. It captures ideas, facilitates research, tracks decisions, and produces executable plans -- all through conversation. Learn more at [kjerneverk.github.io](https://kjerneverk.github.io).*
