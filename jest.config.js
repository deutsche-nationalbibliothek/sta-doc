const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // Align with tsconfig.paths.json (next/jest also reads paths; kept explicit for clarity)
  moduleNameMapper: {
    '^@/public/(.*)$': '<rootDir>/public/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/config/(.*)$': '<rootDir>/config/$1',
    '^@/data/(.*)$': '<rootDir>/data/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/features/(.*)$': '<rootDir>/features/$1',
    '^@/entity/(.*)$': '<rootDir>/features/entity/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/bin/(.*)$': '<rootDir>/bin/$1',
    '^@/bin-types/(.*)$': '<rootDir>/bin/data/types/$1',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
