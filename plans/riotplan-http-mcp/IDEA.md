# Idea: riotplan-http-mcp

## Core Concept

RiotPlan needs a remote HTTP MCP server (like Protokoll) instead of running as a local MCP. Plans should be stored centrally as a service, not scattered across project directories. This would eliminate the need to specify plan directories and allow working across workspaces with a single plan database.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Core insight: RiotPlan should follow the Protokoll architecture pattern - a remote HTTP server that MCP clients connect to, rather than running as a local MCP server embedded in each workspace.
- Pain point: Currently have to specify plan directories everywhere. Don't want to manage separate plan directories in each workspace. Want plans to "just work" across all workspaces.
- Plans as a service: Like Protokoll handles transcriptions centrally, RiotPlan should handle plans centrally. One database/service that all workspaces connect to.
- Friction: Every plan requires creating a directory and specifying "in this directory, explore a plan." Want the workspace to be unaware of plan storage location.
- Agent isolation: When crafting agents to run plan steps, they should connect to a service, not have filesystem access to plan files. This provides isolation between LLMs and plans.
- Plan sharing is currently impossible without copying files around. A remote service would make sharing trivial.
- Storage: Remote service uses the same SQLite-based format (riotplan-format). No separate storage formats for server vs local - one format everywhere.
- Primary usage model shift: RiotPlan's primary interface will be remote MCP server, not local MCP server. This is a fundamental change in how RiotPlan is consumed.
- DECISION: HTTP server is a chance to reshape and simplify the API. Not all 40 local MCP tools get exposed — curate a cleaner set.
- DECISION: Local MCP server stays around as an option. It may need to live on.
- DECISION: Full migration of existing file-based plans to SQLite. No compatibility period. Start by migrating everything in /Users/tobrien/gitw/kjerneverk/plans.
- DECISION: riotplan-format integration into riotplan is a prerequisite for this plan. Package exists at /Users/tobrien/gitw/kjerneverk/riotplan-format/ with full StorageProvider abstraction and migration utilities.
- DECISION: One .plan file per plan. Server manages a collection of files. Future possibility: front a multi-plan database, but not now.
- DECISION: Plans identified by UUID. All major entities should have UUID identifiers. If UUID isn't already in riotplan-format, it needs to be added.
- DECISION: HTTP MCP server code lives in the same riotplan repo, not a separate package.
- FINDING: PlanMetadata in riotplan-format has no UUID — its 'id' field is the plan code string (e.g. 'riotplan-http-mcp'). UUID needs to be added to the schema and types before HTTP server can use it as the primary identifier.
- REQUIREMENT: VSCode extension that connects to the RiotPlan HTTP MCP server. Lists all plans in a tree view. Click a plan to see a rendered detail view in a webview panel. Follow the same pattern as protokoll-vscode.
- REQUIREMENT: Server starts pointed at a PLANS directory (e.g. /Users/tobrien/gitw/kjerneverk/plans). Two special subdirectories: 'done/' for completed plans, 'hold/' for held plans. All other plan directories are active.
- DECISION: Tree view groups plans by lifecycle stage (Idea/Shaping/Built/Executing) under Active, plus Done and Hold as top-level groups.
- DECISION: Detail view starts simple — render metadata + Summary. Future iterations add clickable sections for Idea, Evidence, Steps, etc.
- MAJOR CONCEPT: Consolidate all project-specific plans directories into a single unified directory at /Users/tobrien/gitw/tobrien/plans. Currently plans are scattered: kjerneverk/plans, redaksjon/plans, grunnverk/plans. This means plans need a project slug to identify which project they belong to.
- REQUIREMENT: Each plan needs a project slug (e.g. 'kjerneverk', 'redaksjon', 'grunnverk') so plans from different projects can coexist in one directory. This likely becomes a field in PlanMetadata alongside the UUID.
- DECISION: Project slug inferred from source directory name during migration. Source directories: kjerneverk/plans, redaksjon/plans, grunnverk/plans, girverket/plans, utilarium/plans.
- DECISION: No project grouping in tree view. Instead, project filter (like protokoll-vscode transcript filter) saved in workspace preferences.
- DECISION: Flat directory structure. File naming convention: {uuid-abbrev}-{slug}.plan (e.g. a3f7b2c1-kjerneverk.plan). UUID abbreviation gives uniqueness, slug gives human readability.
- CLARIFICATION: File naming uses plan code slug, not project slug. Example: a3f7b2c1-riotplan-http-mcp.plan. Project is metadata inside the file, not in the filename.

## Constraints

- _Add constraints..._
- Local workspace should not know where plans are stored - only that there's a remote service to call
- Agents executing plan steps should not have filesystem access to plan files - they connect to a service
- Identity/multi-tenancy/security is out of scope for initial implementation. Assume localhost on a port.
- All major entities (Plans, etc.) must have UUID identifiers. UUID needs to be added to riotplan-format PlanMetadata schema.
- Server takes a PLANS directory as configuration on startup. Plans directory has 'done/' and 'hold/' subdirectories for completed and held plans respectively.
- Plan file naming convention: {uuid-abbrev}-{slug}.plan in a flat directory. UUID is the primary identifier, slug provides human context.

## Questions

- _Add questions..._

## Evidence

_Attach relevant documents, images, or files_
- [riotplan-format package API and integration assessment](evidence/riotplan-format-package-api-and-integration-assess.md) (codebase analysis)
- [Protokoll Hono+MCP architecture - reference implementation for RiotPlan HTTP server](evidence/protokoll-honomcp-architecture-reference-implement.md) (codebase analysis)
- [protokoll-vscode extension architecture - reference for RiotPlan VSCode extension](evidence/protokoll-vscode-extension-architecture-reference.md) (codebase analysis)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-02-13T16:12:44.464Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
