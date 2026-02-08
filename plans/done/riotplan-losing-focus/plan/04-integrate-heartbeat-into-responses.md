# Step 4: Integrate Heartbeat Footer into Tool Response Handler

**Recommended Model**: Haiku 4.5
**Rationale**: Mechanical integration - inserting a function call at one specific point in the tool response handler. The heartbeat function already exists from Step 3; this step just wires it in. Clear location, clear pattern.

**Depends on**: Step 3 (heartbeat function must exist)

## Objective

Modify the `registerTool` handler in `src/mcp/server.ts` to append the heartbeat footer to every successful tool response.

## Background

The `registerTool` function (lines 137-272 in server.ts) wraps all tool execution. Every tool response flows through this handler. We need to append the heartbeat string to the response content array so the model sees it after every tool call.

## Tasks

- [ ] Import the `generateHeartbeat` function in server.ts
- [ ] In the success branch of the handler (lines 190-210), add a new content item after the result
- [ ] The heartbeat should be a separate `{ type: 'text', text: heartbeatString }` content item
- [ ] Pass the resolved `planDirectory` to the heartbeat function
- [ ] Handle the case where heartbeat generation fails (don't break the tool response)
- [ ] Do NOT add heartbeat to error responses (keep error output clean)
- [ ] Run TypeScript compilation

## Implementation Location

```typescript
// In registerTool handler, after line 208:
content.push({
    type: 'text' as const,
    text: textContent,
});

// ADD HEARTBEAT HERE:
try {
    const heartbeat = await generateHeartbeat(planDirectory);
    if (heartbeat) {
        content.push({
            type: 'text' as const,
            text: heartbeat,
        });
    }
} catch {
    // Heartbeat failure should never break tool response
}
```

## Files Changed

- `src/mcp/server.ts` - Import heartbeat function + add to response handler

## Acceptance Criteria

- Every successful tool response includes heartbeat footer
- Error responses do NOT include heartbeat
- Heartbeat failure does not break tool responses
- TypeScript compiles cleanly
