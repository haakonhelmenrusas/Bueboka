module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jestSetup.ts'],
  setupFilesAfterEnv: ['./jestSetup.ts'],
  testEnvironment: 'jsdom',
  clearMocks: true,
  restoreMocks: true,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|better-auth|@better-auth|@sentry)',
  ],
  moduleNameMapper: {
    '^expo-modules-core(.*)$': '<rootDir>/node_modules/expo-modules-core$1',
  },
};
