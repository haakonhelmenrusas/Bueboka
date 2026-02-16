import client from '@/services/api/client';
import { handleApiError } from '@/services/api/errors';
import { AuthResponse, SessionResponse } from '@/services/api/types';
import { clearTokens, saveTokens } from '@/services';
import { User } from '@/types';

/**
 * Registration data structure
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  club?: string;
}

/**
 * Login data structure
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'apple';

/**
 * Safely extract token and expiry from better-auth response
 * better-auth returns: { data: { user, session: { token, expiresAt } } } or similar variants
 */
function extractTokenAndExpiry(responseData: any): { token?: string; expiresAt?: string } {
  if (!responseData) return {};

  // Check if response has nested structure
  const data = responseData.data || responseData;

  // Try common paths
  const session = data.session || {};
  const token = session.token || data.token || data.accessToken || data.sessionToken;
  const expiresAt = session.expiresAt || session.expires_at || data.expiresAt || data.expires_at || undefined;

  return { token, expiresAt };
}

function ensureExpiryString(expiresAt?: string): string | undefined {
  if (!expiresAt) return undefined;
  // Normalize to ISO string if it's a Date-like value
  try {
    const d = new Date(expiresAt);
    if (!isNaN(d.getTime())) return d.toISOString();
    return expiresAt;
  } catch {
    return expiresAt;
  }
}

/**
 * Authentication service for all auth-related API calls
 */
export const authService = {
  /**
   * Register a new user with email and password
   */
  async register(data: RegisterData): Promise<{ user: User }> {
    try {
      const response = await client.post<AuthResponse>('/auth/signup', data);
      const { user } = response.data as any;

      const { token, expiresAt } = extractTokenAndExpiry(response.data);
      if (token) {
        const normalized = ensureExpiryString(expiresAt);
        await saveTokens({ accessToken: token, expiresAt: normalized ?? '' });
      }

      return { user };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Login with email and password
   */
  async login(data: LoginData): Promise<{ user: User }> {
    try {
      const response = await client.post<AuthResponse>('/auth/sign-in/email', data);
      const { user } = response.data as any;

      const { token, expiresAt } = extractTokenAndExpiry(response.data);
      if (token) {
        const normalized = ensureExpiryString(expiresAt);
        await saveTokens({ accessToken: token, expiresAt: normalized ?? '' });
      }

      return { user };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Initiate OAuth login (Google or Apple)
   * Returns the OAuth URL to redirect to
   */
  async initiateOAuth(provider: OAuthProvider): Promise<{ url: string }> {
    try {
      const response = await client.get<{ url: string }>(`/auth/oauth/${provider}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Complete OAuth login with callback data
   */
  async completeOAuth(provider: OAuthProvider, code: string): Promise<{ user: User }> {
    try {
      const response = await client.post<AuthResponse>(`/auth/oauth/${provider}/callback`, { code });
      const { user } = response.data as any;

      const { token, expiresAt } = extractTokenAndExpiry(response.data);
      if (token) {
        const normalized = ensureExpiryString(expiresAt);
        await saveTokens({ accessToken: token, expiresAt: normalized ?? '' });
      }

      return { user };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await client.post('/auth/sign-out');
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.warn('Logout request failed, clearing local tokens anyway');
    } finally {
      await clearTokens();
    }
  },

  /**
   * Send verification email to user
   */
  async sendVerificationEmail(email: string): Promise<void> {
    try {
      await client.post('/auth/send-verification-email', { email });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ user: User }> {
    try {
      const response = await client.post<{ user: User }>('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Resend verification email for current user
   */
  async resendVerificationEmail(): Promise<void> {
    try {
      await client.post('/auth/send-verification-email');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Validate the current session
   */
  async validateSession(): Promise<{ user: User } | null> {
    try {
      const response = await client.get<SessionResponse>('/auth/get-session');
      // Some backends return { user } only; others include session
      const user = (response.data as any).user || response.data;
      return { user };
    } catch (_error) {
      return null;
    }
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await client.post('/auth/forget-password', { email });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await client.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
