// API Configuration Constants
// Centralized configuration for API endpoints and settings

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const AUTH_BASE_URL = `${API_BASE_URL}/auth`;
export const API_ORIGIN = API_BASE_URL.replace(/^https?:\/\/([^/]+).*$/, 'http://$1') || 'http://localhost:3000';

export const TOKEN_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  EXPIRES: 'auth_token_expires',
  BETTER_AUTH_SESSION: 'bueboka.session_token',
} as const;

export const OFFLINE_CONFIG = {
  QUEUE_KEY_PREFIX: 'offline_queue',
  MAX_QUEUE_LENGTH: 100,
  MAX_RETRIES: 5,
  BASE_BACKOFF_MS: 1000,
  MAX_BACKOFF_MS: 15000,
} as const;

export const REQUEST_TIMEOUT = 15000;
