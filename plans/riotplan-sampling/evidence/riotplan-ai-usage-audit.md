# RiotPlan AI Generation Usage Audit

Audited: 2026-02-07
Source: RiotPlan codebase analysis

## Where AI Generation Currently Happens

### 1. **Plan Generation** (`src/ai/generator.ts`)

**Function**: `generatePlan()`

**What it does**:
- Takes plan description and context
- Generates complete plan structure with steps, tasks, acceptance criteria
- Uses JSON schema for structured output
- Currently requires a Provider (Anthropic/OpenAI/Gemini)

**Usage locations**:
- CLI: `src/cli/commands/generate.ts` - `riotplan generate` command
- MCP: `src/mcp/tools/generate.ts` - `riotplan_generate` tool
- Programmatic: `src/plan/creator.ts` - when creating plans with AI

**Parameters used**:
- `model`: Model name (default: 'claude-sonnet-4-5')
- `messages`: System + user prompt
- `responseFormat`: JSON schema for structured output

**This is the PRIMARY use case** for execution-sampling.

### 2. **Provider Loading** (`src/ai/provider-loader.ts`)

**Functions**:
- `loadProvider()`: Dynamically loads Anthropic/OpenAI/Gemini providers
- `detectAvailableProviders()`: Checks which providers are installed
- `getDefaultProvider()`: Gets provider from environment variables

**Current behavior**:
- Throws error if provider package not installed
- Suggests installing `@kjerneverk/execution-{provider}`
- Mentions using manual step creation as alternative

**This is where detection logic would go** - check for MCP sampling capability before loading direct providers.

### 3. **Feedback Module** (`src/feedback/index.ts`)

**What it does**:
- Records feedback, deliberation, decisions
- Captures "what was proposed" vs "what was changed"
- Preserves discussion context

**AI usage**: NONE currently
- This is pure data storage/retrieval
- No AI generation happening here

**Potential future use**: Could use AI to summarize feedback or suggest resolutions, but not currently implemented.

### 4. **Retrospective Module** (`src/retrospective/index.ts`)

**What it does**: (Need to check file)
- Likely analyzes completed plans
- May generate insights or summaries

**AI usage**: UNKNOWN - need to check file

### 5. **MCP Prompts** (`src/mcp/prompts/`)

**Files**:
- `create_plan.md`: Prompt template for plan creation
- `shape_approach.md`: Prompt template for shaping approaches

**What they are**:
- MCP prompt templates that Cursor/clients can use
- NOT AI generation by RiotPlan itself
- These are prompts FOR the user's AI to use

**AI usage**: NONE by RiotPlan
- These are resources, not generation calls

## Summary: What Needs execution-sampling?

### Confirmed Needs:
1. ✅ **Plan Generation** (`generatePlan()` in `src/ai/generator.ts`)
   - Used by CLI `generate` command
   - Used by MCP `riotplan_generate` tool
   - This is THE primary use case

### Potential Future Needs:
2. ❓ **Retrospective Analysis** (need to check)
3. ❓ **Feedback Summarization** (not implemented yet)
4. ❓ **Idea Exploration** (mentioned by user - not implemented yet)
5. ❓ **Shaping Assistance** (not implemented yet)

### Does NOT Need:
- ❌ Feedback recording (pure data storage)
- ❌ MCP prompts (resources, not generation)
- ❌ Step operations (CRUD, no AI)
- ❌ Plan file I/O (file operations, no AI)

## Architecture Implications

### Current Flow:
```
User calls riotplan_generate
  ↓
generate.ts (MCP tool)
  ↓
loadProvider() - tries to load Anthropic/OpenAI/Gemini
  ↓
generatePlan() - calls provider.execute()
  ↓
Returns generated plan
```

### Proposed Flow with execution-sampling:
```
User calls riotplan_generate
  ↓
generate.ts (MCP tool)
  ↓
detectExecutionMode() - check for MCP sampling capability
  ↓
IF sampling available:
    loadSamplingProvider() - use execution-sampling
ELSE:
    loadProvider() - use direct API provider
  ↓
generatePlan() - calls provider.execute() (same interface)
  ↓
Returns generated plan
```

## Key Insight

**Only ONE place needs AI generation right now**: `generatePlan()` in `src/ai/generator.ts`

This means:
- execution-sampling needs to implement the same `Provider` interface
- Detection logic goes in `provider-loader.ts`
- No other code changes needed (same interface)
- Future features (idea exploration, shaping) can use the same pattern

## Next Steps

1. Check `src/retrospective/index.ts` to see if it uses AI
2. Verify the `Provider` interface in `src/types.ts`
3. Design execution-sampling to match that interface
4. Add detection logic to `provider-loader.ts`
