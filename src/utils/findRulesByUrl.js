// utils --> findRulesByUrl

import { getQueryRules } from '../config.js'

/**
 * @param urls {string[]}
 * @returns {QueryRule|{}}
 */
export default (urls = []) => {
  const rules = getQueryRules()
  for (const rule of rules) {
    const { patterns } = rule
    const matched = urls.some((url) => patterns.some((pattern) => pattern.test(url)))
    if (matched) {
      return rule
    }
  }
  return {}
}
