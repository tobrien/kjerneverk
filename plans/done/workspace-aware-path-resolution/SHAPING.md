# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Minimal Integration

**Description**: Integrate CardiganTime with minimal changes to existing code. Add a simple walk-up function for tier 3, modify only server.ts to use new resolution logic. Keep existing resolveDirectory() helper mostly unchanged.

**Tradeoffs**:
- PRO: Minimal code changes, easier to review and test
- PRO: Lower risk of breaking existing functionality
- PRO: Faster to implement
- CON: May not fully leverage CardiganTime's capabilities
- CON: Could result in some code duplication between CardiganTime and custom walk-up
- CON: Harder to extend with additional config options later

**Assumptions**:
- CardiganTime's environment variable support works as expected
- Existing code structure is sufficient for basic integration
- Users won't need many additional config options initially


### Approach: Full CardiganTime Integration

**Description**: Deeply integrate CardiganTime throughout riotplan. Create a comprehensive config system with Zod schema, use CardiganTime for all config needs (not just planDirectory). Refactor existing code to use CardiganTime patterns consistently.

**Tradeoffs**:
- PRO: Establishes strong foundation for future config needs
- PRO: Consistent config handling across all of riotplan
- PRO: Leverages all of CardiganTime's features (validation, error handling, etc.)
- PRO: Better for long-term maintainability
- CON: Larger scope, more code changes
- CON: Takes longer to implement
- CON: Higher risk of introducing bugs
- CON: May be over-engineering for current needs

**Assumptions**:
- We'll need more config options in the future
- CardiganTime's patterns fit well with riotplan's architecture
- The upfront investment is worth the long-term benefits


### Approach: Hybrid Approach

**Description**: Use CardiganTime for config file discovery and validation (tiers 1-2), implement a clean, well-tested walk-up module for tier 3. Create a new config/ module that encapsulates all resolution logic. Update server.ts and tools to use the new module.

**Tradeoffs**:
- PRO: Balanced scope - not too minimal, not too comprehensive
- PRO: Clean separation between CardiganTime config and custom walk-up logic
- PRO: Easy to test each tier independently
- PRO: Extensible for future config needs without major refactoring
- PRO: Keeps custom code focused on riotplan-specific needs
- CON: Requires creating new module structure
- CON: More files to maintain than minimal approach
- CON: Need to design good abstraction between tiers

**Assumptions**:
- A dedicated config module will be useful for other features
- The walk-up logic is complex enough to warrant its own module
- Clear separation of concerns is worth the extra structure


## Feedback

_Feedback will be added here as you provide it_

### 2026-01-31T00:30:24.764Z

User selected this approach: 'Full CardiganTime Integration - it's already integrated, but dial it up. I want to use it to its fullest extent.' This means we should leverage all of CardiganTime's features: hierarchical discovery, multi-format support, validation, error handling, MCP integration, and establish the pattern for all future config needs in riotplan.

### 2026-01-31T00:30:33.970Z

Implementation details: 1) Create comprehensive Zod schema for all riotplan config (planDirectory, defaultProvider, defaultModel, etc.), 2) Use CardiganTime's hierarchical discovery for tiers 1-2, 3) Implement custom walk-up as tier 3 fallback (outside CardiganTime), 4) Integrate CardiganTime's MCP support for config management, 5) Add --init-config and --check-config CLI commands, 6) Use CardiganTime's validation and error handling throughout

### 2026-01-31T00:30:35.645Z

Config schema should include: planDirectory (string, default './plans'), defaultProvider (enum: anthropic|openai|gemini), defaultModel (string), templateDirectory (string), and any other settings currently scattered through riotplan. This becomes the single source of truth for all configuration.

### 2026-01-31T00:30:37.332Z

Module structure: Create src/config/ directory with: schema.ts (Zod schema), loader.ts (CardiganTime integration), resolver.ts (plan directory resolution with walk-up), index.ts (public API). This encapsulates all config logic and makes it easy to use throughout riotplan.

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Full CardiganTime Integration

**Reasoning**: User wants to use CardiganTime to its fullest extent. This approach establishes a strong foundation for all future config needs, leverages all of CardiganTime's capabilities (env vars, hierarchical discovery, multi-format support, validation, MCP integration), and creates consistent config handling patterns throughout riotplan. The upfront investment is worth it for long-term maintainability and extensibility.

**Selected At**: 2026-01-31T00:30:26.527Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-01-31T00:28:05.566Z
**Next**: Select an approach and transition to 'built'
