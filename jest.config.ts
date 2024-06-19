import { type Config } from 'jest';

// const testRegex = '(/tests/.*|(\\.|/)(test|spec))\\.(js?|ts?)?$';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.test\\.ts$',
  verbose: true,
  notify: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;
