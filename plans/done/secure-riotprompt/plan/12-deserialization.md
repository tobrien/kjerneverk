# Step 12: Deserialization Validation

## Objective

Add schema validation to all deserialization points to prevent object injection attacks.

## Background

**Vulnerability Addressed:** Deserialization Without Schema Validation (🟡 Medium)

The `ConversationBuilder.fromJSON()` method parses JSON and trusts the content without validation. This could allow:
- Malformed data causing runtime errors
- Injection of unexpected properties
- Version incompatibilities

## Tasks

### 12.1 Create Serialization Schemas

Create `/Users/tobrien/gitw/kjerneverk/riotprompt/src/security/serialization-schemas.ts`:

```typescript
import { z } from 'zod';

/**
 * Schema version for forward compatibility
 */
export const SCHEMA_VERSION = '1.0.0';

/**
 * Tool call schema
 */
export const ToolCallSchema = z.object({
  id: z.string(),
  type: z.literal('function'),
  function: z.object({
    name: z.string().max(100),
    arguments: z.string().max(100000), // 100KB limit
  }),
});

/**
 * Conversation message schema
 */
export const ConversationMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string().nullable().refine(
    val => val === null || val.length <= 1000000, // 1MB limit
    { message: 'Content exceeds maximum length' }
  ),
  name: z.string().max(100).optional(),
  tool_calls: z.array(ToolCallSchema).optional(),
  tool_call_id: z.string().max(100).optional(),
});

/**
 * Conversation metadata schema
 */
export const ConversationMetadataSchema = z.object({
  model: z.string().max(100),
  created: z.string().datetime(),
  lastModified: z.string().datetime(),
  messageCount: z.number().int().nonnegative(),
  toolCallCount: z.number().int().nonnegative(),
});

/**
 * Serialized conversation schema
 */
export const SerializedConversationSchema = z.object({
  // Optional version for forward compatibility
  version: z.string().optional(),
  messages: z.array(ConversationMessageSchema).max(10000), // Max 10k messages
  metadata: ConversationMetadataSchema,
  contextProvided: z.array(z.string().max(1000)).optional(),
});

/**
 * Prompt serialization schema
 */
export const SerializedPromptSchema = z.object({
  version: z.string().optional(),
  persona: z.any().optional(), // Section content
  instructions: z.any().optional(),
  contexts: z.any().optional(),
  content: z.any().optional(),
});

export type SerializedConversation = z.infer<typeof SerializedConversationSchema>;
export type SerializedPrompt = z.infer<typeof SerializedPromptSchema>;
```

### 12.2 Update ConversationBuilder.fromJSON

Modify `/Users/tobrien/gitw/kjerneverk/riotprompt/src/conversation.ts`:

```typescript
import { SerializedConversationSchema, SCHEMA_VERSION } from './security/serialization-schemas';
import { getSecretGuard } from './security/secret-guard';

/**
 * Restore conversation from JSON with validation
 */
static fromJSON(
  json: string,
  config?: Partial<ConversationBuilderConfig>,
  logger?: any
): ConversationBuilder {
  const secretGuard = getSecretGuard();
  
  // Parse JSON safely
  let rawParsed: unknown;
  try {
    rawParsed = JSON.parse(json);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }

  // Validate against schema
  const parseResult = SerializedConversationSchema.safeParse(rawParsed);
  
  if (!parseResult.success) {
    // Create safe error message (don't leak schema details)
    const issues = parseResult.error.issues
      .slice(0, 3) // Limit to first 3 issues
      .map(i => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Conversation data validation failed: ${issues}`);
  }

  const parsed = parseResult.data;

  // Check version compatibility
  if (parsed.version && parsed.version !== SCHEMA_VERSION) {
    logger?.warn(`Conversation version mismatch: ${parsed.version} vs ${SCHEMA_VERSION}`);
  }

  // Create builder
  const builder = ConversationBuilder.create(
    {
      model: parsed.metadata.model,
      ...config,
    },
    logger
  );

  // Restore messages (redact if sensitive content)
  builder.state.messages = parsed.messages.map(msg => ({
    ...msg,
    content: msg.content ? secretGuard.redact(msg.content, 'deserialization') : null,
  }));

  // Restore metadata
  builder.state.metadata = {
    ...parsed.metadata,
    created: new Date(parsed.metadata.created),
    lastModified: new Date(parsed.metadata.lastModified),
  };

  // Restore context
  if (parsed.contextProvided) {
    builder.state.contextProvided = new Set(parsed.contextProvided);
  }

  return builder;
}
```

### 12.3 Update Serializer.fromJSON

Apply similar validation to the Serializer's fromJSON method.

### 12.4 Add Version Field to Serialization

Update `toJSON` methods to include version:

```typescript
toJSON(): string {
  const serialized: SerializedConversation = {
    version: SCHEMA_VERSION,
    messages: this.state.messages,
    metadata: {
      ...this.state.metadata,
      created: this.state.metadata.created.toISOString(),
      lastModified: this.state.metadata.lastModified.toISOString(),
    },
    contextProvided: Array.from(this.state.contextProvided),
  };

  return JSON.stringify(serialized, null, 2);
}
```

## Acceptance Criteria

- [ ] Zod schemas for all serialized types
- [ ] Size limits on serialized data
- [ ] Version field for compatibility
- [ ] Updated fromJSON with validation
- [ ] Safe error messages (don't leak schema)
- [ ] Integration with SecretGuard
- [ ] Unit tests for valid data
- [ ] Unit tests for invalid data
- [ ] Migration guide for existing saved data

## Testing

```typescript
describe('Deserialization Validation', () => {
  it('should validate correct conversation data', () => {
    const validData = {
      version: '1.0.0',
      messages: [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
      ],
      metadata: {
        model: 'gpt-4o',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        messageCount: 2,
        toolCallCount: 0,
      },
    };

    const builder = ConversationBuilder.fromJSON(JSON.stringify(validData));
    expect(builder.getMessageCount()).toBe(2);
  });

  it('should reject invalid data', () => {
    const invalidData = {
      messages: 'not an array', // Should be array
    };

    expect(() => ConversationBuilder.fromJSON(JSON.stringify(invalidData)))
      .toThrow('validation failed');
  });

  it('should reject oversized content', () => {
    const oversizedData = {
      messages: [{
        role: 'user',
        content: 'x'.repeat(2000000), // 2MB, exceeds limit
      }],
      metadata: { /* ... */ },
    };

    expect(() => ConversationBuilder.fromJSON(JSON.stringify(oversizedData)))
      .toThrow('exceeds maximum');
  });
});
```

## Files Changed

- `riotprompt/src/security/serialization-schemas.ts` (new)
- `riotprompt/src/conversation.ts` (modified)
- `riotprompt/src/serializer.ts` (modified)
- `riotprompt/src/security/index.ts` (modified)

## Notes

Migration considerations:
1. Existing saved conversations without `version` field should still load
2. Add warnings for version mismatches, not errors
3. Document the schema version policy

