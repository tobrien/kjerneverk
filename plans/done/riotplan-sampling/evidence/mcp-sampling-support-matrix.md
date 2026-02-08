# MCP Sampling Support Matrix (2026)

Sources:
- https://claudecode.app/documentation/clients
- https://devblogs.microsoft.com/java/unlocking-mcp-in-jetbrains-how-copilot-uses-sampling-prompts-resources-and-elicitation
- https://code.visualstudio.com/docs/copilot/customization/mcp-servers

Retrieved: 2026-02-07

## Support Status by Client

| Client | MCP Sampling | Tools | Prompts | Resources | Roots | Notes |
|--------|-------------|-------|---------|-----------|-------|-------|
| **Cursor** | ❌ | ✅ | ❌ | ❌ | ❌ | Only supports tools |
| **Claude Code** | ❌ | ✅ | ✅ | ❌ | ✅ | No sampling support |
| **GitHub Copilot (VS Code)** | ✅ | ✅ | ✅ | ✅ | ✅ | Full support as of 2026 |
| **GitHub Copilot (JetBrains)** | ✅ | ✅ | ✅ | ✅ | ✅ | Requires v1.5.57+, Agent Mode enabled |
| **Claude Desktop** | ❌ | ✅ | ✅ | ✅ | ❌ | No sampling support |
| **fast-agent** | ✅ | ✅ | ✅ | ✅ | ✅ | Full multimodal support |

## Critical Findings

### 🚨 CURSOR DOES NOT SUPPORT SAMPLING

**This is a MAJOR problem for the riotplan-sampling idea.**

- Cursor only supports MCP tools, not sampling
- Claude Code also does not support sampling
- GitHub Copilot DOES support sampling (as of 2026)

### Implications for RiotPlan

**Option 1: GitHub Copilot Only**
- execution-sampling would only work in GitHub Copilot
- Cursor and Claude Code users would still need API keys
- This defeats the primary use case (Cursor users)

**Option 2: Wait for Cursor to Add Sampling**
- File feature request with Cursor team
- Wait for implementation
- No immediate solution

**Option 3: Hybrid Approach**
- Use sampling where available (GitHub Copilot)
- Fall back to direct AI providers where not (Cursor, Claude Code)
- Provide clear error messages

**Option 4: Alternative Architecture**
- Instead of sampling, use a different pattern
- Maybe: Cursor calls RiotPlan tool → RiotPlan returns prompt → Cursor runs it → User copies result back?
- More manual but works today

## GitHub Copilot Setup

For users with GitHub Copilot, sampling is available:

**VS Code:**
- Available in Copilot chat
- Configure in MCP settings
- Can set model preferences per MCP server

**JetBrains:**
- Requires GitHub Copilot v1.5.57+
- Enable Agent Mode and MCP
- Configure in `mcp.json`

## Recommendation

**The original riotplan-sampling idea needs revision.** The assumption that "if you're using Cursor, you can use sampling" is FALSE. Cursor does not support MCP sampling.

Need to either:
1. Target GitHub Copilot instead of Cursor
2. Wait for Cursor to add sampling support
3. Design a different solution that works with Cursor's limited MCP support (tools only)
4. Keep the current approach (require API keys) until MCP sampling is more widely supported
