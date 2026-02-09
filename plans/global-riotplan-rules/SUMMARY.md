# Plan Summary: RiotPlan Catalysts

## Overview
Implement a **Catalyst** system for RiotPlan -- composable, layerable guidance packages that shape the entire planning process. A catalyst is a collection of resources (questions, constraints, output templates, domain knowledge, process guidance, validation rules) that affects how plans are created, what questions are asked, and what outputs are expected.

## Origin
This plan evolved from a simpler "global plan rules" concept. The original idea was to add `planRules` and `validationRules` arrays to the riotplan config. Through exploration, the concept grew into Catalysts -- a much richer, more flexible system where rules are just one of six facets.

## Selected Approach: Foundation-First
Build the catalyst engine as a separate `@kjerneverk/riotplan-catalyst` package with local directory support first, then integrate into riotplan. NPM distribution deferred to a future phase.

## Goals
1. Create the `@kjerneverk/riotplan-catalyst` package with catalyst schema, loading, and merging
2. Define the plan manifest (`plan.yaml`) that records catalyst associations
3. Integrate catalysts into riotplan's config, generator, and MCP tools
4. Ensure catalyst traceability -- plans clearly show which catalysts influenced them
5. Maintain full backward compatibility -- no catalysts = no behavior change

## Scope

### In Scope (This Plan)
- Phase 1: `@kjerneverk/riotplan-catalyst` package (schema, loader, merger, plan manifest)
- Phase 2: Riotplan integration (config, generator, MCP tools, traceability)

### Out of Scope (Future Work)
- Phase 3: NPM distribution (resolve catalysts from node_modules)
- Catalyst incompatibility detection
- Catalyst taxonomy/typing (technology vs domain vs organization)
- Catalyst configuration overrides per plan
- Plan output directory for generated artifacts
- Catalyst influence on explore_idea and shape_approach MCP prompts

## Key Decisions
- **Package name**: `@kjerneverk/riotplan-catalyst` (not `@kjerneverk/catalyst`, to avoid namespace pollution if riotdoc gets its own catalyst concept)
- **Catalyst identity**: directory-based with `catalyst.yml` manifest
- **Catalyst ID = NPM package name** (with optional scope, e.g. `@kjerneverk/catalyst-nodejs`)
- **Six facets**: questions, constraints, output templates, domain knowledge, process guidance, validation rules
- **Merge strategy**: ordered concatenation with source attribution (no conflict resolution in v1)
- **Plan manifest**: `plan.yaml` with title, ID, and catalyst IDs
- **Selection channels**: config (defaults), CLI (per-plan), MCP (interactive)
- **Backward compatible**: no catalysts configured = no behavior change

## What is a Catalyst?
A catalyst is "a collection of resources that affects the questions asked and the process used to come up with a plan." It provides guidance, not dictation -- guardrails that help identify areas needing attention.

### Catalyst Dimensions (Orthogonal)
- **Technology**: Java, Node.js, Ruby, React
- **Domain**: Finance, Legal, Technology
- **Project**: Specific to a repository or codebase
- **Organization**: Company or team conventions (Kjerneverk, etc.)
- **Personal**: Individual standards across all projects

Multiple catalysts from different dimensions can be layered together.
