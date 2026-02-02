-- Migration to add global location support
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS location VARCHAR(255);
