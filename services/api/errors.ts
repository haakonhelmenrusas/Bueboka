import { AxiosError } from 'axios';
import * as Sentry from '@/services/sentryStub';
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
  // Handle errors from authFetch (better-auth) that have a response property
  const hasResponse = error && typeof error === 'object' && 'response' in error;
  const errorResponse = hasResponse ? (error as any).response : null;
  const statusCode = errorResponse?.status || (error as any)?.status;

  if (error instanceof AxiosError || errorResponse) {
    const apiError = errorResponse?.data as ApiError;

    // Handle specific HTTP status codes
    if (statusCode === 401) {
      const message = apiError?.message?.toLowerCase();
      if (message?.includes('invalid') || message?.includes('credential') || message?.includes('user')) {
        return new AppError('UNAUTHORIZED', 'Feil e-post eller passord. Vennligst prøv igjen.', error);
      }
      return new AppError('UNAUTHORIZED', 'Sesjonen er utløpt. Vennligst logg inn på nytt.', error);
    }

    if (statusCode === 400) {
      return new AppError('BAD_REQUEST', apiError?.message || 'Ugyldig forespørsel', error);
    }

    if (statusCode === 404) {
      return new AppError('NOT_FOUND', 'Ressursen ble ikke funnet', error);
    }

    if (statusCode === 409) {
      return new AppError('CONFLICT', apiError?.message || 'Ressursen eksisterer allerede', error);
    }

    if (statusCode === 429) {
      return new AppError('RATE_LIMITED', 'For mange forespørsler. Vennligst prøv igjen senere.', error);
    }

    if (statusCode && statusCode >= 500) {
      Sentry.captureException(error, {
        tags: { type: 'server_error' },
        extra: {
          status: statusCode,
          url: (error as any).config?.url,
          data: errorResponse?.data,
        },
      });
      return new AppError('SERVER_ERROR', 'Serverfeil. Vennligst prøv igjen senere.', error);
    }

    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return new AppError('TIMEOUT', 'Forespørselen tok for lang tid. Vennligst prøv igjen.', error);
      }

      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return new AppError('NETWORK_ERROR', 'Nettverksfeil. Sjekk internettforbindelsen din.', error);
      }
    }

    return new AppError('UNKNOWN', apiError?.message || (error as any).message || 'En ukjent feil oppstod', error);
  }

  if (error instanceof Error) {
    // Specifically handle "Cannot read property 'user' of null/undefined" – bad credentials
    if (error.message?.includes("property 'user' of null") || error.message?.includes("property 'user' of undefined")) {
      return new AppError('UNAUTHORIZED', 'Feil e-post eller passord. Vennligst prøv igjen.', error);
    }

    // Handle network-related error messages
    if (error.message?.includes('Network') || error.message?.includes('Failed to fetch')) {
      return new AppError('NETWORK_ERROR', 'Nettverksfeil. Sjekk internettforbindelsen din.', error);
    }

    return new AppError('UNKNOWN', 'En ukjent feil oppstod. Vennligst prøv igjen.', error);
  }

  return new AppError('UNKNOWN', 'En ukjent feil oppstod. Vennligst prøv igjen.', error);
}
