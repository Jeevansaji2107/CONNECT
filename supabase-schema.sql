-- Connect Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE,
    email_verified TIMESTAMPTZ,
    image TEXT,
    bio TEXT,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    media_urls TEXT[],
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Follows table
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- NextAuth tables for session management
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Indexes for better performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now, can be tightened later)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all on posts" ON posts FOR ALL USING (true);
CREATE POLICY "Allow all on comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all on likes" ON likes FOR ALL USING (true);
CREATE POLICY "Allow all on follows" ON follows FOR ALL USING (true);

-- Insert Demo User for instant access
INSERT INTO users (id, name, email, image, bio)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Maddy',
    'maddy@connect.social',
    '/avatars/maddy.png',
    'SYSTEM_ARCHITECT: Orchestrating the neural connections of Manchester. [STATUS: ONLINE]'
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    image = EXCLUDED.image,
    bio = EXCLUDED.bio;

-- Insert Demo Posts
INSERT INTO posts (id, content, author_id, created_at)
VALUES 
    (uuid_generate_v4(), 'Welcome to Connect. The neural web is now fully synchronized. #Connect #Social', '00000000-0000-0000-0000-000000000000', NOW() - INTERVAL '2 hours'),
    (uuid_generate_v4(), 'System initializing... The social layer for the future is now online. #Connect #NextGen', '00000000-0000-0000-0000-000000000000', NOW() - INTERVAL '5 hours'),
    (uuid_generate_v4(), 'Engagement flows are looking optimal today. Transmitting from the central node. 🌐💾', '00000000-0000-0000-0000-000000000000', NOW() - INTERVAL '10 hours');

-- Note: In a real app, these posts would need to exist for comments to work, 
-- but since IDs are generated dynamically in this script for posts, 
-- we typically let the user create them. However, for a "WOW" demo, 
-- we could fetch the generated post IDs if we used a more complex script.
-- For simplicity, we'll stick to a robust user and post population.
