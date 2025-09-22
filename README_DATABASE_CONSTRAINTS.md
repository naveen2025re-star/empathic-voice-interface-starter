# Database Constraints and Data Integrity

This document outlines the database constraints implemented to ensure data integrity for the AI Voice Sales Bot platform.

## Business Context Constraints

- **Unique Business Context**: Each business can only have one business context record
  - Constraint: `UNIQUE(business_id)` on `business_contexts` table
  - Implementation: Database-level unique constraint
  - Handled via: Atomic upserts using `INSERT ... ON CONFLICT DO UPDATE`

## Voice Agent Constraints

- **Single Active Agent**: Each business can only have one active voice agent at any time
  - Constraint: `UNIQUE(business_id) WHERE is_active = true` on `voice_agents` table
  - Implementation: Partial unique index at database level
  - Created via: `CREATE UNIQUE INDEX uniq_active_voice_agent ON voice_agents (business_id) WHERE is_active = true`
  - Handled via: Transaction-wrapped deactivate + insert operations

## Data Integrity Features

1. **Atomic Operations**: All upsert operations use database-level atomic transactions
2. **Concurrency Safety**: Unique constraints prevent race conditions under concurrent requests
3. **Post-condition Checks**: Additional integrity verification in application code
4. **Transaction Rollback**: Automatic rollback on constraint violations

## Migration Files

- `migrations/001_unique_active_voice_agent.sql`: Creates unique constraint for active voice agents
- Database initialization in `server/db.ts`: Ensures constraints exist at startup