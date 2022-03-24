// utils/srtipUnwantedTags

import logger from './logger.js'
import { parseHTML } from 'linkedom'

/**
 * @param html {string}
 * @param exclusions {string[]}
 * @returns {string}
 */
export default (html, exclusions = []) => {
  if (!exclusions.length) {
    return html
  }

  try {
    const { document } = parseHTML(html)

    for (const exclusion of exclusions) {
      document.querySelectorAll(exclusion).forEach(node => node.remove())
    }

    return document.toString()
  } catch (err) {
    logger.error(err)
  }

  return html
}
