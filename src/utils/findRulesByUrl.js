// utils --> findRulesByUrl

import { URLPattern } from 'urlpattern-polyfill'

import { getQueryRules } from '../config.js'

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
