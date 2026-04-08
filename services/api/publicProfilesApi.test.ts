import { publicProfilesApi } from './publicProfilesApi';
import { authFetchClient } from './authFetch';

jest.mock('./authFetch', () => ({
  authFetchClient: { get: jest.fn() },
}));

jest.mock('./errors', () => ({
  handleApiError: (error: unknown) => error,
}));

const mockGet = authFetchClient.get as jest.Mock;

/** Wraps profiles in the server envelope the API actually returns. */
const envelope = (profiles: object[]) => ({
  data: { profiles },
});

describe('publicProfilesApi.search', () => {
  it('extracts profiles from the nested server envelope', async () => {
    mockGet.mockResolvedValueOnce(envelope([{ id: '1', name: 'Haakon Test', club: 'Sarpsborg Bueskyttere' }]));
    const result = await publicProfilesApi.search('haakon');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: '1', name: 'Haakon Test', club: 'Sarpsborg Bueskyttere' });
  });

  it('returns empty array when the profiles list is empty', async () => {
    mockGet.mockResolvedValueOnce(envelope([]));
    expect(await publicProfilesApi.search('nobody')).toEqual([]);
  });

  it('returns all profiles when the API returns multiple', async () => {
    mockGet.mockResolvedValueOnce(
      envelope([
        { id: '1', name: 'Alice', club: 'Club A' },
        { id: '2', name: 'Bob', club: 'Club B' },
      ]),
    );
    const result = await publicProfilesApi.search('club');
    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('Bob');
  });

  it('appends the query as the q URL parameter', async () => {
    mockGet.mockResolvedValueOnce(envelope([]));
    await publicProfilesApi.search('haakon');
    expect(mockGet).toHaveBeenCalledWith('/public/profiles?q=haakon');
  });

  it('URL-encodes special characters in the query', async () => {
    mockGet.mockResolvedValueOnce(envelope([]));
    await publicProfilesApi.search('søk med mellomrom');
    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('s%C3%B8k'));
    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('mellomrom'));
  });

  it('trims surrounding whitespace before encoding', async () => {
    mockGet.mockResolvedValueOnce(envelope([]));
    await publicProfilesApi.search('  haakon  ');
    expect(mockGet).toHaveBeenCalledWith('/public/profiles?q=haakon');
  });

  it('returns empty array when the profiles key is absent', async () => {
    mockGet.mockResolvedValueOnce({ data: {} });
    expect(await publicProfilesApi.search('test')).toEqual([]);
  });

  it('returns empty array when the response envelope is malformed', async () => {
    mockGet.mockResolvedValueOnce({ data: {} });
    expect(await publicProfilesApi.search('test')).toEqual([]);
  });

  it('throws when the HTTP request fails', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));
    await expect(publicProfilesApi.search('test')).rejects.toBeTruthy();
  });

  it('throws on an auth error', async () => {
    mockGet.mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }));
    await expect(publicProfilesApi.search('test')).rejects.toBeTruthy();
  });
});
