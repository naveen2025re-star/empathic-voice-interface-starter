-- Migration: Add unique constraint for active voice agents
-- Ensures only one active voice agent per business to prevent concurrency issues

CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_voice_agent 
ON voice_agents (business_id) 
WHERE is_active = true;

-- Add comment for documentation
COMMENT ON INDEX uniq_active_voice_agent IS 'Ensures only one active voice agent per business to prevent race conditions under concurrent requests';