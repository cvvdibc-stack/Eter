// Base types
export type Profession = 'warrior' | 'mage' | 'assassin' | 'cleric';

export interface News {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'changelog' | 'event';
  is_featured: boolean;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveFeedEvent {
  id: string;
  event_type: 'ITEM_DROP' | 'LEVEL_UP' | 'BOSS_KILL' | 'LEGENDARY_DROP' | 'ACHIEVEMENT' | 'CUSTOM';
  character_name: string;
  character_id: string | null;
  message: string;
  item_name: string | null;
  is_public: boolean;
  created_at: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: 'in_progress' | 'planned' | 'done';
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: 'general' | 'guides' | 'trade' | 'bugreport';
  views: number;
  likes_count: number;
  posts_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  last_post_at: string;
}

export interface ForumPost {
  id: string;
  topic_id: string;
  author_id: string;
  content: string;
  likes_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChangelogVersion {
  id: string;
  version: string;
  release_date: string;
  description: string | null;
  created_at: string;
}

export interface ChangelogEntry {
  id: string;
  version_id: string;
  type: 'balancing' | 'content' | 'bugfix' | 'feature';
  title: string;
  description: string | null;
  order: number;
  created_at: string;
}

export interface ServerStats {
  id: string;
  players_online: number;
  players_24h_avg: number;
  uptime_seconds: number;
  unique_drops_today: number;
  last_updated: string;
}

export interface Character {
  id: string;
  name: string;
  profession: Profession;
  level: number;
  exp: number;
  gold: number;
}

export interface CharacterLastActive {
  character_id: string;
  last_active_at: string;
  updated_at: string;
}



