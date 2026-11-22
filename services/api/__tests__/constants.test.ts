describe('services/api/constants', () => {
  const ORIGINAL_ENV = process.env.EXPO_PUBLIC_API_URL;

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL = ORIGINAL_ENV;
    jest.resetModules();
  });

  function loadConstants(apiUrl?: string) {
    if (apiUrl === undefined) delete process.env.EXPO_PUBLIC_API_URL;
    else process.env.EXPO_PUBLIC_API_URL = apiUrl;
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('../constants') as typeof import('../constants');
  }

  it('keeps the https scheme for the production API origin', () => {
    const { API_ORIGIN, AUTH_BASE_URL } = loadConstants('https://bueboka.no/api');
    expect(API_ORIGIN).toBe('https://bueboka.no');
    expect(AUTH_BASE_URL).toBe('https://bueboka.no/api/auth');
  });

  it('keeps the port for LAN development URLs', () => {
    const { API_ORIGIN } = loadConstants('http://192.168.0.90:3000/api');
    expect(API_ORIGIN).toBe('http://192.168.0.90:3000');
  });

  it('falls back to localhost when EXPO_PUBLIC_API_URL is unset', () => {
    const { API_ORIGIN, API_BASE_URL } = loadConstants(undefined);
    expect(API_BASE_URL).toBe('http://localhost:3000/api');
    expect(API_ORIGIN).toBe('http://localhost:3000');
  });
});
