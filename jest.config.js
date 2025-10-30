/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.(ts|tsx|js|jsx)$': '$1'
    },
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                verbatimModuleSyntax: false,
                allowImportingTsExtensions: false
            }
        }]
    }
};

export default config;