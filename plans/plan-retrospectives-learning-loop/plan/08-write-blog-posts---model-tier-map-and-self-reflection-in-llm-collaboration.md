# Step 08: Write Blog Posts — Model Tier Map and Self-Reflection in LLM Collaboration

## Objective

Write two blog posts that capture the insights driving this feature. These are deliverables that communicate the philosophy behind plan retrospectives to a broader audience.

## Background

Through building this feature, two powerful ideas have crystallized:
1. There's a natural model tier map for plan-based work (create high, execute variable, reflect highest)
2. Self-reflection by LLMs is a distinct capability that must be designed for, not bolted on

## Tasks

### 8.1 Blog Post 1: "The Natural Model Tier Map"

Write a blog post covering:
- The observation: different phases of plan-based work have different intelligence requirements
- **Plan creation** (highest tier): Requires understanding the full problem space, designing an approach, anticipating dependencies. This is Opus-class work.
- **Step execution** (variable tier): Individual steps vary in complexity. Simple file creation → Haiku. Complex refactoring → Sonnet or Opus. The plan itself can suggest model tiers per step.
- **Retrospective** (highest tier again): Synthesizing the full execution experience and producing creative insight requires the same (or higher) caliber as plan creation.
- The insight: this creates a "bookend" pattern — the most capable model opens and closes the workflow, with lighter models doing the middle work.
- Practical implications: cost optimization, quality optimization, when to switch models.
- Connect to the broader idea: as model capabilities diverge (fast-cheap vs slow-powerful), intelligent routing becomes a core workflow design decision.

Target: ~1500-2000 words. Conversational but substantive tone.

### 8.2 Blog Post 2: "Self-Reflection in LLM Collaboration"

Write a blog post covering:
- The problem: "self-reflection" in many AI tools is fake — it's templated if-then logic that produces predictable, low-value output
- The anti-pattern: code that says "if error then write 'encountered challenges'" is not reflection, it's string formatting
- What genuine self-reflection looks like: a capable model analyzing its own execution with access to full context, producing insights the user didn't anticipate
- Why it matters: this is where LLMs transition from tool to collaborator — when they can tell you something you didn't know about your own process
- The design challenge: how to prompt for genuine reflection (open-ended questions, anti-patterns, encouraging surprise)
- The quality bar: if you can predict what the reflection will say before reading it, the prompt has failed
- Connection to continuous improvement: retrospectives that feed future plans create a learning loop — not through memory, but through structured reflection
- The aspiration: plans that get better over time, not because the model remembers, but because the system captures and reuses genuine insight

Target: ~1500-2000 words. Personal, opinionated tone. Draw from the real experience of running 100+ plans.

### 8.3 Determine publication location

- Where should these posts live? Options:
  - kjerneverk.github.io (the project's site)
  - A docs/ directory in the riotplan repo
  - External blog
- The user should decide, but draft them as standalone markdown files first

## Acceptance Criteria

- [ ] Blog post 1 written: "The Natural Model Tier Map"
- [ ] Blog post 2 written: "Self-Reflection in LLM Collaboration"
- [ ] Both posts are substantive (1500-2000 words each)
- [ ] Both posts connect to the retrospective feature specifically
- [ ] Posts are saved as markdown files ready for publication

## Key Files

- `blog/natural-model-tier-map.md` (new, location TBD)
- `blog/self-reflection-in-llm-collaboration.md` (new, location TBD)

## Dependencies

- Steps 01-07 (the feature should be implemented before writing about it — authenticity matters)

## Notes

These blog posts should be written AFTER the feature is built and tested. The experience of building and using it will inform the writing. Don't write about the theory — write about the reality.
