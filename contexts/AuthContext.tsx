import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth/authService';
import { clearTokens, getAccessToken } from '@/services/auth/tokenStorage';
import { registerOfflineHandlers } from '@/services/offline/handlers';
import * as Sentry from '@sentry/react-native';
import { authClient } from '@/services/auth/authClient';

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication context value interface
 */
export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, club?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages global authentication state and provides auth methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    // Register offline handlers once on mount
    registerOfflineHandlers();
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state from stored token
   */
  async function initializeAuth() {
    try {
      const token = await getAccessToken();

      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Validate session with backend
      const result = await authService.validateSession();

      if (result && result.user) {
        setState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Set user context for Sentry
        Sentry.setUser({
          id: result.user.id,
          email: result.user.email,
          username: result.user.name,
        });
      } else {
        // Invalid session
        await clearTokens();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.warn('Failed to initialize auth:', error);
      await clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }

  /**
   * Login with email and password
   */
  async function login(email: string, password: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await authService.login({ email, password });

      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Set user context for Sentry
      Sentry.setUser({
        id: result.user.id,
        email: result.user.email,
        username: result.user.name,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  }

  /**
   * Register new user
   */
  async function register(email: string, password: string, name: string, club?: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await authService.register({ email, password, name, club });

      // Set user as authenticated immediately after registration
      // This allows them to access the app while email verification is pending
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Set user context for Sentry
      Sentry.setUser({
        id: result.user.id,
        email: result.user.email,
        username: result.user.name,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
      }));
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async function logout(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await authService.logout();

      // Clear Sentry user context
      Sentry.setUser(null);

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.warn('Logout error:', error);
      // Still clear local state even if logout request fails
      Sentry.setUser(null);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }

  /**
   * Delete user account
   */
  async function deleteAccount(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Import userRepository dynamically to avoid circular dependency
      const { userRepository } = await import('@/services/repositories/userRepository');

      // Delete the account
      await userRepository.deleteAccount();

      // Logout to clear session
      await authService.logout();

      // Clear Sentry user context
      Sentry.setUser(null);

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Kunne ikke slette konto',
      }));
      throw error;
    }
  }

  /**
   * Refresh user data from backend
   */
  async function refreshUser(): Promise<void> {
    try {
      const result = await authService.validateSession();

      if (result && result.user) {
        setState((prev) => ({
          ...prev,
          user: result.user,
          isAuthenticated: true,
        }));
      } else {
        await logout();
      }
    } catch (error) {
      console.warn('Failed to refresh user:', error);
      await logout();
    }
  }

  /**
   * Clear error state
   */
  function clearError() {
    setState((prev) => ({ ...prev, error: null }));
  }

  /**
   * Login with Google OAuth
   */
  async function loginWithGoogle(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Use Better Auth client's built-in social sign-in
      // The expoClient plugin handles the OAuth redirect automatically
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });

      // Handle error response
      if (result.error) {
        console.log('Google login error:', result);
        const errorMsg =
          typeof result.error === 'object' && 'message' in result.error
            ? result.error.message || 'Google login failed'
            : 'Google login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
        return;
      }

      // Check if we have data
      if (!result.data) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'No response from authentication',
        }));
        return;
      }

      // Check if this is a redirect response (OAuth flow initiated)
      if ('redirect' in result.data && result.data.redirect) {
        // expoClient handles the redirect automatically
        // After OAuth flow completes, the user will be authenticated
        // The callback will trigger a session update
        return;
      }

      // Check if we got a successful response with user data
      if ('user' in result.data && result.data.user) {
        const user = result.data.user as User;

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        Sentry.setUser({
          id: user.id,
          email: user.email,
          username: user.name,
        });
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Google login failed',
      }));
    }
  }

  /**
   * Login with Apple OAuth
   */
  async function loginWithApple(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Use Better Auth client's built-in social sign-in
      // The expoClient plugin handles the OAuth redirect automatically
      const result = await authClient.signIn.social({
        provider: 'apple',
        callbackURL: '/',
      });

      // Handle error response
      if (result.error) {
        const errorMsg =
          typeof result.error === 'object' && 'message' in result.error
            ? result.error.message || 'Apple login failed'
            : 'Apple login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
        return;
      }

      // Check if we have data
      if (!result.data) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'No response from authentication',
        }));
        return;
      }

      // Check if this is a redirect response (OAuth flow initiated)
      if ('redirect' in result.data && result.data.redirect) {
        // expoClient handles the redirect automatically
        // After OAuth flow completes, the user will be authenticated
        // The callback will trigger a session update
        return;
      }

      // Check if we got a successful response with user data
      if ('user' in result.data && result.data.user) {
        const user = result.data.user as User;

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        Sentry.setUser({
          id: user.id,
          email: user.email,
          username: user.name,
        });
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Apple login failed',
      }));
    }
  }

  /**
   * Send verification email to a specific email address
   */
  async function sendVerificationEmail(email: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await authService.sendVerificationEmail(email);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to send verification email',
      }));
      throw error;
    }
  }

  /**
   * Resend verification email for current user
   */
  async function resendVerificationEmail(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // If we have a user, pass their email to ensure it works
      if (state.user?.email) {
        await authService.sendVerificationEmail(state.user.email);
      } else {
        // Fallback to the resend endpoint (for when user is not fully loaded)
        await authService.resendVerificationEmail();
      }

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      console.error('Resend verification email failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to resend verification email',
      }));
      throw error;
    }
  }

  /**
   * Verify email with token
   */
  async function verifyEmail(token: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.verifyEmail(token);

      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      Sentry.setUser({
        id: result.user.id,
        email: result.user.email,
        username: result.user.name,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Email verification failed',
      }));
      throw error;
    }
  }

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    deleteAccount,
    refreshUser,
    clearError,
    loginWithGoogle,
    loginWithApple,
    sendVerificationEmail,
    resendVerificationEmail,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 * Must be called within AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
