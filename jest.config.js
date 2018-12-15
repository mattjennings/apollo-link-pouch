module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
      babelConfig: true
    }
  }
}
