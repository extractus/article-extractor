// utils -> standalizeArticle

import sanitize from 'sanitize-html'

import { minify as htmlmin } from 'html-minifier-terser'

import absolutifyUrl from './absolutifyUrl.js'

import { getSanitizeHtmlOptions } from '../config.js'
import { DOMParser } from 'linkedom'

export default async (htmlArticle, url, transform = null) => {
  const $article = new DOMParser().parseFromString(htmlArticle, 'text/html')
  $article.getElementsByTagName('a').forEach(node => {
    const href = node.getAttribute('href')
    if (href) {
      node.setAttribute('href', absolutifyUrl(url, href))
      node.setAttribute('target', '_blank')
    }
  })

  $article.getElementsByTagName('img').forEach(node => {
    const src = node.getAttribute('data-src')
    if (src) {
      node.setAttribute('src', absolutifyUrl(url, src))
    }
  })

  const html = transform ? transform($article).documentElement.innerHTML : $article.documentElement.innerHTML
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
