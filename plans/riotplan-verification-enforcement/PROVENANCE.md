# Plan Provenance

This document traces how the generated plan connects to the idea artifacts.

## How This Plan Was Generated

- **Generated**: 2026-02-18T05:42:20.202Z
- **Constraints**: 3
- **Evidence files**: 0
- **Selected approach**: Configurable Enforcement
- **History events**: 18

## Artifact Analysis

### Constraints

The model analyzed 3 constraint(s):

| # | Constraint | Addressed By | Model's Understanding |
|---|-----------|-------------|----------------------|

| 1 | Must not break existing workflows - verification should be o... | Step 1, Step 3, Step 4, Step 6 | Current step completion flow (`riotplan step complete N`) works without any veri... |

| 2 | Verification checks should be fast - don't slow down the ste... | Step 2 | Step completion is a frequent developer operation. Adding slow verification chec... |

| 3 | Should work with both directory-based and SQLite .plan forma... | Step 3, Step 5 | RiotPlan supports dual storage formats via @kjerneverk/riotplan-format. Verifica... |


### Evidence Used

The model analyzed 4 evidence file(s):

| File | Key Findings | Referenced In |
|------|-------------|--------------|

| src/verification/types.ts | Comprehensive verification type system already exists with interfaces for AcceptanceCriterion, StepC... | Step 2, Step 5 |

| src/cli/commands/step.ts | Current completeStep() call is simple - just sets status to 'completed' and timestamp. No validation... | Step 4, Step 6 |

| src/config/schema.ts | Existing Zod-based configuration system with environment variable support. Clean extension point for... | Step 1, Step 3 |

| src/steps/operations.ts | Core completeStep() function is in steps/operations.ts. This is where verification logic needs to in... | Step 3 |


### Selected Approach

- **Approach**: Configurable Enforcement with three strictness levels
- **Commitments**: Implement advisory (warn only), interactive (prompt for confirmation), and strict (block unless --force) modes. Default to interactive. Add configuration file and environment variable support.
- **Implementation Strategy**: Extend existing configuration system, enhance completeStep() with verification hooks, add enforcement logic with bypass mechanisms, implement automatic retrospective generation.


### Risks Identified

1. Configuration complexity might confuse users if not well-documented
2. Interactive prompts could break scripted workflows if not handled properly
3. Performance impact of acceptance criteria parsing on large plans
4. False positives in verification logic causing user frustration

## Coverage Warnings

The following gaps were detected during validation:

- Selected approach "Configurable Enforcement" not mentioned in plan summary or approach

## Token Budget

- **Estimated tokens**: 3080
- **Budget exceeded**: No

## Step Provenance

How each step connects to the idea artifacts:


### Step 1: Extend Configuration Schema for Verification Settings


**Rationale**: Configuration is the foundation for making verification opt-in and configurable per the selected approach


**Addresses constraints**: Must not break existing workflows - verification should be opt-in or have escape hatches for edge cases


**Uses evidence**: src/config/schema.ts



### Step 2: Create Verification Engine with Enforcement Logic


**Rationale**: Centralized engine enables fast, consistent verification across all completion flows


**Addresses constraints**: Verification checks should be fast - don't slow down the step completion flow significantly


**Uses evidence**: src/verification/types.ts



### Step 3: Enhance Step Completion with Verification Hooks


**Rationale**: Integration point for verification that preserves existing API while adding safety checks


**Addresses constraints**: Must not break existing workflows - verification should be opt-in or have escape hatches for edge cases, Should work with both directory-based and SQLite .plan formats


**Uses evidence**: src/steps/operations.ts, src/config/schema.ts



### Step 4: Enhance CLI Step Command with Interactive Verification


**Rationale**: CLI integration provides the user interface for interactive verification and force bypasses


**Addresses constraints**: Must not break existing workflows - verification should be opt-in or have escape hatches for edge cases


**Uses evidence**: src/cli/commands/step.ts



### Step 5: Implement Artifact Verification and Evidence Requirements


**Rationale**: Advanced verification features provide comprehensive completion validation while remaining optional


**Addresses constraints**: Should work with both directory-based and SQLite .plan formats


**Uses evidence**: src/verification/types.ts



### Step 6: Add Documentation and Migration Guide


**Rationale**: Documentation and migration support are essential for user adoption of the new verification system


**Addresses constraints**: Must not break existing workflows - verification should be opt-in or have escape hatches for edge cases


**Uses evidence**: src/cli/commands/step.ts

