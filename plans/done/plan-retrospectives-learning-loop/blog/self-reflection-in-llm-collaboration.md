# Self-Reflection in LLM Collaboration: Beyond Templated Responses

There's a problem with "self-reflection" in most AI tools: it's fake.

Not fake in the sense that it doesn't exist, but fake in the sense that it's **templated, predictable, and low-value**. It's string formatting masquerading as insight. And if we're serious about AI as a collaborator rather than just a tool, we need to do better.

## The Anti-Pattern

Here's what fake reflection looks like in code:

```python
if error_occurred:
    reflection = "Encountered challenges during execution. Consider improving error handling."
else:
    reflection = "Execution completed successfully. No issues encountered."
```

This isn't reflection. It's an if-then statement. It's deterministic logic that produces the same output for the same input every time. There's no analysis, no surprise, no insight.

Yet this pattern is everywhere in AI-assisted tools. The system detects a condition (error, success, timeout) and outputs a pre-written string. The user reads it and thinks "well, obviously." Nothing was learned. Nothing was discovered. The "reflection" added zero value.

### Why It Happens

This pattern emerges because reflection is hard to implement well. It's easier to:
1. Detect specific conditions (error codes, timing metrics, test results)
2. Map conditions to pre-written responses
3. Call it "AI-powered reflection"

The result looks like reflection—there's text, it references what happened, it uses words like "consider" and "improve." But it's hollow. If you can predict what the reflection will say before reading it, the system has failed.

## What Genuine Reflection Looks Like

Genuine self-reflection by an LLM requires three things:

### 1. Full Context Access

The model needs to see *everything* that happened, not just summary metrics. This means:
- The original plan and its assumptions
- What was actually implemented (code changes, not just step names)
- Intermediate decisions and their rationales
- Errors, warnings, and edge cases encountered
- Time spent on each task (actual vs. estimated)

**Example**: A templated system might say "Step 3 took longer than expected." A reflective system with full context says: "Step 3 took 45 minutes instead of 30 because the authentication middleware was more tightly coupled to the session store than the code structure suggested. The interface looked clean, but the implementation had hidden dependencies. Better upfront dependency analysis would have revealed this."

The difference: the second one tells you *why* and *what to do differently*.

### 2. Open-Ended Prompting

You can't get genuine insight from closed-ended questions. "Did this succeed?" produces "Yes" or "No." "What surprised you?" produces actual reflection.

The prompt design matters enormously. Here's what works:

**Good prompts:**
- "What surprised you during execution?"
- "What took longer than expected, and why?"
- "If you could redo this step, what would you change?"
- "What should the next step know that isn't obvious from the plan?"

**Bad prompts:**
- "Did you encounter any errors?" (closed-ended)
- "Rate your satisfaction with this step" (quantitative, not insightful)
- "Summarize what you did" (descriptive, not reflective)

The good prompts invite analysis. They ask the model to think about the gap between expectation and reality, to identify patterns, to provide forward-looking guidance.

### 3. Capability to Analyze

This is the hardest part: the model must be *capable* of genuine analysis. Not all models are.

A lightweight, fast model can execute a simple task and report success. But it can't necessarily analyze *why* something took longer than expected or identify patterns across multiple steps. That requires reasoning capability, context synthesis, and creative pattern recognition.

This is why, in RiotPlan, we recommend using the highest-tier model available for retrospective generation. Not because we want to spend more money, but because **genuine reflection is hard work** that requires genuine intelligence.

## The Quality Bar

Here's the test: **if you can predict what the reflection will say before reading it, the prompt has failed.**

Let's apply this test to some examples:

### Example 1: Predictable (Failure)

> "Step 4 completed successfully. All tests passed. No issues encountered."

**Predictable?** Yes. This is what you'd expect from a successful step. Zero insight.

### Example 2: Somewhat Better

> "Step 4 took 20 minutes longer than estimated due to test failures. Fixed by updating mock data."

**Predictable?** Somewhat. It's more specific, but still just reporting facts. No analysis of *why* the mocks were wrong or *how* to prevent this in the future.

### Example 3: Genuine Reflection (Success)

> "Step 4 revealed that our test mocks were using the old API response format. This happened because the API was updated in Step 2, but the test fixtures weren't updated at the same time. In future plans, test fixture updates should be a subtask of any step that changes API contracts, not left implicit. Also: the test failure message was unclear about the root cause—it said 'unexpected property' but didn't show which property. Better error messages would have saved 15 minutes of debugging."

**Predictable?** No. This identifies:
- The root cause (API format change)
- Why it was missed (implicit assumption about test updates)
- A process improvement (make fixture updates explicit)
- A tooling improvement (better error messages)
- Quantified impact (15 minutes saved)

This is what genuine reflection looks like. It goes beyond "what happened" to "why it happened" and "what to do differently."

## Why It Matters

Genuine self-reflection is where LLMs transition from **tool** to **collaborator**.

A tool executes commands and reports results. A collaborator tells you things you didn't know about your own process.

When an LLM can analyze its own execution and produce insights you didn't anticipate, it's no longer just following instructions—it's contributing to the improvement of the workflow itself.

### The Learning Loop

This is where reflection connects to continuous improvement. In RiotPlan, we've built a learning loop:

1. **Plan creation**: High-tier model designs the approach
2. **Step execution**: Variable-tier models execute the steps
3. **Step reflections**: Each step captures immediate learnings
4. **Final retrospective**: Highest-tier model synthesizes patterns across all steps
5. **Future plans**: Retrospectives from completed plans can be referenced during new idea exploration

The key: **this isn't memory**. The model doesn't remember previous plans. Instead, the system captures structured reflection that can be explicitly referenced when relevant.

**Example workflow:**

User: "I'm planning a new authentication feature. Reference the retrospective from the previous auth plan."

System: *Loads retrospective with context framing*

System: "The previous auth plan retrospective mentions that middleware coupling was more complex than expected. Should we do upfront dependency analysis for this new feature?"

The retrospective informs the new plan, not through implicit memory, but through explicit reference. This is more reliable and more transparent than hoping the model "remembers" something from a previous conversation.

## The Design Challenge

Building genuine reflection into an AI system requires careful prompt engineering. Here's what we learned building RiotPlan's retrospective feature:

### 1. Provide Anti-Patterns

Tell the model what *not* to do:

> "Do NOT write: 'Completed as planned. Tests pass.'
> This is a summary, not a reflection."

Negative examples help the model understand the quality bar.

### 2. Encourage Surprise

Explicitly ask for the unexpected:

> "What surprised you? What assumptions were wrong?"

This primes the model to look for gaps between plan and reality.

### 3. Request Specificity

Generic reflections are useless. Demand specifics:

> "If you could redo this step, what *specifically* would you change?"

The word "specifically" matters. It pushes the model toward concrete recommendations.

### 4. Ask Forward-Looking Questions

Reflection isn't just about the past—it's about improving the future:

> "What should the next step know that isn't obvious from the plan?"

This creates an inter-step communication channel where later steps learn from earlier ones.

### 5. Use Examples

Show the model what good reflection looks like. In RiotPlan's retrospective generation prompt, we include examples of high-quality vs. low-quality retrospectives. This calibrates the model's understanding of the task.

## The Aspiration

The goal isn't just to capture what happened. It's to create **plans that get better over time**.

Not because the model remembers previous plans (it doesn't), but because the system captures and reuses genuine insight. Each completed plan produces a retrospective. That retrospective can inform future plans. Over time, the organization builds a library of learnings that compound.

This is how human teams improve: through retrospectives, post-mortems, and lessons-learned documents. The difference with AI is that we can make this process more structured, more searchable, and more directly integrated into the planning workflow.

### What This Enables

Imagine a team that's run 100 plans through RiotPlan. They now have 100 retrospectives capturing:
- What worked well and why
- What went wrong and how to avoid it
- Patterns in estimation accuracy
- Common sources of complexity
- Effective strategies for specific types of work

When planning a new feature, they can:
1. Search for similar past plans
2. Reference their retrospectives
3. Incorporate lessons into the new plan

The AI doesn't need to "remember" anything. The system makes past learning explicitly available when relevant.

## Implementation Reality

Building this feature taught us something important: **genuine reflection requires genuine capability**.

We initially tried generating retrospectives with mid-tier models (Sonnet-class). The results were... fine. They weren't wrong. They just weren't insightful. They reported what happened without analyzing why or suggesting what to do differently.

When we switched to Opus-tier models for retrospective generation, the quality jumped dramatically. The retrospectives started identifying patterns we hadn't noticed, making connections between steps, and providing actionable recommendations.

The lesson: if you want genuine reflection, you need a model capable of genuine analysis. This has cost implications (Opus is expensive), but the value is real. A single insight from a retrospective can save hours of work on future plans.

## The Broader Pattern

This isn't just about RiotPlan. It's about how we design AI collaboration systems in general.

As AI capabilities grow, we're moving from:
- **Execution** ("do this task") 
- to **Collaboration** ("help me think about this")
- to **Improvement** ("help me get better at this over time")

Genuine self-reflection is the bridge from collaboration to improvement. It's what enables systems to not just help with the current task, but to help you improve your process for future tasks.

### The Test for Your System

If you're building AI-assisted tools, ask yourself:

1. Does your "reflection" feature produce insights the user couldn't predict?
2. Does it go beyond reporting what happened to analyzing why?
3. Does it provide actionable recommendations for future work?
4. Does it capture learning in a way that can inform future tasks?

If the answer to any of these is "no," you might have templated responses, not genuine reflection.

## Conclusion

Self-reflection in LLM collaboration is hard to do well, but it's worth doing well. The difference between templated responses and genuine insight is the difference between a tool that executes commands and a collaborator that helps you improve.

Building RiotPlan's retrospective feature taught us that genuine reflection requires:
- Full context access (not just summary metrics)
- Open-ended prompting (not closed questions)
- High-capability models (not just fast, cheap ones)
- Careful prompt engineering (with examples and anti-patterns)

When you get it right, something remarkable happens: the AI tells you things you didn't know about your own process. It identifies patterns you missed. It suggests improvements you hadn't considered.

That's when it stops being a tool and starts being a collaborator.

And that's when the real value begins.

---

*This post describes lessons learned while building plan retrospectives into RiotPlan. The retrospective feature explicitly designs for genuine reflection through open-ended prompting, full context access, and high-tier model usage. For implementation details, see the `generate_retrospective.md` prompt and `retrospective/generator.ts` in the RiotPlan codebase.*
