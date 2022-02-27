// utils -> absolutifyUrl

import logger from './logger.js'

export default (fullUrl = '', relativeUrl = '') => {
  try {
    const result = new URL(relativeUrl, fullUrl)
    return result.toString()
  } catch (err) {
    logger.error(err)
    return ''
  }
}
