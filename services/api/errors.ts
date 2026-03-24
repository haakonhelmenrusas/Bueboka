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
      const message = apiError?.message?.toLowerCase();
      if (message?.includes('invalid') || message?.includes('credential') || message?.includes('user')) {
        return new AppError('UNAUTHORIZED', 'Feil e-post eller passord. Vennligst prøv igjen.', error);
      }
      return new AppError('UNAUTHORIZED', 'Sesjonen er utløpt. Vennligst logg inn på nytt.', error);
    }

    if (error.response?.status === 400) {
      return new AppError('BAD_REQUEST', apiError?.message || 'Ugyldig forespørsel', error);
    }

    if (error.response?.status === 404) {
      return new AppError('NOT_FOUND', 'Ressursen ble ikke funnet', error);
    }

    if (error.response?.status === 409) {
      return new AppError('CONFLICT', apiError?.message || 'Ressursen eksisterer allerede', error);
    }

    if (error.response?.status === 429) {
      return new AppError('RATE_LIMITED', 'For mange forespørsler. Vennligst prøv igjen senere.', error);
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
      return new AppError('SERVER_ERROR', 'Serverfeil. Vennligst prøv igjen senere.', error);
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new AppError('TIMEOUT', 'Forespørselen tok for lang tid. Vennligst prøv igjen.', error);
    }

    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return new AppError('NETWORK_ERROR', 'Nettverksfeil. Sjekk internettforbindelsen din.', error);
    }

    return new AppError('UNKNOWN', apiError?.message || error.message || 'En ukjent feil oppstod', error);
  }

  if (error instanceof Error) {
    // Specifically handle "Cannot read property 'user' of null/undefined" – bad credentials
    if (error.message?.includes("property 'user' of null") || error.message?.includes("property 'user' of undefined")) {
      return new AppError('UNAUTHORIZED', 'Feil e-post eller passord. Vennligst prøv igjen.', error);
    }
    return new AppError('UNKNOWN', 'En ukjent feil oppstod. Vennligst prøv igjen.', error);
  }

  return new AppError('UNKNOWN', 'En ukjent feil oppstod. Vennligst prøv igjen.', error);
}
