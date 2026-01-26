# Step 04: Feedback Capture

## Objective

Implement the feedback capture system—the philosophical foundation of RiotPlan. Feedback records preserve deliberation, not just decisions. This step enables creating, listing, and managing feedback records.

## Background

From RIOTPLAN_ANALYSIS.md:

> **RiotPlan preserves deliberation, not just decisions.**

Feedback capture is a **Phase 1 feature, not Phase 4**, because:
1. Every plan revision involves deliberation worth capturing
2. Without it from the start, early deliberation is lost
3. It's the philosophical foundation of the tool
4. It can be implemented simply (markdown files) before complex features

Feedback records capture:
- What was proposed
- What feedback was given
- What was changed as a result
- Why the change was made
- Who was involved

## Tasks

### 1. Create Feedback Module

Create `src/feedback/index.ts`:

```typescript
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import type { 
  Plan, 
  FeedbackRecord, 
  FeedbackParticipant, 
  FeedbackPlatform,
  FeedbackContext 
} from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface CreateFeedbackOptions {
  /** Feedback title */
  title: string;
  
  /** The feedback content */
  feedback: string;
  
  /** Participants */
  participants?: FeedbackParticipant[];
  
  /** Platform where feedback occurred */
  platform?: FeedbackPlatform;
  
  /** What was proposed before feedback */
  proposed?: string;
  
  /** Discussion/debate content */
  discussion?: string;
  
  /** Resolution/outcome */
  resolution?: string;
  
  /** Changes made as a result */
  changes?: string[];
  
  /** Context references (file:lines) */
  context?: FeedbackContext[];
  
  /** Plan version this relates to */
  planVersion?: string;
}
```

### 2. Implement Feedback ID Generation

```typescript
async function getNextFeedbackId(feedbackDir: string): Promise<string> {
  try {
    const files = await readdir(feedbackDir);
    let maxId = 0;
    
    for (const file of files) {
      const match = file.match(PLAN_CONVENTIONS.feedbackPattern);
      if (match) {
        const id = parseInt(match[1]);
        if (id > maxId) maxId = id;
      }
    }
    
    return String(maxId + 1).padStart(3, '0');
  } catch {
    // Directory doesn't exist yet
    return '001';
  }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}
```

### 3. Implement Feedback File Generation

```typescript
function generateFeedbackMd(
  id: string,
  options: CreateFeedbackOptions
): string {
  const date = new Date().toISOString().split('T')[0];
  
  let content = `# Feedback: ${options.title}

## Context

- **Date**: ${date}
`;

  // Add participants
  if (options.participants && options.participants.length > 0) {
    const participantStr = options.participants
      .map(p => `${p.name} (${p.type}${p.model ? `, ${p.model}` : ''})`)
      .join(', ');
    content += `- **Participants**: ${participantStr}\n`;
  }
  
  // Add platform
  if (options.platform) {
    content += `- **Platform**: ${options.platform}\n`;
  }
  
  // Add plan version
  if (options.planVersion) {
    content += `- **Plan Version**: ${options.planVersion}\n`;
  }
  
  // Add file context
  if (options.context && options.context.length > 0) {
    const contextStr = options.context
      .map(c => c.startLine 
        ? `${c.file}:${c.startLine}-${c.endLine || c.startLine}`
        : c.file
      )
      .join(', ');
    content += `- **Related Files**: ${contextStr}\n`;
  }
  
  // What was proposed
  if (options.proposed) {
    content += `
## What Was Proposed

${options.proposed}
`;
  }
  
  // Feedback given
  content += `
## Feedback Given

${options.feedback}
`;
  
  // Discussion
  if (options.discussion) {
    content += `
## Discussion

${options.discussion}
`;
  }
  
  // Resolution
  if (options.resolution) {
    content += `
## Resolution

${options.resolution}
`;
  }
  
  // Changes made
  if (options.changes && options.changes.length > 0) {
    content += `
## Changes Made

${options.changes.map(c => `- ${c}`).join('\n')}
`;
  }
  
  return content;
}
```

### 4. Implement createFeedback Function

```typescript
export interface CreateFeedbackResult {
  /** Created feedback record */
  record: FeedbackRecord;
  
  /** Path to created file */
  path: string;
}

export async function createFeedback(
  planPath: string,
  options: CreateFeedbackOptions
): Promise<CreateFeedbackResult> {
  // Ensure feedback directory exists
  const feedbackDir = join(planPath, PLAN_CONVENTIONS.standardDirs.feedback);
  await mkdir(feedbackDir, { recursive: true });
  
  // Generate ID and filename
  const id = await getNextFeedbackId(feedbackDir);
  const slug = slugify(options.title);
  const filename = `${id}-${slug}.md`;
  const filePath = join(feedbackDir, filename);
  
  // Generate content
  const content = generateFeedbackMd(id, options);
  
  // Write file
  await writeFile(filePath, content);
  
  // Construct record
  const record: FeedbackRecord = {
    id,
    title: options.title,
    createdAt: new Date(),
    participants: options.participants || [],
    platform: options.platform || 'other',
    feedback: options.feedback,
    proposed: options.proposed,
    discussion: options.discussion,
    resolution: options.resolution,
    changes: options.changes,
    context: options.context,
    planVersion: options.planVersion,
    filename
  };
  
  return { record, path: filePath };
}
```

### 5. Implement listFeedback Function

```typescript
export async function listFeedback(
  planPath: string
): Promise<FeedbackRecord[]> {
  const feedbackDir = join(planPath, PLAN_CONVENTIONS.standardDirs.feedback);
  
  try {
    const files = await readdir(feedbackDir);
    const records: FeedbackRecord[] = [];
    
    for (const file of files) {
      if (!PLAN_CONVENTIONS.feedbackPattern.test(file)) continue;
      
      const content = await readFile(join(feedbackDir, file), 'utf-8');
      const record = parseFeedbackFile(file, content);
      if (record) records.push(record);
    }
    
    return records.sort((a, b) => a.id.localeCompare(b.id));
  } catch {
    return []; // No feedback directory
  }
}
```

### 6. Implement getFeedback Function

```typescript
export async function getFeedback(
  planPath: string,
  id: string
): Promise<FeedbackRecord | null> {
  const feedbackDir = join(planPath, PLAN_CONVENTIONS.standardDirs.feedback);
  
  try {
    const files = await readdir(feedbackDir);
    
    for (const file of files) {
      const match = file.match(PLAN_CONVENTIONS.feedbackPattern);
      if (match && match[1] === id.padStart(3, '0')) {
        const content = await readFile(join(feedbackDir, file), 'utf-8');
        return parseFeedbackFile(file, content);
      }
    }
    
    return null;
  } catch {
    return null;
  }
}
```

### 7. Implement Feedback Parser

```typescript
function parseFeedbackFile(
  filename: string, 
  content: string
): FeedbackRecord | null {
  const match = filename.match(PLAN_CONVENTIONS.feedbackPattern);
  if (!match) return null;
  
  const [, id] = match;
  
  // Extract title from first heading
  const titleMatch = content.match(/^#\s+Feedback:\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
  
  // Extract date from context
  const dateMatch = content.match(/\*\*Date\*\*:\s*(\d{4}-\d{2}-\d{2})/);
  const createdAt = dateMatch ? new Date(dateMatch[1]) : new Date();
  
  // Extract platform
  const platformMatch = content.match(/\*\*Platform\*\*:\s*(\w+)/);
  const platform = platformMatch 
    ? (platformMatch[1].toLowerCase() as FeedbackPlatform) 
    : 'other';
  
  // Extract participants (simplified)
  const participants: FeedbackParticipant[] = [];
  const participantsMatch = content.match(/\*\*Participants\*\*:\s*(.+)/);
  if (participantsMatch) {
    // Parse participant string (e.g., "Tim (human), Claude (ai)")
    const parts = participantsMatch[1].split(',');
    for (const part of parts) {
      const pMatch = part.trim().match(/(.+?)\s*\((\w+)(?:,\s*(.+))?\)/);
      if (pMatch) {
        participants.push({
          name: pMatch[1].trim(),
          type: pMatch[2] as 'human' | 'ai',
          model: pMatch[3]?.trim()
        });
      }
    }
  }
  
  // Extract feedback section
  const feedbackSection = extractSection(content, 'Feedback Given');
  
  // Extract other sections
  const proposed = extractSection(content, 'What Was Proposed');
  const discussion = extractSection(content, 'Discussion');
  const resolution = extractSection(content, 'Resolution');
  
  return {
    id,
    title,
    createdAt,
    participants,
    platform,
    feedback: feedbackSection || content,
    proposed,
    discussion,
    resolution,
    filename
  };
}

function extractSection(content: string, sectionName: string): string | undefined {
  const regex = new RegExp(`##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : undefined;
}
```

### 8. Update Index Exports

In `src/index.ts`:

```typescript
export {
  createFeedback,
  listFeedback,
  getFeedback,
  type CreateFeedbackOptions,
  type CreateFeedbackResult
} from './feedback/index.js';
```

## Acceptance Criteria

- [ ] `createFeedback()` creates properly formatted feedback files
- [ ] Feedback IDs auto-increment (001, 002, 003...)
- [ ] Filenames are valid and slugified
- [ ] `listFeedback()` returns all feedback records sorted by ID
- [ ] `getFeedback(id)` retrieves specific record
- [ ] Feedback files can be parsed back into records
- [ ] Works with plans that don't have feedback/ yet
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/feedback.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPlan, createFeedback, listFeedback, getFeedback } from '../src/index';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('Feedback', () => {
  let testDir: string;
  let planPath: string;
  
  beforeEach(async () => {
    testDir = join(tmpdir(), `riotplan-feedback-test-${Date.now()}`);
    const result = await createPlan({
      code: 'test-plan',
      name: 'Test Plan',
      basePath: testDir
    });
    planPath = result.path;
  });
  
  afterEach(async () => {
    await rm(testDir, { recursive: true });
  });
  
  describe('createFeedback', () => {
    it('should create a feedback file', async () => {
      const result = await createFeedback(planPath, {
        title: 'Initial Review',
        feedback: 'Consider adding more steps',
        participants: [
          { name: 'Tim', type: 'human' },
          { name: 'Claude', type: 'ai', model: 'claude-sonnet-4-20250514' }
        ],
        platform: 'cursor'
      });
      
      expect(result.record.id).toBe('001');
      expect(result.record.title).toBe('Initial Review');
    });
    
    it('should auto-increment IDs', async () => {
      await createFeedback(planPath, { title: 'First', feedback: 'Feedback 1' });
      await createFeedback(planPath, { title: 'Second', feedback: 'Feedback 2' });
      const result = await createFeedback(planPath, { title: 'Third', feedback: 'Feedback 3' });
      
      expect(result.record.id).toBe('003');
    });
  });
  
  describe('listFeedback', () => {
    it('should list all feedback', async () => {
      await createFeedback(planPath, { title: 'First', feedback: 'F1' });
      await createFeedback(planPath, { title: 'Second', feedback: 'F2' });
      
      const records = await listFeedback(planPath);
      
      expect(records.length).toBe(2);
      expect(records[0].id).toBe('001');
      expect(records[1].id).toBe('002');
    });
    
    it('should return empty array for plan without feedback', async () => {
      const newPlanResult = await createPlan({
        code: 'no-feedback',
        name: 'No Feedback',
        basePath: testDir,
        createFeedbackDir: false
      });
      
      const records = await listFeedback(newPlanResult.path);
      expect(records).toEqual([]);
    });
  });
  
  describe('getFeedback', () => {
    it('should get specific feedback', async () => {
      await createFeedback(planPath, { title: 'Test', feedback: 'Content' });
      
      const record = await getFeedback(planPath, '001');
      
      expect(record).not.toBeNull();
      expect(record!.title).toBe('Test');
    });
    
    it('should return null for non-existent ID', async () => {
      const record = await getFeedback(planPath, '999');
      expect(record).toBeNull();
    });
  });
});
```

## Files Changed

- `riotplan/src/feedback/index.ts` - New file
- `riotplan/src/index.ts` - Export feedback functions
- `riotplan/tests/feedback.test.ts` - Tests

## Notes

- This is the **philosophical foundation** of RiotPlan
- Feedback files are human-readable markdown
- Parser is forgiving of variations in format
- Consider adding `updateFeedback()` and `deleteFeedback()` later

## Dependencies

- Step 01 (Type System Enhancement) - Feedback types
- Step 03 (Plan Creation) - For test setup

## References

- RIOTPLAN_ANALYSIS.md: R9 (Feedback & Deliberation Capture)
- The feedback/ directory in reverse-engineer-riotplan

