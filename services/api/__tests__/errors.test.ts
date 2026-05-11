import { AxiosError, AxiosHeaders } from 'axios';
import { AppError, handleApiError } from '../errors';

jest.mock('@/services/sentryStub', () => ({
  captureException: jest.fn(),
}));

/** Build an AxiosError with a given HTTP status and optional body/code */
function makeAxiosError(status: number, data?: Record<string, any>, code = 'ERR_BAD_RESPONSE'): AxiosError {
  const err = new AxiosError('Request failed', code);
  err.response = {
    status,
    data: data ?? {},
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as any,
    statusText: 'Error',
  };
  return err;
}

describe('AppError', () => {
  it('sets name, code, and message correctly', () => {
    const err = new AppError('NOT_FOUND', 'Ressursen ble ikke funnet');
    expect(err.name).toBe('AppError');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Ressursen ble ikke funnet');
    expect(err).toBeInstanceOf(Error);
  });

  it('stores originalError', () => {
    const original = new Error('original');
    const err = new AppError('UNKNOWN', 'msg', original);
    expect(err.originalError).toBe(original);
  });
});

describe('handleApiError – AxiosError HTTP status codes', () => {
  it('returns UNAUTHORIZED with "Feil e-post" for 401 with "invalid" in message', () => {
    const err = makeAxiosError(401, { message: 'invalid credentials' });
    const result = handleApiError(err);
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('UNAUTHORIZED');
    expect(result.message).toMatch(/Feil e-post/);
  });

  it('returns UNAUTHORIZED with "Sesjonen er utløpt" for 401 without credential keywords', () => {
    const err = makeAxiosError(401, { message: 'session is gone' });
    const result = handleApiError(err);
    expect(result.code).toBe('UNAUTHORIZED');
    expect(result.message).toMatch(/Sesjonen er utløpt/);
  });

  it('returns BAD_REQUEST for 400, forwarding the API message', () => {
    const err = makeAxiosError(400, { message: 'Ugyldig felt' });
    const result = handleApiError(err);
    expect(result.code).toBe('BAD_REQUEST');
    expect(result.message).toBe('Ugyldig felt');
  });

  it('returns BAD_REQUEST with fallback message when API body has no message', () => {
    const err = makeAxiosError(400, {});
    const result = handleApiError(err);
    expect(result.code).toBe('BAD_REQUEST');
    expect(result.message).toBeTruthy();
  });

  it('returns NOT_FOUND for 404', () => {
    const err = makeAxiosError(404);
    const result = handleApiError(err);
    expect(result.code).toBe('NOT_FOUND');
  });

  it('returns CONFLICT for 409, forwarding the API message', () => {
    const err = makeAxiosError(409, { message: 'E-posten er allerede i bruk' });
    const result = handleApiError(err);
    expect(result.code).toBe('CONFLICT');
    expect(result.message).toBe('E-posten er allerede i bruk');
  });

  it('returns RATE_LIMITED for 429', () => {
    const err = makeAxiosError(429);
    const result = handleApiError(err);
    expect(result.code).toBe('RATE_LIMITED');
  });

  it('returns SERVER_ERROR for 500', () => {
    const err = makeAxiosError(500);
    const result = handleApiError(err);
    expect(result.code).toBe('SERVER_ERROR');
  });

  it('returns SERVER_ERROR for 503', () => {
    const err = makeAxiosError(503);
    const result = handleApiError(err);
    expect(result.code).toBe('SERVER_ERROR');
  });
});

describe('handleApiError – AxiosError network / timeout codes', () => {
  it('returns TIMEOUT for ECONNABORTED', () => {
    const err = new AxiosError('timeout', 'ECONNABORTED');
    const result = handleApiError(err);
    expect(result.code).toBe('TIMEOUT');
  });

  it('returns TIMEOUT for ETIMEDOUT', () => {
    const err = new AxiosError('timed out', 'ETIMEDOUT');
    const result = handleApiError(err);
    expect(result.code).toBe('TIMEOUT');
  });

  it('returns NETWORK_ERROR for ERR_NETWORK code', () => {
    const err = new AxiosError('Network Error', 'ERR_NETWORK');
    const result = handleApiError(err);
    expect(result.code).toBe('NETWORK_ERROR');
  });

  it('returns NETWORK_ERROR when message contains "Network Error"', () => {
    const err = new AxiosError('Network Error');
    const result = handleApiError(err);
    expect(result.code).toBe('NETWORK_ERROR');
  });

  it('returns UNKNOWN for a generic AxiosError with no response', () => {
    const err = new AxiosError('Something went wrong');
    err.message = 'Something totally unexpected';
    const result = handleApiError(err);
    expect(result.code).toBe('UNKNOWN');
  });
});

describe('handleApiError – plain Error instances', () => {
  it('returns UNAUTHORIZED when message mentions property user of null', () => {
    const err = new Error("Cannot read property 'user' of null");
    const result = handleApiError(err);
    expect(result.code).toBe('UNAUTHORIZED');
  });

  it('returns UNAUTHORIZED when message mentions property user of undefined', () => {
    const err = new Error("Cannot read property 'user' of undefined");
    const result = handleApiError(err);
    expect(result.code).toBe('UNAUTHORIZED');
  });

  it('returns UNKNOWN for a generic Error', () => {
    const err = new Error('Some random failure');
    const result = handleApiError(err);
    expect(result.code).toBe('UNKNOWN');
    expect(result.message).toMatch(/ukjent feil/i);
  });
});

describe('handleApiError – non-Error thrown values', () => {
  it('returns UNKNOWN for a string', () => {
    const result = handleApiError('plain string error');
    expect(result.code).toBe('UNKNOWN');
  });

  it('returns UNKNOWN for null', () => {
    const result = handleApiError(null);
    expect(result.code).toBe('UNKNOWN');
  });

  it('returns UNKNOWN for a plain object', () => {
    const result = handleApiError({ weird: true });
    expect(result.code).toBe('UNKNOWN');
  });
});
