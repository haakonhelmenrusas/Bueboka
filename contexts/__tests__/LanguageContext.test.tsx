import React from 'react';
import { Text } from 'react-native';
import { act, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider, useTranslation } from '@/contexts/LanguageContext';

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en' }]),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({ user: null, isLoading: false, isAuthenticated: false })),
}));

jest.mock('@/services/repositories', () => ({
  userRepository: {
    updateLocale: jest.fn().mockResolvedValue({}),
  },
}));

function Probe() {
  const { locale, t } = useTranslation();
  return (
    <>
      <Text testID="locale">{locale}</Text>
      <Text testID="label">{t['language.norwegian']}</Text>
    </>
  );
}

describe('LanguageProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('uses the stored locale when one is present', async () => {
    await AsyncStorage.setItem('bueboka_language', 'en');

    const { getByTestId } = render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(getByTestId('locale').props.children).toBe('en');
      expect(getByTestId('label').props.children).toBe('Norwegian');
    });
  });

  it('falls back to the OS locale when storage is empty', async () => {
    const { getByTestId } = render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(getByTestId('locale').props.children).toBe('en');
    });
  });

  it('treats Norwegian-Bokmål OS codes as "no"', async () => {
    const localization = jest.requireMock('expo-localization');
    (localization.getLocales as jest.Mock).mockReturnValueOnce([{ languageCode: 'nb' }]);

    const { getByTestId } = render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(getByTestId('locale').props.children).toBe('no');
      expect(getByTestId('label').props.children).toBe('Norsk');
    });
  });

  it('persists setLanguage to storage', async () => {
    let captured: ReturnType<typeof useTranslation> | null = null;
    function Capture() {
      captured = useTranslation();
      return null;
    }

    render(
      <LanguageProvider>
        <Capture />
      </LanguageProvider>
    );

    await waitFor(() => expect(captured?.isLoaded).toBe(true));

    await act(async () => {
      await captured!.setLanguage('en');
    });

    expect(await AsyncStorage.getItem('bueboka_language')).toBe('en');
    expect(captured!.locale).toBe('en');
  });
});
