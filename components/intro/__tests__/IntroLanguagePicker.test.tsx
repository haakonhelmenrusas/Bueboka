import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import IntroLanguagePicker from '../IntroLanguagePicker';

const mockSetLanguage = jest.fn().mockResolvedValue(undefined);

jest.mock('@/contexts', () => {
  const { no } = require('@/lib/i18n/translations/no');
  let currentLocale = 'no';
  return {
    useTranslation: () => ({
      locale: currentLocale,
      t: no,
      setLanguage: mockSetLanguage,
      isLoaded: true,
    }),
    __setTestLocale: (l: string) => {
      currentLocale = l;
    },
  };
});

const { __setTestLocale } = require('@/contexts') as { __setTestLocale: (l: string) => void };

describe('IntroLanguagePicker', () => {
  beforeEach(() => {
    mockSetLanguage.mockClear();
    __setTestLocale('no');
  });

  it('renders two flag options', () => {
    render(<IntroLanguagePicker />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(2);
  });

  it('marks the Norwegian option as selected when locale is "no"', () => {
    render(<IntroLanguagePicker />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons[0].props.accessibilityState).toEqual({ selected: true });
    expect(buttons[1].props.accessibilityState).toEqual({ selected: false });
  });

  it('marks the English option as selected when locale is "en"', () => {
    __setTestLocale('en');
    render(<IntroLanguagePicker />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons[0].props.accessibilityState).toEqual({ selected: false });
    expect(buttons[1].props.accessibilityState).toEqual({ selected: true });
  });

  it('calls setLanguage("en") when the English flag is tapped', () => {
    render(<IntroLanguagePicker />);
    const buttons = screen.getAllByRole('radio');
    fireEvent.press(buttons[1]);
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

  it('calls setLanguage("no") when the Norwegian flag is tapped', () => {
    __setTestLocale('en');
    render(<IntroLanguagePicker />);
    const buttons = screen.getAllByRole('radio');
    fireEvent.press(buttons[0]);
    expect(mockSetLanguage).toHaveBeenCalledWith('no');
  });

  it('has an accessible container with a language label', () => {
    render(<IntroLanguagePicker />);
    expect(screen.getByLabelText('Velg språk')).toBeTruthy();
  });
});
