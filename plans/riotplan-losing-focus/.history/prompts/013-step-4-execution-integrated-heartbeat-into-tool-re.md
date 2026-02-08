# Narrative: Step 4 execution - integrated heartbeat into tool response handler

**Date**: 2026-02-07T22:43:14.881Z
**Source**: typing
**Speaker**: assistant

---

[{"text": "Step 4 execution complete. Integrated generateHeartbeat() into tool response handler.\n\nCHANGES:\n- Added import at top of src/mcp/server.ts: import { generateHeartbeat } from './heartbeat.js';\n- Added try/catch block in registerTool success handler (after line 210)\n- Calls generateHeartbeat(planDirectory) for every successful tool response\n- Appends heartbeat as separate content item if it returns non-null\n- Handles heartbeat failure gracefully - never breaks tool response\n- Heartbeat NOT added to error responses (clean error output)\n\nINTEGRATION POINT:\nInside registerTool handler, after result content is pushed but before return:\n```typescript\n// Append heartbeat footer with plan context\ntry {\n    const heartbeat = await generateHeartbeat(planDirectory);\n    if (heartbeat) {\n        content.push({\n            type: 'text' as const,\n            text: heartbeat,\n        });\n    }\n} catch {\n    // Heartbeat failure should never break tool response\n}\nreturn { content };\n```\n\nEFFECT:\nEvery successful RiotPlan MCP tool response now includes:\n- Main result/data\n- Optional heartbeat footer showing:\n  - Plan name, stage, directory\n  - Last action taken\n  - Stage-appropriate next action\n  - Behavioral reminder to stay in plan mode\n\nVERIFICATION:\n- TypeScript build succeeded\n- No compilation errors\n- All 7 steps complete and tested", "type": "text"}]
