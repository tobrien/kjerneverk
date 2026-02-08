# Schema Migration Requirements

## Source
Architecture review meeting notes

## Original Query
"What schema changes are needed for the performance fix?"

## Findings

### Required Changes

1. **Add email index** (from performance analysis)
   - Table: `users`
   - Column: `email`
   - Type: UNIQUE INDEX

2. **Add sessions cleanup**
   - Add `expires_at` column to `sessions` table
   - Create cleanup job to remove expired sessions

3. **Backward Compatibility Requirements**
   - All changes must be additive (no column removals)
   - Existing queries must continue to work
   - No changes to primary key structure
   - Migration must be reversible

### Migration Order
1. Add indexes (non-breaking)
2. Add new columns with defaults (non-breaking)
3. Deploy new code that uses new columns
4. Cleanup old data (optional, can be deferred)

## Relevance Score
0.9 - Defines the implementation approach for schema changes.
