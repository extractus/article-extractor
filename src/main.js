// main.js

import {
  isString
} from 'bellajs'

import retrieve from './utils/retrieve.js'
import parseFromHtml from './utils/parseFromHtml.js'
import { isValid as isValidUrl } from './utils/linker.js'

export const extract = async (input, parserOptions = {}, fetchOptions = {}) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }

  if (!isValidUrl(input)) {
    return parseFromHtml({ inputHtml: input, parserOptions: parserOptions })
  }
  const html = await retrieve(input, fetchOptions)
  if (!html) {
    return null
  }

  return parseFromHtml({ inputHtml: html, inputUrl: input, parserOptions: parserOptions })
}

export const extractFromHtml = async (html, url, parserOptions = {}) => {
  return parseFromHtml({ inputHtml: html, inputUrl: url, parserOptions: parserOptions })
}

export { addTransformations, removeTransformations } from './utils/transformation.js'
export { setSanitizeHtmlOptions, getSanitizeHtmlOptions } from './config.js'
