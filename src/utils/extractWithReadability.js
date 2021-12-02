// utils/extractWithReadability

const { Readability } = require('@mozilla/readability')
const { JSDOM } = require('jsdom')

const {
  error
} = require('./logger')

module.exports = (html) => {
  try {
    const doc = new JSDOM(html)
    const reader = new Readability(doc.window.document)
    const { content, textContent } = reader.parse()
    return !textContent || content.includes('>null</div>') ? null : content
  } catch (err) {
    error(err)
    return null
  }
}
