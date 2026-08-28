import { authService, normalizeEmail } from '@/services/auth/authService';
import { authFetchClient } from '@/services/api/authFetch';

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/services/auth/tokenStorage', () => ({
  saveTokens: jest.fn().mockResolvedValue(undefined),
  clearTokens: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

const mockClient = authFetchClient as jest.Mocked<typeof authFetchClient>;

const fakeUser = { id: 'user-1', email: 'archer@example.com', name: 'Archer' };

describe('normalizeEmail', () => {
  it('strips whitespace left by keyboard autocomplete', () => {
    expect(normalizeEmail(' archer@example.com ')).toBe('archer@example.com');
  });

  it('lowercases an address autofilled with a capital', () => {
    expect(normalizeEmail('Archer@Example.COM')).toBe('archer@example.com');
  });

  it('leaves an already-normal address untouched', () => {
    expect(normalizeEmail('archer@example.com')).toBe('archer@example.com');
  });
});

describe('authService.login', () => {
  beforeEach(() => {
    mockClient.post.mockResolvedValue({ data: { user: fakeUser } } as any);
  });

  it('sends a normalized email so a stray space cannot miss the account', async () => {
    await authService.login({ email: ' Archer@Example.com ', password: 'hunter2' });

    expect(mockClient.post).toHaveBeenCalledWith('/auth/sign-in/email', {
      email: 'archer@example.com',
      password: 'hunter2',
    });
  });

  it('does not touch the password', async () => {
    await authService.login({ email: 'archer@example.com', password: '  spaced  password  ' });

    expect(mockClient.post).toHaveBeenCalledWith('/auth/sign-in/email', {
      email: 'archer@example.com',
      password: '  spaced  password  ',
    });
  });
});

describe('authService.register', () => {
  beforeEach(() => {
    mockClient.post.mockResolvedValue({ data: { user: fakeUser } } as any);
  });

  it('stores the account under the normalized email', async () => {
    await authService.register({ email: ' Archer@Example.com ', password: 'hunter2', name: 'Archer', club: 'Oslo' });

    expect(mockClient.post).toHaveBeenCalledWith('/auth/sign-up/email', {
      email: 'archer@example.com',
      password: 'hunter2',
      name: 'Archer',
      club: 'Oslo',
    });
  });
});

describe('authService.sendVerificationEmail', () => {
  it('normalizes the address it asks the backend to verify', async () => {
    mockClient.post.mockResolvedValue({ data: {} } as any);

    await authService.sendVerificationEmail(' Archer@Example.com ');

    expect(mockClient.post).toHaveBeenCalledWith('/auth/send-verification-email', { email: 'archer@example.com' });
  });
});

describe('authService.requestPasswordReset', () => {
  it('normalizes the address it sends the reset link to', async () => {
    mockClient.post.mockResolvedValue({ data: {} } as any);

    await authService.requestPasswordReset(' Archer@Example.com ');

    expect(mockClient.post).toHaveBeenCalledWith('/auth/forget-password', { email: 'archer@example.com' });
  });
});
