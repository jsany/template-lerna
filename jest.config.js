module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/fixtures/', '/templates'],
  transformIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coveragePathIgnorePatterns: ['/node_modules/']
};
