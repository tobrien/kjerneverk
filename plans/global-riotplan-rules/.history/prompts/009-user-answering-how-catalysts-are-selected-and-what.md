# Narrative: User answering how catalysts are selected and what their manifest contains, plus introducing plan YAML files

**Date**: 2026-02-08T17:11:14.236Z
**Source**: voice
**Speaker**: user

---

User answering how RiotPlan knows which catalysts to use, and what metadata catalysts carry:

HOW CATALYSTS ARE SELECTED:
- Config-based (riotplan config lists default catalysts)
- Command-line (pass catalyst when creating a plan)
- MCP: add ability to list available catalysts, and associate a plan with a catalyst through the MCP
- If config-based, everything automatically gets covered by the configured catalysts

PLANS NEED A YAML FILE:
- Plans should have a YAML file that contains: title, ID, and the list of catalysts the plan is connected to
- This YAML file attaches the plan to its environment
- Catalyst configuration can be stored there (but don't worry about catalyst config details yet)
- When creating a plan via MCP, you could say "create a new plan and I want it covered by the project catalyst"

CATALYST MANIFEST:
- ID: the NPM package identifier (can include scope, e.g. @kjerneverk/catalyst-something)
- Name
- Description
- Version (the NPM version)
- Which facets are provided, plus some configuration
- Don't want to get into taxonomy of catalysts yet -- keep it simple for now

USER EXPLICITLY DEFERRED:
- Catalyst configuration details
- Catalyst taxonomy/typing
- Incompatibility handling
