// utils -> getHostname

import logger from './logger.js'

export default (uri) => {
  try {
    const { hostname } = new URL(uri)
    return hostname.replace('www.', '')
  } catch (err) {
    logger.error(err)
    return ''
  }
}
