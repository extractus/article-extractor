// utils --> findRulesByUrl

const isValidUrl = require('./isValidUrl')

const { getQueryRules } = require('../config')

const findRulesByUrl = (urls = []) => {
  const rules = getQueryRules()
  const xurls = urls.filter(isValidUrl)
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i]
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

module.exports = findRulesByUrl
