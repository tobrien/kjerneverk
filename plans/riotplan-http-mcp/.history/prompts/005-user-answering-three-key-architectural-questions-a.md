# Narrative: User answering three key architectural questions about storage topology, plan identity, and code location

**Date**: 2026-02-17T17:46:11.874Z
**Source**: typing
**Speaker**: user

---

Question 1 - One plan per file. Maybe one day this fronts a database with multiple plans, but for right now each plan is a separate .plan file. Question 2 - Plans need to be identified with a UUID, if this isn't in the plan already, integrate this. All major entities like Plans should have a UUID identifier. Question 3 - Put it in the same repo for now.
