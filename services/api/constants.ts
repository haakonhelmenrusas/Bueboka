/**
 * API Configuration Constants
 * Centralized configuration for API endpoints and settings
 */

// Base API URL - should be set via environment variable
// In production, this should always be EXPO_PUBLIC_API_URL
// Fallback is for local development only
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Auth endpoint base (better-auth expects /auth suffix)
export const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

// Origin header value for better-auth CSRF protection
export const API_ORIGIN = API_BASE_URL.replace(/^https?:\/\/([^/]+).*$/, 'http://$1') || 'http://localhost:3000';

// Token storage keys
export const TOKEN_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  EXPIRES: 'auth_token_expires',
  BETTER_AUTH_SESSION: 'bueboka.session_token',
} as const;

// Offline queue configuration
export const OFFLINE_CONFIG = {
  QUEUE_KEY_PREFIX: 'offline_queue',
  MAX_QUEUE_LENGTH: 100,
  MAX_RETRIES: 5,
  BASE_BACKOFF_MS: 1000,
  MAX_BACKOFF_MS: 15000,
} as const;

// Request timeout configuration
export const REQUEST_TIMEOUT = 15000;
