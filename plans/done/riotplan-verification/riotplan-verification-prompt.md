# Plan Verification and Alignment for RiotPlan

## Overview

This plan addresses a critical gap in RiotPlan: verifying that plans fully incorporate their analysis requirements, and that execution completes everything the plan specifies. Without verification, plans can drift from their intent and execution can be incomplete.

## The Problem

Without verification:
1. Plans may silently miss requirements from the analysis
2. Execution may skip steps or implement them incompletely
3. The "I forgot" problem - AI gets halfway through and misses things
4. No systematic way to confirm alignment at any stage

## Source Notes

From voice transcript (January 14, 2026):

> "I think I missed a step. I think the step is if I'm creating an analysis and then I'm creating a plan for the analysis, I never stopped to make sure that the plan contained everything that the analysis was recommending."

> "The analysis in some ways should be able to allow you to craft questions that verify that the plan meets the requirements outlined by the analysis."

> "I created a plan and then I reviewed the plan... it got halfway through the plan and I said, wait, you didn't do any of this. Why didn't you do this? And it said, Oh, sorry, I forgot."

## Goals

1. **Analysis → Plan Verification**: Confirm plan addresses all analysis requirements
2. **Plan → Execution Verification**: Confirm execution completed all plan steps
3. **Verification Criteria**: Machine-readable checkpoints from analysis
4. **Continuous Verification**: Checkpoints throughout the workflow

## What This Plan Does NOT Do

- Does not enforce verification (optional workflow enhancement)
- Does not change existing plan structures (additive)
- Does not block execution (warnings, not errors)

## Plan Structure

1. **Phase 1 - Foundation** (Steps 01-02): Verification types and criteria format
2. **Phase 2 - Analysis Verification** (Steps 03-04): Verify plan covers analysis
3. **Phase 3 - Execution Verification** (Steps 05-06): Verify execution is complete
4. **Phase 4 - Integration** (Steps 07-08): CLI commands and documentation

## Success Criteria

1. `riotplan verify --analysis` shows coverage of analysis requirements
2. `riotplan verify --execution` shows completion of plan steps
3. Verification criteria can be extracted from analysis
4. Clear reporting of gaps and issues

## Dependencies

- Requires Plan 01 (Interactive Creation) for analysis directory structure
