// utils -> standalizeArticle

import cheerio from 'cheerio'
import sanitize from 'sanitize-html'

import { minify as htmlmin } from 'html-minifier-terser'

import absolutifyUrl from './absolutifyUrl.js'

import { getSanitizeHtmlOptions } from '../config.js'

export default async (htmlArticle, url, transform = null) => {
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

  const html = transform ? transform($).html() : $.html()
  const minifiedHtml = await htmlmin(html, {
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
