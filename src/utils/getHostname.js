// utils -> getHostname

const logger = require('./logger')

const getHostname = (uri) => {
  try {
    const { hostname } = new URL(uri)
    return hostname.replace('www.', '')
  } catch (err) {
    logger.error(err)
    return ''
  }
}

module.exports = getHostname
