/**
 * @type {import('@jest/types/build/Config').GlobalConfig & import('@jest/types/build/Config').ProjectConfig}
 */
const config = {
  verbose: true,
  collectCoverage: true,
  detectOpenHandles: true,
  transform: {},
  moduleNameMapper: {
    'urlpattern-polyfill': '<rootDir>/node_modules/urlpattern-polyfill/dist/index.js'
  }
}
export default config
