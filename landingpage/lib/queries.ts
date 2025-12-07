import { supabase } from './supabase';
import type { News, LiveFeedEvent, RoadmapItem, ForumTopic, ForumPost, ChangelogVersion, ChangelogEntry, ServerStats, Character } from '@/types';

// News queries
export async function getNews(limit = 10, featured = false) {
  let query = supabase
    .from('news')
    .select('*')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as News[];
}

// Live feed queries
export async function getLiveFeed(limit = 20) {
  const { data, error } = await supabase
    .from('live_feed')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as LiveFeedEvent[];
}

// Roadmap queries
export async function getRoadmapItems() {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as RoadmapItem[];
}

// Forum queries
export async function getForumTopics(category?: string, limit = 20) {
  let query = supabase
    .from('forum_topics')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('last_post_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ForumTopic[];
}

export async function getForumTopic(id: string) {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ForumTopic;
}

export async function getForumPosts(topicId: string) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as ForumPost[];
}

// Changelog queries
export async function getChangelogVersions(limit = 10) {
  const { data, error } = await supabase
    .from('changelog_versions')
    .select('*')
    .order('release_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as ChangelogVersion[];
}

export async function getChangelogEntries(versionId: string) {
  const { data, error } = await supabase
    .from('changelog_entries')
    .select('*')
    .eq('version_id', versionId)
    .order('order', { ascending: true });

  if (error) throw error;
  return (data || []) as ChangelogEntry[];
}

// Server stats queries
export async function getServerStats() {
  const { data, error } = await supabase
    .from('server_stats')
    .select('*')
    .order('last_updated', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as ServerStats;
}

// Ranking queries
export async function getTopRanking(limit = 10) {
  const { data, error } = await supabase
    .from('characters')
    .select('id, name, level, exp, gold, profession')
    .order('level', { ascending: false })
    .order('exp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Character[];
}

// Character queries
export async function getUserCharacters(userId: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Character[];
}

