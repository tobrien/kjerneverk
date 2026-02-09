# User Story: Sam Plans a Feature From CodePuppy

- **Added**: 2026-02-09
- **Source**: user story / UX exploration
- **Original Query**: What would it look like for someone using CodePuppy who wants to craft a plan?

## Who

Sam is a full-stack developer who uses CodePuppy as their daily coding assistant. They like it because it runs entirely in the terminal, it's open source, and they can configure the agents and models. They've been working on a SaaS product and realize they need to add multi-tenancy support — a big architectural change that needs careful planning before jumping into code.

Sam has heard about RiotPlan and wants to use it for the planning phase, but doesn't want to leave their CodePuppy workflow. They want to plan in RiotPlan, then come back to CodePuppy (or their terminal, or Cursor) to execute.

## What Sam Wants

Use RiotPlan's structured planning from within CodePuppy, or seamlessly alongside it. Plan the multi-tenancy feature thoroughly, then execute the plan using whatever tool is best for the job.

---

## How This Could Work: Two Paths

### Path A: RiotPlan as a CodePuppy MCP Server

Sam configures RiotPlan as an MCP server in CodePuppy's config. This is the same way RiotPlan works in Cursor — CodePuppy talks to the MCP server.

```yaml
# codepuppy.config.yaml
mcp_servers:
  - name: riotplan
    command: riotplan
    args: ["mcp"]
```

Now CodePuppy's agent has access to all RiotPlan tools. Sam talks to CodePuppy and it uses RiotPlan tools behind the scenes:

```
you> I need to plan adding multi-tenancy to this project.
     Use riotplan to explore this as an idea first.

🐶 I'll use RiotPlan to explore this systematically.

   [tool: riotplan_idea_create]
   Created idea: multi-tenancy-support

   Let me look at the codebase to understand the
   current architecture...

   [tool: list_files] Reading src/...
   [tool: read_file] Reading src/db/connection.ts...
   [tool: grep] Searching for tenant/org references...

   [tool: riotplan_idea_add_evidence]
   Captured: Current database architecture uses single
   connection pool, no tenant isolation.

   [tool: riotplan_idea_add_constraint]
   Must support row-level security — single database,
   tenant_id column approach.

   Ok, I've explored the codebase and captured findings
   in the RiotPlan idea. Key observations:
   - Single database, no tenant awareness
   - Auth system has user model but no org/tenant model
   - 23 database queries that would need tenant filtering
   ...
```

**This already works today** — CodePuppy supports MCP servers, and RiotPlan already has an MCP server. The planning experience is identical to using RiotPlan in Cursor.

### Path B: RiotPlan CLI Alongside CodePuppy

Sam uses RiotPlan's CLI directly from a second terminal tab, or invokes it from CodePuppy's shell tool:

```
# In CodePuppy:
you> Run `riotplan explore multi-tenancy "Add multi-tenancy
     support to the SaaS platform"` in the shell

🐶 [tool: run_shell_command]
   Running: riotplan explore multi-tenancy ...
```

But this is clunky — now Sam is in a nested interactive session (CodePuppy's shell running RiotPlan's interactive chat). That's not a great UX.

**The better version** is Sam working in two terminal tabs:

```
# Tab 1: CodePuppy for coding
🐶 Ready to help...

# Tab 2: RiotPlan for planning
$ riotplan explore multi-tenancy \
    "Add multi-tenancy support to the SaaS platform"

🤖 Let me explore the project...
```

---

## Session: Planning Multi-Tenancy (Tab 2, RiotPlan CLI)

```
$ cd ~/projects/saas-app
$ riotplan explore multi-tenancy \
    "Add multi-tenancy to the SaaS platform"

🌱 Starting idea exploration: multi-tenancy
   Using: Anthropic (claude-sonnet-4-5)
   Plan directory: ./plans/multi-tenancy

🤖 Let me understand the current architecture first.

   🔍 Reading project structure...
   📁 src/db/ — Prisma ORM, single PostgreSQL database
   📁 src/auth/ — JWT auth, User model, no org concept
   📁 src/api/ — 34 API routes
   📄 prisma/schema.prisma — 12 models, no tenant field

   📎 Evidence saved: "Database architecture — Prisma ORM
      with 12 models, PostgreSQL, no tenant isolation.
      All queries go through a single connection without
      any tenant context."

   This is a single-tenant architecture. Adding
   multi-tenancy touches everything — data model,
   auth, API layer, and possibly infrastructure.

   Big question: what isolation model?
   - **Row-level**: Single database, tenant_id on every
     table. Cheapest, most code changes.
   - **Schema-level**: Separate Postgres schema per tenant.
     Medium isolation, complex migrations.
   - **Database-level**: Separate database per tenant.
     Maximum isolation, operational complexity.

   What's your thinking?

you> Row-level. We're a startup, can't afford the
     operational complexity of separate databases.
     We need to move fast.

🤖 Makes sense for your stage. Row-level it is.

   📋 Constraint: Row-level tenant isolation
      (tenant_id column, single database)
   📋 Constraint: Startup context — speed of
      implementation matters

   Let me check what would need tenant_id columns...

   🔍 Analyzing Prisma schema...

   📎 Evidence saved: "Schema analysis — 12 Prisma models.
      10 need tenant_id (User, Project, Invoice, etc.).
      2 are global (AppConfig, MigrationLog). All 34 API
      routes need tenant context middleware."

   10 out of 12 models need tenant_id. That's a big
   migration. And every API route needs middleware to
   inject tenant context from the JWT.

   ❓ Question: How do you handle the existing data?
      All current rows belong to one implicit tenant?
   ❓ Question: Do you need tenant-level billing
      immediately or can that come later?

you> Existing data is all one company — our first
     customer. We'll assign them tenant_id = 1.
     Billing can come later, just need isolation.

🤖 📝 Added note: Existing data becomes tenant_id = 1
      (first customer). Billing is out of scope.

   I think we have a solid picture. Want me to
   look at how other projects handle the Prisma
   middleware for tenant context?

you> Yes.

🤖 🔍 Searching for Prisma multi-tenancy patterns...

   📎 Evidence saved: "Prisma multi-tenancy patterns —
      Prisma supports middleware that can automatically
      inject tenant_id into all queries. The
      $extends API (Prisma 4.16+) is the modern
      approach — creates a 'tenant-scoped' client
      per request."

   The Prisma $extends approach is clean — you create
   a tenant-scoped client in your auth middleware and
   pass it through the request context. Every query
   automatically gets the tenant filter.

you> That's exactly what I want. /done

📝 Exploration summary:
   📝 4 notes
   📋 2 constraints
   ❓ 4 questions (2 answered)
   📎 4 evidence files

   Plan saved at ./plans/multi-tenancy/
```

Then Sam builds the plan and can execute it from anywhere:

```
$ riotplan build ./plans/multi-tenancy

🏗️  Plan generated: 6 steps

   📄 plan/01-add-tenant-model-and-org-auth.md
   📄 plan/02-add-tenant-id-migration-all-models.md
   📄 plan/03-implement-prisma-tenant-scoping.md
   📄 plan/04-update-api-middleware-for-tenant-context.md
   📄 plan/05-migrate-existing-data-to-tenant-1.md
   📄 plan/06-integration-testing-tenant-isolation.md
```

Now Sam can switch back to CodePuppy (or Cursor, or just the RiotPlan CLI) to execute:

```
# Back in CodePuppy (Tab 1):
you> I have a RiotPlan at ./plans/multi-tenancy with
     6 steps. Let's start with step 1.

🐶 [tool: read_file] Reading plans/multi-tenancy/
     plan/01-add-tenant-model-and-org-auth.md...

   Got it. Step 1 is about adding a Tenant model
   and updating auth to include tenant context.
   Let me start implementing...
```

---

## What Sam Experiences

- **RiotPlan CLI and CodePuppy are complementary**, not competing. RiotPlan does the structured thinking, CodePuppy (or any coding tool) does the implementation.
- **Path A (MCP)** is seamless — if CodePuppy supports MCP, RiotPlan just works as a tool provider. No CLI changes needed.
- **Path B (CLI)** works well as a two-tab workflow. Plan in one tab, code in the other. The plan files are the bridge.
- **The plan is tool-agnostic.** Sam created it in RiotPlan CLI, but could execute it in CodePuppy, Cursor, or manually. The markdown files don't care what tool reads them.

## Key UX Observations

1. **Plans are the universal format.** Whether created in Cursor (MCP), CLI, or through CodePuppy's MCP integration, the output is the same markdown files. Any tool can read and execute them.
2. **The CLI fills the gap for tools that don't support MCP.** Not every coding tool has MCP support yet. The CLI makes RiotPlan accessible regardless.
3. **Two-tab workflow is natural for developers.** Planning and coding are different modes of thinking. Having them in separate terminals is actually an advantage.
4. **MCP and CLI are complementary entry points.** MCP for IDE users, CLI for terminal users, same plan format for both.
5. **The CodePuppy reference is valuable architecturally.** Both tools need the same foundation: agent loop, tool registry, streaming, file access. The patterns transfer even though one is Python and the other TypeScript.
