module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js"],
  verbose: true,
  // Clear mocks between tests
  clearMocks: true,
  // Clean up after tests
  setupFilesAfterEnv: [],
  // Timeout for tests
  testTimeout: 10000,
};
