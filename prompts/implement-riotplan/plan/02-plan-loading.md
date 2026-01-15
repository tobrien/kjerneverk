# Step 02: Plan Loading

## Objective

Implement `loadPlan()` function to parse existing plan directories into the `Plan` data structure, including all standard files (SUMMARY.md, EXECUTION_PLAN.md, STATUS.md), step files, feedback records, and evidence.

## Background

Plans exist as directories with markdown files. The `loadPlan()` function must:
1. Discover and validate plan structure
2. Parse all standard files
3. Load step files in order
4. Load feedback records if present
5. Load evidence files if present
6. Return a complete `Plan` object

The stub already exists in `src/index.ts`. This step implements it fully.

## Tasks

### 1. Create Plan Loader Module

Create `src/plan/loader.ts`:

```typescript
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import type { 
  Plan, 
  PlanFiles, 
  PlanMetadata, 
  PlanStep,
  PlanState,
  FeedbackRecord,
  EvidenceRecord 
} from '../types.js';
import { PLAN_CONVENTIONS } from '../types.js';

export interface LoadPlanOptions {
  /** Include feedback records */
  includeFeedback?: boolean;
  /** Include evidence files */
  includeEvidence?: boolean;
  /** Parse STATUS.md for state */
  parseStatus?: boolean;
}

export async function loadPlan(
  path: string, 
  options: LoadPlanOptions = {}
): Promise<Plan> {
  // Implementation
}
```

### 2. Implement Directory Discovery

```typescript
async function discoverPlanFiles(planPath: string): Promise<PlanFiles> {
  const files: PlanFiles = {
    steps: [],
    subdirectories: []
  };
  
  const entries = await readdir(planPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Check standard directories
      if (entry.name === PLAN_CONVENTIONS.standardDirs.plan) {
        files.steps = await discoverStepFiles(join(planPath, entry.name));
      } else if (entry.name === PLAN_CONVENTIONS.standardDirs.feedback) {
        files.feedbackDir = entry.name;
        files.feedbackFiles = await discoverFeedbackFiles(join(planPath, entry.name));
      }
      // ... etc
    } else if (entry.isFile()) {
      // Check standard files
      const name = entry.name;
      if (name === PLAN_CONVENTIONS.standardFiles.summary) {
        files.summary = name;
      } else if (name === PLAN_CONVENTIONS.standardFiles.status) {
        files.status = name;
      }
      // ... etc
    }
  }
  
  return files;
}
```

### 3. Implement Step File Loading

```typescript
async function discoverStepFiles(planDir: string): Promise<string[]> {
  const entries = await readdir(planDir);
  const stepFiles: string[] = [];
  
  for (const entry of entries) {
    if (PLAN_CONVENTIONS.stepPattern.test(entry)) {
      stepFiles.push(entry);
    }
  }
  
  // Sort by step number
  return stepFiles.sort((a, b) => {
    const numA = parseInt(a.match(PLAN_CONVENTIONS.stepPattern)![1]);
    const numB = parseInt(b.match(PLAN_CONVENTIONS.stepPattern)![1]);
    return numA - numB;
  });
}

async function loadSteps(
  planPath: string, 
  stepFiles: string[]
): Promise<PlanStep[]> {
  const steps: PlanStep[] = [];
  
  for (const filename of stepFiles) {
    const match = filename.match(PLAN_CONVENTIONS.stepPattern);
    if (!match) continue;
    
    const [, numberStr, code] = match;
    const number = parseInt(numberStr);
    const filePath = join(planPath, PLAN_CONVENTIONS.standardDirs.plan, filename);
    const content = await readFile(filePath, 'utf-8');
    
    steps.push({
      number,
      code,
      filename,
      title: extractTitle(content) || code,
      description: extractDescription(content),
      status: 'pending', // Default, may be overridden by STATUS.md
      filePath
    });
  }
  
  return steps;
}
```

### 4. Implement Metadata Extraction

```typescript
async function extractMetadata(
  planPath: string, 
  files: PlanFiles
): Promise<PlanMetadata> {
  const code = basename(planPath);
  let name = code;
  let description: string | undefined;
  
  // Try to extract from SUMMARY.md
  if (files.summary) {
    const content = await readFile(join(planPath, files.summary), 'utf-8');
    name = extractTitle(content) || code;
    description = extractFirstParagraph(content);
  }
  
  return {
    code,
    name,
    description,
    path: planPath
  };
}

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractFirstParagraph(markdown: string): string | undefined {
  // Skip title, find first paragraph
  const lines = markdown.split('\n');
  let foundTitle = false;
  let paragraph = '';
  
  for (const line of lines) {
    if (line.startsWith('#')) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim()) {
      if (line.startsWith('#') || line.startsWith('-') || line.startsWith('|')) {
        break; // Hit another section
      }
      paragraph += line + ' ';
    } else if (foundTitle && paragraph && !line.trim()) {
      break; // End of paragraph
    }
  }
  
  return paragraph.trim() || undefined;
}
```

### 5. Implement Feedback Loading

```typescript
async function loadFeedbackRecords(
  feedbackPath: string
): Promise<FeedbackRecord[]> {
  const files = await readdir(feedbackPath);
  const records: FeedbackRecord[] = [];
  
  for (const file of files) {
    if (!PLAN_CONVENTIONS.feedbackPattern.test(file)) continue;
    
    const content = await readFile(join(feedbackPath, file), 'utf-8');
    const record = parseFeedbackFile(file, content);
    if (record) records.push(record);
  }
  
  return records.sort((a, b) => a.id.localeCompare(b.id));
}

function parseFeedbackFile(
  filename: string, 
  content: string
): FeedbackRecord | null {
  const match = filename.match(PLAN_CONVENTIONS.feedbackPattern);
  if (!match) return null;
  
  const [, id, titleSlug] = match;
  
  // Parse frontmatter and content
  const { frontmatter, body } = parseFrontmatter(content);
  
  return {
    id,
    title: frontmatter.title || titleSlug.replace(/-/g, ' '),
    createdAt: frontmatter.date ? new Date(frontmatter.date) : new Date(),
    participants: frontmatter.participants || [],
    platform: frontmatter.platform || 'other',
    feedback: body,
    filename
  };
}
```

### 6. Assemble Complete loadPlan Function

```typescript
export async function loadPlan(
  path: string, 
  options: LoadPlanOptions = {}
): Promise<Plan> {
  const { 
    includeFeedback = true, 
    includeEvidence = true,
    parseStatus = true 
  } = options;
  
  // Verify path exists and is directory
  const pathStat = await stat(path);
  if (!pathStat.isDirectory()) {
    throw new Error(`Plan path is not a directory: ${path}`);
  }
  
  // Discover files
  const files = await discoverPlanFiles(path);
  
  // Extract metadata
  const metadata = await extractMetadata(path, files);
  
  // Load steps
  const steps = files.steps.length > 0 
    ? await loadSteps(path, files.steps)
    : [];
  
  // Initialize state
  let state: PlanState = {
    status: 'pending',
    lastUpdatedAt: new Date(),
    blockers: [],
    issues: [],
    progress: 0
  };
  
  // Parse STATUS.md if present and requested
  if (parseStatus && files.status) {
    const statusContent = await readFile(join(path, files.status), 'utf-8');
    state = parseStatusDocument(statusContent, steps);
  }
  
  // Load feedback if requested
  const feedback = includeFeedback && files.feedbackDir
    ? await loadFeedbackRecords(join(path, files.feedbackDir))
    : undefined;
  
  // Load evidence if requested
  const evidence = includeEvidence && files.evidenceDir
    ? await loadEvidenceRecords(join(path, files.evidenceDir))
    : undefined;
  
  return {
    metadata,
    files,
    steps,
    state,
    feedback,
    evidence
  };
}
```

### 7. Update Index Exports

In `src/index.ts`:

```typescript
export { loadPlan, type LoadPlanOptions } from './plan/loader.js';
```

## Acceptance Criteria

- [ ] `loadPlan(path)` returns valid Plan object for existing plans
- [ ] Handles plans with and without `plan/` subdirectory
- [ ] Correctly parses step file numbering and ordering
- [ ] Extracts metadata from SUMMARY.md
- [ ] Loads feedback records when `feedback/` exists
- [ ] Loads evidence records when `evidence/` exists
- [ ] Throws clear errors for invalid plan structures
- [ ] **`npm run precommit` passes** ← Definition of Done

## Testing

```typescript
// tests/loader.test.ts
import { describe, it, expect } from 'vitest';
import { loadPlan } from '../src/index';
import { join } from 'node:path';

describe('loadPlan', () => {
  const fixturesPath = join(__dirname, 'fixtures');
  
  it('should load a valid plan', async () => {
    const plan = await loadPlan(join(fixturesPath, 'valid-plan'));
    expect(plan.metadata.code).toBe('valid-plan');
    expect(plan.steps.length).toBeGreaterThan(0);
  });
  
  it('should throw for non-existent path', async () => {
    await expect(loadPlan('/nonexistent')).rejects.toThrow();
  });
  
  it('should load feedback records', async () => {
    const plan = await loadPlan(join(fixturesPath, 'plan-with-feedback'));
    expect(plan.feedback).toBeDefined();
    expect(plan.feedback!.length).toBeGreaterThan(0);
  });
  
  it('should handle plan without feedback dir', async () => {
    const plan = await loadPlan(join(fixturesPath, 'minimal-plan'));
    expect(plan.feedback).toBeUndefined();
  });
});
```

### Test Fixtures

Create test fixtures:

```
tests/fixtures/
├── valid-plan/
│   ├── SUMMARY.md
│   ├── STATUS.md
│   └── plan/
│       ├── 01-first-step.md
│       └── 02-second-step.md
├── plan-with-feedback/
│   ├── SUMMARY.md
│   ├── plan/
│   │   └── 01-step.md
│   └── feedback/
│       └── 001-initial-review.md
└── minimal-plan/
    └── SUMMARY.md
```

## Files Changed

- `riotplan/src/plan/loader.ts` - New file
- `riotplan/src/index.ts` - Export loadPlan
- `riotplan/tests/loader.test.ts` - Tests
- `riotplan/tests/fixtures/` - Test plans

## Notes

- Uses native Node.js `fs/promises` (no external dependencies)
- Backward compatible with existing kjerneverk plans
- STATUS.md parsing is basic here; full parsing in Step 05

## Dependencies

- Step 01 (Type System Enhancement) - Need extended types

## References

- RIOTPLAN_ANALYSIS.md: R1 (Plan Management)
- Existing plan directories in kjerneverk

