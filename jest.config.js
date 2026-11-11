
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/shared/material.module.ts',
    '!src/app/core/service/user-mock.service.ts',
    '!src/app/core/models/**',
    '!src/app/app.config.ts',
    '!src/app/app.routes.ts',
  ],
};
