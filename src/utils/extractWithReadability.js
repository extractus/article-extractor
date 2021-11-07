// utils/extractWithReadability

const { Readability } = require('readabilitySAX')
const { Parser } = require('htmlparser2')

const {
  error
} = require('./logger')

module.exports = async (html) => {
  try {
    const readable = new Readability()
    const parser = new Parser(readable, {})
    parser.write(html)
    const article = await readable.getArticle()
    return article && article.html !== 'null' ? article.html : null
  } catch (err) {
    error(err)
    return null
  }
}
