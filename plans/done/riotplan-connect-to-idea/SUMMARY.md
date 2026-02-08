# riotplan-connect-to-idea

## Overview

Plan generation must be rooted in agentic exploration of all idea content (IDEA.md, history, prompts, timeline, evidence) - not just model memory. Currently, riotplan_build reads IDEA.md and SHAPING.md as raw text concatenation and ignores evidence files, timeline/history, and LIFECYCLE.md. The AI generator prompt is completely generic with no instructions about honoring constraints, referencing evidence, or implementing the selected approach. This plan fixes that structural disconnection.

## Goals

Implement the "Rich Prompt with Reasoning Gate" approach: single API call with embedded reasoning that gives a substantial upfront prompt while forcing the model to demonstrate understanding before generating. The generation pipeline will load all artifacts via read_context, construct a rich structured prompt with labeled sections (CONSTRAINTS, SELECTED APPROACH, EVIDENCE, HISTORY), extend the response schema with a mandatory 'analysis' section and per-step provenance citations, implement smart tiering for token budget management, add post-generation validation, and produce PROVENANCE.md showing how artifacts shaped the plan.

## Scope

### In Scope

- Extend GenerationContext interface with structured artifact fields
- Refactor build.ts to use full artifact loading via shared utilities
- Rewrite generator system and user prompts to be artifact-aware
- Extend response schema with analysis section and provenance
- Implement smart tiering for token budget (constraints always full, evidence summarized if large)
- Post-generation validation checking constraint coverage and evidence references
- Generate PROVENANCE.md mapping artifacts to steps
- Expose riotplan_build through MCP
- End-to-end testing with real idea directory

### Out of Scope

- Multi-turn agentic generation (two-pass approach was considered but not selected)
- Customizable validation hooks (mentioned as future work)
- Changes to how evidence is captured during idea exploration (that was riotplan-gathering-evidence)

## Success Criteria

- [x] Step 1: GenerationContext extended and artifact loading wired into build.ts
- [ ] Step 2: Generator prompts rewritten for artifact-aware generation
- [ ] Step 3: Response schema extended with analysis and provenance
- [ ] Step 4: Smart tiering implemented for token budget management
- [ ] Step 5: Post-generation validation and PROVENANCE.md output
- [ ] Step 6: riotplan_build exposed through MCP
- [ ] Step 7: End-to-end test confirms plan is grounded in artifacts

---

*Plan created: 2026-02-08*
