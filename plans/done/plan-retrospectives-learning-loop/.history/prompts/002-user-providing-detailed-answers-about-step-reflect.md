# Narrative: User providing detailed answers about step reflections, retrospective content, learning mechanisms, and format

**Date**: 2026-02-09T03:34:22.204Z
**Source**: voice
**Speaker**: user

---

Step reflections: Written by agent after step completes. Agent should have memory of what it just did. Should capture: time taken, deviations, surprises, blockers, AND enumerate what could have been done differently to make it more straightforward.

Step reflections MUST be visible to subsequent steps - step 5 should learn from step 3's reflection. This creates a communication mechanism between steps.

Overall retrospective.md: Should incorporate/synthesize all the step summaries. Should compare original plan (what we thought we'd do) vs what actually happened.

Not a summary - we already have summary.md and status.md. This is different: high-value feedback focused on what went right, what went wrong, and what could have been done differently in the plan. Designed for: "if I'm going to create another plan like this in the future, what could I have done differently?" Want it to be very creative.

Learning from other plans: During idea exploration, might say "what I'm doing here is related to what we did over there, can you consider the retrospective from that plan?" This helps inform questions that will be asked. Don't automatically detect related plans - RiotPlan doesn't have an index yet.

Format: Human-readable prose, possibly with YAML front matter. In fact, many files (step status, plan status, etc.) probably need YAML front matter.
