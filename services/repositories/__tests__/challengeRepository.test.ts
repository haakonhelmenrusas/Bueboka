import { AxiosError, AxiosHeaders } from 'axios';
import { challengeRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { AppError } from '@/services/api/errors';
import {
  Challenge,
  ChallengeStatus,
  ChallengeListResponse,
  ChallengeListItem,
  CreateChallengeData,
  UpdateChallengeData,
  SubmitChallengeResultData,
} from '@/types';

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

const fakeChallenge: Challenge = {
  id: 'challenge-1',
  challengerId: 'user-1',
  challengedId: 'user-2',
  name: 'Weekend Shootout',
  description: 'Friendly competition',
  roundTypeId: 'round-1',
  customRules: null,
  startDate: '2024-07-01T00:00:00.000Z',
  endDate: '2024-07-07T00:00:00.000Z',
  status: ChallengeStatus.PENDING,
  winnerId: null,
  challengerScore: null,
  challengedScore: null,
  challengerTotalArrows: null,
  challengedTotalArrows: null,
  challengerSubmittedAt: null,
  challengedSubmittedAt: null,
  createdAt: '2024-06-15T00:00:00.000Z',
  updatedAt: '2024-06-15T00:00:00.000Z',
};

const fakeChallengeListItem: ChallengeListItem = {
  id: 'challenge-1',
  challengerId: 'user-1',
  challengedId: 'user-2',
  name: 'Weekend Shootout',
  status: ChallengeStatus.PENDING,
  challengerName: 'Ola Nordmann',
  challengedName: 'Kari Normann',
  challengerScore: null,
  challengedScore: null,
  winnerId: null,
  createdAt: '2024-06-15T00:00:00.000Z',
  updatedAt: '2024-06-15T00:00:00.000Z',
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('challengeRepository.getAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all challenges from /challenges and returns paginated response', async () => {
    const mockResponse: ChallengeListResponse = {
      challenges: [fakeChallengeListItem],
      page: 1,
      pageSize: 20,
      total: 1,
    };
    mockClient.get.mockResolvedValueOnce({ data: mockResponse });
    
    const result = await challengeRepository.getAll({ page: 1, pageSize: 20 });
    
    expect(result).toEqual(mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/challenges?page=1&pageSize=20');
  });

  it('fetches challenges with default pagination when no params provided', async () => {
    const mockResponse: ChallengeListResponse = {
      challenges: [fakeChallengeListItem],
      page: 1,
      pageSize: 20,
      total: 1,
    };
    mockClient.get.mockResolvedValueOnce({ data: mockResponse });
    
    const result = await challengeRepository.getAll();
    
    expect(result).toEqual(mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/challenges');
  });

  it('fetches challenges with filter by status', async () => {
    const mockResponse: ChallengeListResponse = {
      challenges: [fakeChallengeListItem],
      page: 1,
      pageSize: 20,
      total: 1,
    };
    mockClient.get.mockResolvedValueOnce({ data: mockResponse });
    
    await challengeRepository.getAll({ status: ChallengeStatus.PENDING });
    
    expect(mockClient.get).toHaveBeenCalledWith('/challenges?status=PENDING');
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(challengeRepository.getAll()).rejects.toBeInstanceOf(AppError);
  });

  it('throws AppError with UNAUTHORIZED on 401', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(401));
    const caught = await challengeRepository.getAll().catch((e) => e);
    expect(caught.code).toBe('UNAUTHORIZED');
  });
});

// ── getById ───────────────────────────────────────────────────────────────────

describe('challengeRepository.getById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches a challenge by ID from /challenges/:id', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeChallenge });
    
    const result = await challengeRepository.getById('challenge-1');
    
    expect(result).toEqual(fakeChallenge);
    expect(mockClient.get).toHaveBeenCalledWith('/challenges/challenge-1');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.get.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await challengeRepository.getById('ghost').catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe('challengeRepository.create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends POST to /challenges and returns the created challenge', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeChallenge });

    const createData: CreateChallengeData = {
      challengedId: 'user-2',
      name: 'Weekend Shootout',
      description: 'Friendly competition',
    };

    const result = await challengeRepository.create(createData);

    expect(result).toEqual(fakeChallenge);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/challenges',
      expect.objectContaining({
        challengedId: 'user-2',
        name: 'Weekend Shootout',
        description: 'Friendly competition',
      }),
    );
  });

  it('includes roundTypeId when provided', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeChallenge });
    
    const createData: CreateChallengeData = {
      challengedId: 'user-2',
      name: 'Round-based Challenge',
      roundTypeId: 'round-1',
    };

    await challengeRepository.create(createData);
    
    expect(mockClient.post).toHaveBeenCalledWith(
      '/challenges',
      expect.objectContaining({ roundTypeId: 'round-1' }),
    );
  });

  it('includes customRules when provided', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeChallenge });
    
    const createData: CreateChallengeData = {
      challengedId: 'user-2',
      name: 'Custom Challenge',
      customRules: {
        distanceMeters: 18,
        targetType: '40cm',
        numberArrows: 30,
      },
    };

    await challengeRepository.create(createData);
    
    expect(mockClient.post).toHaveBeenCalledWith(
      '/challenges',
      expect.objectContaining({
        customRules: expect.objectContaining({
          distanceMeters: 18,
          targetType: '40cm',
          numberArrows: 30,
        }),
      }),
    );
  });

  it('includes startDate and endDate when provided', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeChallenge });
    
    const startDate = new Date('2024-07-01');
    const endDate = new Date('2024-07-07');
    
    const createData: CreateChallengeData = {
      challengedId: 'user-2',
      name: 'Timed Challenge',
      startDate,
      endDate,
    };

    await challengeRepository.create(createData);
    
    expect(mockClient.post).toHaveBeenCalledWith(
      '/challenges',
      expect.objectContaining({
        startDate: '2024-07-01T00:00:00.000Z',
        endDate: '2024-07-07T00:00:00.000Z',
      }),
    );
  });

  it('throws AppError with BAD_REQUEST on 400', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(400, { message: 'Challenged user not found' }));
    
    const createData: CreateChallengeData = {
      challengedId: 'non-existent-user',
      name: 'Test',
    };
    
    const caught = await challengeRepository.create(createData).catch((e) => e);
    expect(caught.code).toBe('BAD_REQUEST');
  });

  it('throws AppError on network failure', async () => {
    mockClient.post.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    
    const createData: CreateChallengeData = {
      challengedId: 'user-2',
      name: 'Test',
    };
    
    await expect(challengeRepository.create(createData)).rejects.toBeInstanceOf(AppError);
  });
});

// ── accept ────────────────────────────────────────────────────────────────────

describe('challengeRepository.accept', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends PATCH to /challenges/:id/accept and returns updated challenge', async () => {
    const acceptedChallenge = { ...fakeChallenge, status: ChallengeStatus.ACCEPTED };
    mockClient.patch.mockResolvedValueOnce({ data: acceptedChallenge });

    const result = await challengeRepository.accept('challenge-1');

    expect(result.status).toBe(ChallengeStatus.ACCEPTED);
    expect(mockClient.patch).toHaveBeenCalledWith('/challenges/challenge-1/accept');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await challengeRepository.accept('ghost').catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });

  it('throws AppError with CONFLICT on 409 (already handled)', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(409));
    const caught = await challengeRepository.accept('challenge-1').catch((e) => e);
    expect(caught.code).toBe('CONFLICT');
  });
});

// ── decline ───────────────────────────────────────────────────────────────────

describe('challengeRepository.decline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends PATCH to /challenges/:id/decline and returns updated challenge', async () => {
    const declinedChallenge = { ...fakeChallenge, status: ChallengeStatus.DECLINED };
    mockClient.patch.mockResolvedValueOnce({ data: declinedChallenge });

    const result = await challengeRepository.decline('challenge-1');

    expect(result.status).toBe(ChallengeStatus.DECLINED);
    expect(mockClient.patch).toHaveBeenCalledWith('/challenges/challenge-1/decline');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await challengeRepository.decline('ghost').catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── cancel ───────────────────────────────────────────────────────────────────

describe('challengeRepository.cancel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends PATCH to /challenges/:id/cancel and returns updated challenge', async () => {
    const cancelledChallenge = { ...fakeChallenge, status: ChallengeStatus.CANCELLED };
    mockClient.patch.mockResolvedValueOnce({ data: cancelledChallenge });

    const result = await challengeRepository.cancel('challenge-1');

    expect(result.status).toBe(ChallengeStatus.CANCELLED);
    expect(mockClient.patch).toHaveBeenCalledWith('/challenges/challenge-1/cancel');
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await challengeRepository.cancel('ghost').catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });

  it('throws AppError with FORBIDDEN on 403 (only challenger can cancel)', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(403));
    const caught = await challengeRepository.cancel('challenge-1').catch((e) => e);
    expect(caught.code).toBe('FORBIDDEN');
  });
});

// ── submitResult ─────────────────────────────────────────────────────────────

describe('challengeRepository.submitResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends POST to /challenges/:id/submit and returns updated challenge', async () => {
    const challengeWithResult = {
      ...fakeChallenge,
      status: ChallengeStatus.COMPLETED,
      challengerScore: 280,
      challengerTotalArrows: 30,
      challengerSubmittedAt: '2024-06-20T00:00:00.000Z',
    };
    mockClient.post.mockResolvedValueOnce({ data: challengeWithResult });

    const submitData: SubmitChallengeResultData = {
      score: 280,
      totalArrows: 30,
    };

    const result = await challengeRepository.submitResult('challenge-1', submitData);

    expect(result.challengerScore).toBe(280);
    expect(mockClient.post).toHaveBeenCalledWith('/challenges/challenge-1/submit', submitData);
  });

  it('submits with only score (arrows optional)', async () => {
    const challengeWithResult = {
      ...fakeChallenge,
      challengerScore: 290,
    };
    mockClient.post.mockResolvedValueOnce({ data: challengeWithResult });

    const submitData: SubmitChallengeResultData = {
      score: 290,
    };

    await challengeRepository.submitResult('challenge-1', submitData);

    expect(mockClient.post).toHaveBeenCalledWith('/challenges/challenge-1/submit', { score: 290 });
  });

  it('throws AppError with BAD_REQUEST on 400 (invalid submission)', async () => {
    mockClient.post.mockRejectedValueOnce(makeAxiosError(400, { message: 'Challenge not accepted' }));
    
    const submitData: SubmitChallengeResultData = {
      score: 300,
    };
    
    const caught = await challengeRepository.submitResult('challenge-1', submitData).catch((e) => e);
    expect(caught.code).toBe('BAD_REQUEST');
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('challengeRepository.update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends PATCH to /challenges/:id and returns updated challenge', async () => {
    const updatedChallenge = { ...fakeChallenge, name: 'Updated Challenge' };
    mockClient.patch.mockResolvedValueOnce({ data: updatedChallenge });

    const updateData: UpdateChallengeData = {
      name: 'Updated Challenge',
    };

    const result = await challengeRepository.update('challenge-1', updateData);

    expect(result.name).toBe('Updated Challenge');
    expect(mockClient.patch).toHaveBeenCalledWith('/challenges/challenge-1', updateData);
  });

  it('throws AppError with NOT_FOUND on 404', async () => {
    mockClient.patch.mockRejectedValueOnce(makeAxiosError(404));
    const caught = await challengeRepository.update('ghost', { name: 'X' }).catch((e) => e);
    expect(caught.code).toBe('NOT_FOUND');
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('challengeRepository.delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends DELETE to /challenges/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await challengeRepository.delete('challenge-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/challenges/challenge-1');
  });

  it('throws AppError on failure', async () => {
    mockClient.delete.mockRejectedValueOnce(makeAxiosError(403));
    await expect(challengeRepository.delete('challenge-1')).rejects.toBeInstanceOf(AppError);
  });
});

// ── getStatistics ─────────────────────────────────────────────────────────────

describe('challengeRepository.getStatistics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches challenge statistics from /challenges/statistics', async () => {
    const mockStats = {
      totalChallenges: 10,
      wins: 7,
      losses: 2,
      winRate: 0.77,
      pendingChallenges: 3,
      completedChallenges: 7,
    };
    mockClient.get.mockResolvedValueOnce({ data: mockStats });

    const result = await challengeRepository.getStatistics('user-1');

    expect(result).toEqual(mockStats);
    expect(mockClient.get).toHaveBeenCalledWith('/challenges/statistics');
  });

  it('throws AppError on network failure', async () => {
    mockClient.get.mockRejectedValueOnce(new AxiosError('Network Error', 'ERR_NETWORK'));
    await expect(challengeRepository.getStatistics('user-1')).rejects.toBeInstanceOf(AppError);
  });
});
