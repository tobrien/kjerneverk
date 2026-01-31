# Idea: project-voice-tone

## Core Concept

We have voice and tone as defined as document properties, but we also need to have voice and tone defined at a project level as well. And that would be through the configuration.

## Why This Matters

_Why pursue this idea?_

## Initial Thoughts

- _Add your thoughts..._
- Plans must be created in /Users/tobrien/gitw/kjerneverk/plans directory, not /Users/tobrien/plans
- Voice and tone should be universal context objects, not per-document configuration. Need to support multiple voices/tones per user (personal vs corporate).
- Need ability to consume existing documents and learn/infer tone and voice from them. This will require interesting prompts for analysis.
- Voice/tone should be modelable - able to turn into system prompts or guide content creation. Should be usable when creating new documents.
- Should support referencing historical documents to match their tone/voice. Example: "use same tone as last 4 versions of this document"
- Also need "rules" or "guidance" context (e.g., bank restrictions on terms). Need context for names of things and people. Should use same approach as Protocol and Chronology.
- Need to research formal definitions of voice vs tone in writing context. Are there industry standards or measures?
- Per-document voice/tone configuration should be similar to project-level configuration (same structure)
- Users need multiple voices/tones with identifiers. Example: "blog voice" (casual, sarcastic) vs "work voice" (formal). Documents reference by identifier.
- Use hierarchical configuration like RiotPlan - walk up directories to find .riot/ or riot.config. Hierarchical: home directory → project directory. Can inherit or override.
- Voice/tone could also be used for commit messages and release notes generation
- RESEARCH FINDINGS: Voice = consistent personality/style (who is writing). Tone = variable mood/attitude (what feeling conveyed). Voice stays constant, tone changes by context.
- RESEARCH FINDINGS: Four core dimensions for voice/tone: 1) Formal vs Casual, 2) Serious vs Funny, 3) Respectful vs Irreverent, 4) Enthusiastic vs Matter-of-Fact. Each is a spectrum.
- RESEARCH FINDINGS: Framework should include Description, Do (examples to use), Don't (examples to avoid) for each attribute. Style guides document these for consistency.
- RESEARCH FINDINGS: RiotPlan walk-up pattern: starts from current path, walks up directory tree checking for plans/ subdirectory, returns parent directory of first match. Stops at filesystem root. Uses caching.
- RESEARCH FINDINGS: Tone of voice has measurable impacts on brand perception (friendliness, trustworthiness, desirability). Casual, conversational, enthusiastic tones perform best in studies.
- CardiganTime handles hierarchical config discovery (Tier 1 & 2). RiotPlan adds Tier 3 walk-up for plans/ directory. Voice/tone should use similar pattern - CardiganTime for hierarchical config + walk-up for .riot/ or riot.config.
- Style is third component alongside voice and tone. Style captures writer quirks, sayings, personal rules (e.g., "never use synergy", "stuttering is not something to make fun of")
- Need to track: profanity level (can you use curse words?), reading level targeting (6th grade vs 12th grade). This is part of defining a persona/identity for the writer.
- Want to explore: AI reading lots of your work (e.g., 100 blog posts) and auto-generating voice/tone/style document. This should be a differentiating feature.
- Voice/tone/style documents can be substantial. Need to cite sources for industry measures in documentation - don't want to reinvent.
- RESEARCH FINDINGS: Style = broadest term, includes technical writing choices (word choice, sentence structure, length, rhetorical techniques). Voice = consistent pattern of stylistic choices (personal fingerprint). Tone = attitude toward subject/audience (varies by context).
- SOURCE CITATION: Nielsen Norman Group - Four Dimensions: https://www.nngroup.com/articles/tone-of-voice-dimensions/ (Formal/Casual, Serious/Funny, Respectful/Irreverent, Matter-of-Fact/Enthusiastic)
- RESEARCH FINDINGS: Flesch-Kincaid Grade Level measures reading level (sentence length + word complexity). Score 6-8 ideal for web/marketing. Score 7-8 for standard documents. Can target specific grade levels (6th, 12th, etc.)
- Style properties needed: profanity level (can use curse words?), reading level target (Flesch-Kincaid grade level), personal rules (never use X word, avoid Y topics), quirks/sayings

## Constraints

- _Add constraints..._
- Must support multiple voices/tones per user (personal vs corporate/shared)
- Must be able to learn/infer voice and tone from existing documents
- Voice/tone must be modelable as system prompts or content guidance
- Must support auto-generation of voice/tone/style from existing work (e.g., analyze 100 blog posts to derive style)

## Questions

- _Add questions..._
- What are industry standards or accepted definitions for "tone" vs "voice"? Need to research branding industry approaches.
- How should voice/tone context objects integrate with Protocol and Chronology approaches? What patterns exist there?
- Where are Protocol and Chronology projects? Need to understand their context object patterns to apply same approach.
- What are industry standards for tone vs voice definitions? Need to research branding/content strategy standards.
- What are the formal definitions of voice vs tone in writing? What is the difference?
- Are there industry standards or measures for voice and tone? What properties should be included?
- How does RiotPlan walk up directories to find configuration? Need to understand that pattern.
- What is the formal definition of "style" in writing? How does it differ from voice and tone?
- What are the exact sources/citations for the four dimensions (Formal/Casual, Serious/Funny, Respectful/Irreverent, Enthusiastic/Matter-of-Fact)? Need URLs for documentation.

## Evidence

_Attach relevant documents, images, or files_
- [Current per-document voice implementation - loads from document workspace voice/ directory](/Users/tobrien/gitw/kjerneverk/riotdoc/src/voice/loader.ts)
- [Current voice prompt builder - converts voice config to prompt format](/Users/tobrien/gitw/kjerneverk/riotdoc/src/voice/prompt-builder.ts)
- [RiotPlan walk-up implementation - walks up directories to find config. Uses CardiganTime.](/Users/tobrien/gitw/kjerneverk/riotplan/src/config/walk-up.ts)
- [Nielsen Norman Group - Four Dimensions of Tone of Voice (primary source for industry standard)](https://www.nngroup.com/articles/tone-of-voice-dimensions/)
- [Grammarly - Voice vs Tone definitions (secondary source)](https://www.grammarly.com/blog/writing-techniques/tone-and-voice/)
- [CUNY Writing Center - Style, Tone, and Voice definitions (academic source)](https://gcwritingcenter.commons.gc.cuny.edu/rs_style-tone-and-voice-introduction/)

## Related Ideas

- _Link to related ideas..._

## Status

**Stage**: idea
**Created**: 2026-01-31T07:42:41.637Z
**Next**: Decide if worth shaping

## Notes

_Add notes as you think about this..._
