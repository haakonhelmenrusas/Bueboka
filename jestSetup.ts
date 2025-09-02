jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
// Clear all timers after each test
afterEach(() => {
  jest.clearAllTimers();
  jest.runOnlyPendingTimers();
});

// Clear all mocks after all tests
afterAll(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
