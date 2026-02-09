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


### Approach: NPM-Distributed Catalyst Packages

**Description**: Catalysts are NPM packages containing a directory structure with a catalyst.yml manifest and facet content (questions, constraints, output templates, domain knowledge, process guidance, validation rules). Plans gain a plan.yaml manifest that records title, ID, and associated catalyst IDs. RiotPlan resolves catalysts from node_modules, merges their facets in declared order, and injects the merged content into the appropriate lifecycle phases (idea exploration, shaping, plan generation, validation, feedback). Three selection channels: project config (defaults), CLI flags, and MCP tools. Implementation requires: 1) Define catalyst package structure and manifest schema, 2) Add plan.yaml manifest to plans, 3) Build catalyst resolution/loading from node_modules, 4) Build facet merging logic (ordered layering), 5) Inject merged content into generator prompts, 6) Add MCP tools for catalyst listing and plan-catalyst association, 7) Add traceability (catalysts used recorded in plan output).

**Tradeoffs**:
- Leverages NPM ecosystem for versioning, distribution, and dependency management -- no custom registry needed
- Directory-based structure with YAML manifest is simple to author and inspect
- Facet-based architecture (questions, constraints, templates, knowledge, guidance, validation) keeps concerns separated
- Layered composition with ordered merging gives predictable behavior
- Requires plan.yaml -- new infrastructure that changes plan structure
- NPM dependency means catalysts must be installed before use -- no ad-hoc loading from URLs or paths (npm link covers local dev)
- Complexity: touches every lifecycle phase (exploration, shaping, generation, validation, feedback, MCP)
- Defers incompatibility detection, catalyst taxonomy, and catalyst configuration for later

**Assumptions**:
- Catalysts are authored infrequently and consumed often -- authoring complexity is acceptable
- NPM is the right distribution channel for the target audience
- Ordered layering (last catalyst wins on conflicts) is sufficient merge strategy for v1
- The six facets identified (questions, constraints, output templates, domain knowledge, process guidance, validation rules) are the right decomposition
- Plan YAML manifest is a welcome addition to plan infrastructure, not disruptive


### Approach: Foundation-First: Catalyst Internals Then NPM Distribution

**Description**: Same end-state as NPM-Distributed Catalyst Packages, but phased differently. Phase 1: Build the catalyst engine internally -- define the catalyst schema, facet loading, merging, and injection into lifecycle phases. Catalysts in Phase 1 are just local directories (no NPM). The plan.yaml manifest is added. Config-based catalyst selection works by pointing to local directories. Phase 2: Add NPM package resolution so catalysts can be installed as dependencies. Phase 3: Add MCP tools for catalyst listing and association. This approach separates the core concept (what is a catalyst, how does it influence plans) from the distribution mechanism (NPM) and the interface (MCP).

**Tradeoffs**:
- Reduces initial scope -- can ship catalyst support without NPM packaging infrastructure
- Allows rapid iteration on catalyst schema and facet structure before locking it into published packages
- Local-directory catalysts are easier to author and test during development
- More incremental -- each phase delivers value independently
- Takes longer to reach the full vision of shared/published catalysts
- Risk of building local-only features that don't translate well to NPM distribution later
- Three phases means three rounds of integration work instead of one cohesive push

**Assumptions**:
- The catalyst schema will need iteration -- better to iterate locally before publishing
- Local directory catalysts provide enough value to be worth shipping as an intermediate step
- NPM distribution can be cleanly layered on top of local resolution without refactoring
- MCP integration is separable from core catalyst functionality


## Feedback

_Feedback will be added here as you provide it_

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Simple Config-Based Rules

**Reasoning**: Simple, backward-compatible approach that extends existing config system without overcomplicating

**Selected At**: 2026-01-31T07:27:51.755Z

**Selected Approach**: Foundation-First: Catalyst Internals Then NPM Distribution

**Reasoning**: Allows iterating on catalyst schema and facet structure locally before committing to published NPM packages. Each phase delivers value independently. Package will be @kjerneverk/riotplan-catalyst to avoid namespace pollution (riotdoc may have its own catalyst concept later).

**Selected At**: 2026-02-08T17:16:16.492Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-01-31T07:26:57.317Z
**Next**: Select an approach and transition to 'built'
