// main.js

import {
  isString
} from '@pwshub/bellajs'

import retrieve from './utils/retrieve.js'
import parseFromHtml from './utils/parseFromHtml.js'
import { getCharset } from './utils/html.js'
import { isValid as isValidUrl } from './utils/linker.js'

/**
 * Load and extract article data from a URL or HTML string.
 *
 * @param {string} input - URL or HTML string to extract from
 * @param {object} [parserOptions={}] - Options for parsing
 * @param {Function} [fetcher] - Custom fetch function (url) => Promise<Response>. Defaults to globalThis.fetch.
 * @returns {Promise<object|null>} Extracted article data or null
 */
export const extract = async (input, parserOptions = {}, fetcher = globalThis.fetch) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }

  if (!isValidUrl(input)) {
    return parseFromHtml(input, null, parserOptions)
  }
  const buffer = await retrieve(input, fetcher)
  const text = buffer ? Buffer.from(buffer).toString().trim() : ''
  if (!text) {
    return null
  }
  const charset = getCharset(text)
  const decoder = new TextDecoder(charset)
  const html = decoder.decode(buffer)
  return parseFromHtml(html, input, parserOptions)
}

/**
 * Extract article data from an HTML string directly.
 *
 * @param {string} html - Raw HTML content
 * @param {string} [url] - Source URL for resolving relative links
 * @param {ParserOptions} [parserOptions={}] - Options for parsing
 * @returns {Promise<ArticleData|null>} Extracted article data or null
 */
export const extractFromHtml = async (html, url, parserOptions = {}) => {
  return parseFromHtml(html, url, parserOptions)
}

export { addTransformations, removeTransformations } from './utils/transformation.js'
export { setSanitizeHtmlOptions, getSanitizeHtmlOptions } from './config.js'
