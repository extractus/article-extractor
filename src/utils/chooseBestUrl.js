// utils -> chooseBestURL

import {
  slugify
} from 'bellajs'

import * as stringComparison from 'string-comparison'

import { getParserOptions } from '../config.js'

export default (candidates = [], title = '') => {
  const shortestUrl = candidates.reduce((prev, curr) => curr.length < prev.length ? curr : prev, candidates[0])

  const opts = getParserOptions()
  const alg = opts.urlsCompareAlgorithm
  const comparer = stringComparison[alg]

  const titleHashed = slugify(title)

  return candidates.reduce((prev, curr) => {
    const similarity = comparer.similarity(curr, titleHashed)
    const better = similarity > prev.similarity
    return better ? { similarity, value: curr } : prev
  }, {
    similarity: comparer.similarity(shortestUrl, titleHashed),
    value: shortestUrl
  }).value
}
