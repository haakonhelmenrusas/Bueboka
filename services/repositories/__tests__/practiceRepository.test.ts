import { AxiosError, AxiosHeaders } from 'axios';
import { practiceRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { End, Environment, Practice, PracticeCardsResponse, PracticeCategory, WeatherCondition } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/services/sentryStub', () => ({
  captureException: jest.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const mockClient = authFetchClient as jest.Mocked<typeof authFetchClient>;

function makeAxiosError(status: number, data?: Record<string, any>): AxiosError {
  const err = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
  err.response = {
    status,
    data: data ?? {},
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as any,
    statusText: 'Error',
  };
  return err;
}

const fakeEnd: End = {
  id: 'end-1',
  practiceId: 'practice-1',
  arrows: 3,
  arrowsWithoutScore: 0,
  scores: [9, 10, 8],
  roundScore: 27,
  distanceMeters: 18,
  distanceFrom: null,
  distanceTo: null,
  targetSizeCm: 40,
  targetType: 'WA 40cm',
  arrowsPerEnd: 3,
  arrowCoordinates: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const fakePractice: Practice = {
  id: 'practice-1',
  userId: 'user-1',
  date: '2024-01-15T00:00:00.000Z',
  notes: 'Bra økt',
  totalScore: 270,
  rating: 4,
  location: 'Oslo Buehall',
  environment: Environment.INDOOR,
  weather: [WeatherCondition.CLEAR],
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  roundTypeId: null,
  bowId: 'bow-1',
  arrowsId: 'arrows-1',
  ends: [fakeEnd],
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

const fakeCardsResponse: PracticeCardsResponse = {
  practices: [
    {
      id: 'practice-1',
      date: '2024-01-15T00:00:00.000Z',
      arrowsShot: 30,
      arrowsWithScore: 30,
      location: 'Oslo Buehall',
      environment: 'INDOOR',
      rating: 4,
      practiceType: 'TRENING',
      totalScore: 270,
      roundTypeName: null,
      practiceCategory: 'SKIVE_INDOOR',
    },
  ],
  page: 1,
  pageSize: 10,
  total: 1,
};

// ── getCards ──────────────────────────────────────────────────────────────────

describe('practiceRepository.getCards', () => {
  it('fetches combined practice/competition cards from /practices/cards', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeCardsResponse });
    const result = await practiceRepository.getCards();
    expect(result.practices).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(mockClient.get).toHaveBeenCalledWith('/practices/cards?');
  });

  it('appends page and pageSize query parameters when provided', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeCardsResponse });
    await practiceRepository.getCards({ page: 2, pageSize: 5 });
    expect(mockClient.get).toHaveBeenCalledWith('/practices/cards?page=2&pageSize=5');
  });

  it('appends filter query parameter when provided', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeCardsResponse });
    await practiceRepository.getCards({ filter: 'TRENING' });
    expect(mockClient.get).toHaveBeenCalledWith('/practices/cards?filter=TRENING');
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(practiceRepository.getCards()).rejects.toBeInstanceOf(AppError);
  });
});

// ── getAll ────────────────────────────────────────────────────────────────────

describe('practiceRepository.getAll', () => {
  it('fetches practices from /practices and returns the list response', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { practices: [fakePractice] } });
    const result = await practiceRepository.getAll();
    expect(result.practices).toHaveLength(1);
    expect(mockClient.get).toHaveBeenCalledWith('/practices?');
  });

  it('builds query string with page and limit', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { practices: [] } });
    await practiceRepository.getAll({ page: 1, limit: 20 });
    expect(mockClient.get).toHaveBeenCalledWith('/practices?page=1&limit=20');
  });

  it('includes ISO string dates in the query string', async () => {
    const start = new Date('2024-01-01T00:00:00.000Z');
    const end = new Date('2024-12-31T00:00:00.000Z');
    mockClient.get.mockResolvedValueOnce({ data: { practices: [] } });
    await practiceRepository.getAll({ startDate: start, endDate: end });
    expect(mockClient.get).toHaveBeenCalledWith(expect.stringContaining('startDate=2024-01-01T00%3A00%3A00.000Z'));
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await practiceRepository.getAll().catch((e) => e);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── getById ───────────────────────────────────────────────────────────────────

describe('practiceRepository.getById', () => {
  it('unwraps { practice: Practice } envelope from /practices/:id/details', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { practice: fakePractice } });
    const result = await practiceRepository.getById('practice-1');
    expect(result).toEqual(fakePractice);
    expect(mockClient.get).toHaveBeenCalledWith('/practices/practice-1/details');
  });

  it('returns a flat Practice object when there is no practice wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakePractice });
    const result = await practiceRepository.getById('practice-1');
    expect(result.id).toBe('practice-1');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await practiceRepository.getById('ghost').catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe('practiceRepository.create', () => {
  it('sends POST to /practices and returns the created practice', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakePractice });
    const result = await practiceRepository.create({
      date: new Date('2024-01-15'),
      environment: Environment.INDOOR,
      totalScore: 270,
    });
    expect(result).toEqual(fakePractice);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/practices',
      expect.objectContaining({ environment: Environment.INDOOR, totalScore: 270 }),
    );
  });

  it('throws AppError with BAD_REQUEST on 400', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(400, { message: 'Ugyldig feltverdi' }));
    const caught = await practiceRepository.create({ date: new Date(), environment: Environment.INDOOR, totalScore: -1 }).catch((e) => e);
    expect(caught.code).toBe('BAD_REQUEST');
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('practiceRepository.update', () => {
  it('sends PATCH to /practices/:id and returns the updated practice', async () => {
    const updated = { ...fakePractice, rating: 5 };
    mockClient.patch.mockResolvedValueOnce({ data: updated });

    const result = await practiceRepository.update('practice-1', { rating: 5 });

    expect(result.rating).toBe(5);
    expect(mockClient.patch).toHaveBeenCalledWith('/practices/practice-1', { rating: 5 });
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await practiceRepository.update('ghost', { rating: 3 }).catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('practiceRepository.delete', () => {
  it('sends DELETE to /practices/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await practiceRepository.delete('practice-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/practices/practice-1');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(500));
    await expect(practiceRepository.delete('practice-1')).rejects.toBeInstanceOf(AppError);
  });
});

// ── addEnd ────────────────────────────────────────────────────────────────────

describe('practiceRepository.addEnd', () => {
  it('sends POST to /practices/:id/ends and returns the created end', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeEnd });
    const result = await practiceRepository.addEnd('practice-1', { arrows: 3, roundScore: 27 });
    expect(result).toEqual(fakeEnd);
    expect(mockClient.post).toHaveBeenCalledWith('/practices/practice-1/ends', { arrows: 3, roundScore: 27 });
  });

  it('throws AppError with NOT_FOUND when practice does not exist', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await practiceRepository.addEnd('ghost', {}).catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── updateEnd ─────────────────────────────────────────────────────────────────

describe('practiceRepository.updateEnd', () => {
  it('sends PUT to /practices/:practiceId/ends/:endId and returns the updated end', async () => {
    const updated = { ...fakeEnd, roundScore: 30 };
    mockClient.put.mockResolvedValueOnce({ data: updated });

    const result = await practiceRepository.updateEnd('practice-1', 'end-1', { roundScore: 30 });

    expect(result.roundScore).toBe(30);
    expect(mockClient.put).toHaveBeenCalledWith('/practices/practice-1/ends/end-1', { roundScore: 30 });
  });

  it('throws AppError on failure', async () => {
    mockClient.put.mockRejectedValueOnce(makeAxiosError(500));
    await expect(practiceRepository.updateEnd('p-1', 'e-1', {})).rejects.toBeInstanceOf(AppError);
  });
});

// ── deleteEnd ─────────────────────────────────────────────────────────────────

describe('practiceRepository.deleteEnd', () => {
  it('sends DELETE to /practices/:practiceId/ends/:endId', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await practiceRepository.deleteEnd('practice-1', 'end-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/practices/practice-1/ends/end-1');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(403));
    await expect(practiceRepository.deleteEnd('p-1', 'e-1')).rejects.toBeInstanceOf(AppError);
  });
});
