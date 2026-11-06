-- For Tiara, With Love — Supabase Schema
-- Run in Supabase SQL Editor (or via Supabase CLI)

-- ============== STORAGE BUCKETS ==============
-- Create these manually in Supabase Storage:
-- 1. memories (public read, auth upload/replace/delete)
-- 2. artworks (public read, auth upload/replace/delete)
-- 3. audio (public read, auth upload/replace/delete)
-- Note: Use Dashboard > Storage to set policies, or apply via SQL policies below.

-- ============== TABLES ==============

-- Published content snapshot (public site reads this)
CREATE TABLE IF NOT EXISTS published_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_published UNIQUE (id)
);

-- Draft content (admin edits)
CREATE TABLE IF NOT EXISTS draft_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memories (photos + captions + order)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id TEXT UNIQUE NOT NULL,
  src TEXT NOT NULL DEFAULT '',
  alt TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  date TEXT DEFAULT '',
  aspect TEXT DEFAULT 'portrait',
  placeholder BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks (exactly one active record preferred, but allowing list for future)
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id TEXT UNIQUE,
  src TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  title TEXT DEFAULT '',
  year TEXT DEFAULT '',
  medium TEXT DEFAULT '',
  description TEXT DEFAULT '',
  aspect REAL DEFAULT 1.4,
  placeholder BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music track metadata
CREATE TABLE IF NOT EXISTS music_track (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT '',
  artist TEXT DEFAULT '',
  src TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  note TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appearance settings
CREATE TABLE IF NOT EXISTS appearance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auth / Sessions handled by Supabase Auth automatically.
-- Create admin user via Auth > Users in Supabase Dashboard:
-- email: admin@example.com (change to your own)
-- Then add to an admins table if needed:
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============== INDEXES ==============
CREATE INDEX IF NOT EXISTS memories_order_idx ON memories ("order");
CREATE INDEX IF NOT EXISTS artworks_id_idx ON artworks (artwork_id);
CREATE INDEX IF NOT EXISTS published_updated_idx ON published_content (updated_at);
CREATE INDEX IF NOT EXISTS draft_updated_idx ON draft_content (updated_at);

-- ============== RLS POLICIES (example) ==============
-- Enable RLS on tables in Supabase Dashboard or via SQL:
-- ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE draft_content ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE published_content ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appearance ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE music_track ENABLE ROW LEVEL SECURITY;

-- Example: public read for published_content and memories
-- Note: Implement full RLS in Supabase Dashboard > Auth > Policies.
