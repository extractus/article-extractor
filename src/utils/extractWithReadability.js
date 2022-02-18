// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import { isString } from 'bellajs'

export default (html, inputUrl) => {
  if (!isString(html)) return null
  const doc = new DOMParser().parseFromString(html, 'text/html')
  try {
    doc.baseURI = inputUrl
  } catch (e) {
    const base = doc.createElement('base')
    base.href = inputUrl
    doc.head.appendChild(base)
  }
  const reader = new Readability(doc)
  const result = reader.parse() || {}
  const { content, textContent, length } = result
  return !textContent || length < 60 ? null : content
}
