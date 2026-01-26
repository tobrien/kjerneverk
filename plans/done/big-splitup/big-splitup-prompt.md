Ok so this is going to be a big tasks, but I think that RiotPrompt has reached a level of complexity that probably deserves a big of a split up strategy.   I think there are some libraries in this codebase that might be useful outside of Riotprompt itself, maybe the agentic aspects of this project could be best modeled as a separate project.

Can you do me a favor and create a structure that I've been using in a number of projects, that structure consists of an original "prompt-of-prompts" and that is this file that you are processing now.

What I want you to do is create a plan directory in this directory /Users/tobrien/gitw/kjerneverk/prompts/big-splitup and the plan consists of a sequence of numbered files like 01-STEP1.md - these files contain the prompts that will need to be executed in sequence, and I'd look for you to review the tasks I'm asking you to do here and come up with a good, detailed plan.

Then I want you to create a file "SUMMARY.md" in /Users/tobrien/gitw/kjerneverk/prompts/big-splitup that summarizes the approach.

I also want two more files "EXECUTION_PLAN.md" and "STATUS.md" - the EXECUTION_PLAN.md will contain the strategy that will be used to implement this change and the STATUS.md is a bit of a state file that will be used if the execution plan is interrupt.

So, to summarize how I want to use this:

1. Create the big-splitup plan
2. Revise plan based on my feedback
3. Execute the plan in the execution plan (only when I trigger it)