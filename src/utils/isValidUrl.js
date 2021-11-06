// utils -> isValidUrl

const { URL } = require('url')

const {
  isString
} = require('bellajs')

module.exports = (url = '') => {
  if (!isString(url)) {
    return false
  }
  const pros = ['http:', 'https:']

  const {
    protocol,
    host,
    hostname
  } = new URL(url)

  return !((!host || !hostname || !pros.includes(protocol)))
}
