// utils/extractWithRules

import { stripTags } from 'bellajs'

import logger from './logger.js'
import { DOMParser } from 'linkedom'

const MIN_SECTION_LENGTH = 100
const MIN_TEXT_LENGTH = 20

const countWord = (text) => {
  return text.length > 0 ? text.split(/\s+/).length : 0
}

/**
 * @param html {string}
 * @param selector {string | null}
 * @returns {null|string}
 */
export default (html, selector = null) => {
  if (!selector) return html
  try {
    const document = new DOMParser().parseFromString(html, 'text/html')
    const parts = []
    document.querySelectorAll(selector).forEach((node) => {
      const text = node.innerHTML.trim()
      if (countWord(text) >= MIN_SECTION_LENGTH) {
        parts.push(text)
      }
    })

    return parts.length > 0
      ? parts.reduce((prev, curr) => prev.concat([curr]), [])
        .filter((sect) => stripTags(sect).length > MIN_TEXT_LENGTH)
        .join('')
      : document.documentElement.innerHTML
  } catch (err) {
    logger.error(err)
  }

  return null
}
