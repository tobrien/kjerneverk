# Step 04: Design and Implement Retrospective Generation Prompt

## Objective

Create the prompt that drives overall plan retrospective generation. This is the crown jewel of the feature — it must produce creative, high-value feedback that genuinely helps future plan creation. Not a summary. Not a template. Real analysis.

## Background

After 100+ plans, the user wants a system that gives genuine feedback about what could be done differently. They've seen the anti-pattern in other tools: "self-reflection" that's really just templated if-then logic producing predictable, low-value output. This prompt must be designed to leverage the full reasoning capability of a high-tier model (Opus-class).

## Tasks

### 4.1 Design the retrospective prompt

Create `src/mcp/prompts/generate_retrospective.md`:

The prompt must:
- Receive as context: all step reflections, the original plan (SUMMARY.md, EXECUTION_PLAN.md, step files), STATUS.md, and execution history
- NOT produce a summary (SUMMARY.md and STATUS.md already exist for that)
- Focus on three questions:
  1. **What went right?** — What patterns, decisions, or approaches worked well and should be repeated?
  2. **What went wrong?** — Where did assumptions fail, where was the plan over/under-specified, what caused friction?
  3. **What would you do differently?** — If creating this plan again from scratch, what changes would produce better outcomes?
- Compare original plan (what we thought we'd do) vs actual execution (what happened)
- Identify patterns that should influence future plans
- Encourage creative, surprising insights — "What pattern here would I not have noticed?"
- Explicitly instruct: avoid generic observations, avoid filler, every sentence should carry signal

### 4.2 Design the prompt's anti-patterns section

Include explicit anti-patterns in the prompt:
- "Do NOT write 'everything went smoothly'" — that's useless
- "Do NOT enumerate what each step did" — that's a summary, not reflection
- "Do NOT use phrases like 'overall the plan was successful'" — be specific
- "DO identify the single most surprising thing that happened"
- "DO identify the assumption that was most wrong"
- "DO propose a concrete change to the plan structure itself"

### 4.3 Design the output format

retrospective.md format:
- Freeform human-readable prose
- No fixed sections, but the prompt should guide toward covering:
  - Plan vs Reality comparison
  - Assumption audit
  - Step specification quality
  - Adaptation patterns
  - Recommendations for next time
- The retrospective should read like a thoughtful colleague's post-mortem, not a generated report

### 4.4 Test the prompt quality

Before finalizing, manually test the prompt with a real completed plan's data to verify:
- Does it produce generic output? (bad)
- Does it surface something surprising? (good)
- Would future-you learn something from reading it? (the real test)

## Acceptance Criteria

- [ ] Prompt file exists at `src/mcp/prompts/generate_retrospective.md`
- [ ] Prompt receives full execution context (reflections, plan, status, history)
- [ ] Prompt explicitly avoids summary and template patterns
- [ ] Prompt invites creative, specific, high-value analysis
- [ ] Output format is freeform prose, not structured template
- [ ] Anti-patterns section prevents rote responses

## Key Files

- `src/mcp/prompts/generate_retrospective.md` (new)

## Dependencies

- Step 01 (reflection reader for loading step reflections)
- Step 03 (understanding of how reflections are structured)

## Notes

This step should take real time and care. The prompt is the product. A mediocre prompt will produce mediocre retrospectives, which defeats the entire purpose. Consider studying how humans write effective post-mortems — what questions do they ask? What makes a post-mortem worth reading six months later?

The user specifically said: "I think this self-reflection feature is where we start to see LLMs and reasoning models astound us with creative ideas that we haven't thought through yet." The prompt must be worthy of that ambition.
