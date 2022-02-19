// utils -> standalizeArticle

import sanitize from 'sanitize-html'

import { crush } from 'html-crush'

import absolutifyUrl from './absolutifyUrl.js'

import { getSanitizeHtmlOptions } from '../config.js'
import { DOMParser } from 'linkedom'

/**
 * @param htmlArticle {string}
 * @param url {string}
 * @param transform {(Document)=>Document}
 * @returns {Promise<string>}
 */
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

  const html = (transform?.call(this, $article) ?? $article).documentElement.innerHTML

  const crushed = crush(html, {
    removeHTMLComments: 2,
    removeLineBreaks: true
  })

  const cleanHtml = sanitize(crushed.result, getSanitizeHtmlOptions())
  return cleanHtml.trim()
}
