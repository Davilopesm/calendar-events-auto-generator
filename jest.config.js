module.exports = {
  rootDir: '.',
  testRegex: './test/.*.spec.ts$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'js'
  ]
}
