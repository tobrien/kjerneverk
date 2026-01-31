# Idea: kjerneverk-messaging-standards

## Core Concept

Establish a standard way to discuss what Kjerneverk is and create standards for generating text about the project

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Core concept: Kjerneverk defines common formats and approaches for working with generative AI - Prompts, Plans, and Documents as structured 'constructs' with tools and infrastructure around them
- RiotPrompt: Standardizes prompt structure (persona, instructions, context). Originally for single-shot prompts, now extended for agentic interactions and execution. Goal: library to prepare prompts for any model
- RiotPlan: For complex, thoughtful planning beyond simple task lists. Supports analysis, elaboration, research, and thinking before execution. Designed for complicated work like migrations and integrations. Now supports MCP tools for plan creation
- RiotDoc: Standard for documents that captures not just output but the conversation, research, and evidence. Supports idea → outline → draft → revision workflow with full process tracking
- Key messaging problem: Every time AI generates copy about Kjerneverk, there's no single source of truth. Need one canonical document that captures the vision
- Important distinction: This is NOT about 'AI development' - that framing is wrong. It's about structured formats and tools for working with generative AI
- Needed deliverables: 1) 30-second elevator pitch, 2) 1-2 page overview document, 3) Glossary of terms, 4) Tone and voice guidelines, 5) Target audience definitions
- Evidence shows inconsistent messaging: monorepo README says 'AI-assisted software development', GitHub Pages says 'AI-assisted development workflows', but neither captures the core 'structured formats and tools for generative AI work' concept
- CORE INSIGHT: 'The thing is bigger than just the thing' - Prompts/Plans/Docs are not just artifacts, they are processes, lifecycles, and ways of thinking. This is the fundamental concept that must be communicated
- Prompts have 'superposition of states' - they evolve, have revisions, are subjects of experimentation. Need structure and meaning independent of any specific LLM
- Key differentiator: Write once, translate between LLMs (OpenAI uses Markdown sections, Anthropic uses XML tags, Google has rich section collection). RiotPrompt provides the abstraction layer
- Plans are not just storage format - they include standard lifecycle for creation, standard process/prompts in MCP that know how to access plan resources and invoke tools correctly
- Documents capture not just the output but the construction of meaning - sources, references, audience analysis, motivations. Like academic papers show the recipe/ingredients, all documents should track their creation process
- Central thesis: To create things we can truly call our own with LLMs, we need the ability to affect and manage complex context/ontology. This is what's missing from Word processors and Microsoft Project
- This is 'metacognitive programming' - prompting about prompting, self-reflection in agentic workflows. Not afraid to use complex terms like 'ontology' and 'structure' because these ARE complicated concepts
- Key message: 'It's about control' - taking back control over what we send to models. LLMs generate documents that 'hit the mark, but not quite.' Kjerneverk lets you drive them towards what YOU want
- Goal: Make outputs truly our own, not just copied from patterns of the world. Good writers think about process - these tools help everyone write/plan/prompt better by making the process explicit
- CRITICAL DELIVERABLE: Need documents that outline the deep philosophical meaning of Kjerneverk. User's narratives are essentially blog post material that captures this philosophy
- Target audience: Technical users closer to programming than not, using generative AI. Available as library, CLI, MCP server, and eventually standalone applications
- Tone: Pragmatic, opinionated, process-focused, NOT willing to oversimplify. Transparent about complexity. This isn't a company - it's a passion project to redefine how we think about prompts, plans, and documents

## Constraints

- _Add constraints..._
- Must avoid framing Kjerneverk as 'AI development tools' - that's not the right positioning
- Needs to work for multiple audiences: users creating prompts/plans/docs, developers integrating the libraries, and AI assistants generating content
- Must be concise enough for website use (can't be a 10-minute explanation) but comprehensive enough to capture the vision
- Timing matters - more people will be paying attention to this going forward, so messaging needs to be ready
- Must NOT oversimplify - embrace complexity and use proper technical terms (ontology, structure, metacognitive). The audience can handle it
- Must emphasize 'the thing is bigger than just the thing' - process, lifecycle, ways of thinking, not just artifacts
- Core message must be about control and ownership - making LLM outputs truly yours, not just pattern-matched from training data

## Questions

- _Add questions..._
- What's the best 30-second elevator pitch for Kjerneverk that captures the 'structured formats for generative AI work' concept?
- How do we explain the relationship between the three core constructs (Prompt, Plan, Doc) without it feeling like three separate projects?
- What's the right tone? Technical but accessible? Opinionated about how to work with AI? Pragmatic and tool-focused?
- Should we emphasize the evolution story (from single-shot prompts to agentic work) or focus on current capabilities?
- Should we create a 'Philosophy' document as a standalone piece that can be referenced from all other documentation?
- How do we balance 'not oversimplifying' with making the concepts accessible to newcomers? Or is the barrier to entry intentional?
- Should the user's voice narratives be turned into blog posts or manifesto-style documents? They contain the authentic voice and philosophy

## Evidence

_Attach relevant documents, images, or files_
- [Current monorepo README - describes Kjerneverk as 'AI-assisted software development' which user says is wrong framing](/Users/tobrien/gitw/kjerneverk/README.md)
- [Current GitHub Pages README - uses 'AI-assisted development workflows' which doesn't capture the 'structured formats' concept](/Users/tobrien/gitw/kjerneverk/kjerneverk.github.io/public/README.md)
- [RiotPrompt README - good example of package-level messaging but lacks connection to overall Kjerneverk vision](/Users/tobrien/gitw/kjerneverk/riotprompt/README.md)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-30T15:15:11.585Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
