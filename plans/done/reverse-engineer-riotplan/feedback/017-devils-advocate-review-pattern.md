# Feedback 017: Devil's Advocate Review Pattern

## Context
- **Date**: 2026-01-14
- **Participants**: Tim (human), Claude (Cursor), ChatGPT 5.2 Pro with Deep Research
- **Platform**: Multi-AI workflow (Cursor + ChatGPT Pro)
- **Plan Version**: v0.16 → v0.17
- **Related Files**: 
  - RIOTPLAN_ANALYSIS.md
  - RIOTPLAN_ANALYSIS.pdf
  - Critical Review of the RiotPlan Framework.docx

## What Happened

Tim took the RIOTPLAN_ANALYSIS.md document (after 16 rounds of feedback), rendered it to PDF using pandoc, and then submitted it to a **different AI model** (ChatGPT 5.2 Pro with Deep Research enabled) specifically asking for critical, constructive feedback.

### The Process

1. **Rendered to portable format**: Used `pandoc` to convert the 48-page Markdown analysis to PDF
2. **Sent to different AI**: Uploaded to ChatGPT 5.2 Pro with Deep Research
3. **Prompted for critical review**: 
   > "Ok, so I need you to apply your analytical, deep research capabilities to an idea that I'm developing right now called RiotPlan. What I'm looking for you to do is assess the idea and this analysis prior to me asking it to execute and create a plan. This is a 48 page document that describes something I'm building called RiotPlan, what I want you to do is critique it, identify anything that you think is missing, and give me some critical, but constructive feedback."
4. **Received clarifying questions**: The AI asked about audience, deployment goals, and focus areas
5. **Provided context**: Tim clarified developers initially, open-source deployment, no SaaS ambitions
6. **Received comprehensive review**: A 1,000+ line critical analysis with academic grounding

### What the Review Provided

The ChatGPT review delivered:

1. **Strengths/Weaknesses Table**: Systematic analysis of key strengths and corresponding risks
2. **Research Grounding**: References to relevant academic work:
   - He et al. (2025) - "Plan-Then-Execute" on user trust with LLM agents (arXiv 2502.01390)
   - Tankelevitch et al. (2023) - Metacognitive challenges in GenAI workflows
   - Design rationale research (IBIS, ADRs)
   - Cognitive offloading vs overload research
3. **Terminology Critique**: Analysis of "metacognitive" usage - confirmed appropriate but suggested simplification for broader audience
4. **Lifecycle Analysis**: Suggested additions like "Archival" or "Retrospective" stages
5. **CLI Ergonomics**: Detailed feedback on command structure and usability
6. **Multi-project Coordination**: Analysis of complexity and design considerations
7. **Collaboration Gaps**: Identified single-user limitation as significant for team adoption
8. **Communication Clarity**: Suggestions for explaining the concept to non-technical stakeholders
9. **Specific Refinements**: 10+ actionable suggestions for improvement

## The Pattern This Reveals

This workflow demonstrates a **devil's advocate review pattern** that should be a first-class feature in RiotPlan:

### Pattern: External Critical Review

During the **inception and elaboration phase**, send the plan/analysis to a specialized "heavy" AI model with deep research capabilities, specifically asking for:
- Critical (but constructive) feedback
- Identification of missing elements
- Research grounding for key concepts
- Alternative perspectives
- Risk analysis

### Why This Pattern is Valuable

1. **Different AI Perspective**: Different models have different training, strengths, and biases. Getting a second opinion surfaces blind spots.

2. **Deep Research Capability**: Models with research capabilities can ground concepts in academic literature, providing citations and validation.

3. **Deliberate Devil's Advocacy**: Explicitly asking for critique yields different results than asking for help or completion.

4. **Cross-Modal Validation**: Moving from IDE context (Cursor) to research context (ChatGPT Pro Deep Research) forces the plan to stand on its own.

5. **Portable Format Requirement**: The need to render to PDF ensures the document is complete and self-contained.

## Feature Request: Built-in Devil's Advocate Review

RiotPlan should support this workflow explicitly:

```bash
# Render plan for external review
$ riotplan render pdf --for-review

# After receiving review, import it
$ riotplan review import ./path/to/review.docx --source "ChatGPT 5.2 Pro Deep Research"

# Or use integrated review (if API access configured)
$ riotplan review request --model "gpt-5-deep-research" --prompt devils-advocate
```

### Workflow Stages

1. **Prepare**: Render plan to portable format (PDF, HTML)
2. **Submit**: Send to external review (manual or via API)
3. **Prompt**: Use structured prompts designed to elicit critical feedback
4. **Import**: Capture review back into plan's feedback directory
5. **Process**: Integrate insights into plan revision

### Review Prompts to Include

RiotPlan could ship with standard review prompts:

- `devils-advocate.md`: "Critique this plan, identify weaknesses, find what's missing"
- `research-grounding.md`: "Ground the key concepts in relevant research, cite papers"
- `feasibility-check.md`: "Assess technical feasibility and implementation risks"
- `audience-clarity.md`: "Review from perspective of [X audience], identify confusion"
- `scope-creep.md`: "Identify where scope may be expanding beyond core goals"

## Changes Required to RIOTPLAN_ANALYSIS.md

1. Add new requirement R24: External Critical Review
2. Add section on "Devil's Advocate Review Pattern" 
3. Add CLI commands for review workflow
4. Reference the academic papers identified in the ChatGPT review
5. Note this as an example of multi-AI collaboration workflow

## Broader Implications

This feedback session itself demonstrates:

1. **Multi-AI workflows are valuable**: Using different AI systems for different purposes (Cursor for development, ChatGPT Pro for research)
2. **Portable formats matter**: The ability to render and share is crucial for cross-tool workflows
3. **The conversation IS the value**: Tim's exchange with ChatGPT Pro (clarifying questions, context) was itself valuable deliberation
4. **Evidence accumulates**: The DOCX review is now `evidence/` for future plan iterations

## Meta-Observation

This is exactly the kind of workflow that gets lost in current practice. Tim:
1. Rendered a PDF
2. Uploaded to ChatGPT
3. Had a conversation
4. Downloaded a DOCX
5. Brought it back to Cursor

Without explicit capture, all of that would be lost. The fact that we're now documenting it in `feedback/017-*.md` proves the RiotPlan concept itself.

## Resolution

- Create requirement R24: External Critical Review
- Add new section documenting devil's advocate pattern
- Add review-related CLI commands
- Store the ChatGPT review as evidence
- Consider the research papers cited as potential references for documentation

## References from ChatGPT Review

Key papers to potentially cite:
- He et al. (2025) - "Plan-Then-Execute: User Trust and Team Performance with LLM Agents" (arXiv 2502.01390)
- Tankelevitch et al. (2023) - Metacognitive challenges in GenAI workflows
- Chirayath & Premamalini (2025) - "Cognitive offloading or overload?"
- Design rationale literature (IBIS, ADRs)

