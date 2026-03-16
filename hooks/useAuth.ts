import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 *
 * @throws Error if used outside AuthProvider
 * @returns Authentication context value
 *
 * @example
 * ```typescript
 * const { user, login, logout, isAuthenticated } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <LoginScreen />;
 * }
 *
 * return <HomeScreen user={user} />;
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
