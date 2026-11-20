import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { authStorage } from './authStorage';
import { stripDataUriImageFromSession } from './sessionSanitize';
import { AUTH_BASE_URL, API_ORIGIN } from '../api/constants';

/**
 * Runs before expoClient's fetch plugin and strips data-URI images from the
 * /get-session payload before it is written to the chunked session storage.
 */
const stripSessionImagePlugin = {
  id: 'strip-session-image',
  fetchPlugins: [
    {
      id: 'strip-session-image',
      name: 'StripSessionImage',
      hooks: {
        async onSuccess(context: any) {
          try {
            const { pathname } = new URL(context.request.url);
            if (pathname.endsWith('/get-session')) stripDataUriImageFromSession(context.data);
          } catch {
            // never block the auth flow
          }
        },
      },
    },
  ],
};

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    headers: {
      Origin: API_ORIGIN,
    },
  },
  plugins: [
    stripSessionImagePlugin,
    expoClient({
      scheme: 'bueboka',
      storagePrefix: 'bueboka',
      storage: authStorage,
    }),
  ],
});
