# Prompt: Add Verification and Enforcement to RiotPlan

## Context

RiotPlan currently trusts executing agents to accurately report completion without verification. This led to a plan being marked as "completed" when critical work was missing. The `riotplan-http-mcp` plan's Step 5 reflection claimed "Added CLI command 'riotplan migrate'" but the command was never actually registered in the CLI.

## The Problem

**RiotPlan has verification mechanisms but they're not enforced:**

1. **Reflections are self-reported** - No verification that claimed work actually happened
2. **Acceptance criteria exist but aren't checked** - Step files have acceptance criteria but `riotplan_step_complete` doesn't verify them
3. **Retrospective generation is manual** - `riotplan_generate_retrospective` exists but requires manual invocation
4. **No artifact verification** - No checking that claimed files/changes actually exist
5. **No evidence requirement** - Reflections can make claims without proof

## Your Task

Design and implement a verification and enforcement system for RiotPlan that prevents incomplete work from being marked as complete while maintaining workflow flexibility.

## Requirements

### 1. Acceptance Criteria Verification

**Goal**: Verify acceptance criteria are met before allowing step completion.

**Questions to answer:**
- Should verification be automatic (blocks `step_complete`) or advisory (warns but allows)?
- How to verify programmatically? Parse markdown checkboxes? Require structured format?
- What's the escape hatch for edge cases where criteria can't be automatically verified?

**Suggested approach:**
- Parse acceptance criteria from step files (look for `## Acceptance Criteria` section)
- Check if checkboxes are marked `[x]` vs `[ ]`
- Add `--skip-verification` flag for override cases
- Warn if criteria are unchecked but allow completion with explicit confirmation

### 2. Automatic Retrospective Generation

**Goal**: Ensure retrospectives are generated when plans complete.

**Questions to answer:**
- Should this be automatic when transitioning to 'completed' stage?
- Should it block completion if retrospective generation fails?
- How to handle plans without AI provider configured?

**Suggested approach:**
- Hook into `riotplan_transition` when stage becomes 'completed'
- Automatically call `riotplan_generate_retrospective`
- Make it advisory - warn if it fails but don't block
- Add configuration option to disable if needed

### 3. Artifact Verification

**Goal**: Verify that claimed artifacts actually exist.

**Questions to answer:**
- What artifacts should be verified? Git commits? File existence? Test results?
- How to specify expected artifacts in step files?
- Should this be opt-in per step or global?

**Suggested approach:**
- Add `## Artifacts` section to step files with expected files/changes
- Add `riotplan_step_verify` tool that checks:
  - Files mentioned in "Files Changed" section exist
  - Git commits exist since step started (if in git repo)
  - Build/test commands succeed (if specified)
- Make verification opt-in via step file metadata

### 4. Evidence-Based Reflections

**Goal**: Require or encourage evidence links in reflections.

**Questions to answer:**
- Should evidence be required or just encouraged?
- What counts as evidence? Git commits, test outputs, screenshots, file diffs?
- How to structure evidence in reflection files?

**Suggested approach:**
- Update `riotplan_step_reflect` to accept optional evidence parameter
- Add `## Evidence` section to reflection files
- Provide helper to auto-capture: recent git commits, test output, file changes
- Make evidence encouraged but not required (warn if missing)

### 5. Pre-Completion Checklist

**Goal**: Show a checklist before marking step complete.

**Suggested approach:**
- Before `riotplan_step_complete`, show:
  ```
  ✓ Step file exists
  ✓ Reflection written
  ⚠ Acceptance criteria: 2/5 checked
  ⚠ No evidence attached to reflection
  ✓ Files changed: 3 files exist
  
  Proceed with completion? (y/n/review)
  ```
- Allow review to see details
- Allow override with confirmation

## Constraints

- **Must not break existing workflows** - Make verification opt-in or have escape hatches
- **Must be fast** - Don't slow down step completion significantly
- **Must work with both formats** - Support directory-based and SQLite .plan formats
- **Must be configurable** - Allow users to disable/customize verification levels

## Implementation Approach

### Phase 1: Advisory Warnings (Non-Blocking)
1. Add `riotplan_step_verify` tool that checks but doesn't block
2. Show warnings in `step_complete` output
3. Add automatic retrospective generation (with failure warning)
4. Gather feedback on what's useful

### Phase 2: Structured Verification (Opt-In)
1. Add `## Verification` section to step files with checks to run
2. Implement artifact checking (files, commits, tests)
3. Add evidence capture helpers
4. Make verification opt-in per step

### Phase 3: Enforcement (Configurable)
1. Add configuration for verification strictness levels
2. Implement blocking mode for teams that want it
3. Add pre-completion checklist UI
4. Document best practices

## Success Criteria

- [ ] Incomplete steps cannot be marked complete without explicit override
- [ ] Retrospectives are automatically generated when plans complete
- [ ] Agents are encouraged to provide evidence with reflections
- [ ] Acceptance criteria are checked before step completion
- [ ] System remains flexible for edge cases
- [ ] Performance impact is minimal (<100ms per verification)

## Files to Modify

- `src/mcp/tools/step.ts` - Add verification to `step_complete`
- `src/mcp/tools/reflect.ts` - Add evidence parameter
- `src/mcp/tools/transition.ts` - Add automatic retrospective generation
- `src/plan/validator.ts` - Extend validation to check acceptance criteria
- `src/verification/` - New module for verification logic
- `src/verification/checkers.ts` - Artifact checking implementations
- `src/verification/evidence.ts` - Evidence capture helpers

## Testing Strategy

1. Test with the `riotplan-http-mcp` plan - verify it would have caught the missing CLI registration
2. Test with various acceptance criteria formats
3. Test performance with large plans
4. Test with both directory and SQLite formats
5. Test escape hatches and overrides

## Documentation Needs

- Update `AGENTS.md` with verification best practices
- Document verification configuration options
- Add examples of good acceptance criteria
- Document evidence capture helpers
- Update MCP tool descriptions

## Questions for You

1. **Strictness level**: Should verification be advisory (warn), blocking (require override), or configurable?
2. **Acceptance criteria format**: Should we enforce a specific format or parse flexibly?
3. **Evidence requirement**: Required, encouraged, or optional?
4. **Retrospective timing**: Generate immediately on completion or allow delay?
5. **Performance budget**: What's acceptable latency for verification checks?

## Next Steps

1. Review this prompt and answer the questions
2. Decide on approach (advisory vs blocking vs configurable)
3. Create a plan with specific implementation steps
4. Implement Phase 1 (advisory warnings)
5. Test with real plans and gather feedback
6. Iterate based on usage

---

**Use this prompt to:**
- Start a conversation with an AI assistant about implementation
- Create a detailed RiotPlan plan from this idea
- Guide a team discussion about verification requirements
- Document the design decisions for future reference
