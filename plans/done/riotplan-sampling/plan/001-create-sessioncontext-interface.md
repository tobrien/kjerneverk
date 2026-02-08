# Step 1: Create SessionContext Interface and Types

## Objective

Define TypeScript interfaces and types for session-based capability tracking in RiotPlan's MCP server.

## Context

**Why this step**: Foundation for session-aware provider selection. RiotPlan needs to track which clients support sampling on a per-session basis because it supports both STDIO (single client) and HTTP (multiple concurrent clients) transports.

**From evidence/session-based-architecture.md**:
> "Each MCP connection maintains a session context with client information, capabilities, and derived state for provider mode determination."

**Why now**: This is the foundation that all other steps depend on. Must be defined before SessionManager (Step 2) or provider loading (Step 7) can be implemented.

## Tasks

- [ ] Create `src/mcp/session/types.ts` file
- [ ] Define `SessionContext` interface with:
  - `sessionId`: string
  - `transport`: 'stdio' | 'http'
  - `clientInfo`: ClientInfo | null
  - `capabilities`: Capabilities object
  - `samplingAvailable`: boolean (derived)
  - `providerMode`: 'sampling' | 'direct' | 'none'
  - `connectedAt`: Date
  - `lastActivity`: Date
- [ ] Define `ClientInfo` interface (name, version, title, description, etc.)
- [ ] Define `Capabilities` interface (sampling, roots, elicitation, etc.)
- [ ] Define `ProviderMode` type
- [ ] Add JSDoc comments explaining each field
- [ ] Export all types from `src/mcp/session/index.ts`

## Acceptance Criteria

- [ ] `SessionContext` interface matches design in evidence/session-based-architecture.md
- [ ] All fields have clear JSDoc documentation
- [ ] Types compile without errors
- [ ] Interfaces align with MCP specification (from evidence/mcp-sampling-spec.md)
- [ ] `ClientInfo` matches MCP initialize request format
- [ ] `Capabilities` includes sampling sub-capability (tools support)

## Constraints

**From IDEA.md**:
- Must support both STDIO and HTTP transports
- Detection must be automatic (no user configuration)

**Technical**:
- Must align with MCP 2025-11-25 specification
- TypeScript strict mode compatible

## Dependencies

**Requires**: None (foundation step)

**Blocks**: 
- Step 2 (SessionManager needs these types)
- Step 7 (Provider loading needs ProviderMode type)

## Evidence

**MCP Client Detection** (evidence/mcp-client-detection.md):
```typescript
interface SessionContext {
  sessionId: string;
  transport: 'stdio' | 'http';
  clientInfo: {
    name: string;
    version: string;
    // ... other fields
  } | null;
  capabilities: {
    sampling?: { tools?: {} };
    // ... other capabilities
  };
  samplingAvailable: boolean;
  providerMode: 'sampling' | 'direct' | 'none';
  connectedAt: Date;
  lastActivity: Date;
}
```

**MCP Specification** (evidence/mcp-sampling-spec.md):
- Client declares `sampling` capability during initialization
- Optional `tools` sub-capability indicates tool use support in sampling

## Estimated Effort

**4 hours**

- 1h: Review MCP spec and design document
- 2h: Define interfaces and types
- 1h: Documentation and validation

## Notes

- Keep types simple and focused
- Avoid premature optimization
- Ensure types are testable (no complex logic in types)
- Consider adding utility type guards (e.g., `isSamplingAvailable()`)

## Related Files

- `src/mcp/server.ts` - Will use SessionContext
- `src/ai/provider-loader.ts` - Will use ProviderMode
- Evidence files referenced above
