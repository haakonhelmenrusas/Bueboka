import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth/authService';
import { clearTokens, getAccessToken } from '@/services/auth/tokenStorage';
import { registerOfflineHandlers } from '@/services/offline/handlers';
import * as Sentry from '@sentry/react-native';

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

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
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
