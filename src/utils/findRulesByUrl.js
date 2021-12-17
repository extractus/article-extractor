// utils --> findRulesByUrl

const isValidUrl = require('./isValidUrl')

const { getQueryRules } = require('../config')

const findRulesByUrl = (url) => {
  const rules = getQueryRules()
  const matches = !isValidUrl(url)
    ? []
    : rules.filter(({ patterns = [] }) => {
      return patterns.some((pattern) => {
        return pattern.test(url)
      })
    })
  return matches.length > 0 ? matches[0] : {}
}

module.exports = findRulesByUrl
