module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['src/'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json' // Specify your TypeScript config file here
            }
        ]
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Resolve src aliases if you use any
    }
};
