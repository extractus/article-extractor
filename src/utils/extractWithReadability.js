// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import { isString } from 'bellajs'

export default (html, url) => {
  if (!isString(html)) return null
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.baseURI = url
  const reader = new Readability(doc)
  const result = reader.parse() || {}
  const { content, textContent, length } = result
  return !textContent || length < 60 ? null : content
}
