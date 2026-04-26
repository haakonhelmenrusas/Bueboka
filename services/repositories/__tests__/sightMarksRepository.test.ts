import { AxiosError, AxiosHeaders } from 'axios';
import { sightMarksRepository } from '@/services/repositories';
import { authFetchClient } from '@/services/api/authFetch';
import { BowSpecification, SightMark, SightMarkResult } from '@/types';

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

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const mockClient = authFetchClient as jest.Mocked<typeof authFetchClient>;

function makeAxiosError(status: number): AxiosError {
  const err = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
  err.response = {
    status,
    data: {},
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as any,
    statusText: 'Error',
  };
  return err;
}

const fakeSightMark: SightMark = {
  id: 'sm-1',
  userId: 'user-1',
  bowSpecificationId: 'spec-1',
  name: 'Innendørs 18m',
  givenMarks: [120, 115, 112],
  givenDistances: [18, 25, 30],
  ballisticsParameters: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const fakeBowSpec: BowSpecification = {
  id: 'spec-1',
  userId: 'user-1',
  bowId: 'bow-1',
  intervalSightReal: 4.2,
  intervalSightMeasured: 4.0,
  placement: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const fakeSightMarkResult: SightMarkResult = {
  id: 'smr-1',
  userId: 'user-1',
  sightMarkId: 'sm-1',
  distanceFrom: 18,
  distanceTo: 50,
  interval: 5,
  angles: [0, 1, 2],
  distances: [18, 25, 30, 50],
  sightMarksByAngle: {},
  arrowSpeedByAngle: {},
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ── getAll ────────────────────────────────────────────────────────────────────

describe('sightMarksRepository.getAll', () => {
  it('returns a flat array from the API', async () => {
    mockClient.get.mockResolvedValueOnce({ data: [fakeSightMark] });
    const result = await sightMarksRepository.getAll();
    expect(result).toEqual([fakeSightMark]);
    expect(mockClient.get).toHaveBeenCalledWith('/sight-marks');
  });

  it('unwraps { sightMarks: SightMark[] } envelope', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { sightMarks: [fakeSightMark] } });
    const result = await sightMarksRepository.getAll();
    expect(result).toEqual([fakeSightMark]);
  });

  it('returns an empty array when API returns empty sightMarks', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { sightMarks: [] } });
    const result = await sightMarksRepository.getAll();
    expect(result).toEqual([]);
  });
});

// ── create ────────────────────────────────────────────────────────────────────

describe('sightMarksRepository.create', () => {
  it('unwraps { sightMark: SightMark } envelope from POST response', async () => {
    mockClient.post.mockResolvedValueOnce({ data: { sightMark: fakeSightMark } });
    const result = await sightMarksRepository.create({ name: 'Innendørs 18m' });
    expect(result).toEqual(fakeSightMark);
    expect(mockClient.post).toHaveBeenCalledWith('/sight-marks', { name: 'Innendørs 18m' });
  });

  it('returns flat SightMark when API responds without wrapper', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeSightMark });
    const result = await sightMarksRepository.create({ name: 'Innendørs 18m' });
    expect(result.id).toBe('sm-1');
  });
});

// ── update ────────────────────────────────────────────────────────────────────

describe('sightMarksRepository.update', () => {
  it('sends PUT to /sight-marks/:id and returns the updated mark', async () => {
    const updated = { ...fakeSightMark, name: 'Oppdatert' };
    mockClient.put.mockResolvedValueOnce({ data: { sightMark: updated } });

    const result = await sightMarksRepository.update('sm-1', { name: 'Oppdatert' });

    expect(result.name).toBe('Oppdatert');
    expect(mockClient.put).toHaveBeenCalledWith('/sight-marks/sm-1', { name: 'Oppdatert' });
  });
});

// ── patch ─────────────────────────────────────────────────────────────────────

describe('sightMarksRepository.patch', () => {
  it('sends PATCH to /sight-marks/:id and returns the patched mark', async () => {
    mockClient.patch.mockResolvedValueOnce({ data: { sightMark: fakeSightMark } });
    const result = await sightMarksRepository.patch('sm-1', { givenMarks: [120] });
    expect(result).toEqual(fakeSightMark);
    expect(mockClient.patch).toHaveBeenCalledWith('/sight-marks/sm-1', { givenMarks: [120] });
  });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('sightMarksRepository.delete', () => {
  it('sends DELETE to /sight-marks/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await sightMarksRepository.delete('sm-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/sight-marks/sm-1');
  });
});

// ── getBowSpecificationByBowId ────────────────────────────────────────────────

describe('sightMarksRepository.getBowSpecificationByBowId', () => {
  it('unwraps the { bowSpecification } envelope and returns the spec', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { bowSpecification: fakeBowSpec } });
    const result = await sightMarksRepository.getBowSpecificationByBowId('bow-1');
    expect(result).toEqual(fakeBowSpec);
    expect(mockClient.get).toHaveBeenCalledWith('/bow-specifications/by-bow/bow-1');
  });

  it('returns a flat BowSpecification when there is no wrapper', async () => {
    mockClient.get.mockResolvedValueOnce({ data: fakeBowSpec });
    const result = await sightMarksRepository.getBowSpecificationByBowId('bow-1');
    expect(result.id).toBe('spec-1');
  });

  it('throws when the spec is missing the id field', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { bowSpecification: { bowId: 'bow-1' } } });
    await expect(sightMarksRepository.getBowSpecificationByBowId('bow-1')).rejects.toThrow();
  });
});

// ── createSpecification ───────────────────────────────────────────────────────

describe('sightMarksRepository.createSpecification', () => {
  it('sends POST to /bow-specifications and returns the spec', async () => {
    mockClient.post.mockResolvedValueOnce({ data: fakeBowSpec });
    const result = await sightMarksRepository.createSpecification({ bowId: 'bow-1' });
    expect(result).toEqual(fakeBowSpec);
    expect(mockClient.post).toHaveBeenCalledWith('/bow-specifications', { bowId: 'bow-1' });
  });

  it('re-throws errors without wrapping in AppError', async () => {
    const rawError = makeAxiosError(400);
    mockClient.post.mockRejectedValueOnce(rawError);
    await expect(sightMarksRepository.createSpecification({ bowId: 'bow-1' })).rejects.toBe(rawError);
  });
});

// ── getResults ────────────────────────────────────────────────────────────────

describe('sightMarksRepository.getResults', () => {
  it('returns a flat array of SightMarkResult', async () => {
    mockClient.get.mockResolvedValueOnce({ data: [fakeSightMarkResult] });
    const result = await sightMarksRepository.getResults('sm-1');
    expect(result).toEqual([fakeSightMarkResult]);
    expect(mockClient.get).toHaveBeenCalledWith('/sight-marks/sm-1/results');
  });

  it('unwraps { sightMarkResults } envelope', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { sightMarkResults: [fakeSightMarkResult] } });
    const result = await sightMarksRepository.getResults('sm-1');
    expect(result).toEqual([fakeSightMarkResult]);
  });

  it('unwraps { results } envelope', async () => {
    mockClient.get.mockResolvedValueOnce({ data: { results: [fakeSightMarkResult] } });
    const result = await sightMarksRepository.getResults('sm-1');
    expect(result).toEqual([fakeSightMarkResult]);
  });
});

// ── createResult ──────────────────────────────────────────────────────────────

describe('sightMarksRepository.createResult', () => {
  it('sends POST to /sight-marks/:id/results and returns the created result', async () => {
    mockClient.post.mockResolvedValueOnce({ data: { sightMarkResult: fakeSightMarkResult } });
    const result = await sightMarksRepository.createResult('sm-1', { distanceFrom: 18, distanceTo: 50 });
    expect(result).toEqual(fakeSightMarkResult);
    expect(mockClient.post).toHaveBeenCalledWith('/sight-marks/sm-1/results', { distanceFrom: 18, distanceTo: 50 });
  });
});

// ── deleteResult ──────────────────────────────────────────────────────────────

describe('sightMarksRepository.deleteResult', () => {
  it('sends DELETE to /sight-mark-results/:id', async () => {
    mockClient.delete.mockResolvedValueOnce({ data: undefined });
    await sightMarksRepository.deleteResult('smr-1');
    expect(mockClient.delete).toHaveBeenCalledWith('/sight-mark-results/smr-1');
  });
});

// ── calculateBallistics ───────────────────────────────────────────────────────

describe('sightMarksRepository.calculateBallistics', () => {
  it('sends POST to /ballistics/calculate and returns calculated marks', async () => {
    const calcResult = {
      given_distances: [18, 25],
      given_marks: [122, 118],
      calculated_marks: [122, 118, 112],
      ballistics_pars: [1.2, 3.4],
    };
    mockClient.post.mockResolvedValueOnce({ data: calcResult });

    const input = {
      bow_category: 'RECURVE',
      new_given_mark: 122,
      new_given_distance: 18,
      given_marks: [],
      given_distances: [],
    };

    const result = await sightMarksRepository.calculateBallistics(input);
    expect(result).toEqual(calcResult);
    expect(mockClient.post).toHaveBeenCalledWith('/ballistics/calculate', input);
  });
});

// ── calculateSightMarks ───────────────────────────────────────────────────────

describe('sightMarksRepository.calculateSightMarks', () => {
  it('sends POST to /sight-marks/calculate and returns marks result', async () => {
    const marksResult = {
      distances: [18, 25, 30],
      sight_marks_by_hill_angle: { '0': [122, 118, 115] },
      arrow_speed_by_angle: {},
    };
    mockClient.post.mockResolvedValueOnce({ data: marksResult });

    const input = {
      ballistics_pars: [1.2, 3.4],
      distances_def: [18, 25, 30],
      angles: [0],
    };

    const result = await sightMarksRepository.calculateSightMarks(input);
    expect(result).toEqual(marksResult);
    expect(mockClient.post).toHaveBeenCalledWith('/sight-marks/calculate', input);
  });
});

