# Narrative: User answering questions about catalyst identity, distribution, and usage experience

**Date**: 2026-02-08T17:06:00.652Z
**Source**: voice
**Speaker**: user

---

User working through catalyst identity and distribution:

INCOMPATIBILITY: Punt for now. Problem for later.

CATALYST IDENTITY:
- A catalyst is a directory with stuff in it
- Could have a catalyst.yml and folders for each facet
- Would be open to a file format at some point
- For now: directory-based

DISTRIBUTION:
- Distribute as an NPM dependency
- Publish catalyst to NPMJS
- Depend on it locally via npm link for development
- A project has the catalyst, you import it as an NPM dependency

USAGE EXPERIENCE:
- When using RiotPlan to create a plan, the system consults the catalyst
- The catalyst impacts the plan generation - constraints, output templates, domain knowledge all flow into the plan
- The plan summary and execution plan should STATE which catalysts were used
- User should be able to see that a catalyst was applied - transparency/traceability
- Generator would definitely use constraints, output templates, domain knowledge from catalysts
- Questions from catalysts would shape the exploration/shaping phases
