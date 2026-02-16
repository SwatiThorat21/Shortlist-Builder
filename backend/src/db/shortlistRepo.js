import { supabase } from './supabaseClient.js';
import { AppError } from '../utils/errors.js';

export async function saveShortlist({ need, requirements, results }) {
  const { data, error } = await supabase
    .from('shortlists')
    .insert({ need, requirements, results })
    .select('id, need, requirements, results, created_at')
    .single();

  if (error) throw new AppError(500, 'SUPABASE_CONNECTION_ERROR', 'Failed to save shortlist', { reason: error.message });
  return data;
}

export async function fetchRecentShortlists(limit = 5) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);
  const { data, error } = await supabase
    .from('shortlists')
    .select('id, need, requirements, results, created_at')
    .order('created_at', { ascending: false })
    .limit(safeLimit);

  if (error) throw new AppError(500, 'SUPABASE_CONNECTION_ERROR', 'Failed to fetch shortlists', { reason: error.message });
  return data;
}

export async function deleteShortlistById(id) {
  const { error } = await supabase.from('shortlists').delete().eq('id', id);
  if (error) throw new AppError(500, 'SUPABASE_CONNECTION_ERROR', 'Failed to delete shortlist', { reason: error.message });
}

export async function checkSupabaseHealth() {
  const start = Date.now();
  const { error } = await supabase.from('shortlists').select('id').limit(1);
  if (error) throw error;
  return Date.now() - start;
}
