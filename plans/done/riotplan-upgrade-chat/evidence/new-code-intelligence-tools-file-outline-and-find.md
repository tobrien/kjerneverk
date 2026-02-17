# Evidence: New code intelligence tools - file_outline and find_symbol (already implemented)

**Source**: codebase implementation
**Original Query**: What programming intelligence does Cursor have that our tools lack?
**Added**: 2026-02-12T17:11:33.473Z
**Gathering Method**: model-assisted

---

## New Tools Added to Close the Cursor Intelligence Gap

### file_outline (riotplan/src/cli/tools/environment/file-outline.ts)
- Returns class/function/interface/type signatures WITHOUT full file content
- Like IDE "Outline View" - shows structure at a glance
- Multi-language: TS/JS, Python, Rust, Java/Kotlin, Go, C/C++
- Groups methods under their parent class
- Shows line numbers and full signatures
- Token-efficient: ~50 tokens per file vs ~5000 for reading the whole file

Example output:
```
# src/ai/generator.ts (15 symbols)

L16: [interface] export interface GeneratedPlan
L24: [interface] export interface GenerationResult
L54: [interface] export interface GeneratedStep
L78: [interface] export interface GenerationContext
L141: [function] export async function generatePlan(context, provider, options)
  L170: [function] buildPlanPrompt(context)
  L360: [function] buildArtifactAwarePrompt(context)
```

### find_symbol (riotplan/src/cli/tools/environment/find-symbol.ts)
- Given a symbol name, finds: definitions, exports, imports, and usages
- Like IDE "Go to Definition" + "Find All References"
- Classifies each match: is this where it's defined? exported? imported? just used?
- Uses ripgrep with word boundaries for accurate matching
- Results sorted: definitions first, then exports, imports, usages

Example output:
```
# Symbol: AgentLoop

## Definitions (1)
  agentic/src/loop.ts:160  export class AgentLoop {

## Exports (1)
  agentic/src/index.ts:5  export { AgentLoop } from './loop';

## Imported by (3)
  riotplan/src/cli/commands/common.ts:10  import { AgentLoop } from '@kjerneverk/agentic';
  riotplan/src/cli/commands/build.ts:8   import { AgentLoop } from '@kjerneverk/agentic';

## Usages (12)
  riotplan/src/cli/commands/common.ts:464  const agentLoop = AgentLoop.create({
  ...

Total: 1 definitions, 1 exports, 3 imports, 12 usages
```

### Impact on Plan Quality
These tools give the build agent the same structural understanding Cursor has:
- file_outline: understand a file's API without burning tokens on implementation
- find_symbol: follow the dependency chain (who defines X? who uses X?)
- Combined with query_index: "what packages exist?" → "what does this file export?" → "who uses AgentLoop?"

Both tools are already registered in readOnlyEnvironmentTools, so they're immediately available to the explore agent and will be available to the build agent.