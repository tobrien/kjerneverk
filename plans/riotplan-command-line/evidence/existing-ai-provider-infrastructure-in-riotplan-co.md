# Evidence: Existing AI provider infrastructure in RiotPlan codebase

**Source**: codebase analysis
**Original Query**: What existing AI/LLM infrastructure exists in the riotplan codebase?
**Added**: 2026-02-09T14:04:01.687Z
**Gathering Method**: model-assisted

---

## Provider System (src/ai/provider-loader.ts)

RiotPlan already has a multi-provider AI system:

### Provider Loading Priority:
1. MCP Sampling (if session supports it) → @kjerneverk/execution-sampling
2. Explicit provider name → Direct API provider
3. Default from environment → Auto-detect from API keys
4. Error with helpful message

### Supported Providers:
- Anthropic/Claude: @kjerneverk/execution-anthropic
- OpenAI/GPT: @kjerneverk/execution-openai
- Google/Gemini: @kjerneverk/execution-gemini
- Sampling (MCP): @kjerneverk/execution-sampling

### Environment Variables:
- ANTHROPIC_API_KEY
- OPENAI_API_KEY
- GOOGLE_API_KEY

### AI Generation (src/ai/generator.ts):
- Token budget management with tiering (src/ai/tokens.ts)
- Evidence-aware generation (tiers evidence by relevance)
- Artifact-driven generation (uses IDEA.md, SHAPING.md, evidence, history)
- Provenance tracking (src/ai/provenance.ts)
- Validation (src/ai/validation.ts)

### Key Insight:
The provider infrastructure already exists for direct API calls. The challenge isn't calling the LLM - it's creating an interactive conversational loop with tool use, rather than the current one-shot generation pattern.