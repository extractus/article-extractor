// main.js

import {
  isString
} from 'bellajs'

import retrieve from './utils/retrieve.js'
import parseFromHtml from './utils/parseFromHtml.js'
import { getCharset } from './utils/html.js'
import { isValid as isValidUrl } from './utils/linker.js'

export const extract = async (input, parserOptions = {}, fetchOptions = {}) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }

  if (!isValidUrl(input)) {
    return parseFromHtml(input, null, parserOptions || {})
  }
  const buffer = await retrieve(input, fetchOptions)
  const text = buffer ? Buffer.from(buffer).toString().trim() : ''
  if (!text) {
    return null
  }
  const charset = getCharset(text)
  const decoder = new TextDecoder(charset)
  const html = decoder.decode(buffer)
  return parseFromHtml(html, input, parserOptions || {})
}

export const extractFromHtml = async (html, url, parserOptions = {}) => {
  return parseFromHtml(html, url, parserOptions)
}

export { addTransformations, removeTransformations } from './utils/transformation.js'
export { setSanitizeHtmlOptions, getSanitizeHtmlOptions } from './config.js'
