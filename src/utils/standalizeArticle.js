// utils -> standalizeArticle

const cheerio = require('cheerio')
const sanitize = require('sanitize-html')

const { minify: htmlmin } = require('html-minifier-terser')

const absolutifyUrl = require('./absolutifyUrl')
const { getSanitizeHtmlOptions } = require('../config')

module.exports = async (htmlArticle, url) => {
  const $ = cheerio.load(htmlArticle, {
    normalizeWhitespace: true,
    decodeEntities: true
  })

  $('a').each((i, elem) => {
    const href = $(elem).attr('href')
    if (href) {
      $(elem).attr('href', absolutifyUrl(url, href))
      $(elem).attr('target', '_blank')
    }
  })

  $('img').each((i, elem) => {
    const src = $(elem).attr('data-src') || $(elem).attr('src')
    if (src) {
      $(elem).attr('src', absolutifyUrl(url, src))
    }
  })

  const minifiedHtml = await htmlmin($.html(), {
    removeComments: true,
    removeEmptyElements: true,
    removeEmptyAttributes: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    conservativeCollapse: false,
    removeTagWhitespace: true
  })

  const cleanHtml = sanitize(minifiedHtml, getSanitizeHtmlOptions())
  return cleanHtml.trim()
}
