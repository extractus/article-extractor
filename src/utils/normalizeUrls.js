// utils -> normalizeUrls

import absolutifyUrl from './absolutifyUrl.js'

import { DOMParser } from 'linkedom'

/**
 * @param inputHtml {string}
 * @param url {string}
 * @returns article {string}
 */
export default (inputHtml, url) => {
  const $article = new DOMParser().parseFromString(inputHtml, 'text/html')

  Array.from($article.getElementsByTagName('a')).forEach(node => {
    const href = node.getAttribute('href')
    if (href) {
      node.setAttribute('href', absolutifyUrl(url, href))
      node.setAttribute('target', '_blank')
    }
  })

  Array.from($article.getElementsByTagName('img')).forEach(node => {
    const src = node.getAttribute('data-src') ?? node.getAttribute('src')
    if (src) {
      node.setAttribute('src', absolutifyUrl(url, src))
    }
  })

  return $article.toString()
}
