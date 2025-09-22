-- Migration: Add unique constraint for business contexts
-- Ensures only one business context per business to prevent duplicates

-- Remove any duplicate business contexts first (keep the latest one)
DELETE FROM business_contexts 
WHERE id NOT IN (
  SELECT id 
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY business_id ORDER BY updated_at DESC) as rn 
    FROM business_contexts
  ) ranked 
  WHERE rn = 1
);

-- Add unique constraint on business_id
CREATE UNIQUE INDEX IF NOT EXISTS uniq_business_context 
ON business_contexts (business_id);

-- Add comment for documentation
COMMENT ON INDEX uniq_business_context IS 'Ensures only one business context per business to prevent duplicate entries';