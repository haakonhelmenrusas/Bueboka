import { User } from '@/types';

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string;
  redirect?: boolean;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore?: boolean;
}

/**
 * Session validation response
 */
export interface SessionResponse {
  user: User;
  session?: {
    expiresAt: string;
  };
}

