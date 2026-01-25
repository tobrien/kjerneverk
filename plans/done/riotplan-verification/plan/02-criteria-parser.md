# Step 02: Criteria Parser

## Objective

Implement a parser that extracts verification criteria from REQUIREMENTS.md.

## Background

The analysis REQUIREMENTS.md should contain a "Verification Criteria" section with checkboxes organized by priority. This parser extracts those into structured data.

## Tasks

### 2.1 Create Criteria Parser

Create `/Users/tobrien/gitw/kjerneverk/riotplan/src/verification/criteria-parser.ts`:

```typescript
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { VerificationCriterion, CriteriaPriority } from "./types.js";
import { CRITERIA_PATTERNS } from "./constants.js";

export interface ParsedCriteria {
    criteria: VerificationCriterion[];
    source: string;
    parseErrors: string[];
}

/**
 * Parse verification criteria from a plan's analysis
 */
export async function parseCriteria(planPath: string): Promise<ParsedCriteria> {
    const reqPath = join(planPath, "analysis", "REQUIREMENTS.md");
    
    try {
        const content = await readFile(reqPath, "utf-8");
        return parseCriteriaFromContent(content, reqPath);
    } catch (error) {
        return {
            criteria: [],
            source: reqPath,
            parseErrors: [`Could not read ${reqPath}: ${(error as Error).message}`],
        };
    }
}

/**
 * Parse criteria from markdown content
 */
export function parseCriteriaFromContent(
    content: string,
    source: string
): ParsedCriteria {
    const criteria: VerificationCriterion[] = [];
    const parseErrors: string[] = [];
    
    // Find the Verification Criteria section
    const sectionMatch = content.match(CRITERIA_PATTERNS.verificationSection);
    if (!sectionMatch) {
        return {
            criteria: [],
            source,
            parseErrors: ["No 'Verification Criteria' section found"],
        };
    }
    
    // Extract content after the section header until next ## header
    const sectionStart = sectionMatch.index! + sectionMatch[0].length;
    const nextSectionMatch = content.slice(sectionStart).match(/^##\s+[^#]/m);
    const sectionEnd = nextSectionMatch 
        ? sectionStart + nextSectionMatch.index! 
        : content.length;
    const sectionContent = content.slice(sectionStart, sectionEnd);
    
    // Split into priority sections
    const lines = sectionContent.split("\n");
    let currentPriority: CriteriaPriority = "should";  // default
    let lineNumber = content.slice(0, sectionStart).split("\n").length;
    
    for (const line of lines) {
        lineNumber++;
        
        // Check for priority headers
        if (CRITERIA_PATTERNS.mustHaveHeader.test(line)) {
            currentPriority = "must";
            continue;
        }
        if (CRITERIA_PATTERNS.shouldHaveHeader.test(line)) {
            currentPriority = "should";
            continue;
        }
        if (CRITERIA_PATTERNS.couldHaveHeader.test(line)) {
            currentPriority = "could";
            continue;
        }
        
        // Check for checkbox items
        const checkboxMatch = line.match(/^[-*]\s*\[([x ])\]\s*(.+)$/i);
        if (checkboxMatch) {
            const text = checkboxMatch[2].trim();
            const id = generateCriterionId(text, criteria.length);
            
            criteria.push({
                id,
                text,
                priority: currentPriority,
                source,
                lineNumber,
            });
        }
    }
    
    if (criteria.length === 0) {
        parseErrors.push("No checkbox criteria found in Verification Criteria section");
    }
    
    return { criteria, source, parseErrors };
}

/**
 * Generate a unique ID for a criterion
 */
function generateCriterionId(text: string, index: number): string {
    // Create a short, readable ID from the text
    const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30);
    return `${String(index + 1).padStart(3, "0")}-${slug}`;
}

/**
 * Get criteria summary statistics
 */
export function getCriteriaSummary(criteria: VerificationCriterion[]): {
    total: number;
    must: number;
    should: number;
    could: number;
} {
    return {
        total: criteria.length,
        must: criteria.filter(c => c.priority === "must").length,
        should: criteria.filter(c => c.priority === "should").length,
        could: criteria.filter(c => c.priority === "could").length,
    };
}
```

### 2.2 Add to Exports

Update `/Users/tobrien/gitw/kjerneverk/riotplan/src/verification/index.ts`:

```typescript
export * from "./criteria-parser.js";
```

## Acceptance Criteria

- [ ] `parseCriteria` reads REQUIREMENTS.md and extracts criteria
- [ ] Priority levels correctly detected from headers
- [ ] Checkbox items parsed with text
- [ ] Line numbers captured for reference
- [ ] Graceful handling of missing section
- [ ] Graceful handling of missing file
- [ ] TypeScript compiles without errors

## Testing

```typescript
describe("Criteria Parser", () => {
    it("should parse criteria from markdown", () => {
        const content = `
# Requirements

## Verification Criteria

### Must Have
- [ ] User authentication endpoint exists
- [ ] Session tokens have 24hr expiry

### Should Have
- [ ] Rate limiting on auth endpoints

### Could Have
- [ ] Remember me functionality
`;
        
        const result = parseCriteriaFromContent(content, "test.md");
        
        expect(result.criteria).toHaveLength(4);
        expect(result.criteria[0].priority).toBe("must");
        expect(result.criteria[2].priority).toBe("should");
        expect(result.criteria[3].priority).toBe("could");
    });
    
    it("should handle missing section", () => {
        const content = "# Requirements\n\nSome content without criteria.";
        const result = parseCriteriaFromContent(content, "test.md");
        
        expect(result.criteria).toHaveLength(0);
        expect(result.parseErrors).toContain("No 'Verification Criteria' section found");
    });
});
```

## Files Changed

- `riotplan/src/verification/criteria-parser.ts` (new)
- `riotplan/src/verification/index.ts` (export)

## Notes

The parser expects a specific format in REQUIREMENTS.md. The analysis creator from Plan 01 should generate this format by default.
