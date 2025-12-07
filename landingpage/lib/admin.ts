import { supabase } from './supabase';
import type { AdminUser } from '@/types/admin';

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return true;
}

export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
}

export async function isModerator(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return data.role === 'moderator' || data.role === 'admin';
}



