# Performance Analysis

## Source
Database profiling session on 2026-02-07

## Original Query
"Why is the user lookup slow?"

## Findings

### Critical Bottleneck Identified
The `users` table is missing an index on the `email` column. This causes full table scans on every login attempt.

**Specific metrics:**
- Average query time: 2.3 seconds
- 95th percentile: 8.7 seconds
- Full table scans per minute: 450

### Recommended Fix
Add a unique index on `users.email`:
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

Expected improvement: Query time should drop to <10ms.

### Secondary Issue
The `sessions` table has no cleanup job, growing unbounded. Recommend adding a TTL-based cleanup.

## Relevance Score
0.95 - This is the primary performance issue affecting user experience.
