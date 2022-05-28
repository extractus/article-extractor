/**
 * @type {import('@jest/types/build/Config').GlobalConfig & import('@jest/types/build/Config').ProjectConfig}
 */
const config = {
  verbose: true,
  collectCoverage: true,
  detectOpenHandles: true,
  transform: {},
  // TODO https://github.com/makotoshimazu/jest-module-field-resolver/issues/2
  moduleNameMapper: {
    'urlpattern-polyfill': '<rootDir>/node_modules/urlpattern-polyfill/index.js'
  }
}
export default config
