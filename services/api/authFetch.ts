import { authClient } from '@/services/auth/authClient';
import * as Sentry from '@sentry/react-native';
import { API_BASE_URL } from './constants';

/**
 * Authenticated fetch wrapper using better-auth client
 */
export async function authFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const raw = await authClient.$fetch(url, {
      ...options,
      credentials: 'include',
    });

    const isWrapped = raw !== null && typeof raw === 'object' && 'data' in (raw as object) && 'error' in (raw as object);

    if (isWrapped && 'error' in (raw as object)) {
      const wrappedError = (raw as { error: any }).error;
      if (wrappedError) {
        const err = new Error(wrappedError.message || 'API request failed') as any;
        err.status = wrappedError.status ?? wrappedError.statusCode ?? null;
        err.code = wrappedError.code ?? null;
        throw err;
      }
    }

    const data = isWrapped ? (raw as { data: T }).data : (raw as T);
    return { data: (data ?? null) as T };
  } catch (error: any) {
    const status = error?.status ?? error?.response?.status;
    const isExpected = status === 401 || status === 403 || error?.message?.includes('Network');
    if (!isExpected) {
      Sentry.captureException(error, { extra: { endpoint } });
    }
    throw error;
  }
}

/**
 * Build request body and headers based on data type
 */
function buildBody(data: any): { body: any; headers: Record<string, string> } {
  if (data instanceof FormData) {
    return { body: data, headers: {} };
  }
  return {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
}

/**
 * Convenience methods matching axios API
 */
export const authFetchClient = {
  async get<T = any>(url: string, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, { ...config, method: 'GET' });
  },

  async post<T = any>(url: string, data?: any, config?: RequestInit): Promise<{ data: T }> {
    const { body, headers } = buildBody(data);
    return authFetch<T>(url, {
      ...config,
      method: 'POST',
      body,
      headers: {
        ...headers,
        ...config?.headers,
      },
    });
  },

  async put<T = any>(url: string, data?: any, config?: RequestInit): Promise<{ data: T }> {
    const { body, headers } = buildBody(data);
    return authFetch<T>(url, {
      ...config,
      method: 'PUT',
      body,
      headers: {
        ...headers,
        ...config?.headers,
      },
    });
  },

  async delete<T = any>(url: string, config?: RequestInit): Promise<{ data: T }> {
    return authFetch<T>(url, { ...config, method: 'DELETE' });
  },

  async patch<T = any>(url: string, data?: any, config?: RequestInit): Promise<{ data: T }> {
    const { body, headers } = buildBody(data);
    return authFetch<T>(url, {
      ...config,
      method: 'PATCH',
      body,
      headers: {
        ...headers,
        ...config?.headers,
      },
    });
  },
};
