// utils --> findRulesByUrl

import isValidUrl from './isValidUrl.js'

import { getQueryRules } from '../config.js'

/**
 * @param urls {string[]}
 * @returns {QueryRule|{}}
 */
export default (urls = []) => {
  const rules = getQueryRules()
  const xurls = urls.filter(isValidUrl)
  for (const rule of rules) {
    const { patterns } = rule
    const matched = xurls.some((url) => {
      return patterns.some((pattern) => {
        return pattern.test(url)
      })
    })
    if (matched) {
      return rule
    }
  }
  return {}
}
