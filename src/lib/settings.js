import { supabase } from './supabase';

// localStorage-backed cache of site_settings so DB-driven images/text paint with
// the correct value instantly on reload (no flash of the hardcoded fallback).
// Pattern: read cache synchronously for initial render, then revalidate from API.
const CACHE_KEY = 'sp_settings_cache_v1';

let cache = {};
try {
  cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {};
} catch {
  cache = {};
}

// Initial value for a piece of state: the cached value if we have one, else the
// component's own fallback. Use in useState initializers.
export function cachedSetting(key, fallback = '') {
  const v = cache[key];
  return v !== undefined && v !== null && v !== '' ? v : fallback;
}

// All cached keys matching a prefix, as { key: value } (e.g. 'category_banner_').
export function cachedByPrefix(prefix) {
  const out = {};
  for (const [k, v] of Object.entries(cache)) {
    if (k.startsWith(prefix)) out[k] = v;
  }
  return out;
}

// Writes already-fetched rows into the cache (for callers using their own query,
// e.g. App.jsx's .or()).
export function primeCache(rows) {
  if (!rows) return;
  let changed = false;
  rows.forEach((row) => {
    if (cache[row.key] !== row.value) {
      cache[row.key] = row.value;
      changed = true;
    }
  });
  if (changed) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      /* storage full / unavailable — cache stays in-memory for this session */
    }
  }
}

// Fetches the given keys, updates the cache, and returns the rows (same shape as
// a supabase select: [{ key, value }]). Components keep their existing apply logic.
export async function loadSettings(keys) {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', keys);
  primeCache(data);
  return data;
}
