import { authClient } from '@/services/auth/authClient';
import * as Sentry from '@sentry/react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Authenticated fetch wrapper using better-auth client
 * This ensures requests are properly authenticated using better-auth's internal mechanisms
 */
export async function authFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const raw = await authClient.$fetch(url, {
      ...options,
      credentials: 'include',
    });

    // authClient.$fetch wraps every response in { data: T, error: null }.
    // Unwrap it so callers receive the actual API response body.
    const isWrapped = raw !== null && typeof raw === 'object' && 'data' in (raw as object) && 'error' in (raw as object);

    // Check if this is an error response from better-auth.
    // better-auth returns { data: null, error: { status, message, code } }.
    // Preserve status/code so handleApiError can classify it correctly
    // (e.g. 401 → UNAUTHORIZED instead of falling through to UNKNOWN).
    if (isWrapped && 'error' in (raw as object)) {
      const wrappedError = (raw as { error: any }).error;
      if (wrappedError) {
        const err = new Error(wrappedError.message || 'API request failed') as any;
        // better-auth may use `status`, `statusCode`, or `code`
        err.status = wrappedError.status ?? wrappedError.statusCode ?? null;
        err.code = wrappedError.code ?? null;
        throw err;
      }
    }

    const data = isWrapped ? (raw as { data: T }).data : (raw as T);

    return { data: (data ?? null) as T };
  } catch (error: any) {
    // 401/403 and network failures are expected and handled by callers — don't capture them.
    // Everything else is unexpected and should be tracked in Sentry.
    const status = error?.status ?? error?.response?.status;
    const isExpected = status === 401 || status === 403 || error?.message?.includes('Network');
    if (!isExpected) {
      Sentry.captureException(error, { extra: { endpoint } });
    }
    throw error;
  }
}

/**
 * Convenience methods matching axios API
 */
export const authFetchClient = {
  async get<T = any>(url: string, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, { ...config, method: 'GET' });
  },

  async post<T = any>(url: string, data?: any, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  },

  async put<T = any>(url: string, data?: any, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  },

  async delete<T = any>(url: string, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, { ...config, method: 'DELETE' });
  },

  async patch<T = any>(url: string, data?: any, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  },
};
