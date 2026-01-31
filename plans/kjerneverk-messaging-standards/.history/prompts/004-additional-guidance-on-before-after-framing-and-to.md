# Narrative: Additional guidance on before/after framing and tool independence

**Date**: 2026-01-31T03:47:48.977Z
**Source**: voice
**Speaker**: user

---

For each of the projects, RiotPlan, RiotPrompt, RiotDoc, talk about a little bit of a before and after. Without RiotPlan, you're usually depending on the tools to come up with plans, and those plans are very inadequate. Some people have spent some time on planning - Beads is something from Steve Yegge, look that up before you write about it. But what I'm trying to do here is not just create another plan format, but a way for you to execute it that is - and again, this is one of the core concepts - independent of whatever tool you're going to ultimately use.

Call this out as one of the motivators for this project. We're too often getting distracted by the tools we use and not paying attention to the process. And as these models get better, it's starting to not matter which specific model you're using, or which tool you're using it in.

I've tried to design all of these tools so that they can be used by any model or no model at all. I mean, yes, some of the features we have are going to rely on thinking models. But I've tried to design RiotDoc, RiotPlan, and RiotPrompt so that you can use them from the command line and maybe throw it an OpenAI API key environment variable or an Anthropic Claude environment variable and make use of some of the agentic generation of content without having to do it from VS Code or your IDE. I think there's a lot of users out there who will do that.

I've also turned around and created MCP resources, tools, and prompts that'll work with each other and then literally use whatever model you've attached to that session. And then lastly, I am starting to think about ways to wrap these tools in more user-friendly ways like OS X apps.
