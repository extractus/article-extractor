// utils/extractWithReadability

const { Readability } = require('@mozilla/readability')
const { JSDOM } = require('jsdom')

module.exports = (html, url) => {
  const doc = new JSDOM(html, { url })
  const reader = new Readability(doc.window.document)
  const result = reader.parse() || {}
  const { content, textContent, length } = result
  return !textContent || length < 60 ? null : content
}
