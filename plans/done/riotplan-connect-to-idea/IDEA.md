# Idea: riotplan-connect-to-idea

## Core Concept

Plan generation must be rooted in agentic exploration of all idea content (IDEA.md, history, prompts, timeline, evidence) - not just model memory

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- CORE PROBLEM: Plan generation currently relies on model memory of the conversation, not on agentic exploration of the idea artifacts (IDEA.md, .history/, .evidence/, timeline.jsonl, prompts/). This works 'pretty well' but misses the entire point of RiotPlan.
- WHAT RIOTPLAN IS FOR: You use RiotPlan to finely tune a whole set of assumptions, evidence, ideas, ontologies. When you create the plan, ALL that information should flow into plan generation. It's not just about remembering the conversation - it's about deeply integrating all the structured knowledge you've built.
- CURRENT BEHAVIOR: Model just remembers what was talked about. This provides 'a little bit of structure' but it's not enough. Memory is lossy, contextual, and doesn't capture the full richness of the idea exploration.
- DESIRED BEHAVIOR: Plan generation should be rooted in AGENTIC EXPLORATION of idea content. The model/agent should: (1) Read IDEA.md for all requirements, constraints, questions, notes, (2) Read .history/timeline.jsonl for full conversation flow, (3) Read .history/prompts/ for narrative context, (4) Read .evidence/ for supporting materials, (5) Synthesize all this into implementation plan.
- FALLBACK POSITION: What happens now (memory-based generation) should be the FALLBACK behavior if something breaks. It's the degraded mode, not the primary mode. If agent can't read files or exploration fails, THEN fall back to memory.
- EXAMPLE FROM CARDIGANTIME: During cardigantime-file-resolution, the model created 12 steps from memory without reading: IDEA.md (92 lines of requirements), .evidence/proposed-fix-resolve-path-value.md (130 lines of code), .history/timeline.jsonl (65 lines), or prompts. The steps were general, not grounded in the detailed work done during idea phase.
- INVESTIGATION FINDING: build.ts reads IDEA.md and SHAPING.md as raw text concatenation only. Does NOT read evidence files, timeline/history, LIFECYCLE.md, or prompt history. The riotplan_read_context tool exists and aggregates all artifacts but build.ts doesn't use it. The AI generator prompt (generator.ts) is completely generic - no instructions about honoring constraints, referencing evidence, or implementing the selected approach. No post-generation validation exists.
- FIX 1 - Wire riotplan_read_context into riotplan_build: Before generating, load full artifact context (evidence, history, constraints, selected approach). Pass structured context to generator, not raw file dumps.
- FIX 2 - Rewrite generator prompt to be artifact-aware: System and user prompts must instruct the model to honor every constraint from IDEA.md, implement the selected approach from SHAPING.md, reference and incorporate evidence files, ground steps in specific artifacts rather than general knowledge.
- FIX 3 - Post-generation validation: After plan is generated, check that constraints are addressed, evidence is referenced where relevant, and selected approach is reflected. At minimum a warning, not necessarily blocking.
- FIX 4 - Generation provenance summary: After plan is generated, produce a summary showing HOW the plan was influenced by the artifacts - which constraints were addressed in which steps, which evidence was incorporated, how the selected approach shaped the plan, what history informed the direction. This makes the connection visible and auditable.
- OPEN DESIGN QUESTION: How should generation work mechanically? Two options: (A) Big prompt approach - stuff all artifacts into a single massive prompt and let the model generate in one shot. Risk: context window limits, model may lose focus on constraints buried in long context. (B) Agentic approach - have the generator read artifacts iteratively, reason about them, then generate. More reliable but more complex, requires multi-turn generation. User raised this concern explicitly.

## Constraints

- _Add constraints..._
- Plan generation MUST read and incorporate all idea artifacts - IDEA.md, timeline, prompts, evidence
- Memory-based generation should be fallback only, not primary mode
- Generated plans must be reproducible from idea artifacts alone - someone else should be able to generate similar plan from same artifacts
- Must work with both standalone RiotPlan (with AI provider) and MCP mode (with sampling)

## Questions

- _Add questions..._
- What does 'agentic exploration' mean in this context? How deep should the agent go? Just read files, or analyze and synthesize?
- Should this be part of riotplan_generate, or a separate tool like riotplan_explore_and_generate?
- How do we structure the exploration? Read everything first, then generate? Or iterative - read, think, read more, generate?
- What if idea artifacts are huge (100+ pages)? Do we need summarization or chunking strategies?
- How does this relate to riotplan-sampling? If we use MCP sampling, does the calling model do the exploration?

## Evidence

_Attach relevant documents, images, or files_

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T17:50:01.145Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
