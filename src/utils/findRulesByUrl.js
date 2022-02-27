// utils --> findRulesByUrl

import { getQueryRules } from '../config.js'
import { URLPattern } from 'urlpattern-polyfill'

/**
 * @param urls {string[]}
 * @returns {QueryRule|{}}
 */
export default (urls = []) => {
  const rules = getQueryRules()
  for (const rule of rules) {
    const { patterns } = rule
    const matched = urls.some((url) => patterns.some((pattern) => new URLPattern(pattern).exec(url)))
    if (matched) {
      return rule
    }
  }
  return {}
}
