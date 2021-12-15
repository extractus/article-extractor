// utils -> absolutifyUrl

const logger = require('./logger')

module.exports = (fullUrl = '', relativeUrl = '') => {
  try {
    const result = new URL(relativeUrl, fullUrl)
    return result.toString()
  } catch (err) {
    logger.error(err)
    return ''
  }
}
