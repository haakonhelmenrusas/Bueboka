import * as SecureStore from 'expo-secure-store';
import { TOKEN_STORAGE_KEYS } from '../api/constants';

/**
 * Token pair structure
 */
export interface TokenPair {
  accessToken: string;
  expiresAt: string;
}

const { AUTH_TOKEN, EXPIRES } = TOKEN_STORAGE_KEYS;

/**
 * Save authentication token securely
 */
export async function saveTokens(tokens: TokenPair): Promise<void> {
  await Promise.all([SecureStore.setItemAsync(AUTH_TOKEN, tokens.accessToken), SecureStore.setItemAsync(EXPIRES, tokens.expiresAt)]);
}

/**
 * Get stored authentication tokens
 */
export async function getTokens(): Promise<TokenPair | null> {
  const [accessToken, expiresAt] = await Promise.all([SecureStore.getItemAsync(AUTH_TOKEN), SecureStore.getItemAsync(EXPIRES)]);

  if (!accessToken || !expiresAt) {
    return null;
  }

  return { accessToken, expiresAt };
}

/**
 * Get only the access token
 */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(AUTH_TOKEN);
}

/**
 * Clear all stored tokens
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([SecureStore.deleteItemAsync(AUTH_TOKEN).catch(() => {}), SecureStore.deleteItemAsync(EXPIRES).catch(() => {})]);
}

/**
 * Check if the current token is expired
 */
export async function isTokenExpired(): Promise<boolean> {
  const expiresAt = await SecureStore.getItemAsync(EXPIRES);
  if (!expiresAt) {
    return true;
  }

  const expiryDate = new Date(expiresAt);
  const now = new Date();

  // Consider token expired 1 minute before actual expiry for safety
  return expiryDate.getTime() - now.getTime() < 60000;
}
