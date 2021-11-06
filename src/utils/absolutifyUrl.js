// utils -> absolutifyUrl

const { URL, url } = require('url')

const { isString } = require('bellajs')

const isValidUrl = require('./isValidUrl')

module.exports = (fullUrl, relativeUrl) => {
  if (!isValidUrl(fullUrl) || !isString(relativeUrl)) {
    return ''
  }
  const parsed = new URL(fullUrl)
  const first = [parsed.protocol, parsed.host].join('//')
  return url.resolve(first, relativeUrl)
}
