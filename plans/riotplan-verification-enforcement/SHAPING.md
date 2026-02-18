# Shaping: [Name]

## Problem Statement

_What problem are we solving? What are we trying to achieve?_

## Approaches Considered

_Add approaches using riotplan_shaping_add_approach_

### Approach: Advisory Warnings Only

**Description**: Add verification checks that warn but never block. Show warnings when acceptance criteria are unchecked, evidence is missing, or artifacts can't be verified. Auto-generate retrospectives with failure warnings. Keep all verification non-blocking to maintain workflow flexibility.

**Tradeoffs**:
- Pros: No workflow disruption, easy to adopt, fast to implement, no escape hatches needed
- Pros: Users can ignore warnings if they know better
- Pros: Minimal performance impact
- Cons: Warnings can be ignored, won't prevent the problem we just experienced
- Cons: May create warning fatigue if too many warnings
- Cons: No enforcement means discipline is still required

**Assumptions**:
- Users will read and act on warnings
- Warnings are sufficient to change behavior
- The problem was lack of visibility, not lack of discipline


### Approach: Configurable Enforcement

**Description**: Add verification system with three strictness levels: 'advisory' (warn only), 'interactive' (prompt for confirmation), 'strict' (block unless --force flag). Default to 'interactive'. Add config file and environment variables for per-project/per-user preferences. Implement full verification suite: acceptance criteria checking, artifact verification, evidence requirements, automatic retrospectives.

**Tradeoffs**:
- Pros: Flexible - teams can choose their level of enforcement
- Pros: Prevents the problem while allowing overrides
- Pros: Can start advisory and gradually increase strictness
- Pros: Configuration allows per-project policies
- Cons: More complex to implement and maintain
- Cons: Configuration adds cognitive overhead
- Cons: Need to design good defaults that work for most users
- Cons: More code paths to test (3 modes)

**Assumptions**:
- Users want control over strictness
- Configuration is worth the complexity
- Interactive mode strikes the right balance
- Teams will configure policies rather than always using defaults


### Approach: Smart Verification with ML

**Description**: Use LLM to analyze step content, acceptance criteria, and reflection to determine if work is actually complete. LLM reads the step file, checks if mentioned files exist, reviews git commits since step started, and makes a judgment call. Provides confidence score and reasoning. Blocks completion if confidence is low unless overridden.

**Tradeoffs**:
- Pros: Can catch subtle incompleteness that rules can't
- Pros: Understands natural language acceptance criteria
- Pros: Can verify semantic completion, not just checklist items
- Pros: Gets smarter over time as models improve
- Cons: Requires LLM API access (cost, latency, privacy concerns)
- Cons: Non-deterministic - same input might give different results
- Cons: Hard to debug when verification fails incorrectly
- Cons: Overkill for simple verification needs
- Cons: Adds significant latency (2-5 seconds per verification)

**Assumptions**:
- LLM can accurately judge completion
- Users have API access configured
- Latency is acceptable
- Semantic verification is worth the complexity


## Feedback

_Feedback will be added here as you provide it_

### 2026-02-18T05:38:40.739Z

The "Advisory Warnings Only" approach is the safest and fastest to implement, but it won't actually prevent the problem we experienced - warnings can be ignored. It's a good Phase 1 but not a complete solution.

The "Smart Verification with ML" approach is interesting but feels like overkill. The problem we had was simple - a CLI command wasn't registered. We don't need AI to verify that, we need basic checks. The latency and non-determinism would be frustrating.

The "Configurable Enforcement" approach seems like the sweet spot. It solves the problem (can block incomplete work) while maintaining flexibility (can be configured or overridden). The interactive mode is key - prompt the user with verification results and let them decide.

## Evidence

_Evidence will be added here to support decision-making_

## Key Decisions

_Decisions will be tracked here_

**Selected Approach**: Configurable Enforcement

**Reasoning**: This approach solves the actual problem (prevents incomplete work from being marked complete) while maintaining flexibility through configuration and override flags. The interactive mode is the key insight - show users what's wrong and let them decide whether to proceed. This is better than pure warnings (which can be ignored) and better than pure blocking (which is too rigid). The three-level system (advisory/interactive/strict) allows teams to adopt gradually and choose their own balance of safety vs flexibility. The implementation complexity is manageable and the configuration overhead is justified by the value it provides.

**Selected At**: 2026-02-18T05:38:47.180Z

## Open Questions

- _What questions need answering?_

## Status

**Stage**: shaping
**Started**: 2026-02-18T05:38:15.156Z
**Next**: Select an approach and transition to 'built'
