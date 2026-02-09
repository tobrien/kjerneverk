# Step 07: Add Retrospective Referencing to Idea Exploration Flow

## Objective

Enable users to reference retrospectives from completed plans during idea exploration, so past learning informs future plan creation. This closes the outer learning loop.

## Background

The user's workflow: during idea exploration, they might say "what I'm doing here is related to what we did in plan X — consider that plan's retrospective." The retrospective should be read into context with framing about WHY it's being included — not just dumped as raw text.

This is NOT through the evidence system. It's a direct context injection with wrapping that explains relevance.

## Tasks

### 7.1 Create retrospective reference reader

Create `src/retrospective/reference.ts`:
- Function `loadRetrospectiveAsContext(retrospectivePath: string, reason: string): string`
- Reads the retrospective.md file
- Wraps it in context framing:
  ```
  ## Referenced Retrospective
  
  **Source**: [path to plan]
  **Why this is relevant**: [user's reason]
  
  ---
  
  [retrospective content]
  
  ---
  
  Consider the lessons above when exploring this new idea. What patterns from that experience apply here? What mistakes should be avoided?
  ```
- Returns the wrapped content for inclusion in context

### 7.2 Update explore_idea prompt

In the explore_idea workflow (the cursor command / prompt):
- Add guidance: "If the user references another plan's retrospective, read it using the retrospective reference reader and include it in the idea exploration context"
- The referenced retrospective should inform:
  - Questions that get asked during exploration
  - Constraints that get surfaced
  - Risks that get identified

### 7.3 Consider: should riotplan_build also accept retrospective references?

When building a plan from artifacts, if a retrospective was referenced during idea exploration:
- Should it be captured as evidence? (User said NO to evidence system)
- Should it be included in the build context? (Probably yes — if it influenced the idea, it should influence the plan)
- Recommendation: Include referenced retrospectives in the build context when they were noted during idea exploration

### 7.4 Add tests

- Test retrospective loading and wrapping
- Test graceful handling of missing retrospective files
- Test that the wrapping includes the reason for inclusion

## Acceptance Criteria

- [ ] Retrospective files can be loaded with contextual wrapping
- [ ] Wrapping includes source path and reason for relevance
- [ ] explore_idea flow supports retrospective references
- [ ] Referenced retrospectives inform question generation during exploration
- [ ] Tests pass

## Key Files

- `src/retrospective/reference.ts` (new)
- Explore idea prompt/command (modified)

## Dependencies

- Step 05 (retrospective.md must be a known format)

## Notes

This is the outer learning loop. The quality of this feature depends entirely on how well the retrospective content (from Step 04's prompt) captures actionable lessons. If the retrospective is vague, referencing it in future plans won't help. This step validates that the whole chain works end-to-end.
