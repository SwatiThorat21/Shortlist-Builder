import { supabase } from './supabaseClient.js';
import { logger } from '../utils/logger.js';

export async function getCachedPage(url) {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('vendor_page_cache')
    .select('content, expires_at')
    .eq('url', url)
    .gt('expires_at', nowIso)
    .maybeSingle();

  if (error || !data) {
    if (error) logger.warn({ err: error, url }, 'Cache read failed');
    return null;
  }

  void touchCacheHit(url);
  return data.content;
}

export async function setCachedPage(url, content, ttlMinutes) {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const { error } = await supabase
    .from('vendor_page_cache')
    .upsert({ url, content, expires_at: expiresAt, fetched_at: new Date().toISOString() });
  if (error) {
    logger.warn({ err: error, url }, 'Cache upsert failed');
    return false;
  }
  return true;
}

async function touchCacheHit(url) {
  const { error } = await supabase.rpc('increment_vendor_cache_hit', { cache_url: url });
  if (error) {
    logger.debug({ err: error, url }, 'Cache hit metrics update failed');
  }
}

export async function deleteExpiredCacheEntries() {
  const nowIso = new Date().toISOString();
  const { count, error } = await supabase
    .from('vendor_page_cache')
    .delete({ count: 'exact' })
    .lte('expires_at', nowIso);

  if (error) {
    logger.warn({ err: error }, 'Expired cache cleanup failed');
    return 0;
  }
  return count || 0;
}
