# Narrative: User notes from January 29, 2026 about voice and tone requirements

**Date**: 2026-01-31T07:44:21.191Z
**Source**: paste
**Speaker**: user

---

# Riot doc. Voice and tone.

## Metadata

**Date**: January 29, 2026
**Time**: 08:27 PM

**Project**: Kjerneverk
**Project ID**: `kjerneverk`

### Routing

**Destination**: ./notes
**Confidence**: 100.0%

**Reasoning**: No project matches found, using default routing

---
Okay, as I'm looking at the Riot Dock plans, there's some things that I'm starting to realize that we actually really need that are universal to all the docks, and it's not configuration as much as it's like voice and tone. I need to create a common way for people to say, I want to define what my tone is, what my voice is, and I also think I need to have a way to have Riot Dock consume a lot of different documents and try to learn what is someone's tone, what is their approach. And those are going to be interesting prompts.

And I think what I would love to do with the tone and the voice is look in the industry, look on the web, and try to identify if someone has come up with a standard to capture what this means. Like, what is tone, what is voice? But a user should be able to have more than one tone or more than one voice defined. And I think a tone and a voice should be personal, but then there's also places where the tone and the voice will be shared and consistent with a corporate voice. And I think that's interesting. Go look at branding and what do people do there.

But what I would love to have for tone and for voice is something that models it, something that could turn it into either a system prompt or something that could guide the creation of content. So when I need to create a document, I would love to have that voice reflected in the document. And I would love to have whatever generates a document be able to also look at historical documents to get a sense of what that document should be.

So sometimes you might be writing a document and you might want to say, use this voice in that document. Or sometimes you might be writing a document and you might want to say, these are the last four versions of the document. Please use the same tone and voice as this document.

And I really am serious about, I want to get an accepted definition of what the word tone and what the word voice is. But for RiotDoc, this is one of the sort of universal context objects that we need to deal with. And I think I want to call it a context object. I'll tell you why in a second.

The other thing I think we need to do is there might be different rules or different things we need to know when writing a document. I think we'll just call it that, rules or guidance. For example, if I'm writing a document for work and I work in a bank, there might be a rule that I can't use certain terms.

I also think that we might want to have context for names of things and people. I think RiotDoc has a fairly rich approach to context and this should be using the same sort of approach that we're using in Protocol and in Chronology.
