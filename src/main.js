/**
 * Article parser
 * @ndaidong
 **/

import {
  isString
} from 'bellajs'

import retrieve from './utils/retrieve.js'
import parseFromHtml from './utils/parseFromHtml.js'
import { isValid as isValidUrl } from './utils/linker.js'
import { isValid as isHTMLString } from './utils/html.js'

export const extract = async (input, parserOptions = {}, fetchOptions = {}) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }

  if (isHTMLString(input)) {
    return parseFromHtml(input, null, parserOptions)
  }

  if (!isValidUrl(input)) {
    throw new Error('Input must be a valid URL')
  }
  const html = await retrieve(input, fetchOptions)
  if (!html) {
    return null
  }

  return parseFromHtml(html, input, parserOptions)
}

export { addTransformations, removeTransformations } from './utils/transformation.js'
export { setSanitizeHtmlOptions, getSanitizeHtmlOptions } from './config.js'
