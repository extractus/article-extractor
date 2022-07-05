// utils --> findRulesByUrl

/* global URLPattern */

import { getQueryRules } from '../config.js'
import 'urlpattern-polyfill'
/**
 * @param urls {string[]}
 * @returns {QueryRule|{}}
 */
export default (urls = []) => {
  const appliedRules = []
  const rules = getQueryRules()
  for (const rule of rules) {
    const { patterns } = rule
    const matched = urls.some((url) => patterns.some((pattern) => new URLPattern(pattern).test(url)))
    if (matched) {
      appliedRules.push(rule)
    }
  }
  return appliedRules
}
