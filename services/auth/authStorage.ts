import * as SecureStore from 'expo-secure-store';

/**
 * Synchronous in-memory storage adapter backed by chunked SecureStore persistence.
 *
 * @better-auth/expo v1.5.5 requires a *synchronous* storage interface
 * { getItem(key): string|null, setItem(key, value): any }
 * because the expoClient plugin reads cookies synchronously inside every
 * fetch request's init hook.
 *
 * We satisfy this with a module-level Map (sync reads/writes) and fire-and-
 * forget SecureStore persistence in the background.  Large values are split
 * into 1 800-byte chunks to stay under SecureStore's 2 048-byte limit.
 *
 * Keys written by expoClient({ storagePrefix: 'bueboka' }):
 *   bueboka_cookie        – serialised session cookie string
 *   bueboka_session_data  – cached /get-session JSON
 */

const CHUNK_SIZE = 1800;
const META_SUFFIX = '__meta';
const CHUNK_SUFFIX = '__c';

/** Keys that expoClient writes; pre-loaded on startup so the cache is warm. */
const KNOWN_KEYS = ['bueboka_cookie', 'bueboka_session_data'];

// ─── Module-level state (avoids class / prototype issues under Babel) ────────
const _cache = new Map<string, string>();
let _ready = false;

// ─── Chunked async helpers ───────────────────────────────────────────────────

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
   * Pre-load the known expoClient keys from SecureStore into the in-memory
   * cache. Call once early in AuthContext before any API requests fire so
   * that the session cookie is available synchronously on the first request.
   */
  async initialize(): Promise<void> {
    if (_ready) return;
    try {
      const values = await Promise.all(KNOWN_KEYS.map(_read));
      KNOWN_KEYS.forEach((key, i) => {
        const v = values[i];
        if (v != null) _cache.set(key, v);
      });
    } finally {
      _ready = true;
    }
  },

  /** Synchronous read – satisfies ExpoClientOptions.storage */
  getItem(key: string): string | null {
    return _cache.get(key) ?? null;
  },

  /** Synchronous write – satisfies ExpoClientOptions.storage */
  setItem(key: string, value: string): void {
    _cache.set(key, value);
    _write(key, value).catch(() => {});
  },

  /** Convenience delete (not required by expoClient but useful elsewhere) */
  deleteItem(key: string): void {
    _cache.delete(key);
    _clearChunks(key)
      .then(() => SecureStore.deleteItemAsync(key).catch(() => {}))
      .catch(() => {});
  },
};
