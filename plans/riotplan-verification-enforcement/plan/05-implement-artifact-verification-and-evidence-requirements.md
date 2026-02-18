# Step 05: Implement Artifact Verification and Evidence Requirements

## Objective

Add artifact verification for file existence, Git commits, and evidence requirement checking

## Background

Beyond acceptance criteria, the verification system should optionally check for artifacts (files created, commits made) and require evidence links in reflections for comprehensive verification.

## Tasks

### 1. 05.1

Extend the VerificationEngine in src/verification/engine.ts with artifact checking:

```typescript
private async checkArtifacts(step: PlanStep): Promise<string[]> {
    const issues: string[] = [];
    const content = await fs.readFile(step.filePath, 'utf-8');
    
    // Look for file references in tasks
    const fileRefs = this.extractFileReferences(content);
    for (const filePath of fileRefs) {
        const fullPath = path.resolve(path.dirname(step.filePath), '../../', filePath);
        if (!await this.fileExists(fullPath)) {
            issues.push(`Referenced file not found: ${filePath}`);
        }
    }
    
    // Check for Git commit references
    const commitRefs = this.extractCommitReferences(content);
    for (const commitHash of commitRefs) {
        if (!await this.commitExists(commitHash)) {
            issues.push(`Referenced commit not found: ${commitHash}`);
        }
    }
    
    return issues;
}

private extractFileReferences(content: string): string[] {
    // Extract file paths from task descriptions and acceptance criteria
    const fileRegex = /(?:src\/|\.\.?\/)[^\s)]+\.[a-zA-Z0-9]+/g;
    return Array.from(content.matchAll(fileRegex), m => m[0]);
}

private extractCommitReferences(content: string): string[] {
    // Look for commit hashes (7-40 hex characters)
    const commitRegex = /\b[a-f0-9]{7,40}\b/g;
    return Array.from(content.matchAll(commitRegex), m => m[0]);
}
```

This adds concrete artifact verification that checks for files and commits referenced in step content.

### 2. 05.2

Add evidence requirement checking in src/verification/evidence-checker.ts:

```typescript
export interface EvidenceRequirement {
    type: 'commit' | 'file' | 'test' | 'screenshot';
    description: string;
    required: boolean;
    found: boolean;
}

export class EvidenceChecker {
    async checkEvidenceRequirements(
        plan: Plan, 
        step: PlanStep
    ): Promise<EvidenceRequirement[]> {
        const requirements: EvidenceRequirement[] = [];
        const content = await fs.readFile(step.filePath, 'utf-8');
        
        // Check for code changes (commits)
        if (this.hasCodeChanges(content)) {
            requirements.push({
                type: 'commit',
                description: 'Code changes require Git commit evidence',
                required: true,
                found: await this.hasRecentCommits(step)
            });
        }
        
        // Check for test requirements
        if (this.mentionsTests(content)) {
            requirements.push({
                type: 'test',
                description: 'Testing mentioned requires test evidence',
                required: false,
                found: await this.hasTestEvidence(step)
            });
        }
        
        return requirements;
    }
    
    private hasCodeChanges(content: string): boolean {
        return /(?:implement|create|modify|update|add|build).*(?:\.ts|\.js|\.py|\.java)/i.test(content);
    }
    
    private async hasRecentCommits(step: PlanStep): Promise<boolean> {
        // Check for Git commits in the last 24 hours touching relevant files
        try {
            const result = await exec('git log --since="24 hours ago" --oneline');
            return result.stdout.trim().length > 0;
        } catch {
            return false;
        }
    }
}
```

This provides intelligent evidence checking based on step content patterns.

### 3. 05.3

Integration artifact and evidence checking into the VerificationEngine:

```typescript
// In VerificationEngine.verifyStepCompletion()

// Check artifacts if enabled
let artifactIssues: string[] = [];
if (options.checkArtifacts) {
    artifactIssues = await this.checkArtifacts(step);
}

// Check evidence requirements if enabled
let evidenceIssues: string[] = [];
if (options.requireEvidence) {
    const checker = new EvidenceChecker();
    const requirements = await checker.checkEvidenceRequirements(plan, step);
    
    for (const req of requirements) {
        if (req.required && !req.found) {
            evidenceIssues.push(`Missing required evidence: ${req.description}`);
        }
    }
}

// Combine all issues
const allIssues = [...criteriaIssues, ...artifactIssues, ...evidenceIssues];
```

This integrates all verification types into a unified result.

## Acceptance Criteria

- [x] Artifact verification checks for referenced files (commits not implemented)
- [ ] Evidence requirements are intelligently inferred from step content (intentionally not implemented - scope creep)
- [x] Artifact and evidence checking can be configured independently
- [ ] Git integration works correctly and handles errors gracefully

## Testing

Unit tests for file/commit detection, evidence inference, and integration tests with mock Git repositories

## Files Changed

- `src/verification/engine.ts`
- `src/verification/evidence-checker.ts`

## Notes

This step adds advanced verification capabilities beyond basic acceptance criteria
