// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export default (html, url) => {
  const doc = new JSDOM(html, { url })
  const reader = new Readability(doc.window.document)
  const result = reader.parse() || {}
  const { content, textContent, length } = result
  return !textContent || length < 60 ? null : content
}
