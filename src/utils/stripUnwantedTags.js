// utils -> stripUnwantedTags

import { DOMParser } from 'linkedom'

/**
 * @param html {string}
 * @param exclusions {string[]}
 * @returns {string}
 */
export default (html, exclusions = []) => {
  if (!exclusions?.length) return html

  const document = new DOMParser().parseFromString(html, 'text/html')

  for (const exclusion of exclusions) {
    document.querySelectorAll(exclusion).forEach(node => node.remove())
  }

  return document.toString()
}
