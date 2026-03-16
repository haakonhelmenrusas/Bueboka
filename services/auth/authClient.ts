import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Better Auth client for Expo
 * Handles authentication with built-in OAuth support for React Native
 */
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [
    expoClient({
      scheme: 'bueboka', // App scheme from app.json
      storagePrefix: 'bueboka',
      storage: SecureStore,
    }),
  ],
});
