import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth/authService';
import { clearTokens, getAccessToken, saveTokens } from '@/services/auth/tokenStorage';
import { registerOfflineHandlers } from '@/services/offline/handlers';
import * as Sentry from '@sentry/react-native';
import { authClient } from '@/services/auth/authClient';
import * as Linking from 'expo-linking';

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
   * Check current session and update state if user is authenticated
   */
  const checkSession = useCallback(async () => {
    try {
      const result = await authService.validateSession();

      if (result && result.user) {
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
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.warn('[Auth] Session validation failed:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Handle OAuth callback from deep link
   * Extracts session token from URL and stores it
   */
  const handleOAuthCallback = useCallback(
    async (url: string) => {
      try {
        const parsedUrl = new URL(url);
        const cookieParam = parsedUrl.searchParams.get('cookie');

        if (cookieParam) {
          const decodedCookie = decodeURIComponent(cookieParam);
          const sessionTokenMatch = decodedCookie.match(/better-auth\.session_token=([^;]+)/);

          if (sessionTokenMatch && sessionTokenMatch[1]) {
            const sessionToken = sessionTokenMatch[1];
            const expiresAt = new Date(Date.now() + 604800 * 1000).toISOString();

            await saveTokens({ accessToken: sessionToken, expiresAt });

            // Check session after token is saved
            setTimeout(() => {
              checkSession();
            }, 500);
          } else {
            console.warn('[Auth] Could not extract session token from OAuth callback');
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          // No cookie parameter, let expoClient handle it
          setTimeout(() => {
            checkSession();
          }, 1000);
        }
      } catch (error) {
        console.error('[Auth] Error handling OAuth callback:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [checkSession],
  );

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    registerOfflineHandlers();
    initializeAuth();
  }, []);

  /**
   * Listen for deep link callbacks from OAuth
   */
  useEffect(() => {
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        await handleOAuthCallback(url);
      }
    };

    handleInitialURL();

    const subscription = Linking.addEventListener('url', async (event) => {
      await handleOAuthCallback(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleOAuthCallback]);

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

      const result = await authService.validateSession();

      if (result && result.user) {
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
      } else {
        await clearTokens();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.warn('[Auth] Failed to initialize auth:', error);
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
   * Set authenticated user state
   */
  function setAuthenticatedUser(user: User) {
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

  /**
   * Login with email and password
   */
  async function login(email: string, password: string): Promise<void> {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.login({ email, password });
      setAuthenticatedUser(result.user);
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
      setAuthenticatedUser(result.user);
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
    } catch (error: any) {
      console.warn('[Auth] Logout error:', error);
    } finally {
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

      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: 'bueboka://',
      });

      if (result.error) {
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

      if (!result.data) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'No response from authentication',
        }));
        return;
      }

      // OAuth flow initiated - callback will handle the rest
      if ('redirect' in result.data && result.data.redirect) {
        return;
      }

      // Direct response with user data
      if ('user' in result.data && result.data.user) {
        setAuthenticatedUser(result.data.user as User);
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Unexpected response from authentication',
        }));
      }
    } catch (error: any) {
      console.error('[Auth] Google login error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Google login failed',
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
      setAuthenticatedUser(result.user);
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
