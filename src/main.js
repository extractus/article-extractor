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
  getSanitizeHtmlOptions,
  addQueryRules
} = require('./config')

const isValidUrl = require('./utils/isValidUrl')
const isHTMLString = require('./utils/isHTMLString')

const retrieve = require('./utils/retrieve')

const parseFromHtml = require('./utils/parseFromHtml')

const extract = async (input) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }
  if (isHTMLString(input)) {
    return parseFromHtml(input)
  }

  if (!isValidUrl(input)) {
    throw new Error('Input must be a valid URL')
  }
  const html = await retrieve(input)
  if (!html) {
    return null
  }

  return parseFromHtml(html, input)
}

module.exports = {
  setParserOptions,
  setRequestOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getRequestOptions,
  getSanitizeHtmlOptions,
  addQueryRules,
  extract
}
