import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import SkytterePage from '../../app/(tabs)/skyttere';
import { useAuth } from '@/hooks';
import { publicProfilesApi } from '@/services';
import type { User } from '@/types';

// ─── Module mocks ────────────────────────────────────────────────────────────

jest.mock('@/hooks', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  usePathname: () => '/skyttere',
  useNavigation: () => ({ getParent: () => ({ setOptions: jest.fn() }) }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

// Mock only the publicProfilesApi export; everything else from @/services is unused here.
jest.mock('@/services', () => ({
  publicProfilesApi: { search: jest.fn() },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/common', () => {
  const { View, Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    Message: ({ title, description }: { title: string; description: string }) => (
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
      </View>
    ),
  };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockedUseAuth = jest.mocked(useAuth);
const mockedSearch = jest.mocked(publicProfilesApi.search);

const mockUser: User = {
  id: '1',
  name: 'Haakon Test',
  email: 'test@test.com',
  emailVerified: true,
  club: null,
  image: null,
  skytternr: null,
  isPublic: false,
  publicName: false,
  publicClub: false,
  publicStats: false,
  publicSkytternr: false,
  publicAchievements: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const profile = { id: 'Hd4r7VGf90WtNCZ0RDUOVhiSbCJYKm1f', name: 'Haakon Test', club: 'Sarpsborg Bueskyttere' };

/** Type into the search box and advance past the 300 ms debounce.
 *
 * After `advanceTimersByTime(300)` the debounce fires and `fetchProfiles`
 * suspends on `await publicProfilesApi.search(…)`.  The three
 * `await Promise.resolve()` calls each yield execution back to the microtask
 * queue so that the (already-resolved/rejected) mock Promise settles and the
 * resulting state updates – setLoading → setProfiles/setSearched → setLoading –
 * all happen **inside** the same `act` wrapper before any `findBy*` query runs.
 */
async function searchFor(input: Parameters<typeof fireEvent.changeText>[0], text: string) {
  fireEvent.changeText(input, text);
  await act(async () => {
    jest.advanceTimersByTime(300); // fire the debounce
    await Promise.resolve(); // let fetchProfiles reach its first await
    await Promise.resolve(); // let the mock Promise settle + run catch/finally
    await Promise.resolve(); // safety flush for any extra microtask hops
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SkytterePage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedUseAuth.mockReturnValue({ user: mockUser } as ReturnType<typeof useAuth>);
    mockedSearch.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Auth guard ─────────────────────────────────────────────────────────────

  it('shows "Ikke innlogget" when there is no logged-in user', () => {
    mockedUseAuth.mockReturnValue({ user: null } as ReturnType<typeof useAuth>);
    const { getByText } = render(<SkytterePage />);
    expect(getByText('Ikke innlogget')).toBeTruthy();
  });

  it('does not show the search input when logged out', () => {
    mockedUseAuth.mockReturnValue({ user: null } as ReturnType<typeof useAuth>);
    const { queryByPlaceholderText } = render(<SkytterePage />);
    expect(queryByPlaceholderText('Søk etter navn eller klubb…')).toBeNull();
  });

  // ── Idle state ─────────────────────────────────────────────────────────────

  it('shows the idle hint before any search', () => {
    const { getByText } = render(<SkytterePage />);
    expect(getByText('Begynn å skrive for å søke')).toBeTruthy();
  });

  it('shows the page title', () => {
    const { getByText } = render(<SkytterePage />);
    expect(getByText('Finn bueskyttere')).toBeTruthy();
  });

  // ── Debounce ───────────────────────────────────────────────────────────────

  it('does not call search before the 300 ms debounce fires', () => {
    const { getByPlaceholderText } = render(<SkytterePage />);
    fireEvent.changeText(getByPlaceholderText('Søk etter navn eller klubb…'), 'haakon');
    jest.advanceTimersByTime(299);
    expect(mockedSearch).not.toHaveBeenCalled();
  });

  it('calls search with the trimmed query after 300 ms', async () => {
    const { getByPlaceholderText } = render(<SkytterePage />);
    await searchFor(getByPlaceholderText('Søk etter navn eller klubb…'), 'haakon');
    expect(mockedSearch).toHaveBeenCalledWith('haakon');
  });

  it('cancels a pending search when the query changes before debounce fires', async () => {
    const { getByPlaceholderText } = render(<SkytterePage />);
    const input = getByPlaceholderText('Søk etter navn eller klubb…');

    fireEvent.changeText(input, 'haa');
    jest.advanceTimersByTime(150);
    fireEvent.changeText(input, 'haakon');
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Only one call — for the final query
    expect(mockedSearch).toHaveBeenCalledTimes(1);
    expect(mockedSearch).toHaveBeenCalledWith('haakon');
  });

  // ── Results ────────────────────────────────────────────────────────────────

  it('shows profile cards when search returns results', async () => {
    mockedSearch.mockResolvedValueOnce([profile]);
    const { getByPlaceholderText, getByText } = render(<SkytterePage />);

    await searchFor(getByPlaceholderText('Søk etter navn eller klubb…'), 'haakon');

    expect(getByText('Haakon Test')).toBeTruthy();
    expect(getByText('Sarpsborg Bueskyttere')).toBeTruthy();
  });

  it('hides the idle illustration once results are shown', async () => {
    mockedSearch.mockResolvedValueOnce([profile]);
    const { getByPlaceholderText, getByText, queryByText } = render(<SkytterePage />);

    await searchFor(getByPlaceholderText('Søk etter navn eller klubb…'), 'haakon');
    expect(getByText('Haakon Test')).toBeTruthy();

    expect(queryByText('Begynn å skrive for å søke')).toBeNull();
  });

  // ── Empty results ──────────────────────────────────────────────────────────

  it('shows "Ingen resultater" when the search returns nothing', async () => {
    mockedSearch.mockResolvedValueOnce([]);
    const { getByPlaceholderText, getByText } = render(<SkytterePage />);

    await searchFor(getByPlaceholderText('Søk etter navn eller klubb…'), 'xyz');

    expect(getByText('Ingen resultater')).toBeTruthy();
  });

  // ── Clearing the query ─────────────────────────────────────────────────────

  it('returns to the idle state when the query is cleared', async () => {
    mockedSearch.mockResolvedValueOnce([profile]);
    const { getByPlaceholderText, getByText } = render(<SkytterePage />);
    const input = getByPlaceholderText('Søk etter navn eller klubb…');

    await searchFor(input, 'haakon');
    expect(getByText('Haakon Test')).toBeTruthy();

    await act(async () => {
      fireEvent.changeText(input, '');
    });
    expect(getByText('Begynn å skrive for å søke')).toBeTruthy();
  });

  it('does not call search when the query is empty', async () => {
    const { getByPlaceholderText } = render(<SkytterePage />);
    const input = getByPlaceholderText('Søk etter navn eller klubb…');

    fireEvent.changeText(input, '');
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(mockedSearch).not.toHaveBeenCalled();
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it('shows "Ingen resultater" when the search call throws', async () => {
    mockedSearch.mockRejectedValueOnce(new Error('Network error'));
    const { getByPlaceholderText, getByText } = render(<SkytterePage />);

    await searchFor(getByPlaceholderText('Søk etter navn eller klubb…'), 'fail');

    expect(getByText('Ingen resultater')).toBeTruthy();
  });

  it('does not crash and keeps the UI intact after a search error', async () => {
    mockedSearch.mockRejectedValueOnce(new Error('Network error'));
    const { getByPlaceholderText, getByText } = render(<SkytterePage />);
    const input = getByPlaceholderText('Søk etter navn eller klubb…');

    await searchFor(input, 'fail');
    expect(getByText('Ingen resultater')).toBeTruthy();

    // Input is still usable
    expect(input).toBeTruthy();
  });
});
