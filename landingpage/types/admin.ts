export interface AdminUser {
  user_id: string;
  role: 'admin' | 'moderator';
  permissions: Record<string, any>;
  created_at: string;
}

export interface AdminSession {
  user_id: string;
  role: 'admin' | 'moderator';
  isAuthenticated: boolean;
}



