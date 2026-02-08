# RiotPlan MCP Sampling Support

## Objective

Enable RiotPlan to use MCP sampling when called via MCP, eliminating the need for duplicate API keys while maintaining full backward compatibility with standalone CLI mode.

## Value

**Problem**: Users already have AI access through their IDE (Cursor, GitHub Copilot, etc.) but RiotPlan requires separate API keys for `@kjerneverk/execution-anthropic` or similar packages. This creates a major adoption barrier - "Why do I need an API key when I'm already using an AI model?"

**Solution**: When RiotPlan detects it's being called via MCP by a client that supports sampling, it automatically uses MCP sampling to delegate AI generation back to the client. No duplicate API keys needed.

**Impact**:
- **Removes adoption friction**: Cursor/Copilot users can use RiotPlan immediately without setup
- **Future-proof**: Ready when major IDEs add sampling support
- **Reusable pattern**: `execution-sampling` package can be used by other tools
- **Positions RiotPlan as leader**: First major MCP tool to implement sampling
- **No breaking changes**: Standalone CLI mode continues to work with direct providers

## Scope

### In Scope

**Phase 1: Foundation**
- Session-based architecture for tracking client capabilities
- Client detection via MCP initialization handshake
- Provider mode determination (sampling vs direct vs none)

**Phase 2: execution-sampling Package**
- New `@kjerneverk/execution-sampling` npm package
- Implements same `Provider` interface as execution-anthropic/openai/gemini
- Sends `sampling/createMessage` requests to MCP client
- Handles errors gracefully (user rejection, timeouts, etc.)

**Phase 3: RiotPlan Integration**
- Update `provider-loader.ts` to detect sampling capability
- Automatic fallback: sampling → direct provider → error with clear message
- Session context passed to provider loading

**Phase 4: Testing & Validation**
- Python test suite using FastMCP with OpenAI/Anthropic handlers
- End-to-end plan generation via sampling
- Request format validation
- Error handling verification

**Phase 5: Documentation & Advocacy**
- Blog posts about MCP sampling benefits
- Documentation for execution-sampling package
- Examples and guides for other tool authors

### Out of Scope

- Streaming support (not in MCP spec)
- Temperature parameter (not in MCP spec)
- Forcing all users to MCP mode (standalone CLI remains)
- Supporting clients that don't implement sampling correctly

## Success Criteria

1. ✅ **Session tracking works**: Different sessions can have different provider modes
2. ✅ **Sampling detection works**: RiotPlan correctly identifies when client supports sampling
3. ✅ **Plan generation via sampling**: FastMCP test generates complete plan without server API keys
4. ✅ **Graceful fallback**: When sampling unavailable, falls back to direct provider or clear error
5. ✅ **No breaking changes**: Existing users with API keys continue to work
6. ✅ **Reusable package**: execution-sampling can be used by other projects
7. ✅ **Documentation complete**: Blog posts and guides published

## Context

### Key Research Findings

**MCP Sampling Specification** (evidence/mcp-sampling-spec.md):
- Well-defined JSON-RPC API: `sampling/createMessage`
- Supports systemPrompt, maxTokens, modelPreferences
- Error codes: -1 (user rejected), -32602 (invalid params)
- No streaming, no temperature parameter

**Client Support Matrix** (evidence/mcp-sampling-support-matrix.md):
- ❌ Cursor: Tools only, no sampling
- ❌ Claude Desktop: No sampling
- ❌ Claude Code: No sampling  
- ✅ GitHub Copilot: Full sampling support (2026)
- ✅ FastMCP (Python): Production-ready with built-in handlers
- ✅ mcp-go: Working examples

**Critical Pivot**: Original idea assumed Cursor would support sampling, but research revealed it doesn't. Decision: Build it anyway because (1) GitHub Copilot supports it, (2) FastMCP enables testing, (3) Cursor/Claude Desktop will likely add it, (4) positions RiotPlan as MCP sampling leader.

**Architecture Decision** (evidence/session-based-architecture.md):
- Sampling availability is per-session (STDIO vs HTTP transports)
- SessionContext tracks clientInfo, capabilities, providerMode
- Provider mode determined during initialization: sampling → direct → none
- Clean Provider interface means execution-sampling is drop-in replacement

**RiotPlan AI Usage** (evidence/riotplan-ai-usage-audit.md):
- Currently only `generatePlan()` in `src/ai/generator.ts` needs AI
- Used by CLI `generate` command and MCP `riotplan_generate` tool
- Clean Provider interface makes integration straightforward
- Future: idea exploration, shaping assistance (not yet implemented)

### Constraints Honored

From IDEA.md, all constraints are addressed in the plan:

1. ✅ **Standalone CLI must work**: Phase 3 ensures fallback to direct providers
2. ✅ **Automatic detection**: Phase 1 implements capability detection during initialization
3. ✅ **Clear error messages**: Phase 2 includes error handling with actionable messages
4. ✅ **Reusable package**: Phase 2 creates separate @kjerneverk/execution-sampling
5. ✅ **No user configuration**: Detection happens automatically via MCP handshake
6. ✅ **Transparent to user**: Provider selection happens behind the scenes

### Strategic Rationale

**Why build this now?**
1. **Testing is possible**: FastMCP provides production-ready sampling client
2. **GitHub Copilot works**: At least one major IDE supports it
3. **Future-proof**: When Cursor/Claude Desktop add sampling, RiotPlan is ready
4. **Market leadership**: First major MCP tool to implement sampling
5. **Advocacy opportunity**: Blog posts demonstrate value, pressure vendors

**Why session-based architecture?**
- RiotPlan supports both STDIO (local) and HTTP (remote) transports
- Different clients have different capabilities
- HTTP mode may have multiple concurrent sessions
- Each session needs independent provider mode tracking

**Why execution-sampling as separate package?**
- Reusable pattern for other MCP tools
- Part of @kjerneverk ecosystem
- Clean separation of concerns
- Can evolve independently of RiotPlan

## Phases Overview

**Phase 1: Session Architecture** (Steps 1-3)
- Foundation for per-session capability tracking
- No breaking changes, pure addition

**Phase 2: execution-sampling Package** (Steps 4-6)
- New package implementing Provider interface
- Handles MCP sampling protocol
- Comprehensive error handling

**Phase 3: RiotPlan Integration** (Steps 7-9)
- Update provider loading logic
- Automatic mode detection
- Graceful fallbacks

**Phase 4: Testing & Validation** (Steps 10-12)
- FastMCP test suite
- End-to-end verification
- CI/CD integration

**Phase 5: Documentation & Advocacy** (Steps 13-14)
- Blog posts and guides
- Community engagement
- Vendor advocacy

## Timeline

**Total**: 14 steps across 5 phases

**Estimated effort**: 3-4 weeks
- Phase 1: 3-4 days
- Phase 2: 1 week
- Phase 3: 3-4 days
- Phase 4: 3-4 days
- Phase 5: 1 week

**Critical path**: Phase 2 (execution-sampling) is the most complex and blocks Phase 3.
