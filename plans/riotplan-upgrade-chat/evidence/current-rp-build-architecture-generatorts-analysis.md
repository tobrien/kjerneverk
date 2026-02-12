# Evidence: Current rp_build architecture - generator.ts analysis

**Source**: codebase analysis
**Original Query**: Analyze the current rp_build implementation to understand what needs to change
**Added**: 2026-02-12T16:54:40.366Z
**Gathering Method**: model-assisted

---

## Current Architecture of rp_build (generator.ts)

### How it works today:
1. `buildPlan()` in `src/mcp/tools/build.ts` calls `generatePlan()` in `src/ai/generator.ts`
2. `generatePlan()` loads artifacts (IDEA.md, SHAPING.md, evidence, constraints, questions)
3. Applies token budget tiering to evidence
4. Builds a single prompt with all artifacts concatenated into sections (== CONSTRAINTS ==, == EVIDENCE ==, etc.)
5. Makes ONE call to `provider.executeStream()` (recently changed from `provider.execute()` to avoid Anthropic timeout error)
6. Collects the full JSON response and parses it into `GeneratedPlan`

### Key files:
- `riotplan/src/ai/generator.ts` - `generatePlan()`, `buildPlanPrompt()`, `buildArtifactAwarePrompt()`, `SYSTEM_PROMPT`
- `riotplan/src/mcp/tools/build.ts` - `buildPlan()` tool implementation, `executeBuild()`, `buildTool` MCP definition
- `riotplan/src/ai/provider-loader.ts` - `loadProvider()` for session-aware provider loading
- `riotplan/src/ai/artifacts.ts` - `loadArtifacts()` reads all plan files
- `riotplan/src/ai/tokens.ts` - Token budget/tiering for evidence
- `riotplan/src/ai/validation.ts` - `validatePlan()` post-generation checks
- `riotplan/src/ai/provenance.ts` - `generateProvenanceMarkdown()` for traceability

### What it produces:
- SUMMARY.md, EXECUTION_PLAN.md, STATUS.md, PROVENANCE.md
- plan/ directory with numbered step files (01-step-name.md, etc.)
- Each step has: objective, background, tasks, acceptance criteria, testing, files changed, notes, provenance

### Critical gap:
- NO tools available during generation - can't read files, search code, query project index
- NO iteration - single prompt → single response
- NO codebase awareness - only sees what was captured as evidence during exploration
- The "Files Changed" section ends up as "_List files that will be modified..._" placeholder because the LLM has no way to know which files exist