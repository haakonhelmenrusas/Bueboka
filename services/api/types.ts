import { User } from '@/types';

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string;
  redirect?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore?: boolean;
}

export interface SessionResponse {
  user: User;
  session?: {
    expiresAt: string;
  };
}
