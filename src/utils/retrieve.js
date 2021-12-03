// utils -> retrieve

const got = require('got')

const {
  error,
  info
} = require('./logger')

const { getFetchOptions } = require('../config')

module.exports = async (url) => {
  try {
    const res = await got(url, getFetchOptions())

    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.startsWith('text/')) {
      info(`Got invalid content-type (${contentType}) from "${url}"`)
      return null
    }

    info(`Loaded remote HTML content from "${url}"`)
    const html = res.body
    const resUrl = res.url

    const result = {
      url,
      resUrl,
      html
    }

    return result
  } catch (err) {
    info(`Could not fetch HTML content from "${url}"`)
    info(err.message)
    error(err)
  }
  return null
}
