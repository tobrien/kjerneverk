# User Story: Jake Plans an API Migration From His Terminal

- **Added**: 2026-02-09
- **Source**: user story / UX exploration
- **Original Query**: What would it look like for a developer who wants to plan from CLI because they don't have time for an IDE?

## Who

Jake is a senior backend developer at a mid-size company. He's SSH'd into a jump box reviewing production metrics when he realizes the legacy REST API needs to be migrated to GraphQL before the Q3 deadline. He wants to start planning this now while the problem is fresh, but he's on a laptop in a coffee shop with just a terminal open. He's not going to fire up Cursor for this.

He has `ANTHROPIC_API_KEY` in his shell profile. He installed riotplan globally weeks ago.

## What He Wants

A structured migration plan that captures the scope, identifies risks, and can be executed step-by-step later — possibly by him in Cursor, possibly by other team members. He wants the plan to live in the project repo so others can see it.

---

## Session 1: Quick Exploration (15 minutes between meetings)

```
$ cd ~/projects/acme-api
$ riotplan explore api-graphql-migration \
    "Migrate the REST API to GraphQL before Q3"

🌱 Starting idea exploration: api-graphql-migration
   Using: Anthropic (claude-sonnet-4-5)
   Plan directory: ./plans/api-graphql-migration

───────────────────────────────────────────────
  RiotPlan — Idea Exploration
  Type your thoughts. I'll ask questions and
  capture everything as we go.
  Type /done when you're ready to move on.
───────────────────────────────────────────────

🤖 I've created an idea for "api-graphql-migration".
   Let me take a quick look at the project structure
   to understand what we're working with.

   🔍 Reading project structure...
   📁 Found: src/routes/ (23 route files)
   📁 Found: src/models/ (15 model files)
   📁 Found: src/middleware/ (8 middleware files)
   📁 Found: tests/ (142 test files)
   📄 Found: package.json (express 4.18, pg 8.11)

   📎 Evidence saved: "Current API structure — Express-based
      REST API with 23 route files, 15 data models,
      8 middleware layers, 142 tests. Uses PostgreSQL
      via pg driver."

   Ok, so this is a substantial Express REST API.
   23 route files is non-trivial. A few questions:

   - Is this a full replacement or running both
     in parallel during migration?
   - Are there external consumers of this API that
     would break?
   - What's the Q3 deadline exactly — end of July?

you> Parallel. We have mobile clients on the REST API
     that can't switch immediately. Deadline is
     Aug 15. We have 3 devs who can work on this.

🤖 📋 Constraint: Must run REST and GraphQL in
      parallel — mobile clients can't switch
      immediately
   📋 Constraint: Hard deadline Aug 15
   📋 Constraint: 3 developers available
   📝 Added note: Mobile clients are the primary
      consumer that prevents a hard cutover.

   Let me look at the route files to understand
   the API surface...

   🔍 Searching for route definitions...

   📎 Evidence saved: "API surface analysis — 47 REST
      endpoints across 23 route files. Heaviest:
      /api/orders (12 endpoints), /api/users (8),
      /api/products (7). Several routes have complex
      query parameter filtering that will need
      careful GraphQL resolver design."

   47 endpoints is a lot for 3 devs in ~3 months.
   The orders routes look particularly complex.

   ❓ Question: Can this be phased — migrate
      high-priority endpoints first?
   ❓ Question: Are there endpoints that can be
      deprecated rather than migrated?

you> Good point. The /api/reports endpoints are barely
     used — maybe 10 requests/day. We could deprecate
     those. And the /api/admin stuff is internal only,
     could come last.

🤖 That changes the picture significantly.

   📝 Added note: /api/reports can be deprecated
      (~10 req/day). /api/admin is internal-only,
      lowest priority for migration.
   📝 Added note: Phased approach: customer-facing
      first (orders, users, products), then
      internal (admin), deprecate reports.

   Without reports and deferring admin, the core
   migration is about 30 endpoints. Much more
   realistic for 3 devs.

you> Can you check if we have any GraphQL dependencies
     already?

🤖 🔍 Searching package.json and lock files...

   No GraphQL dependencies found in the project.
   Clean slate. You'll need to choose between:
   - Apollo Server (most popular, full-featured)
   - Mercurius (Fastify-native, but you're on Express)
   - graphql-yoga (lightweight, good Express integration)

   📎 Evidence saved: "GraphQL framework options —
      no existing GraphQL deps. Apollo Server is
      most common for Express, graphql-yoga is
      lighter weight."

   ❓ Question: Framework preference? Apollo is
      the safe choice, yoga is lighter.

you> Apollo. We want the ecosystem. /done

📝 Exploration summary:
   📝 6 notes
   📋 3 constraints
   ❓ 5 questions (2 answered)
   📎 3 evidence files (including codebase analysis)

   Plan saved at ./plans/api-graphql-migration/
   Resume:  riotplan explore ./plans/api-graphql-migration
   Build:   riotplan build ./plans/api-graphql-migration
```

---

## Session 2: Building the Plan (same day, after lunch)

```
$ cd ~/projects/acme-api
$ riotplan build ./plans/api-graphql-migration

🏗️  Building plan from idea artifacts...
   Reading: IDEA.md (6 notes, 3 constraints, 5 questions)
   Reading: 3 evidence files (codebase analysis included)
   Reading: conversation history

   Generating plan with Anthropic (claude-sonnet-4-5)...

   ✅ Plan generated: 8 steps

   📄 SUMMARY.md
   📄 EXECUTION_PLAN.md
   📄 plan/01-set-up-apollo-server-alongside-express.md
   📄 plan/02-design-graphql-schema-from-data-models.md
   📄 plan/03-migrate-product-endpoints-to-resolvers.md
   📄 plan/04-migrate-user-endpoints-to-resolvers.md
   📄 plan/05-migrate-order-endpoints-to-resolvers.md
   📄 plan/06-add-graphql-auth-and-middleware.md
   📄 plan/07-client-sdk-and-mobile-migration-guide.md
   📄 plan/08-deprecate-rest-endpoints-and-monitoring.md

   View: riotplan status ./plans/api-graphql-migration
```

---

## Session 3: Executing Step 1 (next morning)

Jake opens Cursor now, but he could also do this from the terminal:

```
$ riotplan execute ./plans/api-graphql-migration

🚀 Starting plan execution: api-graphql-migration
   Progress: 0/8 steps complete
   Using: Anthropic (claude-sonnet-4-5)

🤖 Reading step 1: "Set up Apollo Server alongside
   Express"

   This step has 4 tasks:
   ☐ Install Apollo Server dependencies
   ☐ Create src/graphql/server.ts with basic setup
   ☐ Mount GraphQL endpoint at /graphql in Express app
   ☐ Verify both REST and GraphQL respond

   Ready to work through this? I can see the project
   files and help implement.

you> Go for it.

🤖 Starting step 1...

   📦 Running: npm install @apollo/server graphql
      ✅ Installed @apollo/server@4.11.0, graphql@16.9.0

   📝 Creating src/graphql/server.ts...
   📝 Updating src/app.ts to mount /graphql endpoint...
   📝 Creating test: tests/graphql/server.test.ts...

   🔍 Running tests...
      ✅ 143 tests passing (142 existing + 1 new)

   ✅ Step 1 complete.

   Both endpoints verified:
     GET /api/health → 200 (REST still works)
     POST /graphql → 200 (GraphQL responds)

   Moving to step 2?
```

---

## What Jake Experiences

- **Exploration happened in 15 minutes from a bare terminal.** No IDE needed. The AI read his codebase, understood the API surface, and helped scope the migration.
- **The AI was immediately useful** because it could read files and search the project. It found the 47 endpoints, noticed there were no GraphQL deps, and analyzed the route complexity. Jake didn't have to explain his codebase — the tool explored it.
- **The plan landed in the repo** at `./plans/api-graphql-migration/` — committable, shareable, reviewable. His team lead can read the EXECUTION_PLAN.md without installing anything.
- **Execution was seamless** because the plan was grounded in actual codebase analysis. The steps reference real files and real endpoints, not generic advice.

## Key UX Observations

1. **Codebase awareness is the killer feature.** The tool reading `src/routes/` and analyzing endpoints transforms this from "generic AI chat" to "context-aware planning assistant."
2. **Evidence from the codebase should be automatic.** Jake didn't ask the AI to analyze his routes — it did so proactively because it had file access.
3. **The explore → build → execute pipeline feels natural for developers.** Explore to scope, build to plan, execute to implement.
4. **Plans in the repo are shareable artifacts.** Jake can commit the plan directory, and teammates can execute steps independently.
5. **The transition from terminal to IDE is seamless.** Jake explored in terminal, could execute in either terminal or Cursor — the plan files are the same.
