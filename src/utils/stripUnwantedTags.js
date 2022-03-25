// utils/srtipUnwantedTags

import { parseHTML } from 'linkedom'

/**
 * @param html {string}
 * @param exclusions {string[]}
 * @returns {string}
 */
export default (html, exclusions = []) => {
  if (!exclusions?.length) return html

  const { document } = parseHTML(html)

  for (const exclusion of exclusions) {
    document.querySelectorAll(exclusion).forEach(node => node.remove())
  }

  return document.toString()
}
