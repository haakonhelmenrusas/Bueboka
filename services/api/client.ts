import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Sentry from '@sentry/react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RefreshResponse {
  session: {
    token: string;
    expiresAt: string;
  };
}

let authRefreshPromise: Promise<RefreshResponse> | null = null;

/**
 * Axios client configured for the backend API
 */
const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Add auth token and Origin header to all requests
 */
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }

    // Add Origin header for better-auth CSRF protection
    // On React Native, we set it based on the API URL
    if (config.headers) {
      const urlObj = new URL(API_BASE_URL);
      config.headers['Origin'] = `${urlObj.protocol}//${urlObj.host}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor: Handle 401 errors and token refresh
 */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and haven't already tried to refresh, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      try {
        // Use a promise to prevent multiple simultaneous refresh requests
        if (!authRefreshPromise) {
          authRefreshPromise = refreshSession();
        }

        const { session } = await authRefreshPromise;
        authRefreshPromise = null;

        // Store new token
        await SecureStore.setItemAsync('auth_token', session.token);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${session.token}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        authRefreshPromise = null;
        // Token refresh failed, user needs to log in again
        await SecureStore.deleteItemAsync('auth_token').catch(() => {});

        Sentry.captureException(refreshError, {
          tags: { type: 'token_refresh_failed' },
        });

        return Promise.reject(refreshError);
      }
    }

    // Log server errors to Sentry
    if (error.response?.status && error.response.status >= 500) {
      Sentry.captureException(error, {
        tags: { type: 'api_error' },
        extra: {
          status: error.response.status,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response?.data,
        },
      });
    }

    return Promise.reject(error);
  },
);

/**
 * Refresh the session token
 */
async function refreshSession(): Promise<RefreshResponse> {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) {
    throw new Error('No auth token available');
  }

  // Use a separate axios instance to avoid interceptor loops
  const response = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export default client;
