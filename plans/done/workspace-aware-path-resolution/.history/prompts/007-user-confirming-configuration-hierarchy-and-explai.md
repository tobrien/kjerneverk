# Narrative: User confirming configuration hierarchy and explaining CardiganTime Zod schema approach

**Date**: 2026-01-30T16:22:31.614Z
**Source**: voice
**Speaker**: user

---

User confirming CardiganTime and configuration hierarchy: "Yes, check to see if there's a more recent version of CardiganTime. And it does have the flexible config support that I mentioned because I did it. Look at the documentation. Just make sure that we use this as a way to sort of upgrade how we're using CardiganTime.

Based on everything you said, here's the revised hierarchy: RIOTPLAN_PLAN_DIRECTORY environment variable. Yeah. So that's like number one. If that's there, use that. And that's something we could set in the IDE or in the MCP server or something. And then the second thing is CardiganTime configuration. Right, that's where we search for it. If it doesn't exist, then we walk up, we look for a plan directory, and then we fall back to current directory ./plans. That works.

When someone does create a config file, what would the plan directory setting look like? Just a simple planDirectory, yes. That's what it would look like. And that's defined by CardiganTime. So in CardiganTime, you would create a Zod schema. And that Zod schema would have the definition of planDirectory."
