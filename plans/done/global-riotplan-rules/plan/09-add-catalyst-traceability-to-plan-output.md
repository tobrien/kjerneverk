# Step 09: Add catalyst traceability to plan output

## Phase
Phase 2: Riotplan Integration

## Objective
Ensure that when a plan is created with catalysts, the plan output clearly records which catalysts were used and how they influenced the plan. Users must be able to see that a catalyst was applied.

## Tasks

### 9.1 Add catalyst section to SUMMARY.md
When catalysts are applied, include a "Catalysts Applied" section in the generated SUMMARY.md:
```markdown
## Catalysts Applied
- @kjerneverk/catalyst-nodejs (v1.2.0) - Node.js development standards
- @kjerneverk/catalyst-kjerneverk (v1.0.0) - Kjerneverk project conventions
```

### 9.2 Add catalyst section to EXECUTION_PLAN.md
Include a section noting catalyst influence on the execution plan:
```markdown
## Catalyst Influence
The following catalysts shaped this plan:
- **@kjerneverk/catalyst-nodejs**: Added constraints for testing and documentation steps
- **@kjerneverk/catalyst-kjerneverk**: Added GitHub infrastructure requirements
```

### 9.3 Include catalysts in PROVENANCE.md
Extend the provenance tracking to show how catalyst content influenced the plan:
- Which catalyst constraints were incorporated
- Which output templates were included
- Which domain knowledge shaped the approach

### 9.4 Add catalyst info to STATUS.md
Include catalyst IDs in the status display so `riotplan_status` shows which catalysts are active for a plan.

### 9.5 Update riotplan_status output
When `riotplan_status` is called, include catalyst information in the response if catalysts are associated with the plan.

### 9.6 Write tests
- Test that SUMMARY.md includes catalyst section when catalysts are applied
- Test that EXECUTION_PLAN.md includes catalyst influence
- Test that plans without catalysts don't have catalyst sections
- Test that riotplan_status includes catalyst info

## Definition of Done
- [ ] SUMMARY.md, EXECUTION_PLAN.md, and PROVENANCE.md include catalyst traceability
- [ ] STATUS.md and riotplan_status show associated catalysts
- [ ] Plans without catalysts are unaffected
- [ ] Users can clearly see what catalysts influenced their plan
