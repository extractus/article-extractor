// utils -> stripUnwantedTags

import { DOMParser } from 'linkedom'
import { unique } from 'bellajs'

/**
 * @param html {string}
 * @param exclusions {string[]}
 * @returns {string}
 */
export default (html, exclusions = []) => {
  if (!exclusions?.length) return html

  const document = new DOMParser().parseFromString(html, 'text/html')

  for (const exclusion of unique(exclusions)) {
    document.querySelectorAll(exclusion).forEach(node => node.remove())
  }

  return Array.from(document.children).map(it => it.outerHTML).join('')
}
