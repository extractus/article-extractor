// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import { isString } from 'bellajs'

export default (html, url = '') => {
  if (!isString(html)) {
    return null
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const base = doc.createElement('base')
  base.setAttribute('href', url)
  doc.head.appendChild(base)
  const reader = new Readability(doc, {
    keepClasses: true,
  })
  const result = reader.parse() ?? {}
  return result.textContent ? result.content : null
}

export function extractTitleWithReadability (html) {
  if (!isString(html)) {
    return null
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const reader = new Readability(doc)
  return reader._getArticleTitle() || null
}
