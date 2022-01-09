/**
 * Article parser
 * @ndaidong
 **/

import {
  isString
} from 'bellajs'

import isValidUrl from './utils/isValidUrl.js'
import isHTMLString from './utils/isHTMLString.js'

import retrieve from './utils/retrieve.js'

import parseFromHtml from './utils/parseFromHtml.js'

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

export * from './config.js'
