// utils -> transformHtml

import { DOMParser } from 'linkedom'

/**
 * @param inputHtml {string}
 * @param transform {(Document)=>Document}
 * @returns document {string}
 */
export default (inputHtml, transform = null) => {
  if (!transform) {
    return inputHtml
  }

  const $article = new DOMParser().parseFromString(inputHtml, 'text/html')

  const document = transform($article)

  return document.toString()
}
