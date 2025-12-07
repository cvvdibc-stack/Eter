import { ForumTopic, ForumPost } from './index';

export interface ForumTopicWithAuthor extends ForumTopic {
  author_name?: string;
  author_avatar?: string;
}

export interface ForumPostWithAuthor extends ForumPost {
  author_name?: string;
  author_avatar?: string;
}

export type ForumCategory = 'general' | 'guides' | 'trade' | 'bugreport';



