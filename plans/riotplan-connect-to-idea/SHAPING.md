# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Structured Rich Prompt

**Description**: Rewrite the generation pipeline so riotplan_build calls riotplan_read_context to gather all artifacts, then constructs a single, well-structured prompt with explicit sections the model must respond to. The prompt has clear labeled sections: CONSTRAINTS (with each constraint listed and numbered), SELECTED APPROACH (with the full description and reasoning), EVIDENCE (with summaries/previews of each evidence file, not full content for large files), HISTORY CONTEXT (key narrative chunks and decisions), and REQUIREMENTS (what the model must do with each section). The response schema is extended to include provenance: for each generated step, the model must cite which constraints it addresses and which evidence informed it. Post-generation, a validation pass checks that every constraint is cited by at least one step, and produces a PROVENANCE.md file showing the mapping. The prompt measures its own token size and warns if it exceeds a configurable threshold (e.g., 50K tokens). Evidence files over a size limit get summarized rather than included in full.

**Tradeoffs**:
- + Single-shot generation - simple architecture, one API call
- + Prompt is directive and specific - model gets clear instructions about what to honor
- + Provenance in the response schema forces the model to show its work
- + Token size awareness prevents runaway context
- + Validation catches missed constraints mechanically
- + Evidence summarization keeps prompt manageable
- + Works with any model that supports structured output
- - Single-shot means model has to juggle everything at once - constraints, evidence, approach, AND step generation
- - Long prompts risk attention degradation - model may lose track of constraint #7 when generating step #5
- - No opportunity for the model to 'think' about the artifacts before planning
- - Summarizing large evidence files may lose important details
- - Provenance citations may be shallow - model says it addressed a constraint without really doing so

**Assumptions**:
- Most plans will have manageable artifact sizes (under 50K tokens total)
- Structured output with provenance citations gives enough accountability
- Models are good enough at following structured prompts with labeled sections
- Evidence summaries (first N lines or truncated) capture enough for planning


### Approach: Two-Pass Agentic Generation

**Description**: Split generation into two distinct passes, both executed by RiotPlan itself. PASS 1 (Analysis): RiotPlan loads all artifacts via read_context, then sends them to the model with a different prompt - not 'generate a plan' but 'analyze these artifacts and produce a generation brief.' The model reads constraints, evidence, history, and the selected approach, then outputs a structured analysis: what the key requirements are, what the evidence tells us, what the selected approach commits to, what risks exist, and a proposed step outline. This is the 'reasoning' pass. PASS 2 (Generation): The generation brief from pass 1 is fed into the actual plan generation prompt. This prompt is focused: here's the brief, here are the constraints to honor, generate the steps. The brief is more compact than raw artifacts because the model already distilled them. The response schema includes provenance. After generation, validation checks constraints and produces PROVENANCE.md. The analysis brief is also saved as a plan artifact (ANALYSIS.md or similar) so you can see what the model understood.

**Tradeoffs**:
- + Model gets dedicated space to reason about artifacts before planning
- + The generation brief is distilled and focused - second pass prompt is cleaner
- + ANALYSIS.md artifact shows what the model understood, making misunderstandings visible
- + Better for complex plans with lots of evidence and constraints
- + Each pass has a simpler job - analyze OR generate, not both at once
- + If analysis is wrong, you can catch it before generation happens
- - Two API calls instead of one - roughly double the token cost
- - More complex architecture - two prompts, two response schemas, intermediate artifact
- - The analysis pass could itself miss things, and the generation pass trusts it
- - Slower - sequential API calls add latency
- - RiotPlan needs to orchestrate multi-turn generation internally

**Assumptions**:
- Complex plans benefit enough from dedicated analysis to justify the cost
- The analysis brief will be meaningfully more useful than raw artifacts
- RiotPlan can handle multi-turn orchestration in its generator
- Saving the analysis as an artifact adds value for auditability


### Approach: Rich Prompt with Reasoning Gate

**Description**: Combine the best of both: build a rich, structured prompt like approach 1, but extend the response schema to include a mandatory 'reasoning' section that the model must fill BEFORE generating steps. The prompt includes all artifacts (constraints, evidence summaries, selected approach, history context) with clear sections and instructions. The response schema has two top-level sections: (1) 'analysis' - where the model must output its understanding of each constraint, what each evidence file tells it, what the selected approach commits to, and any tensions or risks it sees; (2) 'plan' - the actual generated steps with provenance citations. This is a single API call but the schema structure forces the model to reason before generating. Think of it as chain-of-thought embedded in the response schema. Post-generation validation checks both the analysis quality (did it address all constraints? mention all evidence?) and the plan quality (do steps cite constraints? is the selected approach reflected?). Evidence files over a threshold get smart summaries. Token budget is measured and if too large, the prompt is tiered: full content for constraints and selected approach (always included), summaries for evidence, and abbreviated history. PROVENANCE.md is generated from the analysis + citations.

**Tradeoffs**:
- + Single API call but with built-in reasoning space - best of both worlds
- + The analysis section makes the model's understanding visible and auditable
- + Structured response schema forces chain-of-thought without multi-turn complexity
- + Smart tiering keeps prompt manageable even with large artifacts
- + Validation can check BOTH analysis quality and plan quality
- + PROVENANCE.md comes naturally from the analysis + step citations
- + Same architecture complexity as approach 1 - one call, one response
- + Evidence and constraint coverage is verifiable from the response alone
- - Response schema is more complex - model has to fill analysis AND plan
- - Single-call means if analysis is wrong, generation proceeds anyway (no human-in-the-loop between passes)
- - Reasoning models may not need the forced analysis section - they reason internally anyway
- - Smart tiering logic adds code complexity for evidence summarization and token budgeting

**Assumptions**:
- Forcing structured reasoning in the response improves plan quality over just prompting well
- Token tiering can be implemented with reasonable heuristics (file size thresholds, line count limits)
- The analysis section will surface misunderstandings that would otherwise be hidden
- Single-call with embedded reasoning is a good middle ground between simplicity and thoroughness


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Rich Prompt with Reasoning Gate

**Reasoning**: Single API call with embedded reasoning gives the substantial upfront prompt the user wants while forcing the model to demonstrate understanding before generating. The analysis section provides auditability and a natural hook for future customizable validation. Smart tiering keeps context manageable. Avoids the architectural complexity of multi-turn agentic orchestration while getting most of its benefits. User also sees this as having a natural extension point for customizable validation steps in the future.

**Selected At**: 2026-02-08T07:00:30.903Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-08T06:58:10.339Z
**Next**: Select an approach and transition to 'built'
