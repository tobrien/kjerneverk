# Step 02: Implement Sessions Table Cleanup Job

## Objective

Prevent the 'sessions' table from growing unbounded, ensuring it remains performant.

## Background

The 'sessions' table lacks a cleanup mechanism, as noted in the 'performance-analysis.md', leading to database bloat and potential degradations.

## Tasks

### 1. 02.1

Add a new 'expires_at' column to the sessions table with default values.

### 2. 02.2

Create a scheduled job to delete expired sessions regularly.

### 3. 02.3

Verify that session expiration aligns with existing user session logic.

## Acceptance Criteria

- [ ] Sessions older than their expiration are removed by the cleanup job.
- [ ] No existing functionality is broken due to the addition of the 'expires_at' column.

## Provenance


**Constraints addressed:** CONSTRAINT-2, CONSTRAINT-5
**Evidence used:** schema-requirements.md
**Approach elements:** none


## Notes

This enhances performance and data integrity without altering existing session management logic.
