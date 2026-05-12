// Polyfill TextEncoder / TextDecoder – required by axios (browser platform adapter)
// and expo's URL polyfill when running in the jsdom test environment.
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder: NodeTextEncoder, TextDecoder: NodeTextDecoder } = require('util');
  // @ts-ignore
  global.TextEncoder = NodeTextEncoder;
  // @ts-ignore
  global.TextDecoder = NodeTextDecoder;
}

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (i: { top: number; bottom: number; left: number; right: number }) => React.ReactNode }) =>
      children(insets),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets, frame },
  };
});

// Mock better-auth packages
jest.mock('better-auth/react', () => ({
  createAuthClient: jest.fn(() => ({
    $fetch: jest.fn(),
    signIn: { email: jest.fn() },
    signUp: { email: jest.fn() },
    signOut: jest.fn(),
    useSession: jest.fn(() => ({ data: null, isPending: false })),
  })),
}));

jest.mock('@better-auth/expo/client', () => ({
  expoClient: jest.fn(),
}));

// Provide a default LanguageProvider/useTranslation so components that consume
// the i18n context can render under test without each test having to wrap in
// the real provider. Defaults to the Norwegian translations so existing tests
// that match Norwegian copy keep working. Individual tests can override with
// jest.spyOn / jest.doMock if they need a different locale.
jest.mock('@/contexts/LanguageContext', () => {
  const { no } = require('@/lib/i18n/translations/no');
  return {
    LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
    useTranslation: () => ({
      locale: 'no',
      t: no,
      setLanguage: jest.fn().mockResolvedValue(undefined),
      isLoaded: true,
    }),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  })),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn((callback) => {
    // Call the callback immediately in tests
    callback();
  }),
  Redirect: ({ href }: { href: string }) => null,
  Tabs: ({ children }: { children: React.ReactNode }) => children,
  Stack: ({ children }: { children: React.ReactNode }) => children,
}));
