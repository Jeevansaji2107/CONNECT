-- Migration to add branding and categorization to groups
ALTER TABLE groups ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500);
ALTER TABLE groups ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Index for tags searching
CREATE INDEX IF NOT EXISTS idx_groups_tags ON groups USING GIN (tags);
