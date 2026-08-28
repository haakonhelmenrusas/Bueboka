import * as SecureStore from 'expo-secure-store';

/**
 * Synchronous in-memory storage adapter for @better-auth/expo.
 * Uses chunked SecureStore persistence to handle size limits.
 */

const CHUNK_SIZE = 1800;
const META_SUFFIX = '__meta';
const CHUNK_SUFFIX = '__c';

const KNOWN_KEYS = ['bueboka_cookie', 'bueboka_session_data'];

// Module-level cache survives Fast Refresh via globalThis
const CACHE_KEY = '__bueboka_authStorage_cache';
const _cache: Map<string, string> = (globalThis as any)[CACHE_KEY] ?? ((globalThis as any)[CACHE_KEY] = new Map<string, string>());

// Chunked async helpers for SecureStore

async function _read(key: string): Promise<string | null> {
  const meta = await SecureStore.getItemAsync(key + META_SUFFIX).catch(() => null);
  if (meta) {
    try {
      const { n } = JSON.parse(meta) as { n: number };
      const chunks = await Promise.all(Array.from({ length: n }, (_, i) => SecureStore.getItemAsync(key + CHUNK_SUFFIX + i)));
      if (chunks.some((c) => c === null)) return null;
      return (chunks as string[]).join('');
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key).catch(() => null);
}

async function _write(key: string, value: string): Promise<void> {
  if (value.length <= CHUNK_SIZE) {
    await _clearChunks(key);
    await SecureStore.setItemAsync(key, value);
  } else {
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) chunks.push(value.slice(i, i + CHUNK_SIZE));
    await Promise.all([
      SecureStore.setItemAsync(key + META_SUFFIX, JSON.stringify({ n: chunks.length })),
      ...chunks.map((c, i) => SecureStore.setItemAsync(key + CHUNK_SUFFIX + i, c)),
    ]);
    await SecureStore.deleteItemAsync(key).catch(() => {});
  }
}

async function _clearChunks(key: string): Promise<void> {
  const meta = await SecureStore.getItemAsync(key + META_SUFFIX).catch(() => null);
  if (!meta) return;
  try {
    const { n } = JSON.parse(meta) as { n: number };
    await Promise.all([
      SecureStore.deleteItemAsync(key + META_SUFFIX).catch(() => {}),
      ...Array.from({ length: n }, (_, i) => SecureStore.deleteItemAsync(key + CHUNK_SUFFIX + i).catch(() => {})),
    ]);
  } catch {
    SecureStore.deleteItemAsync(key + META_SUFFIX).catch(() => {});
  }
}

// ─── Plain-object adapter (no class / prototype chain) ───────────────────────

export const authStorage = {
  /**
   * Pre-load known keys from SecureStore into cache
   */
  async initialize(): Promise<void> {
    const values = await Promise.all(KNOWN_KEYS.map(_read));
    KNOWN_KEYS.forEach((key, i) => {
      const v = values[i];
      if (v != null) _cache.set(key, v);
    });
  },

  getItem(key: string): string | null {
    return _cache.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    _cache.set(key, value);
    _write(key, value).catch(() => {});
  },

  deleteItem(key: string): void {
    _cache.delete(key);
    _clearChunks(key)
      .then(() => SecureStore.deleteItemAsync(key).catch(() => {}))
      .catch(() => {});
  },
};
