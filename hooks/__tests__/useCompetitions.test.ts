import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCompetitions } from '../useCompetitions';
import { competitionRepository } from '@/services/repositories';
import type { Competition } from '@/types';
import { Environment, PracticeCategory } from '@/types';

jest.mock('@/services/repositories', () => ({
  competitionRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

// The hook reads object-style t from LanguageContext (mocked globally in jestSetup)
jest.mock('@/contexts/LanguageContext', () => ({
  useTranslation: () => ({
    t: {
      'common.unknownError': 'Unknown error',
      'konkurranse.fetchError': 'Kunne ikke laste konkurranser',
    },
  }),
}));

const mockGetAll = jest.mocked(competitionRepository.getAll);

const makeCompetition = (overrides: Partial<Competition>): Competition => ({
  id: 'c1',
  userId: 'u1',
  date: '2020-01-01T10:00:00',
  name: 'Old Cup',
  location: null,
  organizerName: null,
  environment: Environment.INDOOR,
  weather: [],
  practiceCategory: PracticeCategory.SKIVE_INDOOR,
  notes: null,
  placement: null,
  numberOfParticipants: null,
  personalBest: null,
  totalScore: 100,
  bowId: null,
  arrowsId: null,
  rounds: [],
  createdAt: '2020-01-01T10:00:00',
  updatedAt: '2020-01-01T10:00:00',
  ...overrides,
});

describe('useCompetitions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches competitions and derives active/past/stats', async () => {
    const past = makeCompetition({ id: 'past', date: '2020-01-01T10:00:00', placement: 2, personalBest: true, totalScore: 600 });
    const future = makeCompetition({ id: 'future', date: '2999-01-01T10:00:00', totalScore: 650 });
    mockGetAll.mockResolvedValue({ competitions: [past, future] });

    const { result } = await renderHook(() => useCompetitions());

    await act(async () => {
      await result.current.fetchCompetitions();
    });

    expect(mockGetAll).toHaveBeenCalledTimes(1);
    expect(result.current.competitions).toHaveLength(2);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.active.map((c) => c.id)).toEqual(['future']);
    expect(result.current.past.map((c) => c.id)).toEqual(['past']);
    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.active).toBe(1);
    expect(result.current.stats.podiums).toBe(1);
    expect(result.current.stats.personalBests).toBe(1);
    expect(result.current.stats.bestPlacement).toBe(2);
    expect(result.current.stats.averageScore).toBe(625);
  });

  it('sets error when the fetch fails', async () => {
    mockGetAll.mockRejectedValue(new Error('Network down'));

    const { result } = await renderHook(() => useCompetitions());

    await act(async () => {
      await result.current.fetchCompetitions();
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.error?.message).toBe('Network down');
    expect(result.current.competitions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('handles a response without a competitions array', async () => {
    mockGetAll.mockResolvedValue({} as any);

    const { result } = await renderHook(() => useCompetitions());

    await act(async () => {
      await result.current.fetchCompetitions();
    });

    expect(result.current.competitions).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
