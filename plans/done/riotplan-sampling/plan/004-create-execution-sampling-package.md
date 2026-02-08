# Step 4: Create execution-sampling Package Structure

## Objective

Set up new `@kjerneverk/execution-sampling` npm package with proper structure, dependencies, and build configuration.

## Context

**Why this step**: Creates reusable package for MCP sampling that other tools can use. Part of @kjerneverk ecosystem.

**From IDEA.md**:
> "execution-sampling should be a separate npm package that other projects can use. Part of @kjerneverk ecosystem."

**Why now**: Foundation for Phase 2. Must exist before implementing SamplingProvider (Step 5).

## Tasks

- [ ] Create new directory: `execution-sampling/`
- [ ] Initialize package.json with:
  - Name: `@kjerneverk/execution-sampling`
  - Version: `0.1.0`
  - Description: "MCP sampling provider for AI generation"
  - Keywords: mcp, sampling, ai, provider
  - Dependencies: `@modelcontextprotocol/sdk`
- [ ] Set up TypeScript configuration (tsconfig.json)
- [ ] Create src/ directory structure:
  - `src/index.ts` - Main exports
  - `src/SamplingProvider.ts` - Provider implementation (Step 5)
  - `src/types.ts` - Type definitions
  - `src/errors.ts` - Error classes
- [ ] Set up build scripts (npm run build)
- [ ] Create README.md with overview
- [ ] Add LICENSE file (MIT)
- [ ] Create .gitignore and .npmignore

## Acceptance Criteria

- [ ] Package builds successfully
- [ ] Package.json has correct metadata
- [ ] TypeScript compiles without errors
- [ ] README explains purpose and basic usage
- [ ] Follows @kjerneverk package conventions
- [ ] Can be installed locally for testing

## Dependencies

**Requires**: None (new package)

**Blocks**: 
- Step 5 (SamplingProvider implementation)
- Step 6 (Tests and error handling)

## Evidence

**Package Requirements** (from timeline event 50):
> "execution-sampling should be a separate npm package that other projects can use. Part of @kjerneverk ecosystem."

**Reusability** (from EXECUTION_PLAN.md):
> "Demonstrates value to community. Other MCP tools can use this pattern."

## Estimated Effort

**4 hours**

- 1h: Package setup and configuration
- 1h: Directory structure and build setup
- 1h: README and documentation
- 1h: Testing build and local install

## Notes

- Follow conventions from execution-anthropic/openai/gemini
- Use same build tools as other @kjerneverk packages
- Consider adding example/ directory with usage examples
- Add package to monorepo if applicable

## Related Files

- Other execution packages for reference
- RiotPlan package.json for dependency
