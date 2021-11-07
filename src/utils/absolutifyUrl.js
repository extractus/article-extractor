// utils -> absolutifyUrl

const resolve = (from, to) => {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'))
  if (resolvedUrl.protocol === 'resolve:') {
    const { pathname, search, hash } = resolvedUrl
    return pathname + search + hash
  }
  return resolvedUrl.toString()
}

const { isString } = require('bellajs')

const isValidUrl = require('./isValidUrl')

module.exports = (fullUrl, relativeUrl) => {
  if (!isValidUrl(fullUrl) || !isString(relativeUrl)) {
    return ''
  }
  const parsed = new URL(fullUrl)
  const first = [parsed.protocol, parsed.host].join('//')
  return resolve(first, relativeUrl)
}
