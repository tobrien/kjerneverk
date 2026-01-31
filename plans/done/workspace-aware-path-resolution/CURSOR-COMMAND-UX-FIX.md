# Cursor Command UX Fix: explore_idea

## Problem Summary

The `/riotplan/explore_idea` Cursor command had a workflow mismatch that created a confusing user experience:

1. User invokes `/riotplan/explore_idea`
2. AI reads the command prompt which instructed: "Ask the user for: code and description"
3. AI stops and asks user for these values
4. User provides them (feeling like they're filling out a form)
5. AI then calls `riotplan_idea_create()` with those values

This broke conversational flow and made the command feel bureaucratic rather than exploratory.

## Root Cause

**Cursor commands don't support formal parameters** like traditional CLI commands. They are prompt templates that guide AI behavior, not parameterized functions.

The original command prompt showed example tool calls but instructed the AI to ask for input first, creating the jarring UX.

## Solution Implemented

Rewrote the command prompt to handle multiple scenarios gracefully:

### Smart Extraction Pattern

The new command prompt instructs the AI to:

1. **Check if user already provided details** in their invocation message
2. **Extract them immediately** if present (code and/or description)
3. **Derive missing information** intelligently (e.g., convert description to kebab-case code)
4. **Only ask for missing information** if truly needed
5. **Begin exploration immediately** after creating the idea

### Example Scenarios

**Scenario 1: Full details provided**
```
User: /riotplan/explore_idea real-time-notifications Add push notifications
AI: [extracts, creates idea, begins exploration] "Let's explore this. What's driving this need?"
```

**Scenario 2: Partial details provided**
```
User: /riotplan/explore_idea I want to add notifications
AI: [extracts description, derives code, creates idea] "Let's explore this notification idea..."
```

**Scenario 3: No details provided**
```
User: /riotplan/explore_idea
AI: "What idea would you like to explore? Give me a short name and brief description."
User: "Real-time notifications for users"
AI: [extracts, creates idea, begins exploration]
```

## Key Improvements

1. **No Repeated Information**: AI doesn't ask for what user already provided
2. **Intelligent Defaults**: Derives code from description when needed
3. **Immediate Action**: Creates idea and begins exploration without unnecessary pauses
4. **Natural Conversation**: Feels like collaboration, not form-filling
5. **Flexible Input**: Handles various levels of detail gracefully

## Implementation Details

### File Created
- `/Users/tobrien/gitw/kjerneverk/.cursor/commands/explore_idea.md`

### Key Changes

1. **Added Smart Extraction Section**
   - Instructions for checking user's message first
   - Examples of extraction patterns
   - Fallback to natural conversation only when needed

2. **Emphasized Immediate Action**
   - "Do NOT ask the user to repeat information they already provided"
   - "Begin exploration immediately after creating the idea"
   - Anti-pattern: "Don't ask for information the user already provided"

3. **Comprehensive Examples**
   - Shows all three scenarios (full, partial, no details)
   - Demonstrates extraction logic
   - Illustrates natural conversation flow

## Pattern for Other Commands

This pattern can be applied to other commands that might have similar issues:

### Template for Smart Command Prompts

```markdown
## 1. Extract or Gather Information

**FIRST: Check if the user already provided details in their message.**

Look for:
- [Required parameter 1]
- [Required parameter 2]

**If all are present:**
- Extract them immediately
- Proceed directly to action
- Do NOT ask the user to repeat information

**If any are missing:**
- Have a natural conversation to gather them
- Extract what you can
- Only ask for what's truly missing

**Example extractions:**
[Show various input formats and how to extract from them]

## 2. Take Action Immediately

Once you have required information, [take action] immediately:
[Show tool call]

## 3. Continue Workflow

After [action], immediately begin [next phase]. Don't wait for prompting.
```

## Testing

### Before Fix
```
User: /riotplan/explore_idea
AI: "Please provide: 1. A short code/identifier 2. Initial description"
User: "Ugh, okay... code is 'my-feature', description is 'Add feature X'"
AI: [calls riotplan_idea_create]
AI: "Now let's explore..."
```
**Result**: 3 turns, feels bureaucratic

### After Fix
```
User: /riotplan/explore_idea my-feature "Add feature X"
AI: [calls riotplan_idea_create immediately]
AI: "Let's explore this idea. What's driving this feature?"
```
**Result**: 1 turn, feels natural

## Related Considerations

### Commands That May Need Similar Treatment

1. `riotplan_checkpoint_create` - If it has a command wrapper
2. `riotplan_shaping_start` - Likely doesn't need parameters
3. Any future commands that create entities

### MCP Tool Descriptions

The underlying MCP tools (`riotplan_idea_create`, etc.) are fine as-is. They properly define required parameters. The issue was only in the Cursor command wrapper's prompt.

## Lessons Learned

1. **Cursor commands are prompt templates**, not parameterized functions
2. **Smart extraction** is better than formal parameters for this system
3. **Immediate action** creates better UX than multi-turn form-filling
4. **Flexible input handling** accommodates different user styles
5. **Clear anti-patterns** help guide AI behavior consistently

## Future Improvements

Consider:
1. Creating a standard template for all RiotPlan Cursor commands
2. Documenting the smart extraction pattern for other command authors
3. Adding more sophisticated NLP extraction (e.g., from natural sentences)
4. Creating a command testing framework to validate UX flows
