# Template Discussion and Implementation Approach

**Date**: 2026-01-30
**Context**: Discussion about template requirements, lifecycle phases, and implementation approach

---

## User Narrative 1: Initial Template Requirements

OK to answer a narrative capture tool available the question that's been solved so take that out of the plan. We're already able to do the narrative capture I believe although it'll be a real question as to whether or not the system is able to capture what I'm supplying to you right now into that history prompts directory I hope it does, but if it doesn't, then we might need to update the explore idea or Lambert idea thing that we're doing

Document mentioned email project plan research paper and podcast script. We could explore what those look like I don't know I mean, or you could just come up with an idea and I could change it once you're done what I want to put in terms of my requirements for the templates is that they should be relatively straightforward. They should define the structure of the document the structure of the output document and then also the template themselves should be accompanied by a markdown document that has some of the questions that need to be answered to really write something in that format so you know, for example if you're running a blood post, you're gonna wanna know like what's the title or what's your idea about the title? What's the topic? What's the proposal length? What's the target audience? What website is it gonna be post on stuff like that?

Version numbering implementation that that's fine. Do whatever you wanna do there if it's wrong I'll change it later.

At line manipulation, tools I don't know I don't know. I mean an MCP tool that allows me to revise. The outline would be very helpful. Insert section move section delete section. Maybe that's getting too granular. I don't know. I really don't know. Let's just create an outline and see what happens

---

## User Narrative 2: Critical Template Feedback - Lifecycle Phases

The template structure looks OK I mean frankly it's maybe a little too heavy like a look take a look at the Blog post one. It's too heavy right so when I'm starting to write a blog post and I'm starting to think about the idea, I'm gonna wanna focus on title Topic angle target length I'm actually not really gonna focus too much on SCO keywords category tag both of those things categories an SCO is an after the fact concern so what I'm saying is some of this metadata for Blog post could be moved to another section that's like questions to answer before publishing which also implies that there would be like another lifecycle phase between when you write the draft when you review the draft when you're finalizing the document and then finally when you're gonna publish it I like some of the things that you could put in there are like the call action, the category, the SCO related content images. Those are all things that you could probably fill in at the end, but for a Blog, you're really looking at the angle of the title the topic the target length you're looking at the purpose in the tone. Those are the things that you wanna do upfront so answer a question about what I think about the questions. I think I'm opening up the idea that there's probably another thing that we need to figure out, which is are there questions that you ask prior to publish other questions you ask as the document is finalized and the reason why I bring that up is because sometimes you were a Blog post and you really working on the idea and the whole thing changes and you wouldn't wanna set SCO keyword for something until it's written you wouldn't wanna set the category in tags until it's done sometimes even you don't know what website you're gonna publish it until it's published Call. The action is very marketing thing right that might be something you know upfront that might not be something you know until the end same was related in terms of how I write blood post. I usually wait until the very end to think about images to think about links so anyway that's my feedback on the template. The template itself should be a template for the output document. It should also define the questions to answer during the idea phase the questions to answer during the draft phase. Both of those are gonna be almost the same, if not the same set then you're gonna have questions that you wanna answer toward the publishing phase and that's a very long answer your question.

the other thing I think I need to make clear is that you said you captured the narrative I think you called out to like riot plan idea add narrative and I see that it sent The sent the stuff to Ryan add narrative plan got a response narrative chunk adde and that's not really what I thought was gonna happen in the response it says narrative chunk added to the timeline, but I don't see it in the timeline and that's not really where I wanted it to be anyway I wanted it to be stored in the file system and something like the prompt directory the underdo history, but that's not where it went so I think there's a bug in Ryan idea at narrative you're not capturing some of the most valuable stuff which is prompt like this so I need you to take a look at this. I'm really not happy that I have to go back and tell you this again.

let me give you more template feedback so I'm looking at the email template. This is good. I mean you've got subject Boddie and two from and date so that's good no problems here right I like the meditate the purpose to and follow up attachments that's all good. The example used cases are OK. It's those questions right there questions are gonna wanna have a front sometimes you wanna have a really simple easy case which is like a quick e. You might draft the body first before you think about the subject. You definitely know who the recipients gonna be know what the centers context is you probably know what the tone is gonna be upfront and the length there's other things though that'll come in later, which is like you might give it back you might not it might just be like a quick email I want to send an email to Anil. It has to say sensitive topics or some of them might be optional previous communications might be something that you need to drop in as evidence or research before you write it call action, delight, urgency that's all stuff that might be more amenable to an answer at the end. The same feedback for emails I ever blocked. Sometimes you might just have a quick email you wanna write you would do it quickly and sometimes you have an email that you wanna sit on for a day or two and really think about all these different things. I also don't see any record here for like BCC or C carbon copy or blind carbon copy I think that's an interesting thing to put in here

once again I don't think you're listening. I've told you a couple times podcast script needs to be in this set of templates and the podcast script. Is you know just make it up? I'm gonna change a lot but just make something up. See the project plan template this is OK. I don't know how much I'm gonna use this to start so I don't really care about it too much but I think the project plan has the same thing like as you're starting to think about a project plan there's things you know now and those things you don't know until the end.

---

## User Narrative 3: Implementation Approach

Speed of implantation sort of important to me, but I think a copy paste from riot planned for some of the history checkpoint narrative stuff he recommended I don't want you to create a third project for us to go back-and-forth right now because I don't think it's worth the weight but eventually, I think that'll be Short Lee arriving think that what we need to do is just build it I like you're saying like template first and just build it all and don't build the shared infrastructure library do you have any more questions?

---

## User Narrative 4: Fix the Bug NOW

No, not really I don't think that's what I said. I mean it's fine. Do the 10th first then Coffey paste the infrastructure and new version numbers and do our tools but there's one other question I like didn't I ask you to fix the narrative saving thing first you're losing all the narrative that I'm doing now you're not putting it into history prompts can you fix that? Can you actually save the prompts that I've sent you over and then can you also fix the bug in riot plan

---

## Key Insights

### Template Requirements
- Templates must split questions by lifecycle phase:
  - **Idea/Draft Phase**: Title, topic, angle, length, purpose, tone
  - **Publishing Phase**: SEO, categories, tags, images, links, call-to-action
- Blog posts: Write first, optimize for SEO later
- Emails: Quick emails need minimal questions; important emails need all
- Missing from email template: CC and BCC fields
- Podcast script template was missing (now created)

### Implementation Approach
- **Speed matters**: Fast implementation preferred
- **Copy-paste from RiotPlan**: Accept code duplication for now
- **Template-first**: Build template system as foundation
- **No shared library yet**: Defer to later when patterns stabilize
- **Build it all together**: Not incremental

### Critical Bug
- `riotplan_idea_add_narrative` only logs to timeline.jsonl
- Does NOT save to .history/prompts/ directory
- Narratives should be saved as numbered prompt files
- User is frustrated this wasn't fixed immediately
