# Step 01: Create Step Reflection Tool and Reflections Directory Structure

## Objective

Implement a new `riotplan_step_reflect` MCP tool that writes freeform reflection files to a `reflections/` directory within the plan. This is the foundation of the inter-step learning channel.

## Background

Currently, `step_complete` marks a step as done and regenerates STATUS.md. There is no mechanism for the executing agent to capture what it learned, what surprised it, or what could be done differently. This step adds that mechanism as a separate layer — reflection files live alongside the plan, not embedded in the status tracking.

## Tasks

### 1.1 Create reflection file writer

Create `src/reflections/writer.ts`:
- Function `writeStepReflection(planPath: string, stepNumber: number, content: string): Promise<string>`
- Creates `reflections/` directory if it doesn't exist
- Writes reflection to `reflections/{NN}-reflection.md` (e.g., `reflections/01-reflection.md`)
- File format: freeform prose, no schema enforcement
- Returns the path to the written file

### 1.2 Create reflection file reader

Create `src/reflections/reader.ts`:
- Function `readStepReflection(planPath: string, stepNumber: number): Promise<string | null>`
- Function `readAllReflections(planPath: string): Promise<Array<{ step: number, content: string }>>`
- Function `readPriorReflections(planPath: string, beforeStep: number): Promise<Array<{ step: number, content: string }>>`
- Gracefully handles missing reflection files (returns null, not error)

### 1.3 Create the MCP tool

Create `src/mcp/tools/reflect.ts`:
- Tool name: `riotplan_step_reflect`
- Parameters:
  - `step` (required): Step number to reflect on
  - `path` (optional): Plan directory path
- Input: The reflection content as a string
- Validation: Step must exist and be completed (can't reflect on a step that hasn't finished)
- Writes the reflection file
- Returns confirmation with file path

### 1.4 Register the tool

Update `src/mcp/tools/index.ts` to register `riotplan_step_reflect` in the tool list.

### 1.5 Add tests

- Test reflection file writing (correct path, creates directory)
- Test reflection file reading (single, all, prior-to-step)
- Test MCP tool validation (step must be completed)
- Test graceful handling of missing reflections

## Acceptance Criteria

- [ ] `riotplan_step_reflect` tool is registered and callable
- [ ] Reflection files are written to `reflections/{NN}-reflection.md`
- [ ] Reader functions return prior reflections filtered by step number
- [ ] Reflecting on a non-completed step returns an error
- [ ] Missing reflection files are handled gracefully (no crashes)
- [ ] Tests pass

## Key Files

- `src/reflections/writer.ts` (new)
- `src/reflections/reader.ts` (new)
- `src/mcp/tools/reflect.ts` (new)
- `src/mcp/tools/index.ts` (modified)

## Dependencies

None — this is the foundational step.
