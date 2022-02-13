// utils/extractWithReadability

const { Readability } = require('@mozilla/readability')
const { DOMParser } = require('linkedom')
const { isString } = require('bellajs')

module.exports = (html) => {
  if (!isString(html)) return null
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const reader = new Readability(doc)
  const result = reader.parse() || {}
  const { content, textContent, length } = result
  return !textContent || length < 60 ? null : content
}
