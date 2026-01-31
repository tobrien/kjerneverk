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
