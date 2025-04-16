module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!.*\\.mjs$)',
    ],
  };