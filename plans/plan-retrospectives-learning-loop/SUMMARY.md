# Plan Retrospectives Learning Loop — Summary

## Overview

Add a two-level reflection system to RiotPlan that captures learning during and after plan execution. Step-level reflections create an inter-step communication channel (later steps learn from earlier ones). A plan-level retrospective synthesizes all learning into creative, high-value feedback that can inform future plan creation.

## Philosophy

Retrospectives are not summaries. SUMMARY.md and STATUS.md already tell you what happened. The retrospective tells you what you should have done differently, what patterns you missed, and what creative insights emerge from genuine model reasoning about the execution experience.

This feature is built on the conviction that self-reflection by capable reasoning models is where LLM collaboration becomes transformative — when the model tells you something you didn't know about your own process.

## Approach: Layered Reflection

Chosen over an integrated approach that would embed reflections in STATUS.md. The layered approach:
- Keeps STATUS.md focused on execution tracking
- Stores step reflections as standalone freeform files in `reflections/`
- Generates retrospective.md as a plan-level document at completion
- Enables cross-plan learning through explicit retrospective references

## Key Design Decisions

1. **Two-level reflection**: Step reflections (granular, during execution) + overall retrospective (synthesized, at completion)
2. **Freeform prose**: No fixed schema — reflections must be genuine analysis, not template filling
3. **Inter-step learning**: Prior step reflections are read by the agent before executing subsequent steps
4. **Highest-tier model**: Retrospective generation signals the need for the most capable model available
5. **Explicit referencing**: Future plans can reference past retrospectives by pointing at them during idea exploration
6. **No auto-indexing**: Retrospective referencing is manual/explicit — no plan repository or automatic detection

## Deliverables

1. `riotplan_step_reflect` MCP tool — per-step reflection after completion
2. `reflections/` directory structure — freeform reflection files
3. STATUS.md reflection indicators — visual markers for which steps have reflections
4. Updated execution prompts — mandating reflection and reading prior reflections
5. Retrospective generation prompt — the crown jewel, designed for creative analysis
6. `riotplan_generate_retrospective` MCP tool — generates retrospective.md
7. Plan completion workflow integration — automatic retrospective trigger
8. Retrospective referencing in idea exploration — cross-plan learning
9. Blog post: "The Natural Model Tier Map"
10. Blog post: "Self-Reflection in LLM Collaboration"

## Out of Scope

- YAML front matter standardization (separate concern)
- Multi-model execution system (separate plan)
- Automatic plan indexing/detection
- Retrospective repository
