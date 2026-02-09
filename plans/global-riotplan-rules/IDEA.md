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
- Catalyst dimensions are orthogonal planes: Technology (Java, Node, Ruby), Domain (finance, legal, tech), Project (specific repo), Organization (Kjerneverk, Redaction), Personal (across everything). You apply a combination. Some may be incompatible.
- New feature need: plans should have an "output directory" concept. Generated artifacts (blog posts, press releases, 6-pagers) should go in an output/ directory, not the plan root.
- Catalyst questions aren't hyper-specific interrogation -- they're general guidance about "things that need to be known" to support the catalyst's domain. They shape the conversation, not dictate it.
- Plans as proposals: when creating a plan with output templates (press release, 6-pager), the plan itself becomes a proposal that needs approval. The catalyst shapes both the plan AND the artifacts that justify it.
- Catalyst format: directory-based. Contains a catalyst.yml (or similar manifest) and folders/files for each facet (questions, constraints, output templates, domain knowledge, process guidance, validation rules).
- Distribution: catalysts are NPM packages. Publish to NPMJS, depend on them in package.json, use npm link for local development. This makes catalysts versionable, shareable, and composable through existing package infrastructure.
- Traceability requirement: the plan summary and execution plan must state which catalysts were used. The user should be able to see that a catalyst was applied and how it influenced the plan. Transparency is key.
- Plans need a YAML file (plan manifest). Contains: title, ID, list of catalyst IDs the plan is connected to. This is new infrastructure -- plans currently don't have a manifest file. This attaches the plan to its environment and makes catalyst association explicit and persistent.
- Catalyst ID = NPM package identifier (with optional scope, e.g. @kjerneverk/catalyst-nodejs). This ties identity to distribution -- the ID IS the package name. No separate registry needed.
- MCP integration: need new MCP tools to list available catalysts and to associate a plan with a catalyst. This makes catalysts first-class in the MCP interface, not just a config concern.
- Architecture decision: catalysts likely need their own package (e.g. @kjerneverk/catalyst or @kjerneverk/riotplan-catalyst). This follows the existing pattern -- execution, execution-anthropic, agentic, riotprompt are all separate repos/packages consumed by riotplan. A catalyst package would handle schema, loading, resolution, merging -- riotplan consumes it.

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
- Catalysts must be composable -- multiple catalysts applied together in a defined order, with their influence layering on top of a baseline
- Catalysts must affect the entire lifecycle -- idea exploration, shaping, plan generation, validation, feedback -- not just one phase
- Catalyst system must support multiple orthogonal dimensions: technology, domain, project, organization, personal -- without forcing a single taxonomy
- Plans must record which catalysts were applied -- traceability into the plan summary and execution plan so users can see catalyst influence
- Catalysts must be distributable as NPM packages -- publishable to NPMJS, linkable locally for development
- Catalyst selection must work through three channels: project config (defaults), command line (per-plan), and MCP (interactive) -- all three must be supported
- Every plan must have a YAML manifest file that records its title, ID, and associated catalyst IDs

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
- [Riotplan codebase analysis - catalyst integration points](evidence/riotplan-codebase-analysis-catalyst-integration-po.md) (codebase analysis)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T07:13:59.911Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
