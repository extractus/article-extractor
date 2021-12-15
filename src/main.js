/**
 * Article parser
 * @ndaidong
 **/

const {
  isString
} = require('bellajs')

const {
  setParserOptions,
  setRequestOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getRequestOptions,
  getSanitizeHtmlOptions
} = require('./config')

const isValidUrl = require('./utils/isValidUrl')
const isHTMLString = require('./utils/isHTMLString')

const retrieve = require('./utils/retrieve')

const parseFromHtml = require('./utils/parseFromHtml')

const extract = async (input, selector) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }
  if (isHTMLString(input)) {
    return parseFromHtml(input, selector)
  }

  if (!isValidUrl(input)) {
    throw new Error('Input must be a valid URL')
  }
  const html = await retrieve(input)
  if (!html) {
    return null
  }

  return parseFromHtml(html, selector, input)
}

module.exports = {
  setParserOptions,
  setRequestOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getRequestOptions,
  getSanitizeHtmlOptions,
  extract
}
