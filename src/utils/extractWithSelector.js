// utils/extractWithRules

const cheerio = require('cheerio')

const {
  stripTags
} = require('bellajs')

const logger = require('./logger')

const MIN_SECTION_LENGTH = 100
const MIN_TEXT_LENGTH = 20

const countWord = (text) => {
  return text.length > 0 ? text.split(/\s+/).length : 0
}

module.exports = (html, selector = 'article') => {
  try {
    const doc = cheerio.load(html, {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeSelfClosing: true
    })

    const parts = []
    const els = doc(selector)
    if (els) {
      els.each((_, el) => {
        const section = doc(el)
        const text = section.html().trim()
        if (countWord(text) >= MIN_SECTION_LENGTH) {
          parts.push(text)
        }
      })
    }
    if (parts.length > 0) {
      const content = parts.reduce((prev, curr) => {
        return prev.concat([curr])
      }, []).filter((sect) => {
        return stripTags(sect).length > MIN_TEXT_LENGTH
      }).join('')
      return content
    }
  } catch (err) {
    logger.error(err)
  }

  return null
}
