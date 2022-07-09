// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'

import { isValid as isHTMLString } from './html.js'
import { error } from './logger.js'

/**
 * @param html {string}
 * @param inputUrl {string}
 * @returns {string|null}
 */
export default (html, inputUrl = '') => {
  try {
    if (!isHTMLString(html)) return null
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const base = doc.createElement('base')
    base.setAttribute('href', inputUrl)
    doc.head.appendChild(base)
    const reader = new Readability(doc)
    const result = reader.parse() ?? {}
    return result.textContent ? result.content : null
  } catch (err) {
    error(err.message)
    return null
  }
}

export function extractTitleWithReadability (html) {
  try {
    if (!isHTMLString(html)) return null
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const reader = new Readability(doc)
    // noinspection JSUnresolvedFunction
    return reader._getArticleTitle()
  } catch (err) {
    error(err.message)
    return ''
  }
}
