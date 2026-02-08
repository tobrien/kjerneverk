# Why MCP Sampling Matters: The End of Duplicate API Keys

**Date**: February 2026  
**Author**: RiotPlan Team  
**Tags**: MCP, Sampling, Developer Experience, AI Tools

## The Problem

You're using Cursor. Cursor has AI. You pay for Claude or GPT access through Cursor.

Now you want to use an AI-powered tool via MCP - let's say RiotPlan for generating execution plans. Suddenly, you need to:

1. Get another API key
2. Configure it on the server side
3. Pay twice for the same AI access
4. Manage duplicate credentials

**This is absurd.**

## The Solution: MCP Sampling

MCP (Model Context Protocol) includes a feature called **sampling** that solves this elegantly:

```
┌─────────────────┐
│     Cursor      │  ← Already has AI access
│  (MCP Client)   │  ← Already authenticated
└────────┬────────┘
         │ MCP Connection
         │
┌────────▼────────┐
│    RiotPlan     │  ← Needs AI generation
│  (MCP Server)   │  ← NO API keys needed!
└─────────────────┘
```

Instead of RiotPlan calling OpenAI/Anthropic directly, it asks **Cursor** to do the generation:

1. RiotPlan: "Hey Cursor, can you generate this plan for me?"
2. Cursor: "Sure! I already have AI access" → calls Claude
3. Cursor: "Here's the result"
4. RiotPlan: "Thanks!" → saves the plan

**No duplicate API keys. No duplicate costs. No configuration.**

## How It Works

### Traditional Approach (Duplicate Keys)

```typescript
// RiotPlan needs its own API key
const provider = createAnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY  // User must configure this
});

const result = await provider.execute({
  model: 'claude-sonnet-4-5',
  messages: [...]
});
```

**Problems:**
- User must get API key
- User must configure environment
- User pays twice (Cursor + RiotPlan)
- Keys must be managed/rotated

### MCP Sampling Approach (No Duplicate Keys)

```typescript
// RiotPlan detects client supports sampling
const provider = createSamplingProvider({
  sessionId: session.sessionId,
  clientName: session.clientInfo.name
});

// Delegates to client's AI
const result = await provider.execute({
  model: 'claude-sonnet-4-5',  // Preference, not requirement
  messages: [...]
});
```

**Benefits:**
- Zero configuration
- No duplicate API keys
- No duplicate costs
- Client handles authentication

## Real-World Impact

### For Users
- **Instant setup**: No API key hunting
- **Lower costs**: Pay once, not twice
- **Better security**: Fewer credentials to manage
- **Seamless experience**: Just works

### For Tool Developers
- **Lower barrier to entry**: Users can try your tool immediately
- **Fewer support requests**: No "how do I configure API keys?" questions
- **Better adoption**: Remove friction from onboarding
- **Future-proof**: Works with any MCP client

### For Organizations
- **Centralized billing**: All AI costs through one provider
- **Easier compliance**: Fewer API keys to audit
- **Better governance**: Control AI access at the client level
- **Reduced overhead**: Less credential management

## The Current State (February 2026)

**Who Supports MCP Sampling?**

✅ **GitHub Copilot**: Full sampling support  
✅ **FastMCP** (Python): Complete implementation  
✅ **mcp-go** (Go): Working sampling handlers  

❌ **Cursor**: Not yet (as of Feb 2026)  
❌ **Claude Desktop**: Not yet  
❌ **Claude Code**: Not yet  

## Why We Built It Anyway

Even though major IDEs don't support sampling yet, we implemented it in RiotPlan because:

1. **Future-proof**: When IDEs add support, we're ready
2. **Advocacy**: Show the value, create pressure
3. **Testing**: FastMCP lets us validate the implementation
4. **Leadership**: Be first, not last

## The Call to Action

### For IDE Vendors (Cursor, Anthropic, etc.)

**Please implement MCP sampling.** Your users are paying you for AI access. Let them use that access with MCP tools. Don't make them pay twice.

The specification exists. The value is clear. FastMCP proves it works.

### For Tool Developers

**Build with sampling in mind.** Even if clients don't support it yet, design your architecture to use sampling when available and fall back to direct API keys when not.

RiotPlan's approach:
```
Priority 1: Use sampling if client supports it
Priority 2: Use direct API keys if configured
Priority 3: Clear error message with setup instructions
```

### For Users

**Ask your IDE vendor for MCP sampling support.** Tweet at them. File feature requests. Show them this post. Create pressure.

The more users ask for it, the faster it will happen.

## Technical Details

Want to implement sampling in your tool? Here's what you need:

### 1. Detect Sampling Support

```typescript
// During MCP initialization
const capabilities = initRequest.params.capabilities;
const samplingAvailable = !!capabilities.sampling;
```

### 2. Create Sampling Provider

```typescript
if (samplingAvailable) {
  const provider = createSamplingProvider({
    sessionId: session.sessionId,
    clientName: session.clientInfo.name
  });
}
```

### 3. Send Sampling Request

```typescript
// Provider handles the MCP sampling/createMessage request
const response = await provider.execute({
  model: 'claude-sonnet-4-5',
  messages: [
    { role: 'user', content: 'Generate a plan...' }
  ]
});
```

### 4. Handle Response

```typescript
// Response comes from client's AI
console.log(response.content);  // Generated content
console.log(response.model);    // Actual model used
```

## Resources

- **MCP Specification**: https://modelcontextprotocol.io/specification/2025-11-25/server/sampling
- **RiotPlan Implementation**: https://github.com/kjerneverk/riotplan
- **FastMCP**: https://github.com/jlowin/fastmcp
- **execution-sampling Package**: https://github.com/kjerneverk/execution-sampling

## Conclusion

MCP sampling is a **game-changer** for AI tool development. It eliminates duplicate API keys, reduces costs, and improves user experience.

The specification exists. The implementation is proven. The value is clear.

**Now we need IDE vendors to implement it.**

If you're building AI tools, design for sampling. If you're using AI tools, demand sampling support from your IDE.

Let's end the era of duplicate API keys.

---

**About RiotPlan**: RiotPlan is a framework for long-lived, stateful AI workflows. It's the first major MCP tool to implement full sampling support, proving the value and creating pressure for wider adoption.

**Try it**: `npx @kjerneverk/riotplan` (works with FastMCP sampling today!)
