import { supabase } from './supabaseClient.js';

export async function getCachedPage(url) {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('vendor_page_cache')
    .select('content, expires_at')
    .eq('url', url)
    .gt('expires_at', nowIso)
    .maybeSingle();

  if (error || !data) return null;
  return data.content;
}

export async function setCachedPage(url, content, ttlMinutes) {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  await supabase
    .from('vendor_page_cache')
    .upsert({ url, content, expires_at: expiresAt, fetched_at: new Date().toISOString() });
}
