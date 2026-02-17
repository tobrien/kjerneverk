# Step 01: Create write_plan Tool and Agent Generation Prompt

## Objective

Create the `write_plan` tool that the agent calls to output its generated plan, and write the system prompt that guides the agent through codebase-aware plan generation.

## Background

The current `generatePlan()` in `riotplan/src/ai/generator.ts` uses a one-shot LLM call with a `SYSTEM_PROMPT` and `buildArtifactAwarePrompt()`. The agent-powered approach replaces this with a multi-turn agent session. The agent needs:

1. A system prompt that tells it to explore the codebase and then generate a structured plan
2. A `write_plan` tool it calls when ready, passing the `GeneratedPlan` JSON structure
3. The `write_plan` tool signals completion and returns the plan to the caller

The existing `GeneratedPlan` interface (lines 16-22 of `generator.ts`) defines the output shape: `{ summary, approach, successCriteria, steps[], analysis? }`. The `write_plan` tool must accept this exact shape.

## Tasks

### Create write_plan tool
- [ ] Create `riotplan/src/ai/tools/write-plan.ts` with a `writePlanTool` definition
- [ ] The tool accepts the `GeneratedPlan` JSON schema as its input parameter (matching the existing `plan_generation` schema in `generator.ts` lines 186-287)
- [ ] When called, the tool validates the JSON structure and stores it in a closure/callback that `generatePlanWithAgent()` can read
- [ ] Use the agentic `Tool` interface from `@kjerneverk/agentic` (same pattern as tools in `riotplan/src/cli/tools/environment/`)
- [ ] Return a success message like "Plan accepted with N steps" so the agent knows it worked

### Write agent generation system prompt
- [ ] Create `riotplan/src/ai/prompts/build-agent.md` with the system prompt for agent-powered generation
- [ ] The prompt should instruct the agent to:
  1. First read the provided plan artifacts (constraints, evidence, selected approach)
  2. Use `query_index` to understand the project structure (packages, key files)
  3. Use `read_file` to examine relevant interfaces, types, and implementations
  4. Use `grep` to find usage patterns and references
  5. Draft the plan with concrete file paths, class names, and method references
  6. Call `write_plan` with the complete structured JSON
- [ ] Include the same artifact-awareness instructions from the current `SYSTEM_PROMPT` (lines 312-333 of `generator.ts`)
- [ ] Add explicit instructions: "Every step MUST include specific file paths in filesChanged, reference actual interfaces/classes by name, and describe concrete code changes"
- [ ] Include the JSON schema inline so the agent knows the exact structure to produce

### Create user prompt builder for agent mode
- [ ] Create `buildAgentUserPrompt()` function in `generator.ts` that assembles the user prompt
- [ ] Include the same artifact sections as `buildArtifactAwarePrompt()` (constraints, evidence, selected approach, history, questions)
- [ ] Add a new `== CODEBASE CONTEXT ==` section with the project index summary (packages, key files, directory structure)
- [ ] Instead of generation instructions at the end, tell the agent: "Explore the codebase using your tools, then call write_plan when ready"

## Acceptance Criteria

- [ ] `write_plan` tool validates the JSON structure matches `GeneratedPlan` interface
- [ ] `write_plan` tool uses a callback/promise pattern to pass the plan back to the caller
- [ ] System prompt includes explicit instructions to use codebase exploration tools
- [ ] System prompt includes the full JSON schema for the expected output
- [ ] User prompt builder includes all existing artifact sections plus codebase context

## Key Files

- `riotplan/src/ai/tools/write-plan.ts` (NEW)
- `riotplan/src/ai/prompts/build-agent.md` (NEW)
- `riotplan/src/ai/generator.ts` (modify - add `buildAgentUserPrompt()`)

## Dependencies

None - this is the foundation step.
