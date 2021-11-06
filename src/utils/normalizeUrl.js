// utils -> removeUTM

const { URL } = require('url')

module.exports = (url) => {
  const {
    protocol,
    host,
    pathname,
    query = ''
  } = new URL(url)

  const parts = [protocol, '//', host, pathname]

  if (query && query.length > 2) {
    const modquery = query.split('&').filter((v) => {
      return !(/^utm_/).test(v) && !(/^pk_/).test(v)
    })
    if (modquery.length > 0) {
      parts.push('?' + modquery.join('&'))
    }
  }
  return parts.join('')
}
