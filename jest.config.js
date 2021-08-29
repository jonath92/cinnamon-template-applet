const UUID = __dirname.split('/').slice(-1)[0]


/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    preset: 'ts-jest',
    // TODO: optimally would be to implement an own testEnvironment for Gjs/Cjs but this is difficult ... 
    testEnvironment: 'cjs-jest-test-runtime',
    // needed to work with baseUrl. See https://stackoverflow.com/a/51174924/11603006
    moduleDirectories: ['node_modules', './src'],
    // clearMocks: true, 
    globals: {
        "ts-jest": {
            tsconfig: './test/tsconfig.json'
        }, 
        "__meta": {
            uuid: UUID
        }
    }
};