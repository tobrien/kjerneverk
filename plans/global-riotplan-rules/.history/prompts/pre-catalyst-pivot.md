# Checkpoint: pre-catalyst-pivot

**Timestamp**: 2026-02-08T16:56:26.767Z
**Stage**: built
**Message**: Checkpoint before pivoting from simple config-based plan rules to the full Catalyst concept. Preserving the original built plan (6 steps, Simple Config-Based Rules approach) in case we need to reference it.

## Current State

**Current Stage**: built

### IDEA.md

# Idea: global-riotplan-rules

## Core Concept

Define global rules that all plan construction must abide by, such as requiring documentation and testing steps for plans affecting source code

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Problem: Currently have to repeatedly remind Riot Plan about baseline requirements for every plan. Need a way to define global rules once that apply to all plan construction.
- Note: Idea creation tool should also use resolvePlanDirectory() logic instead of just process.cwd() - currently requires manual directory specification
- Clarification: These are project-specific "plan rules", not global rules. Found via configuration (same way plan directory is resolved)
- Two types of rules: 1) Plan creation rules (guidance for generator), 2) Validation rules (check if plan meets criteria)
- Example creation rule: Every plan involving software development must have testing step and documentation step
- Example creation rule: Documentation must cover README.md, project website, and AI guide
- Example validation rule: Check if TypeScript code uses class keyword, or check for forbidden languages like Fortran
- Storage: Config file property "rules" (array of strings). Skip directory approach for now. Separate "planRules" and "validationRules" in config.
- Format: Freeform markdown strings. Simple, not complex. Just strings that describe what rules must be followed.
- Timing: Creation rules applied during plan creation (funneled to generator). Validation rules applied after initial plan creation AND during each feedback iteration.
- Implementation approach: Extend config schema with planRules and validationRules (arrays of strings). Load rules from config, inject planRules into generator prompt, run validationRules after plan creation and during feedback.
- Keep implementation simple - avoid overcomplicating. Rules allow specifying "all plans that do X must do Y" or "when creating plans that do this, consider X or Y"
- Evolution: "plan rules" concept has grown into "Catalysts" - composable, layerable guidance packages that shape the entire planning process, not just validation checks. This fundamentally changes scope from config arrays to a pluggable system.
- Catalyst definition: "a collection of resources that affects the questions asked and the process used to come up with a plan." Not dictation - guidance. Guardrails that help identify areas needing attention.
- Catalyst layering: catalysts stack. Base "software" catalyst + "Node.js" catalyst + "company X culture" catalyst. Each layer adds domain-specific questions, constraints, output expectations, and institutional knowledge.
- Catalyst scope is broader than tech: could have catalysts for personal finance planning, blog post creation, news summaries, strategic business planning - any domain where structured thinking helps.
- Amazon press release analogy: a catalyst could define expected outputs like a 6-pager or press release. "Install the Amazon catalyst and you get the prompts and content to design the outputs you'd create at Amazon." Output templates are part of what a catalyst provides.
- Open source vision: an open repository of industry-specific catalysts that anyone can use, contribute to, and customize. Community-driven domain expertise.
- PIVOT: Plan is being revised entirely. The "global rules" concept was the seed, but Catalysts are the real idea. Rules are just one facet of what a catalyst provides. Returning to idea exploration to properly define the catalyst concept before rebuilding.

## Constraints

- _Add constraints..._
- Every plan affecting source code must include a documentation step
- Every plan affecting source code must include a testing step
- Documentation steps must cover README, AI guide, and website updates
- Rules are project-specific, not global - found via configuration resolution
- Start with simple rules only - no conditional logic yet
- Creation rules must be passed to plan generator as guidance
- Rules stored in config file as "planRules" and "validationRules" properties (arrays of strings), not in separate directory
- Rule format: Freeform markdown strings only - no complex structure
- Validation rules must run after plan creation AND during each feedback iteration
- Rules are OPTIONAL - if no rules defined, behavior should remain unchanged (backward compatible)

## Questions

- _Add questions..._
- Where should rules be stored? In riotplan.config.* file? Separate rules file? Both?
- What format should creation rules use? Simple text templates? Structured JSON/YAML?
- How should validation rules be executed? During plan creation? As separate validation step? Both?
- How should creation rules be injected into plan generator? Modify system prompt? Add to user prompt? Separate guidance section?
- How do catalysts compose/layer? What's the merge strategy when two catalysts define conflicting rules or overlapping questions?
- What does a catalyst contain? Rules, questions, output templates, constraints, domain knowledge - what's the structure?
- How are catalysts distributed? npm packages? Git repos? A central registry? All of the above?
- Does the existing built plan (simple config-based planRules/validationRules) become the foundation that catalysts build on, or does the catalyst concept replace it entirely?

## Evidence

_Attach relevant documents, images, or files_
- [Plan generator code showing SYSTEM_PROMPT and buildPlanPrompt function where creation rules could be injected](/Users/tobrien/gitw/kjerneverk/riotplan/src/ai/generator.ts)
- [Current config schema showing where planRules and validationRules properties need to be added](/Users/tobrien/gitw/kjerneverk/riotplan/src/config/schema.ts)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T07:13:59.911Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._


### SHAPING.md

# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Simple Config-Based Rules

**Description**: Extend config schema with optional planRules and validationRules arrays. Load rules when config is loaded. Inject creation rules into generator prompt. Run validation rules after plan creation and during feedback iterations.

**Tradeoffs**:
- Simple to implement - just extend existing config system
- Backward compatible - rules are optional
- Freeform markdown allows flexibility but no structured validation


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Simple Config-Based Rules

**Reasoning**: Simple, backward-compatible approach that extends existing config system without overcomplicating

**Selected At**: 2026-01-31T07:27:51.755Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-01-31T07:26:57.317Z
**Next**: Select an approach and transition to 'built'




## Files at This Point

- EXECUTION_PLAN.md
- IDEA.md
- LIFECYCLE.md
- SHAPING.md
- STATUS.md
- SUMMARY.md

## Recent Timeline

- 2/8/2026, 8:54:45 AM: note_added - {"note":"Catalyst layering: catalysts stack. Base \"software\" catalyst + \"Node.js\" catalyst + \"company X culture\" catalyst. Each layer adds domain-specific questions, constraints, output expectations, and institutional knowledge."}
- 2/8/2026, 8:54:47 AM: note_added - {"note":"Catalyst scope is broader than tech: could have catalysts for personal finance planning, blog post creation, news summaries, strategic business planning - any domain where structured thinking helps."}
- 2/8/2026, 8:54:51 AM: note_added - {"note":"Amazon press release analogy: a catalyst could define expected outputs like a 6-pager or press release. \"Install the Amazon catalyst and you get the prompts and content to design the outputs you'd create at Amazon.\" Output templates are part of what a catalyst provides."}
- 2/8/2026, 8:54:53 AM: note_added - {"note":"Open source vision: an open repository of industry-specific catalysts that anyone can use, contribute to, and customize. Community-driven domain expertise."}
- 2/8/2026, 8:54:56 AM: question_added - {"question":"How do catalysts compose/layer? What's the merge strategy when two catalysts define conflicting rules or overlapping questions?"}
- 2/8/2026, 8:54:58 AM: question_added - {"question":"What does a catalyst contain? Rules, questions, output templates, constraints, domain knowledge - what's the structure?"}
- 2/8/2026, 8:54:59 AM: question_added - {"question":"How are catalysts distributed? npm packages? Git repos? A central registry? All of the above?"}
- 2/8/2026, 8:55:01 AM: question_added - {"question":"Does the existing built plan (simple config-based planRules/validationRules) become the foundation that catalysts build on, or does the catalyst concept replace it entirely?"}
- 2/8/2026, 8:56:20 AM: narrative_chunk - {"content":"User decision: Redesign from the catalyst concept down. The original \"global rules\" plan was too narrow - catalysts ARE the mechanism for defining those rules, plus much more. Going back to idea phase to fully explore what catalysts mean before rebuilding the plan.\n\nThe simple config-based planRules/validationRules approach is being set aside. The catalyst concept is broader: it's a composable, layerable guidance system that shapes every aspect of the planning process - questions, constraints, outputs, domain knowledge, process guidance, and validation.\n\nThis is a full plan revision, not an incremental change.","source":"voice","context":"User deciding to pivot the plan from simple rules to the full Catalyst concept, going back to idea exploration","speaker":"user"}
- 2/8/2026, 8:56:24 AM: note_added - {"note":"PIVOT: Plan is being revised entirely. The \"global rules\" concept was the seed, but Catalysts are the real idea. Rules are just one facet of what a catalyst provides. Returning to idea exploration to properly define the catalyst concept before rebuilding."}

---

This checkpoint captures the state of the plan at this moment in time.
You can restore to this checkpoint using: `riotplan_checkpoint_restore({ checkpoint: "pre-catalyst-pivot" })`
