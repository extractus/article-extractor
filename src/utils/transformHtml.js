// utils -> transformHtml

import { DOMParser } from 'linkedom'

/**
 * @param inputHtml {string}
 * @param transform {(Document)=>Document}
 * @returns document {string}
 */
export default (html, transforms = []) => {
  if (!transforms?.length) return html

  let document = new DOMParser().parseFromString(html, 'text/html')
  transforms.forEach((transform) => {
    document = transform(document)
  })

  return Array.from(document.children).map(it => it.outerHTML).join('')
}
