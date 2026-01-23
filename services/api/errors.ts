import { AxiosError } from 'axios';
import * as Sentry from '@sentry/react-native';
import { ApiError } from './types';

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Handle and transform API errors into AppError instances
 */
export function handleApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;

    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      return new AppError('UNAUTHORIZED', 'Session expired. Please login again.', error);
    }

    if (error.response?.status === 400) {
      return new AppError('BAD_REQUEST', apiError?.message || 'Invalid request data', error);
    }

    if (error.response?.status === 404) {
      return new AppError('NOT_FOUND', 'Resource not found', error);
    }

    if (error.response?.status === 429) {
      return new AppError('RATE_LIMITED', 'Too many requests. Please try again later.', error);
    }

    if (error.response?.status && error.response.status >= 500) {
      Sentry.captureException(error, {
        tags: { type: 'server_error' },
        extra: {
          status: error.response.status,
          url: error.config?.url,
          data: error.response?.data,
        },
      });
      return new AppError('SERVER_ERROR', 'Server error. Please try again later.', error);
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new AppError('TIMEOUT', 'Request timed out. Please try again.', error);
    }

    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return new AppError('NETWORK_ERROR', 'Network connection error. Check your internet.', error);
    }

    return new AppError('UNKNOWN', apiError?.message || error.message || 'An unknown error occurred', error);
  }

  if (error instanceof Error) {
    return new AppError('UNKNOWN', error.message, error);
  }

  return new AppError('UNKNOWN', 'An unknown error occurred', error);
}
