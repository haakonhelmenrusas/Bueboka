import { authClient } from '@/services/auth/authClient';

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

    const data = isWrapped ? (raw as { data: T }).data : (raw as T);
    return { data };
  } catch (error: any) {
    console.error('[AuthFetch] Error:', endpoint, error);
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
