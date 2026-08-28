import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { authStorage } from './authStorage';
import { AUTH_BASE_URL, API_ORIGIN } from '../api/constants';

/**
 * Better Auth client for Expo with SecureStore and OAuth support
 */
export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    headers: {
      Origin: API_ORIGIN,
    },
  },
  plugins: [
    expoClient({
      scheme: 'bueboka',
      storagePrefix: 'bueboka',
      storage: authStorage,
    }),
  ],
});
