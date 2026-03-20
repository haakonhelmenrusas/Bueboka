import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Sentry from '@sentry/react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

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
      // Check both storage locations for token
      let token = await SecureStore.getItemAsync('auth_token');

      // If not found in auth_token, try bueboka.session_token (used by @better-auth/expo)
      if (!token) {
        token = await SecureStore.getItemAsync('bueboka.session_token');
      }

      if (token && config.headers) {
        // Try both Cookie and Authorization headers
        config.headers.Cookie = `better-auth.session_token=${token}`;
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[API] Failed to get auth token:', error);
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Failed to get auth token from secure store',
        level: 'warning',
      });
    }

    // Add Origin header for better-auth CSRF protection
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
 * Response interceptor: Handle 401 errors and invalid sessions
 */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      // For better-auth, 401 means session is invalid - clear and force re-login
      await SecureStore.deleteItemAsync('auth_token').catch(() => {});

      return Promise.reject(error);
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

export default client;
