import { authFetchClient as client } from '@/services/api/authFetch';
import { handleApiError } from '@/services/api/errors';
import { AuthResponse, SessionResponse } from '@/services/api/types';
import { clearTokens, saveTokens } from '@/services/auth/tokenStorage';
import { User } from '@/types';
import * as Sentry from '@sentry/react-native';

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

function ensureExpiryString(expiresAt?: string): string | undefined {
  if (!expiresAt) return undefined;
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
      const response = await client.post<{ data: any }>('/auth/sign-up/email', data);
      const authData = response.data.data;
      const user = authData.user;
      const token = authData.token;
      const expiresAt = authData.expiresAt;

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
      const response = await client.post<{ data: any }>('/auth/sign-in/email', data);
      const authData = response.data.data;
      const user = authData.user;
      const token = authData.token;
      const expiresAt = authData.expiresAt;

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
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Logout request failed, clearing local tokens anyway',
        level: 'info',
      });
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
      const response = await client.get<{ data: any }>('/auth/get-session');
      const sessionData = response.data.data;
      const user = sessionData.user;

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
