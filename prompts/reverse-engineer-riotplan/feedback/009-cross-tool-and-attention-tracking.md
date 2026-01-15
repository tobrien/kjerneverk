# Feedback: Cross-Tool Context Switching and Attention Tracking

## Context
- **Date**: 2026-01-14 (morning)
- **Participants**: Tim (human), Claude (AI)
- **Platform**: Cursor IDE
- **Plan Version**: v0.7.2 → v0.7.3

## Feedback Given

### Cross-Tool Pain Points

> "I'm constantly having to switch between Generative AI UI tools like ChatGPT on my mobile device or laptop and running Generative AI processes in Cursor on filesystems. If I need an image generated, I usually have to go over to the ChatGPT UI and generate it there."

> "Most frustratingly, I'm a ChatGPT Pro subscriber so when I need to make use of ChatGPT Pro, I have to do this in the UI and then it's almost impossible to copy the full fidelity of the generated analysis to Markdown. I'm losing a lot every day to that context switch."

### Document Rendering

> "One feature in Riotplan that would be really awesome is a built-in ability to render a plan as a document that can be rendered into HTML, DOCX, PDF, or Markdown and then shared with someone for feedback."

## Resolution

Added new pain points to the table:
- Cross-tool context switching
- AI UI content capture
- Document rendering
- Sharing for feedback

Added new requirements:
- **R20**: Document Rendering & Sharing (PDF, HTML, DOCX, Markdown)
- **R21**: Cross-Tool Content Capture (import from ChatGPT, preserve formatting)

Added CLI commands:
```bash
riotplan render --pdf
riotplan import clipboard
riotplan import chatgpt <file>
```

---

## Feedback Given (Attention Tracking)

> "These sections also identify that we need something that's keeping track of what someone is paying attention to so that it can use that attention stream to tie things together, but also to inform the user."

> "Before lunch you were looking at this and working with this project, and then you moved over to this other plan. Having something that has some awareness of that timeline would be a tool that is able to support the cognitive load that is placed on people when they have the ability to move at 100x."

## Resolution

Added to human story (4:00 PM):
> "When you can move at 100x speed—when AI lets you accomplish in an hour what used to take a week—the cognitive cost of context-switching becomes the bottleneck. The work isn't the problem; remembering what you were doing is the problem."

Added **R18: Attention Tracking**:
- Track which plans/files user is viewing over time
- Record session timeline
- Surface recent context: "Before lunch you were working on Step 6"
- Identify relationships through attention patterns

Added CLI commands:
```bash
riotplan timeline
riotplan wherewasi
riotplan trail
```

## Key Insight

At 100x speed, **the work isn't the bottleneck—remembering what you were doing is**. RiotPlan should be the hub that captures content from wherever it originates and tracks where your attention has been.

