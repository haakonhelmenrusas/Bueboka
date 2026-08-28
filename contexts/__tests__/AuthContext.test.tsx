jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('expo-linking', () => ({
  getInitialURL: jest.fn().mockResolvedValue(null),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('@sentry/react-native', () => ({
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
}));

jest.mock('@/services/auth/authService', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/services/auth/tokenStorage', () => ({
  getAccessToken: jest.fn().mockResolvedValue(null),
  isTokenExpired: jest.fn().mockResolvedValue(false),
  clearTokens: jest.fn().mockResolvedValue(undefined),
  saveTokens: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/auth/authStorage', () => ({
  authStorage: { initialize: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('@/services/auth/authClient', () => ({
  authClient: {
    getSession: jest.fn().mockResolvedValue({ data: null }),
    signIn: { social: jest.fn() },
  },
}));

jest.mock('@/services/offline/handlers', () => ({
  registerOfflineHandlers: jest.fn(),
}));

import React from 'react';
import { Text } from 'react-native';
import { act, render, waitFor } from '@testing-library/react-native';
// eslint-disable-next-line import/first
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth/authService';

const mockedRegister = authService.register as jest.Mock;

const registeredUser = { id: 'user-1', email: 'skytter@example.com', name: 'Skytter' };

let registerResult: { requiresEmailVerification: boolean } | undefined;

function Probe() {
  const { register, isAuthenticated } = useAuth();
  return (
    <>
      <Text testID="authenticated">{String(isAuthenticated)}</Text>
      <Text
        testID="register"
        onPress={async () => {
          registerResult = await register('skytter@example.com', 'passord123', '');
        }}
      >
        register
      </Text>
    </>
  );
}

async function renderAndRegister() {
  const utils = render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );

  await waitFor(() => expect(utils.getByTestId('authenticated')).toBeTruthy());

  await act(async () => {
    await utils.getByTestId('register').props.onPress();
  });

  return utils;
}

describe('AuthProvider register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    registerResult = undefined;
  });

  it('leaves the user unauthenticated when sign-up returns no session token', async () => {
    mockedRegister.mockResolvedValue({ user: registeredUser, requiresEmailVerification: true });

    const { getByTestId } = await renderAndRegister();

    expect(getByTestId('authenticated').props.children).toBe('false');
  });

  it('reports that email verification is pending when sign-up returns no session token', async () => {
    mockedRegister.mockResolvedValue({ user: registeredUser, requiresEmailVerification: true });

    await renderAndRegister();

    expect(registerResult).toEqual({ requiresEmailVerification: true });
  });

  it('logs the user straight in when sign-up returns a session token', async () => {
    mockedRegister.mockResolvedValue({ user: registeredUser, requiresEmailVerification: false });

    const { getByTestId } = await renderAndRegister();

    expect(getByTestId('authenticated').props.children).toBe('true');
    expect(registerResult).toEqual({ requiresEmailVerification: false });
  });
});
