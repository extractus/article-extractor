// utils -> retrieve

const axios = require('axios')

const logger = require('./logger')

const { getRequestOptions } = require('../config')

module.exports = async (url) => {
  try {
    const res = await axios.get(url, getRequestOptions())

    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.includes('text/html')) {
      logger.error(`Content type must be "text/html", not "${contentType}"`)
      return null
    }

    return res.data
  } catch (err) {
    logger.error(err.message || err)
    return null
  }
}
