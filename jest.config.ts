module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-native' +
      '|@react-native-community' +
      '|@react-navigation' +
      '|@fortawesome' +
      '|expo-modules-core' +
      '|react-native-vector-icons' +
      ')',
  ],
  setupFiles: ['./jestSetup.ts'],
  setupFilesAfterEnv: ['./jestSetup.ts'],
  testEnvironment: 'jsdom',
  clearMocks: true,
  restoreMocks: true,
};
