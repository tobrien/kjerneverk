# Execution Plan: RiotPlan MCP Sampling Support

## Selected Approach

**Session-Based Sampling with Graceful Fallback**

After investigating MCP sampling feasibility and discovering that major IDEs (Cursor, Claude Desktop) don't yet support it, we've chosen to build sampling support anyway with a session-based architecture that gracefully falls back to direct providers when sampling is unavailable.

### Why This Approach?

**From Investigation** (timeline events 55-67):
1. **FastMCP enables testing**: Production-ready Python client with sampling support
2. **GitHub Copilot works**: At least one major IDE supports sampling
3. **Future-proof**: Ready when Cursor/Claude Desktop add support
4. **Market leadership**: Positions RiotPlan as MCP sampling pioneer
5. **No breaking changes**: Existing users unaffected

**Key Insight** (from narrative chunk 67):
> "User wants to build it anyway to: (1) be ready when they add it, (2) test with FastMCP today, (3) put pressure on vendors, (4) position RiotPlan as MCP sampling leader."

## Strategy

### 1. Session-Based Architecture

**Rationale** (from evidence/session-based-architecture.md):
- RiotPlan supports both STDIO (local, single client) and HTTP (remote, multiple clients)
- Different sessions may have different client capabilities
- Sampling availability must be tracked per-session, not globally

**Implementation**:
- `SessionContext` tracks clientInfo, capabilities, providerMode per connection
- `SessionManager` manages lifecycle of sessions
- Provider mode determined during MCP initialization: `sampling` → `direct` → `none`

### 2. execution-sampling as Separate Package

**Rationale** (from IDEA.md constraint + timeline event 50):
> "execution-sampling should be a separate npm package that other projects can use. Part of @kjerneverk ecosystem."

**Benefits**:
- Reusable pattern for other MCP tools
- Clean separation of concerns
- Can evolve independently
- Demonstrates value to community

**Implementation**:
- New `@kjerneverk/execution-sampling` package
- Implements same `Provider` interface as execution-anthropic/openai/gemini
- Drop-in replacement - no RiotPlan code changes needed beyond provider loading

### 3. Automatic Detection with Graceful Fallback

**Rationale** (from IDEA.md constraints):
> "Detection must be automatic - no user configuration required"
> "Error messages must be clear when sampling unavailable"

**Flow**:
```
1. MCP client connects → SessionManager creates session
2. Initialize request received → Extract clientInfo + capabilities
3. Determine provider mode:
   - capabilities.sampling exists? → mode = 'sampling'
   - API keys available? → mode = 'direct'
   - Neither? → mode = 'none'
4. When AI needed:
   - Load provider based on session's mode
   - If 'none', return clear error with next steps
```

### 4. Test-Driven with FastMCP

**Rationale** (from evidence/fastmcp-test-plan.md):
- FastMCP provides production-ready sampling client
- Can test end-to-end without waiting for IDE support
- Validates implementation before major IDE adoption

**Approach**:
- Python pytest suite using FastMCP
- Tests with both OpenAI and Anthropic handlers
- Validates request format, error handling, end-to-end generation
- CI/CD integration ensures ongoing compatibility

## Phases

### Phase 1: Session Architecture Foundation (Steps 1-3)

**Goal**: Build session tracking infrastructure

**Why First**: Foundation needed before provider logic can be session-aware

**Deliverables**:
- `SessionContext` interface and class
- `SessionManager` for lifecycle management
- Integration with MCP server initialization

**Risk Mitigation**: Pure addition, no changes to existing code paths

### Phase 2: execution-sampling Package (Steps 4-6)

**Goal**: Create reusable sampling provider

**Why Second**: Core functionality that Phase 3 depends on

**Deliverables**:
- New `@kjerneverk/execution-sampling` npm package
- `SamplingProvider` implementing `Provider` interface
- Error handling for user rejection, timeouts, invalid params
- Unit tests for sampling provider

**Risk Mitigation**: 
- Implement Provider interface exactly (from evidence/riotplan-ai-usage-audit.md)
- Test with mock MCP client before FastMCP integration

### Phase 3: RiotPlan Integration (Steps 7-9)

**Goal**: Wire up sampling support in RiotPlan

**Why Third**: Requires both Phase 1 (sessions) and Phase 2 (sampling provider)

**Deliverables**:
- Updated `provider-loader.ts` with session-aware loading
- Automatic mode detection during initialization
- Graceful fallback logic
- Clear error messages

**Risk Mitigation**:
- Maintain backward compatibility
- Existing API key usage must continue working
- Add feature flag for gradual rollout

### Phase 4: Testing & Validation (Steps 10-12)

**Goal**: Verify implementation with real sampling client

**Why Fourth**: Validates Phases 1-3 work together

**Deliverables**:
- Python test suite using FastMCP (from evidence/fastmcp-test-plan.md)
- End-to-end plan generation tests
- Request format validation
- Error handling verification
- CI/CD integration

**Risk Mitigation**:
- Test both OpenAI and Anthropic handlers
- Test error cases (user rejection, timeout, invalid params)
- Verify no regression in direct provider mode

### Phase 5: Documentation & Advocacy (Steps 13-14)

**Goal**: Share learnings and encourage adoption

**Why Last**: Needs working implementation to demonstrate

**Deliverables**:
- Blog posts about MCP sampling benefits
- execution-sampling package documentation
- RiotPlan sampling usage guide
- Examples for other tool authors

**Risk Mitigation**: N/A - advocacy work, no technical risk

## Key Decisions

### Decision 1: Build Despite Limited IDE Support

**Context** (from timeline event 55):
> "Cursor does NOT support MCP sampling, only tools. Claude Code also lacks sampling."

**Decision**: Build it anyway

**Rationale**:
- GitHub Copilot supports it
- FastMCP enables testing
- Future-proof for when IDEs add support
- Market leadership opportunity

**Tradeoffs**:
- ✅ Ready when Cursor adds sampling
- ✅ Can test with FastMCP today
- ✅ Demonstrates value to vendors
- ⚠️ Limited immediate user benefit (only Copilot users)

### Decision 2: Session-Based Architecture

**Context** (from timeline event 64):
> "Since RiotPlan supports both STDIO and HTTP transports, sampling availability is per-session."

**Decision**: Track provider mode per-session, not globally

**Rationale**:
- STDIO: One client per process
- HTTP: Multiple concurrent clients with different capabilities
- Must support both modes

**Tradeoffs**:
- ✅ Correct architecture for multi-client scenarios
- ✅ No global state issues
- ⚠️ More complex than global flag
- ⚠️ Session management overhead

### Decision 3: Separate execution-sampling Package

**Context** (from timeline event 50):
> "execution-sampling should be a separate npm package that other projects can use."

**Decision**: Create `@kjerneverk/execution-sampling` as standalone package

**Rationale**:
- Reusable pattern for MCP ecosystem
- Clean separation of concerns
- Can version independently
- Demonstrates value to community

**Tradeoffs**:
- ✅ Reusable by other tools
- ✅ Clear API boundary
- ✅ Independent evolution
- ⚠️ Additional package to maintain
- ⚠️ More complex dependency graph

### Decision 4: Maintain Standalone CLI Mode

**Context** (from timeline event 49):
> "Standalone CLI mode should absolutely still work with direct AI providers. Don't want to force everyone to MCP."

**Decision**: execution-sampling is an addition, not a replacement

**Rationale**:
- Users may prefer direct API control
- Not all environments support MCP
- Backward compatibility essential

**Tradeoffs**:
- ✅ No breaking changes
- ✅ User choice preserved
- ✅ Backward compatible
- ⚠️ Must maintain both code paths

## Assumptions

1. **MCP spec stability**: `sampling/createMessage` API won't change significantly
2. **FastMCP reliability**: FastMCP client works as documented for testing
3. **Provider interface stability**: RiotPlan's Provider interface won't need breaking changes
4. **IDE adoption**: Cursor/Claude Desktop will eventually add sampling support
5. **User acceptance**: Users will approve sampling requests when prompted

## Constraints

All constraints from IDEA.md are honored:

1. ✅ **Standalone CLI must work**: Fallback to direct providers ensures this
2. ✅ **Automatic detection**: Capability check during initialization
3. ✅ **Clear error messages**: Phase 2 includes error handling with actionable guidance
4. ✅ **Reusable package**: execution-sampling is separate @kjerneverk package
5. ✅ **No user configuration**: Detection via MCP handshake, no config needed
6. ✅ **Transparent to user**: Provider selection happens automatically

## Risks and Mitigations

### Risk 1: IDE Vendors Don't Add Sampling

**Likelihood**: Medium  
**Impact**: Medium

**Mitigation**:
- Blog posts and advocacy demonstrate value
- GitHub Copilot already supports it (proof of concept)
- FastMCP shows it's technically feasible
- Even if IDEs don't adopt, HTTP deployments can use FastMCP

### Risk 2: MCP Sampling Spec Changes

**Likelihood**: Low  
**Impact**: High

**Mitigation**:
- Follow spec closely (evidence/mcp-sampling-spec.md)
- Version execution-sampling package appropriately
- Monitor MCP spec changes
- Comprehensive tests catch breaking changes

### Risk 3: Performance Issues with Sampling

**Likelihood**: Low  
**Impact**: Medium

**Mitigation**:
- Sampling is request/response, similar to direct API
- User approval dialog may add latency (acceptable)
- Test with realistic plan generation workloads
- Monitor performance in FastMCP tests

### Risk 4: User Confusion About Sampling Dialogs

**Likelihood**: Medium  
**Impact**: Low

**Mitigation**:
- Document that sampling requires user approval
- Provide clear error message if user rejects
- Blog posts explain the flow
- Consider adding explanatory text in sampling requests

### Risk 5: Breaking Existing Users

**Likelihood**: Very Low  
**Impact**: Very High

**Mitigation**:
- Maintain backward compatibility as primary constraint
- Existing API key usage must continue working
- Comprehensive regression tests
- Feature flag for gradual rollout
- Session-based architecture isolates changes

## Success Metrics

### Technical Metrics

1. **Session tracking works**: Unit tests pass for SessionManager
2. **Sampling detection accurate**: 100% correct mode determination in tests
3. **Plan generation via sampling**: FastMCP test generates valid plan
4. **Fallback works**: Direct provider used when sampling unavailable
5. **No regressions**: Existing tests continue passing
6. **Error handling**: All error cases handled gracefully

### Adoption Metrics

1. **Package published**: execution-sampling available on npm
2. **Documentation complete**: README, examples, API docs published
3. **Blog posts published**: At least 2 posts about MCP sampling
4. **Community engagement**: Shared in MCP community channels
5. **Other tools adopt**: At least 1 other tool uses execution-sampling

### Validation Criteria

Before considering this complete:

- [ ] All 14 steps completed
- [ ] FastMCP test suite passing
- [ ] No breaking changes to existing functionality
- [ ] execution-sampling package published
- [ ] Documentation published
- [ ] Blog posts written
- [ ] Checkpoint created with "implementation-complete" tag

## Next Steps

1. **Review this plan**: Confirm approach and priorities
2. **Create checkpoint**: Save approved plan state
3. **Begin Phase 1**: Start with Step 1 (SessionContext)
4. **Iterative execution**: Complete steps in order, validate at each phase boundary
5. **Blog as you build**: Document learnings for final blog posts
