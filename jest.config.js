module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jestSetup.ts'],
  setupFilesAfterEnv: ['./jestSetup.ts'],
  testEnvironment: 'jsdom',
  clearMocks: true,
  restoreMocks: true,
};
