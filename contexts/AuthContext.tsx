import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth/authService';
import { clearTokens, getAccessToken, saveTokens } from '@/services/auth/tokenStorage';
import { registerOfflineHandlers } from '@/services/offline/handlers';
import * as Sentry from '@sentry/react-native';
import { authClient } from '@/services/auth/authClient';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

// Complete any pending OAuth sessions
// This must be called at module level for iOS deep linking to work properly
WebBrowser.maybeCompleteAuthSession();

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
            setTimeout(() => checkSession(), 500);
          } else {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          // No cookie parameter, check if expoClient has stored the token
          setTimeout(async () => {
            const token = await SecureStore.getItemAsync('bueboka.session_token');

            if (token) {
              const expiresAt = new Date(Date.now() + 604800 * 1000).toISOString();
              await saveTokens({ accessToken: token, expiresAt });
            }

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
    if (!user || typeof user !== 'object') {
      console.error('[Auth] Invalid user object received!');
      return;
    }

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
        console.warn('[Auth] refreshUser: No user returned from API');
        await logout();
      }
    } catch (error) {
      console.error('[Auth] refreshUser failed:', error);
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

      // OAuth flow initiated - poll for session completion
      if ('redirect' in result.data && result.data.redirect) {
        pollForOAuthSession();
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
   * Poll for OAuth session completion
   * This is needed because the deep link callback may not be triggered on iOS
   */
  async function pollForOAuthSession() {
    const maxAttempts = 30; // 30 seconds max (30 attempts * 1 second)
    let attempts = 0;

    const pollInterval = setInterval(async () => {
      attempts++;

      try {
        // Use authClient to get session - this should use the expoClient storage
        const session = await authClient.getSession();

        if (session?.data?.user) {
          clearInterval(pollInterval);

          // Log full session data to diagnose missing profile info
          console.log('[Auth] Full session data from OAuth:', JSON.stringify(session.data, null, 2));

          // Get token from session object first (most reliable)
          const sessionToken = (session.data as any).session?.token || (session.data as any).token;
          const expoToken = await SecureStore.getItemAsync('bueboka.session_token');
          const buebokaToken = await SecureStore.getItemAsync('bueboka.token');
          const authToken = await SecureStore.getItemAsync('auth_token');

          const token = sessionToken || expoToken || buebokaToken || authToken;

          if (token) {
            const expiresAt = new Date(Date.now() + 604800 * 1000).toISOString();

            try {
              // Sync to both storage locations
              await Promise.all([SecureStore.setItemAsync('bueboka.session_token', token), saveTokens({ accessToken: token, expiresAt })]);

              // Small delay to ensure storage is persisted
              await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
              console.error('[Auth] Error syncing token:', error);
            }
          }

          // Set authenticated user
          setAuthenticatedUser(session.data.user as User);
          return;
        }

        // Also check storage directly as fallback
        const expoToken = await SecureStore.getItemAsync('bueboka.session_token');
        const authToken = await SecureStore.getItemAsync('auth_token');

        if (expoToken || authToken) {
          clearInterval(pollInterval);

          const token = expoToken || authToken;
          if (token) {
            const expiresAt = new Date(Date.now() + 604800 * 1000).toISOString();
            await Promise.all([SecureStore.setItemAsync('bueboka.session_token', token), saveTokens({ accessToken: token, expiresAt })]);
          }

          await checkSession();
          return;
        }

        // Stop polling after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          console.warn('[Auth] OAuth polling timeout');
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'OAuth authentication timed out. Please try again.',
          }));
        }
      } catch (error) {
        console.error('[Auth] Error during OAuth polling:', error);
      }
    }, 1000); // Poll every 1 second
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
