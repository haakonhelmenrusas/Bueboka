import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Sentry from '@sentry/react-native';
import { API_BASE_URL, REQUEST_TIMEOUT, TOKEN_STORAGE_KEYS } from './constants';

/**
 * Axios client configured for the backend API
 */
const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
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
      const { AUTH_TOKEN, BETTER_AUTH_SESSION } = TOKEN_STORAGE_KEYS;
      let token = await SecureStore.getItemAsync(AUTH_TOKEN);

      if (!token) {
        token = await SecureStore.getItemAsync(BETTER_AUTH_SESSION);
      }

      if (token && config.headers) {
        config.headers.Cookie = `better-auth.session_token=${token}`;
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Failed to get auth token from secure store',
        level: 'warning',
      });
    }

    if (config.headers) {
      const urlObj = new URL(API_BASE_URL);
      config.headers['Origin'] = `${urlObj.protocol}//${urlObj.host}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor: Handle 401 errors and log server errors
 */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEYS.AUTH_TOKEN).catch(() => {});
    }

    if (error.response?.status && error.response.status >= 500) {
      Sentry.captureException(error, {
        tags: { type: 'api_error' },
        extra: {
          status: error.response.status,
          url: error.config?.url,
          method: error.config?.method,
        },
      });
    }

    return Promise.reject(error);
  },
);

export default client;
