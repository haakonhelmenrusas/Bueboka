import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { authStorage } from './authStorage';

// Get the base API URL and construct the auth base URL
// better-auth expects the baseURL to point to the auth handler
// If your API is at http://localhost:3000/api, the auth handler is at http://localhost:3000/api/auth
//
// Example endpoint construction:
// - API_BASE_URL: http://192.168.0.90:3000/api
// - AUTH_BASE_URL: http://192.168.0.90:3000/api/auth
// - signIn.social() calls: http://192.168.0.90:3000/api/auth/sign-in/social
// - OAuth callback: http://192.168.0.90:3000/api/auth/callback/google
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

// Extract the base URL without /api for the origin header
const getOriginFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    return 'http://localhost:3000';
  }
};

const ORIGIN = getOriginFromUrl(API_BASE_URL);

/**
 * Better Auth client for Expo
 * Handles authentication with built-in OAuth support for React Native
 *
 * The expoClient plugin:
 * - Stores tokens in SecureStore instead of cookies
 * - Handles OAuth redirects with deep links (scheme: bueboka://)
 * - Monitors network state for offline support
 * - Automatically refreshes tokens
 */
export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    headers: {
      Origin: ORIGIN,
    },
  },
  plugins: [
    expoClient({
      scheme: 'bueboka', // App scheme from app.json - used for OAuth redirects
      storagePrefix: 'bueboka',
      storage: authStorage,
    }),
  ],
});
