import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // maps @ to your root folder
  },
  collectCoverage: true, // Enable coverage collection
  // collectCoverageFrom: [
  //   'app/**/*.{ts,tsx}', // Collect coverage for all files in the app folder (adjust as needed)
  //   '!app/**/*.test.{ts,tsx}', // Exclude test files from coverage
  // ],
  // coverageDirectory: '<rootDir>/coverage', // Specify where coverage reports should be output
  // coverageThreshold: {
  //   global: {
  //     statements: 80, // Minimum % of statements that need to be covered
  //     branches: 80, // Minimum % of branches that need to be covered
  //     functions: 80, // Minimum % of functions that need to be covered
  //     lines: 80, // Minimum % of lines that need to be covered
  //   },
  // },
};

export default createJestConfig(config);
