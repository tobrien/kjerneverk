# The Natural Model Tier Map: Why Different Work Needs Different Intelligence

When we built plan retrospectives into RiotPlan, something unexpected emerged: a natural pattern for when to use which model tier. Not a rigid rule, but an organic alignment between the type of work and the intelligence required. We call this the **Natural Model Tier Map**.

## The Observation

If you've worked with AI-assisted planning tools, you've probably noticed that not all tasks feel equally demanding. Creating a plan from scratch—understanding the problem space, anticipating dependencies, designing an approach—feels heavyweight. Executing a simple step like "create a config file" feels lightweight. And synthesizing what happened across an entire plan execution? That feels heavyweight again.

This isn't just subjective difficulty. It maps directly to the capabilities required from the AI model doing the work.

## The Three Phases

### Phase 1: Plan Creation (Highest Tier)

When you're creating a plan, you're operating at the highest level of abstraction. You need to:

- Understand the full problem space, not just the immediate task
- Anticipate dependencies between components
- Design an approach that balances competing concerns
- Break down ambiguous requirements into concrete steps
- Identify risks and edge cases before they become problems

This is **Opus-class work**. You need a model with deep reasoning capabilities, broad context understanding, and the ability to think several moves ahead. A fast, lightweight model will give you a plan, but it won't be a *good* plan. It'll miss the subtle dependencies, overlook the edge cases, and produce steps that seem reasonable in isolation but don't compose well.

**Example**: When planning a database migration, an Opus-tier model will notice that Step 3 (update application code) actually depends on Step 5 (add backward compatibility layer) and reorder them. A lighter model might miss this entirely.

### Phase 2: Step Execution (Variable Tier)

Here's where it gets interesting: **not all steps are created equal**.

Some steps are genuinely simple:
- "Create a `.env.example` file with placeholder values"
- "Add a TypeScript type definition for the new API response"
- "Update the README with installation instructions"

These can be handled by **Haiku-tier models** (or equivalent fast, lightweight options). They're well-defined, low-ambiguity tasks that don't require deep reasoning.

Other steps are complex:
- "Refactor the authentication middleware to support multiple providers"
- "Implement caching with invalidation strategy"
- "Add comprehensive error handling with retry logic"

These need **Sonnet or Opus-tier models**. They involve architectural decisions, edge case handling, and understanding how changes ripple through the system.

The insight: **the plan itself can suggest model tiers per step**. When generating a plan, the high-tier model can annotate each step with a recommended model tier based on complexity. This enables intelligent routing during execution.

**Example from RiotPlan**:
```markdown
## Step 03: Create Basic Config File
**Recommended Model**: Haiku
**Rationale**: Simple file creation with known structure

## Step 04: Implement Caching Strategy
**Recommended Model**: Sonnet
**Rationale**: Requires understanding of invalidation patterns and edge cases
```

### Phase 3: Retrospective (Highest Tier Again)

After completing a plan, you need to synthesize the entire execution experience and extract genuine insights. This requires:

- Analyzing what happened across all steps
- Identifying patterns in what went wrong (and right)
- Recognizing assumptions that were incorrect
- Producing creative insights the user didn't anticipate
- Connecting execution reality to planning assumptions

This is **Opus-class work again**—potentially even more demanding than plan creation. Why? Because genuine reflection requires:

1. **Full context awareness**: Understanding not just what was planned, but what actually happened
2. **Pattern recognition**: Seeing themes across multiple steps
3. **Creative analysis**: Producing insights that aren't obvious from the raw data
4. **Honest self-assessment**: Identifying where the plan (and the model's execution) fell short

A lightweight model will give you a retrospective, but it'll be generic: "Step 3 took longer than expected. Consider better time estimates." An Opus-tier model will tell you: "The coupling between the auth middleware and session store wasn't visible in the code structure. Future plans should include explicit dependency analysis before implementation."

## The Bookend Pattern

This creates what we call the **bookend pattern**: the most capable model opens and closes the workflow, with lighter (and cheaper) models doing the middle work.

```
[OPUS] Plan Creation
  ↓
[HAIKU] Simple Step 1
[HAIKU] Simple Step 2
[SONNET] Complex Step 3
[HAIKU] Simple Step 4
[SONNET] Complex Step 5
  ↓
[OPUS] Retrospective
```

The high-intelligence work happens at the boundaries—when you're designing the approach and when you're learning from the execution. The execution itself can often be delegated to lighter models, with selective use of heavier models for complex steps.

## Practical Implications

### Cost Optimization

This pattern enables significant cost savings. If you have an 8-step plan:
- 2 steps need Opus (plan + retrospective)
- 2 steps need Sonnet (complex implementation)
- 4 steps need Haiku (simple tasks)

You're using Opus for 25% of the work, not 100%. For a large project with dozens of plans, this compounds.

### Quality Optimization

More importantly, this pattern optimizes for *quality*, not just cost. You're using the right tool for each job:
- High-reasoning models for high-reasoning tasks
- Fast models for straightforward tasks
- No model is being wasted on work below its capability

### When to Switch Models

The bookend pattern suggests natural switching points:

1. **After plan creation**: Switch from Opus to Haiku/Sonnet for execution
2. **During execution**: Switch up to Sonnet/Opus for complex steps, back down for simple ones
3. **Before retrospective**: Switch back to Opus for synthesis

In RiotPlan, we signal these transitions explicitly. When you complete the final step, the system says: "All steps completed. Generate retrospective with highest-tier model available." This isn't just a suggestion—it's recognizing that retrospective generation is fundamentally different work than step execution.

## The Broader Trend

This pattern matters beyond RiotPlan. As model capabilities diverge—with fast-cheap models getting faster and cheaper, and slow-powerful models getting more capable—**intelligent routing becomes a core workflow design decision**.

We're moving from "use GPT-4 for everything" to "use the right model for each task." But this requires understanding *which* tasks need *which* capabilities. The Natural Model Tier Map is one answer for plan-based work.

### The Anti-Pattern

The anti-pattern is using a single model tier for everything:

- **All Opus**: Expensive and slow. You're paying premium prices for tasks that don't need premium intelligence.
- **All Haiku**: Fast and cheap, but the plan quality suffers. You save money on execution but lose it to rework when the plan was poorly designed.

The sweet spot is **strategic tier selection**: high-tier models for high-leverage work (planning, reflection), lighter models for execution.

## Connection to RiotPlan's Design

RiotPlan's retrospective feature embodies this pattern:

1. **Plan creation** uses a high-tier model to design the approach
2. **Step execution** uses variable-tier models based on step complexity
3. **Step reflections** capture immediate learnings (can use execution-tier model)
4. **Final retrospective** uses the highest-tier model to synthesize everything

The step reflections create an intermediate learning layer—each step captures what surprised the executing agent, what took longer than expected, and what the next step should know. These feed into the final retrospective, where the highest-tier model synthesizes patterns across all steps.

This creates a **learning loop**: high-quality plans → variable-quality execution → high-quality reflection → better future plans.

## Implementation Notes

If you're building similar systems, here's what we learned:

### 1. Make tier recommendations explicit

Don't just vary the model silently. Tell the user (or the executing agent) which tier is recommended and why. This builds trust and enables override when needed.

### 2. Allow override

Sometimes the user knows a "simple" step is actually complex in their context. Let them override the recommendation.

### 3. Track actual tier usage

Log which model tier was used for each step. This data informs future tier recommendations and helps identify patterns (e.g., "steps involving database schema changes always need Sonnet+").

### 4. Signal transitions

When moving from execution to retrospective, explicitly signal the transition and recommend a tier switch. Don't assume the user will remember.

### 5. Test with different tiers

During development, we ran the same plan with different tier combinations to see where quality degraded. The bookend pattern emerged from this empirical testing, not from theory.

## Conclusion

The Natural Model Tier Map isn't a rigid rule—it's an observed pattern that emerges when you match work type to model capability. Plan creation and retrospective generation are high-reasoning tasks that benefit from high-tier models. Step execution varies in complexity, enabling intelligent routing to lighter models for simple tasks.

This creates the bookend pattern: high-intelligence work at the boundaries (planning and reflection), with lighter models doing the middle work. It's a pattern that optimizes for both cost and quality, and it's likely to become more important as model capabilities continue to diverge.

The key insight: **not all AI work is created equal**. Design your workflows to use the right intelligence for each task, and you'll get better results at lower cost.

---

*This post describes patterns discovered while building plan retrospectives into RiotPlan. The retrospective feature explicitly implements the bookend pattern, using high-tier models for plan creation and synthesis, with variable-tier models for execution.*
