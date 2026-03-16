import * as SecureStore from 'expo-secure-store';

/**
 * Token pair structure
 */
export interface TokenPair {
  accessToken: string;
  expiresAt: string;
}

const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_token_expires';

/**
 * Save authentication token securely
 */
export async function saveTokens(tokens: TokenPair): Promise<void> {
  await Promise.all([SecureStore.setItemAsync(TOKEN_KEY, tokens.accessToken), SecureStore.setItemAsync(EXPIRES_KEY, tokens.expiresAt)]);
}

/**
 * Get stored authentication tokens
 */
export async function getTokens(): Promise<TokenPair | null> {
  const [accessToken, expiresAt] = await Promise.all([SecureStore.getItemAsync(TOKEN_KEY), SecureStore.getItemAsync(EXPIRES_KEY)]);

  if (!accessToken || !expiresAt) {
    return null;
  }

  return { accessToken, expiresAt };
}

/**
 * Get only the access token
 */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Clear all stored tokens
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {}), SecureStore.deleteItemAsync(EXPIRES_KEY).catch(() => {})]);
}

/**
 * Check if the current token is expired
 */
export async function isTokenExpired(): Promise<boolean> {
  const expiresAt = await SecureStore.getItemAsync(EXPIRES_KEY);
  if (!expiresAt) {
    return true;
  }

  const expiryDate = new Date(expiresAt);
  const now = new Date();

  // Consider token expired 1 minute before actual expiry for safety
  return expiryDate.getTime() - now.getTime() < 60000;
}
