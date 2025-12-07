-- Migration 017: Landing Page Tables
-- Creates all tables needed for the landing page: news, forum, changelog, admin, server stats, etc.

-- ============================================
-- 1. NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('news', 'changelog', 'event')),
  is_featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 2. LIVE FEED TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.live_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('ITEM_DROP', 'LEVEL_UP', 'BOSS_KILL', 'LEGENDARY_DROP', 'ACHIEVEMENT', 'CUSTOM')),
  character_name TEXT NOT NULL,
  character_id TEXT, -- No foreign key to avoid type conflicts (characters.id may be TEXT or UUID depending on migration)
  message TEXT NOT NULL,
  item_name TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 3. ROADMAP ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'planned', 'done')),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 4. FORUM TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'guides', 'trade', 'bugreport')),
  views INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_post_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.forum_views (
  topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (topic_id, user_id)
);

-- ============================================
-- 5. CHANGELOG TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.changelog_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  release_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.changelog_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.changelog_versions(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('balancing', 'content', 'bugfix', 'feature')),
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 6. ADMIN TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 7. SERVER STATS TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.server_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  players_online INTEGER DEFAULT 0,
  players_24h_avg INTEGER DEFAULT 0,
  uptime_seconds BIGINT DEFAULT 0,
  unique_drops_today INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert initial server stats record
INSERT INTO public.server_stats (id, players_online, players_24h_avg, uptime_seconds, unique_drops_today)
VALUES (gen_random_uuid(), 0, 0, 0, 0)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.server_stats_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  players_online INTEGER DEFAULT 0,
  players_24h_avg INTEGER DEFAULT 0
);

-- ============================================
-- 8. CHARACTER LAST ACTIVE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.character_last_active (
  character_id TEXT PRIMARY KEY, -- No foreign key to avoid type conflicts (characters.id may be TEXT or UUID depending on migration)
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================
-- 9. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_type ON public.news(type);
CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(is_featured) WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_live_feed_created_at ON public.live_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_feed_public ON public.live_feed(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_live_feed_event_type ON public.live_feed(event_type);

CREATE INDEX IF NOT EXISTS idx_roadmap_status ON public.roadmap_items(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_priority ON public.roadmap_items(priority DESC);

CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON public.forum_topics(category);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created_at ON public.forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_topics_pinned ON public.forum_topics(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_forum_topics_last_post_at ON public.forum_topics(last_post_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_posts_topic_id ON public.forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_changelog_versions_release_date ON public.changelog_versions(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_changelog_entries_version_id ON public.changelog_entries(version_id);

CREATE INDEX IF NOT EXISTS idx_character_last_active_last_active_at ON public.character_last_active(last_active_at);

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- News: Public read, admin write
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published news" ON public.news FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Admins can manage news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Live Feed: Public read, admin write
ALTER TABLE public.live_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view public live feed" ON public.live_feed FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Admins can manage live feed" ON public.live_feed FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Roadmap: Public read, admin write
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view roadmap" ON public.roadmap_items FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage roadmap" ON public.roadmap_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Forum Topics: Public read, authenticated write
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view forum topics" ON public.forum_topics FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own topics" ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all topics" ON public.forum_topics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Forum Posts: Public read, authenticated write
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view forum posts" ON public.forum_posts FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.forum_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Forum Likes: Authenticated users
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view likes" ON public.forum_likes FOR SELECT USING (TRUE);
CREATE POLICY "Users can like posts" ON public.forum_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike own likes" ON public.forum_likes FOR DELETE USING (auth.uid() = user_id);

-- Forum Views: Authenticated users
ALTER TABLE public.forum_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view view counts" ON public.forum_views FOR SELECT USING (TRUE);
CREATE POLICY "Users can record views" ON public.forum_views FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Changelog: Public read, admin write
ALTER TABLE public.changelog_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view changelog versions" ON public.changelog_versions FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage changelog" ON public.changelog_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view changelog entries" ON public.changelog_entries FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage changelog entries" ON public.changelog_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Admin Users: Only admins can view
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Server Stats: Public read, system write (via service role)
ALTER TABLE public.server_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view server stats" ON public.server_stats FOR SELECT USING (TRUE);

-- Server Stats History: Public read
ALTER TABLE public.server_stats_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view server stats history" ON public.server_stats_history FOR SELECT USING (TRUE);

-- Character Last Active: Users can view own, admins can view all
ALTER TABLE public.character_last_active ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own character activity" ON public.character_last_active FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.characters WHERE id::text = character_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all character activity" ON public.character_last_active FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- ============================================
-- 11. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update forum topic stats when post is added
CREATE OR REPLACE FUNCTION update_forum_topic_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_topics
  SET 
    posts_count = (SELECT COUNT(*) FROM public.forum_posts WHERE topic_id = NEW.topic_id),
    last_post_at = NEW.created_at
  WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_post_insert_trigger
AFTER INSERT ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_forum_topic_stats();

-- Function to update forum post likes count
CREATE OR REPLACE FUNCTION update_forum_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts
    SET likes_count = (SELECT COUNT(*) FROM public.forum_likes WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts
    SET likes_count = (SELECT COUNT(*) FROM public.forum_likes WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_likes_update_trigger
AFTER INSERT OR DELETE ON public.forum_likes
FOR EACH ROW
EXECUTE FUNCTION update_forum_post_likes();

-- Function to update character_last_active (to be called from game)
CREATE OR REPLACE FUNCTION update_character_activity(character_id_param TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.character_last_active (character_id, last_active_at, updated_at)
  VALUES (character_id_param, timezone('utc'::text, now()), timezone('utc'::text, now()))
  ON CONFLICT (character_id) 
  DO UPDATE SET 
    last_active_at = timezone('utc'::text, now()),
    updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if character can be deleted (3 days inactive)
CREATE OR REPLACE FUNCTION can_delete_character(character_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  last_active TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT last_active_at INTO last_active
  FROM public.character_last_active
  WHERE character_id = character_id_param;
  
  IF last_active IS NULL THEN
    RETURN TRUE; -- No activity recorded, allow deletion
  END IF;
  
  RETURN (timezone('utc'::text, now()) - last_active) > INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 12. COMMENTS
-- ============================================
COMMENT ON TABLE public.news IS 'News and announcements for the landing page';
COMMENT ON TABLE public.live_feed IS 'Live feed of in-game events';
COMMENT ON TABLE public.roadmap_items IS 'Roadmap items showing development progress';
COMMENT ON TABLE public.forum_topics IS 'Forum discussion topics';
COMMENT ON TABLE public.forum_posts IS 'Forum posts/replies';
COMMENT ON TABLE public.changelog_versions IS 'Game version changelogs';
COMMENT ON TABLE public.admin_users IS 'Admin user permissions';
COMMENT ON TABLE public.server_stats IS 'Server statistics cache';
COMMENT ON TABLE public.character_last_active IS 'Tracks last activity time for characters';

