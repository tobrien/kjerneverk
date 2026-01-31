# Start Using RiotPlan

## Overview

I've built RiotPlan, a framework for managing long-lived AI workflows. The problem is: I'm not actually using it. Instead, I keep manually pointing AI agents at the guide files (`/riotplan/guide/create.md` and `/riotplan/guide/execute.md`) and creating plan structures by hand.

## The Problem

- **Current state**: RiotPlan exists as a package with CLI commands, but I'm not using it in my workflow
- **Pain point**: Manual plan creation and management is tedious and error-prone
- **Opportunity**: RiotPlan could streamline my workflow if I actually integrated it

## Goals

1. Decide on the best integration approach (MCP server vs CLI)
2. Set up RiotPlan in my actual workflow
3. Create a simple, repeatable process for starting new plans
4. Test the workflow with a real plan

## What This Plan Does NOT Do

- This is not about building new RiotPlan features
- This is not about documenting RiotPlan for others
- This is about getting ME to actually use the tool I built

## Success Criteria

1. I can create a new plan without manually creating directory structures
2. I can check plan status without manually reading STATUS.md
3. I have a clear decision on MCP vs CLI approach
4. I've successfully created and executed at least one plan using the chosen approach
