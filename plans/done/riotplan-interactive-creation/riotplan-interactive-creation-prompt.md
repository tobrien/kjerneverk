# Interactive Plan Creation Workflow for RiotPlan

## Overview

RiotPlan currently has `riotplan init` which creates a bare plan structure, but real-world plan creation is more nuanced. This plan adds an interactive `riotplan create` workflow that guides users through analysis-first or direct-plan creation modes.

## The Problem

When creating a plan, there are two distinct scenarios:

1. **Quick Plans**: The task is clear enough to jump directly to plan generation
2. **Complex Plans**: The task needs requirements elaboration before planning

Currently, users must manually decide and manage this workflow. The tool should guide them.

## Source Notes

From voice transcript (January 14, 2026):

> "When I hit enter, I think at that point the sort of interactive process of creating a plan should ask, hey, do you want analysis to create a plan for a possible plan so that you can influence the direction of what the plan would be, or are you comfortable just generating the plans based on that prompt?"

> "When you elaborate, you're providing feedback to the analysis. When you create a plan, you're providing reviews for the plan."

> "The initial prompt for the plan is where you give it the parameters for what you want the plan to do. And as you type that, it also would be good to save it so that you can go recover."

## Goals

1. **Interactive Creation**: `riotplan create <name>` guides users through plan creation
2. **Mode Selection**: Ask whether to analyze first or generate directly
3. **Prompt Preservation**: Save all inputs for recovery and audit
4. **Clear Terminology**: "Elaborate" for analysis feedback, "Amend" for plan feedback

## What This Plan Does NOT Do

- Does not change `riotplan init` (that remains for programmatic/minimal use)
- Does not require interactive mode (can be bypassed with flags)
- Does not break existing plan structures

## Plan Structure

1. **Phase 1 - Foundation** (Steps 01-02): CLI infrastructure and prompt storage
2. **Phase 2 - Analysis Mode** (Steps 03-04): Analysis directory and elaborate command
3. **Phase 3 - Plan Mode** (Steps 05-06): Plan generation and amend command
4. **Phase 4 - Polish** (Steps 07-08): Help, documentation, and integration

## Success Criteria

1. `riotplan create my-feature` prompts for description, then asks analysis vs direct
2. All prompts saved to plan directory for recovery
3. `riotplan elaborate` adds feedback to analysis phase
4. `riotplan amend` adds feedback to plan phase
5. Non-interactive mode available via flags

## Review Before Execution

This plan is designed for human review. Each step should be reviewed, potentially modified, and approved before execution.
