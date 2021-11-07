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
    if (res.statusCode !== 200) {
      error(`Got ${res.statusCode} error code from "${url}"`)
      return null
    }

    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.startsWith('text/')) {
      error(`Got invalid content-type (${contentType}) from "${url}"`)
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
    error(`Could not fetch HTML content from "${url}"`)
    error(err)
  }
  return null
}
