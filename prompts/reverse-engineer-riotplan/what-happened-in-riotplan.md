# RiotPlan Process Documentation: Secure-RiotPrompt Case Study

## Overview

This document captures observations about the planning process used to create the `secure-riotprompt` plan. The goal is to reverse-engineer patterns that could inform the design of the RiotPlan framework.

## Plan Creation Context

- **Date**: 2026-01-13
- **Triggering Request**: Security review findings needed a structured implementation plan
- **Plan Complexity**: 17 steps across 5 phases
- **Estimated Duration**: 12-17 working days

## Observed Planning Patterns

### 1. Plan Structure

The plan follows a consistent directory structure:

```
secure-riotprompt/
├── secure-riotprompt-prompt.md   # Meta-prompt (original request/context)
├── SUMMARY.md                     # High-level overview and philosophy
├── EXECUTION_PLAN.md              # Phase/step organization and dependencies
├── STATUS.md                      # Current state tracking
└── plan/                          # Individual step files
    ├── 01-security-types.md
    ├── 02-security-testing.md
    ├── ...
    └── 17-release.md
```

### 2. Step File Structure

Each step file contains consistent sections:

1. **Objective**: One-sentence goal
2. **Background**: Context and vulnerability addressed
3. **Tasks**: Numbered sub-tasks with code examples
4. **Acceptance Criteria**: Checklist of completion requirements
5. **Testing**: Example test cases
6. **Files Changed**: List of affected files
7. **Notes**: Additional considerations

### 3. Dependency Management

Steps are organized to respect dependencies:
- Foundation steps (types, testing infrastructure) come first
- Critical fixes before lower-priority ones
- Documentation and release at the end

The EXECUTION_PLAN.md explicitly documents:
- Phase organization
- Prerequisites
- Quality gates
- Project creation order

### 4. State Tracking

STATUS.md tracks:
- Current overall status
- Step-by-step progress table
- Blockers and issues
- "What's Next" section for continuity

Status values observed:
- `PLANNING_COMPLETE` - Plan created, awaiting review
- `READY_FOR_EXECUTION` - Plan approved, execution can begin
- `IN_PROGRESS` - Steps being executed
- `COMPLETED` - All steps done

Individual step statuses:
- ⬜ Pending
- 🔄 In Progress
- ✅ Completed
- ❌ Failed
- ⏸️ Blocked

### 5. Human Review Points

The plan explicitly builds in review points:
- Plan creation → human review before execution
- Each step → approval before marking complete
- Phase boundaries → checkpoint for direction changes

This "checkpoint" pattern is critical for complex plans.

## Key Observations for RiotPlan Design

### 1. Plans Are Documentation

A plan is not just executable steps—it's a **living document** that:
- Captures context and reasoning
- Enables interruption and resumption
- Allows for human intervention and course correction
- Serves as audit trail

### 2. Separation of Concerns

Distinct files serve distinct purposes:
- `*-prompt.md`: Original intent/request
- `SUMMARY.md`: "What" and "why"
- `EXECUTION_PLAN.md`: "How" and "in what order"
- `STATUS.md`: "Where are we now"
- `plan/*.md`: Individual "do this" instructions

### 3. Metadata Is Essential

The STATUS.md contains rich metadata:
- Timestamps (started, last updated)
- Progress percentages implicitly via step counts
- Cross-references to affected packages
- Decision points that need human input

### 4. Code Examples in Steps

Each step includes **concrete code examples**:
- Proposed implementations
- Test cases
- Expected behavior

This makes steps self-contained and executable.

### 5. Acceptance Criteria Pattern

Every step has explicit acceptance criteria:
- Checkbox format for easy tracking
- Testable conditions
- Both technical (tests pass) and process (documentation updated)

## Inferred RiotPlan Types

Based on observation, a RiotPlan data model might include:

```typescript
interface Plan {
  id: string;
  name: string;
  created: Date;
  status: PlanStatus;
  phases: Phase[];
  metadata: PlanMetadata;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  order: number;
}

interface Step {
  id: string;
  name: string;
  file: string;  // Path to step markdown
  status: StepStatus;
  started?: Date;
  completed?: Date;
  blockers?: Blocker[];
  acceptanceCriteria: AcceptanceCriterion[];
}

interface AcceptanceCriterion {
  description: string;
  completed: boolean;
}

type PlanStatus = 
  | 'PLANNING'
  | 'PLANNING_COMPLETE'
  | 'READY_FOR_EXECUTION'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'ABANDONED';

type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked';
```

## Process Flow Observed

```
1. Receive complex task
   ↓
2. Analyze and decompose into phases
   ↓
3. Create step files with detailed instructions
   ↓
4. Create SUMMARY.md with high-level view
   ↓
5. Create EXECUTION_PLAN.md with dependencies
   ↓
6. Create STATUS.md initialized to PLANNING_COMPLETE
   ↓
7. Human review
   ↓
8. [If approved] Execute steps in order
   ↓
9. Update STATUS.md after each step
   ↓
10. Handle interruptions via STATUS.md
```

## Planning Heuristics Used

1. **Group by concern**: Security types → testing → critical fixes → docs
2. **Dependency ordering**: Foundation before features
3. **Parallel-safe batching**: Independent steps in same phase
4. **Checkpoints at phase boundaries**: Natural review points
5. **Conservative estimation**: Allow buffer time
6. **Explicit prerequisites**: Don't assume anything

## Anti-Patterns Avoided

1. **Monolithic plans**: Breaking into small, testable steps
2. **Hidden dependencies**: Making all dependencies explicit
3. **Vague acceptance criteria**: Every step has testable outcomes
4. **Missing context**: Each step file is self-contained
5. **Implicit state**: STATUS.md tracks everything explicitly

## Research Conducted During Planning

The planning process included external research:
- Similar tools (LangChain, LlamaIndex) and their security issues
- OWASP LLM Top 10 guidance
- Industry best practices for AI agent security

This research informed the threat model and prioritization.

## Questions for RiotPlan Design

Based on this case study:

1. **Parsing**: How should STATUS.md be parsed/updated programmatically?
2. **Step files**: Should they be markdown or a more structured format?
3. **Dependencies**: How to express complex dependency graphs?
4. **Parallelism**: How to indicate steps that can run in parallel?
5. **Versioning**: How to handle plan modifications during execution?
6. **Audit trail**: How to track who approved what and when?

## Next Steps for RiotPlan

1. Formalize the plan schema based on observed patterns
2. Create parsers for STATUS.md and step files
3. Implement state machine for plan execution
4. Build CLI commands for plan management
5. Add support for plan templates

---

*This document will be updated as more plans are created and executed.*

