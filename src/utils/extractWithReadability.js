// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import isHTMLString from './isHTMLString.js'

/**
 * @param html {string}
 * @param inputUrl {string}
 * @returns {string|null}
 */
export default (html, inputUrl = '') => {
  if (!isHTMLString(html)) return null
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const base = doc.createElement('base')
  base.setAttribute('href', inputUrl)
  doc.head.appendChild(base)
  const reader = new Readability(doc)
  const result = reader.parse() || {}
  return result.textContent ? result.content : null
}

export function extractTitleWithReadability (html) {
  if (!isHTMLString(html)) return null
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const reader = new Readability(doc)
  // noinspection JSUnresolvedFunction
  return reader._getArticleTitle()
}
