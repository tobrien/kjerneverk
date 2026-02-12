# Step 03: Inject Project Index Context into Build

## Objective

Auto-build the project index before plan generation and inject a structured codebase context section into the agent's prompt, giving it immediate awareness of the project structure without needing tool calls.

## Background

The project indexer (`riotplan/src/cli/tools/environment/project-index.ts`) scans a project and builds an in-memory index of files, packages, and exports in ~244ms for the kjerneverk monorepo. The index is cached in the `indexCache` Map, so if `riotplan explore` already indexed the project, the same index is reused.

The indexer is **language-agnostic** (already implemented):
- **Project manifests**: Detects `package.json` (Node), `Cargo.toml` (Rust), `pyproject.toml`/`setup.py` (Python), `go.mod` (Go), `pom.xml`/`build.gradle` (Java), `CMakeLists.txt` (C/C++), `.csproj` (.NET), `Gemfile` (Ruby), `Package.swift` (Swift)
- **Symbol extraction**: Extracts public symbols from JS/TS (`export`), Python (`def`/`class`), Rust (`pub fn`/`pub struct`), Java (`public class`), Go (uppercase names), C/C++ headers (function declarations, typedefs, macros)
- **Comment styles**: Understands `//`, `#`, `///`, `"""`, `/* */` for file descriptions
- **Project root detection**: `findProjectRoot()` in `common.ts` recognizes `.git`, `package.json`, `Cargo.toml`, `go.mod`, `pom.xml`, `CMakeLists.txt`, `*.sln`, and other root indicators

Currently, `buildPlan()` in `riotplan/src/mcp/tools/build.ts` has no concept of the project root or codebase context. It only knows about plan artifacts.

## Tasks

### Add project root detection to build tool
- [ ] In `riotplan/src/mcp/tools/build.ts`, import `findProjectRoot` from the CLI common module (or extract it to a shared location if the import path is awkward between MCP and CLI)
- [ ] Alternatively, create a lightweight `resolveProjectRoot(planPath: string): string` in `riotplan/src/ai/project-context.ts` that implements the same walk-up logic
- [ ] Call this at the start of `buildPlan()` to determine the project root

### Build and format project index for prompt injection
- [ ] Create `riotplan/src/ai/project-context.ts` with:
  - `getProjectContext(planPath: string): Promise<string>` - builds index and returns formatted context
  - Calls `indexProjectImpl({ path: projectRoot }, projectRoot)` to build/retrieve cached index
  - Formats the result as a structured text section:
    ```
    == CODEBASE CONTEXT ==
    Project root: /path/to/project
    
    ### Packages (N total)
    - @kjerneverk/agentic (agentic/) - Agentic agent loop and tool registry
    - @kjerneverk/execution-anthropic (execution-anthropic/) - Anthropic provider
    ...
    
    ### Key Source Files
    - riotplan/src/ai/generator.ts (15.2KB) - exports: generatePlan, GeneratedPlan, ...
    - riotplan/src/mcp/tools/build.ts (12.1KB) - exports: buildPlan, buildTool, ...
    ...
    
    ### Directory Structure
    riotplan/src/
      ai/          - AI generation, artifacts, tokens, validation
      cli/         - CLI commands, terminal, tools
      mcp/         - MCP server, tools, prompts
      config/      - Configuration loading
    ```
- [ ] Filter to relevant files: prioritize `.ts`, `.tsx`, `.js` files; show files with exports; cap at ~100 most relevant files
- [ ] Include package dependency relationships (which packages depend on which)

### Integrate with GenerationContext
- [ ] Add `codebaseContext?: string` field to `GenerationContext` interface in `generator.ts` (line 78)
- [ ] In `buildAgentUserPrompt()`, include the `codebaseContext` as a `== CODEBASE CONTEXT ==` section
- [ ] Also include it in `buildArtifactAwarePrompt()` for the one-shot fallback path (even without tools, codebase context helps)

### Handle missing index gracefully
- [ ] If project root can't be determined, skip codebase context (don't fail the build)
- [ ] If indexing fails (e.g., permission error), log warning and continue without context
- [ ] If index is already cached (from `riotplan explore`), use it instantly (~0ms)

## Acceptance Criteria

- [ ] Project root is detected from plan path using walk-up logic
- [ ] Project index is built automatically (or retrieved from cache) before generation
- [ ] Codebase context section includes: package list, key files with exports, directory structure
- [ ] Context is injected into both agent prompt and one-shot fallback prompt
- [ ] Graceful degradation if indexing fails - build still works, just without codebase context
- [ ] Index cache is reused if `riotplan explore` already built it

## Key Files

- `riotplan/src/ai/project-context.ts` (NEW - project root detection + context formatting)
- `riotplan/src/ai/generator.ts` (modify - add `codebaseContext` to `GenerationContext`, use in prompts)
- `riotplan/src/mcp/tools/build.ts` (modify - call `getProjectContext()` before generation)
- `riotplan/src/cli/tools/environment/project-index.ts` (reference - `indexProjectImpl`, `indexCache`)

## Dependencies

- Step 1 (prompt builder that includes codebase context section)
