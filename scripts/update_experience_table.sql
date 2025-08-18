-- Update experience table to support month/year date ranges
ALTER TABLE experience 
DROP COLUMN IF EXISTS duration,
ADD COLUMN start_month INTEGER CHECK (start_month >= 1 AND start_month <= 12),
ADD COLUMN start_year INTEGER CHECK (start_year >= 1900 AND start_year <= 2100),
ADD COLUMN end_month INTEGER CHECK (end_month >= 1 AND end_month <= 12),
ADD COLUMN end_year INTEGER CHECK (end_year >= 1900 AND end_year <= 2100);

-- Remove any existing mock data
DELETE FROM experience;

-- Add index for date sorting
CREATE INDEX IF NOT EXISTS idx_experience_dates ON experience(start_year DESC, start_month DESC);
