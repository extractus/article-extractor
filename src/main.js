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

export const extract = async (input) => {
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

export { addTransformations, removeTransformations } from './utils/transformation.js'
export * from './config.js'
