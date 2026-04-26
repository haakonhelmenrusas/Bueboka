import { AxiosError, AxiosHeaders } from 'axios';
import { competitionRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import { Competition, Environment, PracticeCategory } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/services/api/authFetch', () => ({
  authFetchClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@sentry/react-native', () => ({
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

const fakeCompetition: Competition = {
  id: 'comp-1',
  userId: 'user-1',
  date: '2024-06-15T00:00:00.000Z',
  name: 'NM Innendørs 2024',
  location: 'Hamar',
  organizerName: 'Norges Bueskytterforbund',
  environment: Environment.INDOOR,
  weather: [],
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  notes: null,
  placement: 3,
  numberOfParticipants: 50,
  personalBest: true,
  totalScore: 580,
  bowId: 'bow-1',
  arrowsId: 'arrows-1',
  rounds: [],
  createdAt: '2024-06-15T00:00:00.000Z',
  updatedAt: '2024-06-15T00:00:00.000Z',
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('competitionRepository.getAll', () => {
  it('fetches all competitions from /competitions and returns list response', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { competitions: [fakeCompetition] } });
    const result = await competitionRepository.getAll();
    expect(result.competitions).toHaveLength(1);
    expect(result.competitions[0].name).toBe('NM Innendørs 2024');
    expect(mockClient.get).toHaveBeenCalledWith('/competitions');
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(competitionRepository.getAll()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await competitionRepository.getAll().catch((e) => e);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── getById ───────────────────────────────────────────────────────────────────

describe('competitionRepository.getById', () => {
  it('unwraps { competition: Competition } envelope from /competitions/:id/details', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { competition: fakeCompetition } });
    const result = await competitionRepository.getById('comp-1');
    expect(result).toEqual(fakeCompetition);
    expect(mockClient.get).toHaveBeenCalledWith('/competitions/comp-1/details');
  });

  it('falls back to { practice } envelope for backward-compatibility', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { practice: fakeCompetition } });
    const result = await competitionRepository.getById('comp-1');
    expect(result.id).toBe('comp-1');
  });

  it('returns flat data when there is no envelope wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeCompetition });
    const result = await competitionRepository.getById('comp-1');
    expect(result.id).toBe('comp-1');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await competitionRepository.getById('ghost').catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe('competitionRepository.create', () => {
  it('sends POST to /competitions and returns the created competition', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeCompetition });

    const result = await competitionRepository.create({
      date: new Date('2024-06-15'),
      name: 'NM Innendørs 2024',
      environment: Environment.INDOOR,
    });

    expect(result).toEqual(fakeCompetition);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/competitions',
      expect.objectContaining({ name: 'NM Innendørs 2024', environment: Environment.INDOOR }),
    );
  });

  it('includes optional fields such as placement, personalBest, and rounds', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeCompetition });
    await competitionRepository.create({
      date: new Date(),
      name: 'Test',
      environment: Environment.OUTDOOR,
      placement: 1,
      personalBest: true,
      rounds: [{ roundNumber: 1, roundScore: 290 }],
    });
    expect(mockClient.post).toHaveBeenCalledWith(
      '/competitions',
      expect.objectContaining({ placement: 1, personalBest: true }),
    );
  });

  it('throws AppError with BAD_REQUEST on 400', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(400, { message: 'Navn er påkrevd' }));
    const caught = await competitionRepository
      .create({ date: new Date(), name: '', environment: Environment.INDOOR })
      .catch((e) => e);
    expect(caught.code).toBe('BAD_REQUEST');
  });

  it('throws AppError on network failure', async () => {
    mockClient.post.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(
      competitionRepository.create({ date: new Date(), name: 'X', environment: Environment.OUTDOOR }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('competitionRepository.update', () => {
  it('sends PATCH to /competitions/:id and returns the updated competition', async () => {
    const updated = { ...fakeCompetition, placement: 1 };
    mockClient.patch.mockResolvedValueOnce({ data: updated });

    const result = await competitionRepository.update('comp-1', { placement: 1 });

    expect(result.placement).toBe(1);
    expect(mockClient.patch).toHaveBeenCalledWith('/competitions/comp-1', { placement: 1 });
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await competitionRepository.update('ghost', { notes: 'x' }).catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });

  it('throws AppError with SERVER_ERROR on 500', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(500));
    const caught = await competitionRepository.update('comp-1', {}).catch((e) => e);
    expect(caught.code).toBe('SERVER_ERROR');
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('competitionRepository.delete', () => {
  it('sends DELETE to /competitions/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await competitionRepository.delete('comp-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/competitions/comp-1');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(403));
    await expect(competitionRepository.delete('comp-1')).rejects.toBeInstanceOf(AppError);
  });
});

