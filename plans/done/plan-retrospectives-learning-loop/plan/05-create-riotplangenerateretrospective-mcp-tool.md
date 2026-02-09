# Step 05: Create riotplan_generate_retrospective MCP Tool

## Objective

Implement the MCP tool that generates the overall plan retrospective. This tool loads all execution context, applies the retrospective prompt (Step 04), and writes retrospective.md.

## Background

The retrospective generation needs to:
1. Gather all execution data (reflections, plan files, status, history)
2. Apply the prompt from Step 04
3. Use a high-tier model for generation
4. Write the result as retrospective.md in the plan directory

## Tasks

### 5.1 Create the retrospective generator

Create `src/retrospective/generator.ts`:
- Function `generateRetrospective(planPath: string, options?: GenerateRetrospectiveOptions): Promise<string>`
- Loads context:
  - All step reflections via `readAllReflections()`
  - SUMMARY.md (the original plan vision)
  - EXECUTION_PLAN.md (the planned approach)
  - STATUS.md (what actually happened)
  - Individual step files from `plan/`
  - Timeline/history if available
- Assembles the prompt with all context
- Returns the generated retrospective content

### 5.2 Create the MCP tool

Create `src/mcp/tools/retrospective.ts`:
- Tool name: `riotplan_generate_retrospective`
- Parameters:
  - `path` (optional): Plan directory path
- Validation:
  - Plan must exist
  - Plan must be completed (all steps done) OR user explicitly requests it
  - At least one step reflection should exist (warn if not, but don't block)
- Calls the generator
- Writes retrospective.md to the plan directory
- Returns confirmation with retrospective summary

### 5.3 Signal model tier requirement

The tool should include metadata or documentation indicating this operation benefits from the highest-tier model available. Options:
- Include a note in the tool description: "This tool generates best results with the most capable reasoning model available"
- Consider: should execution pause here to allow model switching? Document the recommended workflow.

### 5.4 Register the tool

Update `src/mcp/tools/index.ts` to register `riotplan_generate_retrospective`.

### 5.5 Add tests

- Test context loading (all reflections, plan files gathered correctly)
- Test validation (plan must be completed, handle missing reflections)
- Test retrospective.md is written correctly
- Test graceful handling of plans without reflections

## Acceptance Criteria

- [ ] `riotplan_generate_retrospective` tool is registered and callable
- [ ] Tool loads all execution context (reflections, plan files, status, history)
- [ ] Tool writes retrospective.md to plan directory
- [ ] Tool signals high-tier model recommendation
- [ ] Validation prevents generating retrospective for incomplete plans (with override)
- [ ] Tests pass

## Key Files

- `src/retrospective/generator.ts` (new)
- `src/mcp/tools/retrospective.ts` (new)
- `src/mcp/tools/index.ts` (modified)

## Dependencies

- Step 01 (reflection reader)
- Step 04 (retrospective prompt)
